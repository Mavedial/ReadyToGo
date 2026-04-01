import { Response } from 'express';
import { Friendship } from '../models/Friendship';
import User from '../models/User';
import { AuthRequest } from '../types/AuthRequest';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

// POST /api/friends/request - Envoyer une demande d'ami
export const sendFriendRequest = async (req: AuthRequest, res: Response) => {
    try {
        const requesterId = req.user?.id;
        const { recipientId } = req.body;

        if (!requesterId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        if (!recipientId) {
            return res.status(400).json({ message: 'recipientId requis' });
        }

        // Ne pas s'ajouter soi-même
        if (requesterId === recipientId) {
            return res.status(400).json({ message: 'Vous ne pouvez pas vous ajouter vous-même' });
        }

        // Vérifier que le destinataire existe
        const recipient = await User. findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si une relation ACTIVE existe déjà (pending ou accepted seulement)
        const existingFriendship = await Friendship.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ],
            status: { $in: ['pending', 'accepted'] } // ← AJOUT : vérifier seulement les relations actives
        });

        if (existingFriendship) {
            return res.status(400).json({
                message: 'Une relation existe déjà',
                status: existingFriendship.status
            });
        }

        // Supprimer les anciennes demandes refusées (optionnel mais nettoyage)
        await Friendship.deleteMany({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ],
            status: 'rejected'
        });

        // Créer la demande
        const friendship = await Friendship.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });

        logger.info(`Demande d'ami envoyée de ${requesterId} vers ${recipientId}`);

        return res.status(201).json({
            message: 'Demande d\'ami envoyée',
            friendship
        });
    } catch (error) {
        logger.error('sendFriendRequest error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// PUT /api/friends/respond/: friendshipId - Accepter/Refuser une demande
export const respondToFriendRequest = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { friendshipId } = req.params;
        const { action } = req.body; // 'accepted' ou 'rejected'

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        if (!['accepted', 'rejected'].includes(action)) {
            return res. status(400).json({ message: 'Action invalide (accepted/rejected)' });
        }

        const friendship = await Friendship.findById(friendshipId);

        if (!friendship) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }

        // Vérifier que l'utilisateur est bien le destinataire
        if (friendship.recipient.toString() !== userId) {
            return res. status(403).json({ message: 'Vous n\'êtes pas le destinataire de cette demande' });
        }

        // Vérifier le statut actuel
        if (friendship.status !== 'pending') {
            return res.status(400).json({ message: `Cette demande est déjà ${friendship.status}` });
        }

        // Mettre à jour
        friendship.status = action;
        friendship.respondedAt = new Date();
        await friendship.save();

        logger.info(`Demande d'ami ${action} par ${userId} (friendshipId: ${friendshipId})`);

        return res.json({
            message: `Demande ${action === 'accepted' ? 'acceptée' : 'refusée'}`,
            friendship
        });
    } catch (error) {
        logger.error('respondToFriendRequest error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// GET /api/friends - Liste des amis (status = accepted)
export const getFriends = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req. user?.id;

        if (! userId) {
            return res. status(401).json({ message: 'Non authentifié' });
        }

        const friendships = await Friendship.find({
            $or: [
                { requester: userId, status: 'accepted' },
                { recipient: userId, status: 'accepted' }
            ]
        })
            .populate('requester', 'username email avatar')
            .populate('recipient', 'username email avatar');

// Retourner les Friendships complètes, pas juste les users
        return res.json(friendships);
    } catch (error) {
        logger.error('getFriends error:', error);
        return res. status(500).json({ message: 'Erreur serveur' });
    }
};

// GET /api/friends/pending - Demandes en attente (reçues)
export const getPendingRequests = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const requests = await Friendship.find({
            recipient: userId,
            status: 'pending'
        }).populate('requester', 'username email avatar');

        return res. json(requests);
    } catch (error) {
        logger.error('getPendingRequests error:', error);
        return res. status(500).json({ message: 'Erreur serveur' });
    }
};

// DELETE /api/friends/:friendshipId - Supprimer un ami
export const removeFriend = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { friendshipId } = req.params;

        if (! userId) {
            return res. status(401).json({ message: 'Non authentifié' });
        }

        const friendship = await Friendship.findById(friendshipId);

        if (!friendship) {
            return res.status(404).json({ message: 'Relation non trouvée' });
        }

        // Vérifier que l'utilisateur fait partie de cette relation
        const isInvolved =
            friendship.requester.toString() === userId ||
            friendship.recipient.toString() === userId;

        if (!isInvolved) {
            return res.status(403).json({ message: 'Vous n\'êtes pas impliqué dans cette relation' });
        }

        await Friendship.findByIdAndDelete(friendshipId);

        logger.info(`Relation d'amitié supprimée:  ${friendshipId}`);

        return res.json({ message: 'Ami supprimé' });
    } catch (error) {
        logger.error('removeFriend error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};