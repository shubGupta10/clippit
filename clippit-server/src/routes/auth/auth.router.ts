import { Router, raw } from "express";
import { clerkWebhookHandler, getMe } from "../../modules/auth/auth.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post(
    "/webhooks/clerk",
    raw({ type: "application/json" }),
    clerkWebhookHandler
)

router.get(
    "/get-me",
    requireAuth,
    getMe,
)

export default router