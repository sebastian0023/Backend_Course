import express from 'express';
import tourneyRoutes from './routes/tourneyRoutes';
import requestLogger from './middleware/requestLogger';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use('/api/tournaments', tourneyRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
