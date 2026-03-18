import { Response } from "express";
import { asyncWrapper, AuthRequest } from "../../lib/asyncWrapper";
import AppError from "../../lib/AppError";
import { ItemService } from "./item.service";

const createItem = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const clerkId = req.userId;
    if (!clerkId) throw new AppError('Unauthorized', 401);

    const itemData = {
        ...req.body,
        clerkId,
    };

    const item = await ItemService.createItem(itemData, clerkId);
    res.status(201).json({ success: true, data: item });
});


const fetchUserItem = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const clerkId = req.userId;
    if (!clerkId) throw new AppError('Unauthorized', 401);

    const items = await ItemService.fetchUserItem(clerkId);

    res.status(200).json({
        success: true,
        count: items.length,
        data: items,
    });
});

const getItemById = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const clerkId = req.userId;
    if (!clerkId) throw new AppError('Unauthorized', 401);

    const item = await ItemService.getItemById(req.params.id as string, clerkId);

    res.status(200).json({
        success: true,
        data: item,
    });
});

const deleteItem = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const clerkId = req.userId;
    if (!clerkId) throw new AppError('Unauthorized', 401);

    await ItemService.deleteItem(req.params.id as string, clerkId);

    res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
    });
});

const editItem = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const clerkId = req.userId;
        if (!clerkId) throw new AppError("Unauthorized", 401)

        const items = await ItemService.editItem(req.params.id as string, clerkId, req.body)

        res.status(200).json({
            success: true,
            data: items
        })
    }
)

const clearAllItems = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const clerkId = req.userId;
        if (!clerkId) throw new AppError("Unauthorized", 401)

        const result = await ItemService.clearAllItems(clerkId);

        res.status(200).json({
            success: true,
            message: "All items deleted successfully",
            data: result
        })
    }
)

const deleteAccount = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const clerkId = req.userId;
        if (!clerkId) throw new AppError("Unauthorized", 401)

        const result = await ItemService.deleteAccount(clerkId);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully",
            data: result
        })
    }
)

export {
    createItem,
    fetchUserItem,
    getItemById,
    deleteItem,
    editItem,
    clearAllItems,
    deleteAccount
}