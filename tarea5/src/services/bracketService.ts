export interface Entrant {
    id: string;
    name: string;
    score: number;
}

export interface Slot {
    participant?: unknown;
    name?: string | null;
    seed?: number | null;
    isBye: boolean;
}
////
export interface Match {
    matchNumber: number;
    player1: Slot;
    player2: Slot;
    winner?: Slot | null;
}

export interface Round {
    round: number;
    name: string;
    matches: Match[];
}

export const MIN_PARTICIPANTS = 2;

const BYE: Slot = { participant: null, name: null, seed: null, isBye: true };
const PENDING: Slot = { participant: null, name: null, seed: null, isBye: false };

export const nextPowerOfTwo = (n: number): number => {
    let size = 1;
    while (size < n) size *= 2;
    return size;
};

export const seedOrder = (size: number): number[] => {
    let order = [1, 2];
    while (order.length < size) {
        const total = order.length * 2;
        order = order.flatMap((seed) => [seed, total + 1 - seed]);
    }
    return order.slice(0, size);
};

const roundName = (round: number, totalRounds: number): string =>
    round === totalRounds ? 'Final' : `Round ${round}`;

export const rankEntrants = (entrants: Entrant[]): Entrant[] =>
    [...entrants].sort((a, b) => b.score - a.score);

export const buildBracket = (entrants: Entrant[]): { size: number; rounds: Round[] } => {
    if (entrants.length < MIN_PARTICIPANTS) {
        throw new Error(`Se requieren al menos ${MIN_PARTICIPANTS} participantes`);
    }

    const ranked = rankEntrants(entrants);
    const size = nextPowerOfTwo(ranked.length);
    const totalRounds = Math.log2(size);

    const slotForSeed = (seed: number): Slot => {
        const entrant = ranked[seed - 1];
        if (!entrant) return { ...BYE };
        return { participant: entrant.id, name: entrant.name, seed, isBye: false };
    };

    const order = seedOrder(size);
    const firstRound: Match[] = [];
    for (let i = 0; i < size; i += 2) {
        const player1 = slotForSeed(order[i]);
        const player2 = slotForSeed(order[i + 1]);
        const match: Match = { matchNumber: i / 2 + 1, player1, player2 };
        if (player2.isBye) match.winner = player1;
        else if (player1.isBye) match.winner = player2;
        firstRound.push(match);
    }

    const rounds: Round[] = [{ round: 1, name: roundName(1, totalRounds), matches: firstRound }];

    for (let r = 2; r <= totalRounds; r++) {
        const previous = rounds[r - 2].matches;
        const matches: Match[] = [];
        for (let i = 0; i < previous.length; i += 2) {
            matches.push({
                matchNumber: i / 2 + 1,
                player1: previous[i].winner ?? { ...PENDING },
                player2: previous[i + 1].winner ?? { ...PENDING }
            });
        }
        rounds.push({ round: r, name: roundName(r, totalRounds), matches });
    }

    return { size, rounds };
};

const slotName = (slot: Slot | undefined | null): string | null => {
    if (!slot) return null;
    if (slot.isBye) return 'Bye';
    return slot.name ?? 'TBD';
};

export const formatBracket = (
    tournament: { id: string; name: string },
    bracket: { size: number; rounds: Round[] }
) => ({
    tournament: tournament.name,
    tournamentId: tournament.id,
    size: bracket.size,
    rounds: bracket.rounds.map((round) => ({
        round: round.round,
        name: round.name,
        matches: round.matches.map((match) => ({
            match: match.matchNumber,
            player1: slotName(match.player1),
            player1Seed: match.player1.seed,
            player2: slotName(match.player2),
            player2Seed: match.player2.seed,
            winner: slotName(match.winner)
        }))
    }))
});
