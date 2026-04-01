import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { connectDB } from './config/db';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`==Serveur démarré sur le port ${PORT}==`);
        });
    } catch (err) {
        logger.error('Erreur au démarrage du serveur:', err);
        process.exit(1);
    }
};

startServer();