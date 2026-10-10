import express from 'express';
import tourneyRoutes from './routes/tourneyRoutes';
import { notFound, errorHandler } from './middleware/tourneyMiddleware';

const app = express();

app.use(express.json());
app.use('/api/tournaments', tourneyRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
