import User from './user.modal';
import { IUser } from './user.interface';
import redis from '../../config/redis';

const CACHE_TTL = 3600;

const createUser = async (data: IUser) => {
    const existing = await User.findOne({ clerkId: data.clerkId });
    if (existing) return existing;

    const user = await User.create(data);
    await redis.del(`user:profile:${data.clerkId}`);

    return user;
};

const getUserByClerkId = async (clerkId: string) => {
    const cacheKey = `user:profile:${clerkId}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
        return null;
    }

    await redis.set(cacheKey, JSON.stringify(user), "EX", CACHE_TTL);

    return user;
};

const completeOnboarding = async (clerkId: string) => {
    const user = await User.findOneAndUpdate(
        { clerkId },
        { onboardingComplete: true },
        { new: true }
    );
    if (user) await redis.del(`user:profile:${clerkId}`);

    return user;
};

export const userService = {
    createUser,
    getUserByClerkId,
    completeOnboarding,
};