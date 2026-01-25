import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from "./config/db";
import {logger} from "./utils/logger";

dotenv.config();

const app = express();

app.use(
    cors({
        origin : process.env.CORS_ORIGIN,
    })
);

const PORT = process.env.PORT || 5000;
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Serveur lancé sur le port ${PORT}`);
        });
    })
    .catch((err) => {
        logger.error("Impossible de démarrer le serveur, erreur de connexion DB:", err);
        process.exit(1);
    });
