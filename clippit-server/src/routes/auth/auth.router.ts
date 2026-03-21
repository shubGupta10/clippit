import { Router, raw } from "express";
import { clerkWebhookHandler } from "../../modules/auth/auth.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post(
    "/webhooks/clerk",
    raw({ type: "application/json" }),
    clerkWebhookHandler
)

export default router