import mongoose, { Schema, Document } from "mongoose";
import { IInvites } from "./invites.interface";

export interface InvitesDocument extends IInvites, Document { }

const InvitesSchema = new Schema<IInvites>(
    {
        collectionId: {
            type: String,
            required: true,
            ref: "Collection"
        },
        owner: {
            type: String,
            required: true,
            ref: "User"
        },
        inviteeEmail: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', "accepted", "declined"],
            default: 'pending'
        }
    },
    { timestamps: true }
)

InvitesSchema.index({ owner: 1, createdAt: -1 });

const Invites = mongoose.model<IInvites>("Invites", InvitesSchema);

export default Invites;