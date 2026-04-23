import { Response } from "express";
import { asyncWrapper, AuthRequest } from "../../lib/asyncWrapper";
import { searchService } from "./search.service";
import AppError from "../../lib/AppError";
import { SearchSchema } from "../../lib/validations";

const searchItems = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const clerkId = req.userId;
        if (!clerkId) throw new AppError("Unauthorized", 401)

        const parsed = SearchSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.issues[0].message, 400);
        }

        const results = await searchService.searchItems(clerkId, {
            query: parsed.data.query,
            limit: parsed.data.limit,
        })

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    }
)

export {
    searchItems
}