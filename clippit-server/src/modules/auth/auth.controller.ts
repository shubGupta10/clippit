import { Request, Response } from "express";
import { Webhook } from "svix";
import { userService } from "../user/user.service";
import { AuthRequest, asyncWrapper } from "../../lib/asyncWrapper";

const clerkWebhookHandler = async (req: Request, res: Response) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET as string;

    const headers = {
        'svix-id': req.headers['svix-id'] as string,
        'svix-timestamp': req.headers['svix-timestamp'] as string,
        'svix-signature': req.headers['svix-signature'] as string,
    };

    const wh = new Webhook(WEBHOOK_SECRET);
    let event: any;

    try {
        event = wh.verify(req.body, headers);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Invalid webhook signature" });
    }

    if (event.type === "user.created") {
        const { id, email_addresses, first_name, last_name } = event.data;
        await userService.createUser({
            clerkId: id,
            email: email_addresses[0].email_address,
            firstName: first_name,
            lastName: last_name,
        });
    }

    res.status(200).json({ message: 'ok' });
};

const getMe = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const user = await userService.getUserByClerkId(req.userId!);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

export {
    clerkWebhookHandler,
    getMe
}