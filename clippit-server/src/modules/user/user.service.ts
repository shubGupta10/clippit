import User from './user.modal';
import { IUser } from './user.interface';

const createUser = async (data: IUser) => {
    const existing = await User.findOne({ clerkId: data.clerkId });
    if (existing) return existing;
    return await User.create(data);
};

const getUserByClerkId = async (clerkId: string) => {
    return await User.findOne({ clerkId });
};

const completeOnboarding = async (clerkId: string) => {
    return await User.findOneAndUpdate(
        { clerkId },
        { onboardingComplete: true },
        { new: true }
    );
};

export const userService = {
    createUser,
    getUserByClerkId,
    completeOnboarding,
};