import {Router} from "express";
import {
    getProfile,
    updateProfile,
    getUserById,
    searchUsers,
    deleteAccount,
    exportUserData
} from "../controllers/userControllers";
import {verifyToken} from "../middleware/authMiddleware"

const router = Router();

router.use(verifyToken);

router.get("/me", getProfile);
router.put("/me",updateProfile);
router.delete("/me", deleteAccount);
router.get("/search", searchUsers);
router.get("/:id", getUserById);
router.get('/me/export', exportUserData);

export default router;