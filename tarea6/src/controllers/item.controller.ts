import { Request, Response } from "express";
import mongoose from "mongoose";
import LostItem from "../models/LostItem";

function handleError(err: any, res: Response) {
    if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Error interno del servidor" });
}

function validId(id: string, res: Response): boolean {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: "ID inválido" });
        return false;
    }
    return true;
}

export async function getAll(_req: Request, res: Response) {
    try {
        const items = await LostItem.find().populate("user", "name email").sort({ createdAt: -1 });
        return res.status(200).json(items);
    } catch (err) {
    return handleError(err, res);
    }
}

export async function getMine(_req: Request, res: Response) {
    try {
        const items = await LostItem.find({ user: res.locals.userId }).populate("user", "name email").sort({ createdAt: -1 });
        return res.status(200).json(items);
    } catch (err) {
        return handleError(err, res);
    }
}

export async function getOne(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !validId(id, res)) return;
        const item = await LostItem.findById(id).populate("user","name email");
    if (!item) {
        return res.status(404).json({ message: "Objeto no encontrado" });
    }
    return res.status(200).json(item);
    } catch (err) {
        return handleError(err, res);  
    }
}

export async function create(req: Request, res: Response) {
    try {
        const { title, description, location, foundDate } = req.body ?? {};

        if (!title || !description || !location || !foundDate) {
            return res.status(400).json({message:"Título, descripción, ubicación y fecha del hallazgo son obligatorios"});
        }

        const date = new Date(foundDate);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ message: "Fecha inválida" });
        }

        const item = await LostItem.create({
            title,
            description,
            location,
            foundDate: date,
            status: "found",
            user: res.locals.userId
        });

        return res.status(201).json(item);
    } catch (err) {
        return handleError(err, res);
    }
}

export async function update(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !validId(id, res)) return;

        const item = await LostItem.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Objeto no encontrado" });
        }

        if (item.user.toString() !== res.locals.userId) {
            return res.status(403).json({ message: "No puedes modificar un objeto de otro usuario" });
        }

        const { title, description, location, status } = req.body ?? {};

        if (title !== undefined) {
            if (!String(title).trim()) {
                return res.status(400).json({ message: "El título no puede estar vacío" });
            }
            item.title = title;
        }
        if (description !== undefined) {
            if (!String(description).trim()) {
                return res.status(400).json({ message: "La descripción no puede estar vacía" });
            }
            item.description = description;
        }
        if (location !== undefined) {
            if (!String(location).trim()) {
                return res.status(400).json({ message: "La ubicación no puede estar vacía" });
            }
            item.location = location;
        }
        if (status !== undefined) {
            if (status !== "found" && status !== "returned") {
                return res.status(400).json({ message: "Estado inválido" });
            }
            if (status === "found" && item.status === "returned") {
                return res.status(400).json({message: "Solo se permite cambiar el estado de found a returned"});
            }
            item.status = status;
        }

        await item.save();
        return res.status(200).json(item);
        } catch (err) {
            return handleError(err, res);
        }
}

export async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !validId(id, res)) return;

        const item = await LostItem.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Objeto no encontrado" });
        }

        if (item.user.toString() !== res.locals.userId) {
            return res.status(403).json({ message: "No puedes eliminar un objeto de otro usuario" });
        }

        await item.deleteOne();
        return res.status(200).json({ message: "Objeto eliminado" });
    } catch (err) {
        return handleError(err, res);
    }
}
