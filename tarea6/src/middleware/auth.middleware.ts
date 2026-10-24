import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Falta token o no es válido" });
        }
        
        const token = header.slice("Bearer ".length).trim();
        if (!token) {
            return res.status(401).json({ message: "Falta token o no es válido" });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string;
        };

        const user = await User.findById(payload.id).select("_id");
        if (!user) return res.status(401).json({ message: "El usuario no existe o es inválido" });

        res.locals.userId = user._id.toString();
        return next();
    } catch {
        return res.status(401).json({ message: "Token inválido" });
    }
}
