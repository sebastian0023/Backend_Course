import {request, response} from 'express';
import { type Usuario } from '../models/userModel.js';

const users: Usuario[] = [];

let userIdCounter = 1;

function validarUsuario(usuario: Usuario): boolean {
    if (!usuario.nombre || !usuario.correo || !usuario.contrasena) {
        return false;
    }
    return true;
}

export const getUsers = (req: typeof request, res: typeof response) => {
    res.json(users);
};

export const createUser = (req: typeof request, res: typeof response) => {
    const { nombre, correo, contrasena } = req.body;

    const newUser: Usuario = {
        id: userIdCounter++,
        nombre,
        correo,
        contrasena
    };

    if (!validarUsuario(newUser)) {
        return res.status(400).json({ error: 'Datos de usuario inválidos' });
    }

    users.push(newUser);
    res.status(201).json(newUser);
};

export const findUserById = (id: number): Usuario | undefined => {
    return users.find(user => user.id === id);
};

export const getUserById = (req: typeof request, res: typeof response) => {
    const userId = parseInt(String(req.params.id), 10);
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
}

export const updateUserById = (req: typeof request, res: typeof response) => {
    const userId = parseInt(String(req.params.id), 10);
    const user = findUserById(userId);

    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { nombre, correo, contrasena } = req.body ?? {};

    if (!nombre && !correo && !contrasena) {
        return res.status(400).json({ error: 'Datos de usuario inválidos' });
    }

    if (nombre) user.nombre = nombre;
    if (correo) user.correo = correo;
    if (contrasena) user.contrasena = contrasena;

    res.json(user);
};

export const deleteUserById = (req: typeof request, res: typeof response) => {
    const userId = parseInt(String(req.params.id), 10);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    users.splice(userIndex, 1);
    res.status(204).send();
};



