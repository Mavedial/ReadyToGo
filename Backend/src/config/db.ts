import mongoose from "mongoose";
import {logger} from "../utils/logger";

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        logger.error("MONGO_URI non défini");
        process.exit(1);
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("MongoDB connecté");
    } catch (error) {
        logger.error("Erreur connexion MongoDB :", error);
        process.exit(1);
    }
};
