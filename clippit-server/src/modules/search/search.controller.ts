import { Response } from "express";
import { asyncWrapper, AuthRequest } from "../../lib/asyncWrapper";
import { searchService } from "./search.service";
import AppError from "../../lib/AppError";

const searchItems = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const clerkId = req.userId;
        if (!clerkId) throw new AppError("Unauthorized", 401)

        const { query, limit } = req.body;

        const results = await searchService.searchItems(clerkId, {
            query,
            limit: limit ? parseInt(limit) : 10,
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