import {Router} from "express";
import {submitAvailability, getEventAvailabilities, getMyAvailability, calculateBestDate}
    from "../controllers/availabilityControllers";
import {verifyToken} from "../middleware/authMiddleware";

const router = Router();

router.post('/', submitAvailability);
router.get('/event/:eventId', getEventAvailabilities);
router.get('/event/:eventId', getMyAvailability);
router.post('/event/:eventId/calculate', calculateBestDate);

export default router;