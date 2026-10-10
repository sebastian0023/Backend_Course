import type { Request, Response } from 'express';
import Participant from '../models/participantModel';
import Bracket from '../models/bracketModel';
import { buildBracket, formatBracket } from '../services/bracketService';

export const generateBracket = async (_req: Request, res: Response) => {
    const tourney = res.locals.tournament;

    const participants = await Participant.find({ tournament: tourney._id }).sort({ _id: 1 });
    if (participants.length < 2) {
        return res.status(400).json({ error: 'Se necesitan al menos 2 participantes para generar la llave' });
    }

    const { size, rounds } = buildBracket(
        participants.map(p => ({ id: p.id, name: p.name, score: p.score }))
    );

    await Bracket.deleteOne({ tournament: tourney._id });
    const bracket = await Bracket.create({ tournament: tourney._id, size, rounds });

    res.status(201).json(formatBracket(tourney, bracket.toObject()));
};

export const getBracket = async (_req: Request, res: Response) => {
    const tourney = res.locals.tournament;

    const bracket = await Bracket.findOne({ tournament: tourney._id });
    if (!bracket) {
        return res.status(404).json({ error: 'La llave de este torneo aún no ha sido generada' });
    }

    res.json(formatBracket(tourney, bracket.toObject()));
};
