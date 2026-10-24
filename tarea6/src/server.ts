import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;
const URL = process.env.URL;

async function start() {
  if (!URL || !process.env.JWT_SECRET) {
    console.error("Faltan URL o JWT_SECRET en el archivo .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(URL);
    console.log("Conectado a MongoDB");
    app.listen(PORT, () =>
      console.log(`Servidor en http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("No se pudo conectar a MongoDB", err);
    process.exit(1);
  }
}

void start();
