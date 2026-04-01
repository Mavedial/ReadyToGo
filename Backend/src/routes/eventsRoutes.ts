import { Router } from 'express';
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    leaveEvent,
    inviteUsers,
    respondToInvitation,
    getPendingInvitations,
    removeParticipant
} from '../controllers/eventControllers';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();


router.use(verifyToken);

// ===== ÉVÉNEMENTS =====
router.get('/invitations/pending', getPendingInvitations);
router.get('/', getEvents);
router.post('/', createEvent);

// ===== INVITATIONS =====
router.put('/invitations/:invitationId/respond', respondToInvitation);
router.post('/:id/invite', inviteUsers);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.delete('/:id/leave', leaveEvent);
router.delete('/:id/participants/:participantId', removeParticipant);

export default router;