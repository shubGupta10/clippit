import { PlanStatus, UserRole } from './user.enum';

export interface IUser {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    plan: string;
    subscription: {
        status: PlanStatus;
        planId?: string;
        subscriptionId?: string;
        currentPeriodStart?: Date;
        currentPeriodEnd?: Date;
    }
    role?: UserRole;
    onboardingComplete?: boolean;
}


//currentPeriodStart — the date their current subscription period started. For example if they subscribed on March 1st, this is March 1st.

//currentPeriodEnd — the date their current subscription period ends. If it is a monthly plan, this would be April 1st.