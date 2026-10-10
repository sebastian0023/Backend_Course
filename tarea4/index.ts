import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes/index.js';
import { engine } from 'express-handlebars';
import { config } from 'dotenv';
config();

import {} from 'mongoose';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbConnectionString = process.env.URI;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
