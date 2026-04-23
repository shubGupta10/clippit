import { Response } from "express";
import { asyncWrapper, AuthRequest } from "../../lib/asyncWrapper";
import { invitesService } from "./invites.service";
import AppError from "../../lib/AppError";
import { SendInviteSchema } from "../../lib/validations";

const sendInvites = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { id: collectionId } = req.params
        const userId = req.userId;

        const parsed = SendInviteSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.issues[0].message, 400);
        }

        await invitesService.sendInvite(userId!, collectionId as string, parsed.data.email);

        res.status(200).json({
            success: true,
            message: "Invites sent successfully"
        })
    }
)

const acceptInvite = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { id: inviteId } = req.params
        const userId = req.userId;

        await invitesService.acceptInvite(inviteId as string, userId!);

        res.status(200).json({
            success: true,
            message: "Invite accepted successfully"
        })
    }
)

const declineInvite = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { id: inviteId } = req.params
        const userId = req.userId;

        await invitesService.declineInvite(inviteId as string, userId!);

        res.status(200).json({
            success: true,
            message: "Invite declined successfully"
        })
    }
)

const getPendingInvites = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId;

        const pendingInvites = await invitesService.getPendingInvites(userId!);

        res.status(200).json({
            success: true,
            data: pendingInvites
        })
    }
)

export {
    sendInvites,
    acceptInvite,
    declineInvite,
    getPendingInvites
}