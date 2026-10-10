import type { Request, Response } from 'express';
import User from '../models/user.js';

export const getUsers = async (req: Request, res: Response) => {
    User.find({}).then(response => {
        console.log(response);
        res.send(response);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error retrieving users');
    });
};