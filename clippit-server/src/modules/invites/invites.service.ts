import AppError from "../../lib/AppError"
import Collection from "../collection/collection.model"
import User from "../user/user.modal";
import Invites from "./invites.model";
import { sendEmail } from "../../config/resend";
import { sendInviteTemplate } from "../../lib/emailTemplates";
import { Types } from "mongoose";
import redis from "../../config/redis";

const getUserByClerkId = async (clerkId: string) => {
    const user = await User.findOne({ clerkId });
    if (!user) throw new AppError("User not found", 404);
    return user;
}

const sendInvite = async (userId: string, collectionId: string, email: string) => {
    const user = await getUserByClerkId(userId);

    const collection = await Collection.findById(collectionId);
    if (!collection) {
        throw new AppError("Collection not found", 404)
    }

    if (collection.owner.toString() !== user._id.toString()) {
        throw new AppError("Only owners can invite", 403)
    }

    const invitee = await User.findOne({ email });
    if (invitee) {
        if (invitee._id.toString() === user._id.toString()) return { message: "Invite sent" };
        if (collection.members.some(memberId => memberId.toString() === invitee._id.toString())) {
            return { message: "Invite sent" };
        }
    }

    const existingInvite = await Invites.findOne({
        collectionId: collectionId,
        inviteeEmail: email,
        status: "pending"
    })

    // Silently succeed if invite already pending (prevents enumeration)
    if (existingInvite) return { message: "Invite sent" };

    const invite = await Invites.create({
        collectionId: collectionId,
        owner: user._id.toString(),
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
    const user = await getUserByClerkId(userId);

    const invite = await Invites.findById(inviteId);
    if (!invite) {
        throw new AppError("Invite not found", 404)
    }

    if (user.email !== invite.inviteeEmail) {
        throw new AppError("You cannot accept this invite as this is not yours", 403)
    }

    if (invite.status !== "pending") {
        throw new AppError("Invite is already responded to", 400)
    }

    const collection = await Collection.findById(invite.collectionId);
    if (!collection) {
        throw new AppError("Collection has already been deleted", 404)
    }

    collection.members.push(new Types.ObjectId(user._id));
    await collection.save();

    invite.status = "accepted";
    await invite.save();

    const owner = await User.findById(collection.owner);
    if (owner) {
        await redis.del(`collections:list:${owner.clerkId}`);
    }
    await redis.del(`collections:list:${userId}`);
    await redis.del(`collection:detail:${collection._id}`);
}

const declineInvite = async (inviteId: string, userId: string) => {
    const user = await getUserByClerkId(userId);

    const invite = await Invites.findById(inviteId);
    if (!invite) {
        throw new AppError("Invite not found", 404)
    }

    if (user.email !== invite.inviteeEmail) {
        throw new AppError("You cannot decline this invite as this is not yours", 403)
    }

    if (invite.status !== "pending") {
        throw new AppError("Invite is already responded to", 400)
    }

    invite.status = "declined";
    await invite.save();
}

const getPendingInvites = async (userId: string) => {
    const user = await getUserByClerkId(userId);

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
