import express from 'express';
import cors from 'cors';
import { logger } from './utils/logger';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import friendshipRoutes from './routes/friendshipRoutes';
import eventsRoutes from './routes/eventsRoutes';
import availabilityRoutes from './routes/availabilityRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendshipRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/availabilities', availabilityRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'ReadyToGo API est en fonction !' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée !' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Erreur non gérée:', err);
    res.status(500).json({ message: 'Erreur serveur interne' });
});

export default app;