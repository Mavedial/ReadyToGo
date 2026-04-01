import { Response } from 'express';
import Availability from '../models/Availability';
import Event from '../models/Event';
import { AuthRequest } from '../types/AuthRequest';
import { logger } from '../utils/logger';

// POST /api/availabilities - Soumettre ses disponibilités
export const submitAvailability = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { eventId, availableDates } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        if (!eventId || !availableDates || ! Array.isArray(availableDates)) {
            return res. status(400).json({
                message: 'eventId et availableDates (array) requis'
            });
        }

        // Vérifier que l'événement existe
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        // Vérifier que l'utilisateur est participant
        if (!event.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({
                message: 'Vous devez être participant pour soumettre vos disponibilités'
            });
        }

        // Convertir les dates en objets Date et normaliser à minuit UTC
        const dates = availableDates.map((d: string) => {
            // d est au format YYYY-MM-DD
            const parts = d.split('-');
            return new Date(Date.UTC(
                parseInt(parts[0]),
                parseInt(parts[1]) - 1,
                parseInt(parts[2]),
                0, 0, 0
            ));
        });
        const availability = await Availability.findOneAndUpdate(
            { event:  eventId, user: userId },
            {
                availableDates: dates,
                submittedAt: new Date()
            },
            { upsert: true, new: true }
        );

        logger.info(`Disponibilités soumises par ${userId} pour l'événement ${eventId}`);

        return res.json({
            message: 'Disponibilités enregistrées',
            availability
        });
    } catch (error) {
        logger.error('submitAvailability error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// GET /api/availabilities/event/:eventId - Récupérer toutes les disponibilités d'un événement
export const getEventAvailabilities = async (req:  AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { eventId } = req.params;

        if (! userId) {
            return res. status(401).json({ message: 'Non authentifié' });
        }

        // Vérifier l'accès à l'événement
        const event = await Event.findById(eventId);
        if (!event) {
            return res. status(404).json({ message: 'Événement non trouvé' });
        }

        const hasAccess =
            event. creator.toString() === userId ||
            event.participants.some(p => p.toString() === userId);

        if (!hasAccess) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        const availabilities = await Availability.find({ event: eventId })
            .populate('user', 'username email avatar');

        return res.json(availabilities);
    } catch (error) {
        logger.error('getEventAvailabilities error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// GET /api/availabilities/event/:eventId/my - Mes disponibilités pour un événement
export const getMyAvailability = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { eventId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const availability = await Availability.findOne({
            event: eventId,
            user: userId
        }).populate('user', 'username email avatar');

        if (!availability) {
            return res. status(404).json({ message: 'Aucune disponibilité trouvée' });
        }

        return res.json(availability);
    } catch (error) {
        logger.error('getMyAvailability error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// POST /api/availabilities/event/: eventId/calculate - Calculer la meilleure date 🔥
export const calculateBestDate = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { eventId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        // Seul le créateur peut lancer le calcul
        if (event.creator.toString() !== userId) {
            return res.status(403).json({
                message: 'Seul le créateur peut calculer la meilleure date'
            });
        }

        // Récupérer toutes les disponibilités
        const availabilities = await Availability.find({ event: eventId });

        if (availabilities.length === 0) {
            return res. status(400).json({
                message: 'Aucune disponibilité soumise'
            });
        }

        // ALGORITHME : Compter combien de personnes sont disponibles par date
        const dateCount: Map<string, number> = new Map();

        // Convertir les dates de l'événement en strings YYYY-MM-DD (UTC)
        const eventStartStr = event.startDateRange.toISOString().split('T')[0];
        const eventEndStr = event.endDateRange.toISOString().split('T')[0];
        availabilities.forEach(avail => {
            avail.availableDates.forEach(date => {
                const dateStr = new Date(date).toISOString().split('T')[0];
                // Vérifier que la date est dans la plage (inclusivement)
                if (dateStr >= eventStartStr && dateStr <= eventEndStr) {
                    dateCount.set(dateStr, (dateCount.get(dateStr) || 0) + 1);
                } else {
                }
            });
        });

// Trouver la date avec le maximum de participants
        let bestDate: string | null = null;
        let maxCount = 0;

        dateCount.forEach((count, date) => {
            if (count > maxCount) {
                maxCount = count;
                bestDate = date;
            }
        });

        if (! bestDate) {
            return res.status(400).json({
                message: 'Impossible de déterminer une date'
            });
        }

        // Mettre à jour l'événement
        event.finalDate = new Date(bestDate);
        event.status = 'confirmed';
        await event.save();

        logger.info(`Meilleure date calculée pour l'événement ${eventId}:  ${bestDate} (${maxCount} participants)`);

        return res.json({
            message: 'Date calculée avec succès',
            bestDate,
            participantCount: maxCount,
            totalParticipants: availabilities.length,
            event
        });
    } catch (error) {
        logger.error('calculateBestDate error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};