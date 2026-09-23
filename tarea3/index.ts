import express from 'express';
import type { Request, Response } from 'express';
import { allowRoles } from './middlewares/allowRoles.js';

const app = express();
    
app.get('/', (req: Request, res: Response) => {
    res.send({message: 'Public route'});
});

app.get('/admin', allowRoles(['admin']), (req: Request, res: Response) => {
    res.send({message: 'Welcome admin'});
});

app.get('/reports', allowRoles(['admin', 'manager']), (req: Request, res: Response) => {
    res.send({message: 'Reports area'});
});

app.get('/inventory', allowRoles(['manager', 'employee']), (req: Request, res: Response) => {
    res.send({message: 'Inventory area'});
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
