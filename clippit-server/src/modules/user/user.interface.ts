import { UserRole } from './user.enum';

export interface IUser {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    onboardingComplete?: boolean;
}