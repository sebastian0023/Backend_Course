import type { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { HttpError } from './httpError';

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
