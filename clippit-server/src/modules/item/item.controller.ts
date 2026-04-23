import { Response } from "express";
import { asyncWrapper, AuthRequest } from "../../lib/asyncWrapper";
import AppError from "../../lib/AppError";
import { ItemService } from "./item.service";
import { CreateItemSchema, EditItemSchema } from "../../lib/validations";
import { IItem } from "./item.interface";

const createItem = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const clerkId = req.userId;
    if (!clerkId) throw new AppError('Unauthorized', 401);

    const parsed = CreateItemSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError(parsed.error.issues[0].message, 400);
    }

    const itemData = {
        ...parsed.data,
        clerkId,
    } as Partial<IItem>;

    const item = await ItemService.createItem(itemData, clerkId);
    res.status(201).json({ success: true, data: item });
});


const fetchUserItem = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const clerkId = req.userId;
    if (!clerkId) throw new AppError('Unauthorized', 401);

    const groupedItems = await ItemService.fetchUserItem(clerkId);

    res.status(200).json({
        success: true,
        count: groupedItems.length,
        data: groupedItems,
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

        const parsed = EditItemSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.issues[0].message, 400);
        }

        const items = await ItemService.editItem(req.params.id as string, clerkId, parsed.data)

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

const exportItems = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const clerkId = req.userId;
        if (!clerkId) throw new AppError("Unauthorized", 401)

        const items = await ItemService.exportItems(clerkId);

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=clippit-export.json");

        res.status(200).json({
            exportedAt: new Date().toISOString(),
            total_items: items.length,
            items
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
    deleteAccount,
    exportItems
}