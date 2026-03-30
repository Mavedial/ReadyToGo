import {Router} from "express";
import {getProfile, updateProfile, getUserById, searchUsers, deleteAccount} from "../controllers/userControllers";
import {verifyToken} from "../middleware/authMiddleware"

const router = Router();

router.use(verifyToken);

router.get("/me", getProfile);
router.put("/me",updateProfile);
router.delete("/me", deleteAccount);
router.get("/search", searchUsers);
router.get("/:id", getUserById);

export default router;