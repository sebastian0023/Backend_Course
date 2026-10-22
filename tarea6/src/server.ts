import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

const URL = process.env.URL;
const PORT = process.env.PORT ?? 3000;

if (!URL) {
  console.error('Falta la variable de entorno URL');
  process.exit(1);
}

mongoose
  .connect(URL)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });
