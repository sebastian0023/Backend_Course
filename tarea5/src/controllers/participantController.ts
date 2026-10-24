import type { Request, Response } from 'express';
import Participant from '../models/participantModel';

export const addParticipant = async (req: Request, res: Response) => {
    const participant = await Participant.create({
        tournament: res.locals.tournament._id,
        name: req.body.name,
        score: req.body.score
    });
    res.status(201).json(participant);
};

export const getParticipants = async (_req: Request, res: Response) => {
    const participants = await Participant.find({ tournament: res.locals.tournament._id }).sort({ score: -1, createdAt: 1 });
    res.json(participants);
};
