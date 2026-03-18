import { Response } from "express";
import { asyncWrapper, AuthRequest } from "../../lib/asyncWrapper";
import { collectionService } from "./collection.service";

const createCollection = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId;
        const { name } = req.body;

        const collection = await collectionService.createCollection(name, userId!);

        res.status(201).json({
            success: true,
            message: "Collection created successfully",
            data: collection
        })
    }
)

const getCollections = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId;

        const collections = await collectionService.getCollections(userId!);

        res.status(200).json({
            success: true,
            message: "Collections fetched successfully",
            data: collections
        })
    }
)

const getCollectionById = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId;
        const collectionId = req.params.id;

        const collection = await collectionService.getCollectionById(userId!, collectionId as string);

        res.status(200).json({
            success: true,
            message: "Collection fetched successfully",
            data: collection
        })
    }
)

const addItemToCollection = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId;
        const collectionId = req.params.id;
        const { itemId } = req.body

        const collection = await collectionService.addItemToCollection(userId!, collectionId as string, itemId as string);

        res.status(200).json({
            success: true,
            message: "Item added to collection successfully",
            data: collection
        })
    }
)

const removeItemFromCollection = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId;
        const collectionId = req.params.id;
        const { itemId } = req.body

        const collection = await collectionService.removeItemFromCollection(userId!, collectionId as string, itemId as string);

        res.status(200).json({
            success: true,
            message: "Item removed from collection successfully",
            data: collection
        })
    }
)

const deleteCollection = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId;
        const collectionId = req.params.id;

        const collection = await collectionService.deleteCollection(userId!, collectionId as string);

        res.status(200).json({
            success: true,
            message: "Collection deleted successfully",
            data: collection
        })
    }
)

export {
    createCollection,
    getCollections,
    getCollectionById,
    addItemToCollection,
    removeItemFromCollection,
    deleteCollection
}