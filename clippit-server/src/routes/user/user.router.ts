import { Router } from "express";
import { userController } from "../../modules/user/user.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.get("/get-me", requireAuth, userController.getMe);

router.put(
    "/complete-onboarding",
    requireAuth,
    userController.completeOnboarding
);

export default router;
