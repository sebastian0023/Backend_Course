import type { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Tourney from '../models/tourneyModel';

export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

const OBJECT_ID = /^[a-f\d]{24}$/i;
const DAY_MS = 24 * 60 * 60 * 1000;

const parseDate = (value: unknown): Date | null => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(`${value}T00:00:00.000Z`);
    if (isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
    return date;
};

export const validateTourneyBody = (req: Request, _res: Response, next: NextFunction) => {
    const { name, registrationDeadline, eventDate } = req.body ?? {};

    if (typeof name !== 'string' || !name.trim()) throw new HttpError(400, 'El nombre es obligatorio');
    if (registrationDeadline === undefined || registrationDeadline === null || registrationDeadline === '') {
        throw new HttpError(400, 'La fecha límite de registro es obligatoria');
    }
    if (eventDate === undefined || eventDate === null || eventDate === '') {
        throw new HttpError(400, 'La fecha del evento es obligatoria');
    }

    const deadline = parseDate(registrationDeadline);
    const event = parseDate(eventDate);
    if (!deadline) throw new HttpError(400, 'La fecha límite de registro es inválida (usa YYYY-MM-DD)');
    if (!event) throw new HttpError(400, 'La fecha del evento es inválida (usa YYYY-MM-DD)');
    if (event <= deadline) {
        throw new HttpError(400, 'La fecha del evento debe ser posterior a la fecha límite de registro');
    }

    req.body = { name: name.trim(), registrationDeadline: deadline, eventDate: event };
    next();
};

export const loadTourney = async (req: Request, res: Response, next: NextFunction) => {
    const { tournamentId } = req.params;
    if (typeof tournamentId !== 'string' || !OBJECT_ID.test(tournamentId)) {
        throw new HttpError(400, 'El id del torneo es inválido');
    }

    const tourney = await Tourney.findById(tournamentId);
    if (!tourney) throw new HttpError(404, 'Torneo no encontrado');

    res.locals.tournament = tourney;
    next();
};

export const validateParticipantBody = (req: Request, _res: Response, next: NextFunction) => {
    const { name, score } = req.body ?? {};

    if (typeof name !== 'string' || !name.trim()) throw new HttpError(400, 'El nombre es obligatorio');
    if (score === undefined || score === null) throw new HttpError(400, 'El puntaje es obligatorio');
    if (typeof score !== 'number' || !Number.isFinite(score)) {
        throw new HttpError(400, 'El puntaje debe ser un número válido');
    }
    if (score < 0) throw new HttpError(400, 'El puntaje no puede ser negativo');

    req.body = { name: name.trim(), score };
    next();
};

export const ensureRegistrationOpen = (_req: Request, res: Response, next: NextFunction) => {
    const closesAt = new Date(res.locals.tournament.registrationDeadline).getTime() + DAY_MS;
    if (Date.now() >= closesAt) {
        throw new HttpError(400, 'El registro de participantes ya cerró (pasó la fecha límite)');
    }
    next();
};

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
    next(new HttpError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
        return res.status(err.status).json({ error: err.message });
    }
    if (err?.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'El cuerpo de la solicitud no es un JSON válido' });
    }
    if (err instanceof MongooseError.ValidationError || err instanceof MongooseError.CastError) {
        return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
};
