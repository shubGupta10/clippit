import AppError from "../../lib/AppError"
import Collection from "../collection/collection.model"
import User from "../user/user.modal";
import Invites from "./invites.model";
import { sendEmail } from "../../config/resend";
import { sendInviteTemplate } from "../../lib/emailTemplates";
import { Types } from "mongoose";

const sendInvite = async (userId: string, collectionId: string, email: string) => {
    const collection = await Collection.findById(collectionId);
    if (!collection) {
        throw new AppError("Collection not found", 404)
    }

    if (collection.owner.toString() !== userId.toString()) {
        throw new AppError("Only owners can invite", 403)
    }

    const existingInvite = await Invites.findOne({
        collectionId: collectionId,
        inviteeEmail: email,
        status: "pending"
    })

    if (existingInvite) {
        throw new AppError("Invite already sent", 400)
    }

    const user = await User.findOne({ email });

    if (user) {
        if (user._id.toString() === userId.toString()) {
            throw new AppError("You cannot invite yourself", 400)
        }

        if (collection.members.some(memberId => memberId.toString() === user._id.toString())) {
            throw new AppError("User is already a member", 400)
        }
    }

    const invite = await Invites.create({
        collectionId: collectionId,
        owner: userId,
        inviteeEmail: email,
        status: "pending"
    })

    await sendEmail(
        email,
        `You've been invited to join ${collection.name || 'a collection'}!`,
        sendInviteTemplate(collection.name as string)
    )

    return invite;
}

const acceptInvite = async (inviteId: string, userId: string) => {
    const invite = await Invites.findById(inviteId);
    if (!invite) {
        throw new AppError("Invite not found", 404)
    }

    const user = await User.findById(userId);
    if (user?.email !== invite.inviteeEmail) {
        throw new AppError("You cannot accept this invite as this is not yours", 403)
    }

    if (invite.status !== "pending") {
        throw new AppError("Invite is already responded to", 400)
    }

    const collection = await Collection.findById(invite.collectionId);
    if (!collection) {
        throw new AppError("Collection has already been deleted", 404)
    }

    collection.members.push(new Types.ObjectId(userId));
    await collection.save();

    invite.status = "accepted";
    await invite.save();
}

const declineInvite = async (inviteId: string, userId: string) => {
    const invite = await Invites.findById(inviteId);
    if (!invite) {
        throw new AppError("Invite not found", 404)
    }

    const user = await User.findById(userId);
    if (user?.email !== invite.inviteeEmail) {
        throw new AppError("You cannot decline this invite as this is not yours", 403)
    }

    if (invite.status !== "pending") {
        throw new AppError("Invite is already responded to", 400)
    }

    invite.status = "declined";
    await invite.save();
}

const getPendingInvites = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404)
    }

    const pendingInvites = await Invites.find({
        inviteeEmail: user.email,
        status: "pending"
    })
        .populate("owner", "firstName lastName email")
        .populate("collectionId", "name");

    return pendingInvites;
}

export const invitesService = {
    sendInvite,
    acceptInvite,
    declineInvite,
    getPendingInvites
}
