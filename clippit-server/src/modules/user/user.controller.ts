import { Response } from "express";
import { userService } from "./user.service";
import { AuthRequest, asyncWrapper } from "../../lib/asyncWrapper";

const completeOnboarding = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const user = await userService.completeOnboarding(req.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, data: user });
});

const getMe = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const user = await userService.getUserByClerkId(req.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, data: user });
});

const getUsageLimits = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const limits = await userService.usageLimits(req.userId!);
    res.json({ success: true, data: limits });
});

export const userController = {
    completeOnboarding,
    getMe,
    getUsageLimits
};
