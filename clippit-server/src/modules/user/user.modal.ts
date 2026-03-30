import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.interface';
import { PlanStatus, UserRole } from './user.enum';
import { UserPlan } from './user.enum';

export interface IUserDocument extends IUser, Document { }

const UserSchema = new Schema<IUserDocument>(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        plan: {
            type: String,
            enum: Object.values(UserPlan),
            default: UserPlan.FREE
        },
        subscription: {
            status: {
                type: String,
                enum: Object.values(PlanStatus),
                default: PlanStatus.INACTIVE
            },
            planId: {
                type: String,
            },
            subscriptionId: {
                type: String,
            },
            currentPeriodStart: {
                type: Date,
            },
            currentPeriodEnd: {
                type: Date,
            }
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER
        },
        onboardingComplete: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

const User = mongoose.model<IUserDocument>('User', UserSchema);
export default User;