import {Router} from "express";
import {submitAvailability, getEventAvailabilities, getMyAvailability, calculateBestDate}
    from "../controllers/availabilityControllers";
import {verifyToken} from "../middleware/authMiddleware";

const router = Router();

router.use(verifyToken);

router.post('/', submitAvailability);
router.get('/event/:eventId', getEventAvailabilities);
router.get('/event/:eventId/my', getMyAvailability);
router.post('/event/:eventId/calculate', calculateBestDate);

export default router;