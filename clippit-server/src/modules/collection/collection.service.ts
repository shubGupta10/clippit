import AppError from "../../lib/AppError"
import Collection from "./collection.model"
import Item from "../item/item.model"
import mongoose from "mongoose"

const createCollection = async (name: string, userId: string) => {
    if (!name || !userId) {
        throw new AppError("Please provide name", 400)
    }

    const collection = await Collection.create({
        name,
        owner: new mongoose.Types.ObjectId(userId)
    })
    return collection
}

const getCollections = async (userId: string) => {
    const userObjId = new mongoose.Types.ObjectId(userId)
    const collections = await Collection.find({
        $or: [
            { owner: userObjId },
            { members: userObjId }
        ]
    })

    return collections
}

const getCollectionById = async (userId: string, collectionId: string) => {
    if (!collectionId) {
        throw new AppError("Please provide collection Id", 404)
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
        throw new AppError("Collection not found", 404)
    }
    const isMember = collection.members.some(m => m.toString() === userId)
    const isOwner = collection.owner.toString() === userId

    if (!isMember && !isOwner) {
        throw new AppError("You are not authorized to access this collection", 403)
    }
    return collection
}

const addItemToCollection = async (userId: string, collectionId: string, itemId: string) => {
    if (!collectionId || !itemId) {
        throw new AppError("Please provide CollectionId and ItemId", 400)
    }

    const collection = await Collection.findById(collectionId)
    if (!collection) {
        throw new AppError("Collection not found", 404)
    }

    const isOwner = collection.owner.toString() === userId
    const isMember = collection.members.some(m => m.toString() === userId)
    if (!isOwner && !isMember) {
        throw new AppError("You are not authorized to add items to this collection", 403)
    }

    const item = await Item.findById(itemId)
    if (!item) {
        throw new AppError("Item not found", 404)
    }

    if (item.collectionId) {
        throw new AppError("Item already belongs to a collection", 400)
    }

    collection.itemIds.push(new mongoose.Types.ObjectId(itemId))
    item.collectionId = new mongoose.Types.ObjectId(collectionId)
    await Promise.all([collection.save(), item.save()])

    return collection
}

const removeItemFromCollection = async (userId: string, collectionId: string, itemId: string) => {
    if (!collectionId || !itemId) {
        throw new AppError("Please provide CollectionId and ItemId", 400)
    }

    const collection = await Collection.findById(collectionId)
    if (!collection) {
        throw new AppError("Collection not found", 404)
    }

    const item = await Item.findById(itemId)
    if (!item) {
        throw new AppError("Item not found", 404)
    }

    const isOwner = collection.owner.toString() === userId
    const isItemSaver = item.userId.toString() === userId

    if (!isOwner && !isItemSaver) {
        throw new AppError("You are not authorized to remove this item", 403)
    }

    collection.itemIds = collection.itemIds.filter(id => id.toString() !== itemId)
    item.collectionId = null
    await Promise.all([collection.save(), item.save()])

    return collection
}

const deleteCollection = async (userId: string, collectionId: string) => {
    if (!collectionId) {
        throw new AppError("Please provide collection Id", 400)
    }

    const collection = await Collection.findById(collectionId)
    if (!collection) {
        throw new AppError("Collection not found", 404)
    }

    if (collection.owner.toString() !== userId) {
        throw new AppError("You are not authorized to delete this collection", 403)
    }

    await Item.updateMany({ collectionId: collectionId }, { $unset: { collectionId: "" } })
    await collection.deleteOne()

    return collection
}

export const collectionService = {
    createCollection,
    getCollections,
    getCollectionById,
    addItemToCollection,
    removeItemFromCollection,
    deleteCollection
}