import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const EMAIL_REGEX = /^[^\s@]+@iteso\.mx$/;

export async function register(req: Request, res: Response) {
    try {
            const { name, email, password } = req.body ?? {};

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Nombre, correo y contraseña son obligatorios" });
        }
        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Datos inválidos" });
        }

        const cleanEmail = email.trim().toLowerCase();
        if (!EMAIL_REGEX.test(cleanEmail)) {
            return res.status(400).json({ message: "El correo debe ser válido y del dominio @iteso.mx" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }

        const exists = await User.findOne({ email: cleanEmail });
        if (exists) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: cleanEmail,
            password: hash,
        });

        return res.status(201).json({message: "Usuario registrado",user: { id: user._id, name: user.name, email: user.email }});
    } catch (err: any) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        if (err.code === 11000) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body ?? {};

        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = jwt.sign({ id: user._id.toString() },process.env.JWT_SECRET as string,{ expiresIn: "2h" });

        return res.status(200).json({token,user: { id: user._id, name: user.name, email: user.email },});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}