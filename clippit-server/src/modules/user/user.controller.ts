import { Response } from "express";
import { userService } from "./user.service";
import { AuthRequest, asyncWrapper } from "../../lib/asyncWrapper";

const completeOnboarding = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const user = await userService.completeOnboarding(req.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

const getMe = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const user = await userService.getUserByClerkId(req.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

export const userController = {
    completeOnboarding,
    getMe,
};
