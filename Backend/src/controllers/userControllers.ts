import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types/AuthRequest';
import { logger } from '../utils/logger';

// GET /api/users/me - Récupérer le profil de l'utilisateur connecté
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        return res.json(user);
    } catch (error) {
        logger.error('getProfile error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// PUT /api/users/me - Modifier le profil
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { username, email, avatar } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Non authentifié' });
        }

        // Vérifier si username/email déjà pris par un autre user
        if (username) {
            const existingUser = await User.findOne({
                username,
                _id: { $ne: userId }
            });
            if (existingUser) {
                return res.status(400).json({ message: 'Username déjà utilisé' });
            }
        }

        if (email) {
            const existingEmail = await User.findOne({
                email,
                _id: { $ne: userId }
            });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email déjà utilisé' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, avatar },
            { new: true, runValidators: true }
        ).select('-password');

        logger.info(`Profil mis à jour pour userId: ${userId}`);
        return res.json({ message: 'Profil mis à jour', user: updatedUser });
    } catch (error) {
        logger.error('updateProfile error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// GET /api/users/: id - Récupérer un utilisateur par ID
export const getUserById = async (req: AuthRequest, res:  Response) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        return res.json(user);
    } catch (error) {
        logger.error('getUserById error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// GET /api/users/search? q=username - Rechercher des utilisateurs
export const searchUsers = async (req: AuthRequest, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Paramètre de recherche manquant' });
        }

        const users = await User.find({
            username: { $regex: q, $options: 'i' }
        })
            .select('-password')
            .limit(20);

        return res.json(users);
    } catch (error) {
        logger.error('searchUsers error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};