import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { acceptInvite, declineInvite, getPendingInvites } from "../../modules/invites/invites.controller";

const router = Router();

router.get("/pending", requireAuth, getPendingInvites);
router.patch("/:id/accept", requireAuth, acceptInvite);
router.patch("/:id/decline", requireAuth, declineInvite);

export default router;