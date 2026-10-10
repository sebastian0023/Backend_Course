import type { Request, Response } from 'express';
import Participant from '../models/participantModel';
import Bracket from '../models/bracketModel';
import { HttpError } from '../middleware/httpError';
import { buildBracket, formatBracket, MIN_PARTICIPANTS, type Round } from '../services/bracketService';

export const generateBracket = async (_req: Request, res: Response) => {
    const tourney = res.locals.tournament;

    const participants = await Participant.find({ tournament: tourney._id }).sort({ createdAt: 1, _id: 1 });
    if (participants.length < MIN_PARTICIPANTS) {
        throw new HttpError(400, `Se necesitan al menos ${MIN_PARTICIPANTS} participantes para generar la llave (hay ${participants.length})`);
    }

    const { size, rounds } = buildBracket(
        participants.map((p) => ({ id: p.id, name: p.name, score: p.score }))
    );

    // Generar de nuevo reemplaza la llave anterior.
    const bracket = await Bracket.findOneAndUpdate(
        { tournament: tourney._id },
        { tournament: tourney._id, size, rounds },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    res.status(201).json(formatBracket(tourney, bracket.toObject() as unknown as { size: number; rounds: Round[] }));
};

export const getBracket = async (_req: Request, res: Response) => {
    const tourney = res.locals.tournament;

    const bracket = await Bracket.findOne({ tournament: tourney._id });
    if (!bracket) throw new HttpError(404, 'La llave de este torneo aún no ha sido generada');

    res.json(formatBracket(tourney, bracket.toObject() as unknown as { size: number; rounds: Round[] }));
};
