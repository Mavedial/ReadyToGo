import {Router} from 'express'
import {createEvent, getEvents, getEventById, updateEvent, deleteEvent, inviteUsers, respondToInvitation, getPendingInvitations}
    from "../controllers/eventControllers";
import {verifyToken} from "../middleware/authMiddleware"

const router = Router();

router.use(verifyToken);

router.get('/',getEvents);

router.post('/',createEvent);
router.get('/invitation/pending',getPendingInvitations);
router.get('/:id',getEventById);
router.put('/:id',updateEvent);
router.delete('/:id',deleteEvent);

//invitations

router.post('/:id/invite',inviteUsers);
router.put('/invitations/:invitationId/respond',respondToInvitation);

export default router;