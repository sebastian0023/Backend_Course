import { Router } from 'express';
import type { Request, Response } from 'express';
import { allowRoles } from '../middlewares/allowRoles.js';
import cv from '../data/cv.json' with { type: 'json' };

const router = Router();


router.get('/admin', allowRoles(['admin']), (req: Request, res: Response) => {
    res.send({message: 'Welcome admin'});
});

router.get('/reports', allowRoles(['admin', 'manager']), (req: Request, res: Response) => {
    res.send({message: 'Reports area'});
});

router.get('/inventory', allowRoles(['manager', 'employee']), (req: Request, res: Response) => {
    res.send({message: 'Inventory area'});
});

router.get('/home', (req: Request, res: Response) => {

    const datos = {
        title: 'Home Page',
        message: 'Welcome to the home page',
        user: {
            name: 'John Doe',
            role: 'admin'
        }
    };

    res.render('home', datos);
    }
);

router.get('/', (req: Request, res: Response) => {
    res.render('cv', {
        title: 'CV',
        name: cv.name,
        profession: cv.profession,
        summary: cv.summary,
        email: cv.email,
        location: cv.location,
        photo: cv.photo,
        about: cv.about,
        available: cv.available
    });
});

router.get('/acerca', (req: Request, res: Response) => {
    res.render('info', {
        title: 'Experiencia',
        name: cv.name,
        experiences: cv.experiences,
        skills: cv.skills
    });
});

router.get('/contacto', (req: Request, res: Response) => {
    res.render('contact', {
        title: 'Contacto',
        name: cv.name,
        email: cv.email,
        phone: cv.contact.phone,
        linkedin: cv.contact.linkedin,
        github: cv.contact.github
    });
});

router.post('/contacto', (req: Request, res: Response) => {
    const nombre = req.body.nombre;
    const email = req.body.email;
    const mensaje = req.body.mensaje;

    res.render('contacto-enviado', {
        title: 'Mensaje enviado',
        nombre: nombre,
        email: email,
        mensaje: mensaje
    });
});

export default router;
