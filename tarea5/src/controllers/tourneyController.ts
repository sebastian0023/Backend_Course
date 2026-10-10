import type { Request, Response } from 'express';
import Tourney from '../models/tourneyModel';

export const createTourney = async (req: Request, res: Response) => {
    const tourney = await Tourney.create(req.body);
    res.status(201).json(tourney);
};

export const getTourneys = async (_req: Request, res: Response) => {
    res.json(await Tourney.find({}));
};

// El torneo ya viene validado y cargado por el middleware loadTourney
export const getTourneyById = async (_req: Request, res: Response) => {
    res.json(res.locals.tournament);
};
