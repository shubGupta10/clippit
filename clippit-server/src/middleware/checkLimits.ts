import { Response, NextFunction } from "express"
import { AuthRequest, asyncWrapper } from "../lib/asyncWrapper"
import User from "../modules/user/user.modal";
import AppError from "../lib/AppError";
import { PLANS } from "../config/plan";
import Item from "../modules/item/item.model";
import Collection from "../modules/collection/collection.model";
import { userService } from "../modules/user/user.service";

type PlanKey = keyof typeof PLANS;

const getUserPlanConfig = async (clerkId: string) => {
    const user = await userService.getUserByClerkId(clerkId);
    if (!user) throw new AppError("User not found", 404);

    const userPlan = user.plan as PlanKey;
    const planConfig = PLANS[userPlan];
    if (!planConfig) throw new AppError("Invalid plan", 400);

    return { planConfig, user };
};

// Checks if the user has reached the max number of saved items
export const checkSaveLimit = asyncWrapper(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { planConfig } = await getUserPlanConfig(req.userId!);

    const itemsCount = await Item.countDocuments({ clerkId: req.userId });
    if (itemsCount >= planConfig.maxSaves) {
        throw new AppError(`Save limit reached (max ${planConfig.maxSaves})`, 400);
    }

    next();
});

// Checks if the user has reached the max number of collections they own
export const checkCollectionLimit = asyncWrapper(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { planConfig, user } = await getUserPlanConfig(req.userId!);

    const collectionsCount = await Collection.countDocuments({ owner: user._id });
    if (collectionsCount >= planConfig.maxCollections) {
        throw new AppError(`Collection limit reached (max ${planConfig.maxCollections})`, 400);
    }

    next();
});

// Checks if the user has reached the max number of shared collections they are a member of
export const checkSharedCollectionLimit = asyncWrapper(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { planConfig, user } = await getUserPlanConfig(req.userId!);

    const sharedCollectionsCount = await Collection.countDocuments({ members: user._id });
    if (sharedCollectionsCount >= planConfig.maxSharedCollections) {
        throw new AppError(`Shared collection limit reached (max ${planConfig.maxSharedCollections})`, 400);
    }

    next();
});

// Checks if the requested export format is allowed on the user's plan
export const checkExportFormat = asyncWrapper(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { planConfig } = await getUserPlanConfig(req.userId!);

    const { format } = req.query;
    if (format && !planConfig.exportFormats.includes(format as string)) {
        throw new AppError(
            `Export format '${format}' not allowed. Allowed formats: ${planConfig.exportFormats.join(", ")}`,
            400
        );
    }

    next();
});