import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.interface';
import { UserRole } from './user.enum';

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