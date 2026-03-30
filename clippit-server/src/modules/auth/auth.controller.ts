import { Request, Response } from "express";
import { Webhook } from "svix";
import { userService } from "../user/user.service";
import clerkClient from "../../config/clerk";
import { PlanStatus, UserPlan } from "../user/user.enum";

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
        console.error("Webhook signature verification failed:", error);
        return res.status(400).json({ error: "Invalid webhook signature" });
    }

    // ── user.created ────────────────────────────────────────────────────────
    if (event.type === "user.created") {
        const { id, email_addresses, first_name, last_name } = event.data;

        try {
            await userService.createUser({
                clerkId: id,
                email: email_addresses[0].email_address,
                firstName: first_name ?? undefined,
                lastName: last_name ?? undefined,
                plan: UserPlan.FREE,
                subscription: {
                    status: PlanStatus.INACTIVE,
                    planId: undefined,
                    subscriptionId: undefined,
                    currentPeriodStart: undefined,
                    currentPeriodEnd: undefined,
                },
                onboardingComplete: false,
            });
        } catch (err) {
            console.error("Failed to create user in DB:", err);
            // Return 500 so Svix retries — we don't want to silently lose a user
            return res.status(500).json({ error: "Failed to create user" });
        }

        try {
            await clerkClient.users.updateUserMetadata(id, {
                publicMetadata: {
                    onboardingComplete: false,
                },
            });
        } catch (err) {
            // Non-fatal: app still works, metadata can be re-synced later
            console.error("Failed to initialize Clerk metadata:", err);
        }
    }

    // ── user.deleted ────────────────────────────────────────────────────────
    if (event.type === "user.deleted") {
        const { id } = event.data;

        try {
            await userService.deleteUserByClerkId(id);
        } catch (err) {
            console.error("Failed to delete user from DB:", err);
            return res.status(500).json({ error: "Failed to delete user" });
        }
    }

    res.status(200).json({ message: "ok" });
};

export { clerkWebhookHandler };