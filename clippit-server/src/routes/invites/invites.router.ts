import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { acceptInvite, declineInvite, getPendingInvites } from "../../modules/invites/invites.controller";
import { checkSharedCollectionLimit } from "../../middleware/checkLimits";

const router = Router();

router.get("/pending", requireAuth, getPendingInvites);
router.patch("/:id/accept", requireAuth, checkSharedCollectionLimit, acceptInvite);
router.patch("/:id/decline", requireAuth, declineInvite);

export default router;