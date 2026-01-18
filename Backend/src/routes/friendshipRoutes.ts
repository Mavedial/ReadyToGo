import {Router} from "express";
import {sendFriendRequest,respondToFriendRequest, getFriends, getPendingRequests, removeFriend}
    from "../controllers/friendshipControllers";
import {verifyToken} from "../middleware/authMiddleware"

const router = Router();

router.use(verifyToken);

router.get("/",getFriends);

router.get("/pending",getPendingRequests);
router.post("/request", sendFriendRequest);

router.put("/respond/:friendshipId", respondToFriendRequest);

router.delete("/:friendshipId", removeFriend);

export default router;
