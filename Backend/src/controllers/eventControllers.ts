import { Response } from 'express';
import Event from '../models/Event';
import  EventInvitation  from '../models/EventInvitation';
import User from '../models/User';
import { Friendship } from '../models/Friendship';
import { AuthRequest } from '../types/AuthRequest';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

// POST /api/events - Créer un événement
export const createEvent = async (req:  AuthRequest, res: Response) => {
    try {
        const creatorId = req.user?.id;
        const { title, description, startDateRange, endDateRange, userIds  } = req.body;
        const invitedUserIds = userIds;

        if (!creatorId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        if (!title || !startDateRange || !endDateRange) {
            return res.status(400).json({
                message: 'title, startDateRange et endDateRange sont requis'
            });
        }

        // Vérifier que les dates sont valides
        // Créer les dates en UTC à minuit pour éviter les décalages de timezone
        const start = new Date(Date.UTC(
            parseInt(startDateRange.split('-')[0]),
            parseInt(startDateRange.split('-')[1]) - 1,
            parseInt(startDateRange.split('-')[2]),
            0, 0, 0
        ));

        const end = new Date(Date.UTC(
            parseInt(endDateRange.split('-')[0]),
            parseInt(endDateRange.split('-')[1]) - 1,
            parseInt(endDateRange.split('-')[2]),
            0, 0, 0
        ));

        if (start >= end) {
            return res.status(400).json({
                message: 'startDateRange doit être avant endDateRange'
            });
        }

// Créer l'événement
        const event = await Event.create({
            title,
            description,
            creator: creatorId,
            startDateRange: start,
            endDateRange: end,
            status: 'planning',
            invitedUsers: invitedUserIds || [],
            participants: [creatorId] // Le créateur est automatiquement participant
        });

        // Créer les invitations
        if (invitedUserIds && Array.isArray(invitedUserIds)) {
            const invitations = invitedUserIds.map((userId: string) => ({
                event: event._id,
                invitedUser: userId,
                invitedBy: creatorId,
                status: 'pending'
            }));

            await EventInvitation.insertMany(invitations);
        }

        logger.info(`Événement créé: ${event._id} par ${creatorId}`);

        return res.status(201).json({
            message: 'Événement créé',
            event
        });
    } catch (error) {
        logger.error('createEvent error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// GET /api/events - Liste des événements de l'utilisateur
export const getEvents = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        // Événements où l'utilisateur est créateur ou participant
        const events = await Event.find({
            $or: [
                { creator:  userId },
                { participants: userId }
            ]
        })
            .populate('creator', 'username email avatar')
            .sort({ createdAt: -1 });

        return res.json(events);
    } catch (error) {
        logger.error('getEvents error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// GET /api/events/:id - Détails d'un événement
export const getEventById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req. params;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const event = await Event.findById(id)
            .populate('creator', 'username email avatar')
            .populate('participants', 'username email avatar')
            .populate('invitedUsers', 'username email avatar');

        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        // Vérifier que l'utilisateur a accès à cet événement
        const hasAccess =
            event.creator._id.toString() === userId ||
            event.participants.some((p:  any) => p._id.toString() === userId) ||
            event.invitedUsers.some((u: any) => u._id.toString() === userId);

        if (!hasAccess) {
            return res. status(403).json({ message: 'Accès refusé' });
        }

        return res.json(event);
    } catch (error) {
        logger.error('getEventById error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// PUT /api/events/:id - Modifier un événement
export const updateEvent = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { title, description, startDateRange, endDateRange, status } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        // Seul le créateur peut modifier
        if (event.creator. toString() !== userId) {
            return res.status(403).json({ message: 'Seul le créateur peut modifier l\'événement' });
        }

        // Mise à jour
        if (title) event.title = title;
        if (description !== undefined) event.description = description;
        if (startDateRange) event.startDateRange = new Date(startDateRange);
        if (endDateRange) event.endDateRange = new Date(endDateRange);
        if (status) event.status = status;

        await event.save();

        logger.info(`Événement mis à jour: ${id}`);

        return res.json({ message: 'Événement mis à jour', event });
    } catch (error) {
        logger.error('updateEvent error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// DELETE /api/events/:id - Supprimer un événement
export const deleteEvent = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const event = await Event. findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        // Seul le créateur peut supprimer
        if (event.creator.toString() !== userId) {
            return res.status(403).json({ message: 'Seul le créateur peut supprimer l\'événement' });
        }

        await Event.findByIdAndDelete(id);
        await EventInvitation.deleteMany({ event: id });

        logger.info(`Événement supprimé: ${id}`);

        return res.json({ message: 'Événement supprimé' });
    } catch (error) {
        logger.error('deleteEvent error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// POST /api/events/: id/invite - Inviter des utilisateurs
export const inviteUsers = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req. user?.id;
        const { id } = req.params;
        const { userIds } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        if (!userIds || !Array. isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'userIds requis (array)' });
        }
        const validUserIds = userIds.filter((id: any) => id !== null && id !== undefined);

        if (validUserIds.length === 0) {
            return res.status(400).json({ message: 'Aucun ID utilisateur valide' });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        // Seul le créateur peut inviter
        if (event.creator.toString() !== userId) {
            return res.status(403).json({ message: 'Seul le créateur peut inviter' });
        }

        // Créer les invitations
        const invitations = [];
        for (const invitedUserId of userIds) {
            // Vérifier que l'user n'est pas déjà invité
            const existingInvite = await EventInvitation.findOne({
                event: id,
                invitedUser: invitedUserId
            });

            if (!existingInvite) {
                invitations.push({
                    event: id,
                    invitedUser: invitedUserId,
                    invitedBy: userId,
                    status:  'pending'
                });

                // Ajouter à invitedUsers
                if (! event.invitedUsers.includes(invitedUserId)) {
                    event.invitedUsers.push(invitedUserId);
                }
            }
        }

        if (invitations.length > 0) {
            await EventInvitation.insertMany(invitations);
            await event.save();
        }

        logger.info(`${invitations.length} invitation(s) envoyée(s) pour l'événement ${id}`);

        return res.json({
            message: `${invitations.length} invitation(s) envoyée(s)`,
            invitations
        });
    } catch (error) {
        logger.error('inviteUsers error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// PUT /api/events/invitations/:invitationId/respond - Répondre à une invitation
export const respondToInvitation = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { invitationId } = req.params;
        const { action } = req.body; // 'accepted' ou 'declined'

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        if (!['accepted', 'declined'].includes(action)) {
            return res. status(400).json({ message: 'Action invalide (accepted/declined)' });
        }

        const invitation = await EventInvitation.findById(invitationId);

        if (!invitation) {
            return res. status(404).json({ message: 'Invitation non trouvée' });
        }

        // Vérifier que c'est bien l'invité
        if (invitation.invitedUser.toString() !== userId) {
            return res.status(403).json({ message: 'Cette invitation ne vous concerne pas' });
        }

        if (invitation.status !== 'pending') {
            return res.status(400).json({ message: `Cette invitation est déjà ${invitation.status}` });
        }

        // Mise à jour
        invitation.status = action;
        invitation.respondedAt = new Date();
        await invitation.save();

        // Si accepté, ajouter aux participants
        if (action === 'accepted') {
            await Event.findByIdAndUpdate(invitation.event, {
                $addToSet: { participants: userId }
            });
        }

        logger.info(`Invitation ${action} par ${userId} (invitationId: ${invitationId})`);

        return res.json({
            message: `Invitation ${action === 'accepted' ? 'acceptée' : 'refusée'}`,
            invitation
        });
    } catch (error) {
        logger.error('respondToInvitation error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// GET /api/events/invitations/pending - Invitations en attente
export const getPendingInvitations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?. id;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const invitations = await EventInvitation.find({
            invitedUser: userId,
            status: 'pending'
        })
            .populate('event')
            .populate('invitedBy', 'username email avatar');

        return res.json(invitations);
    } catch (error) {
        logger.error('getPendingInvitations error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};