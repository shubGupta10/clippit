import AppError from "../../lib/AppError"
import Collection from "./collection.model"
import Item from "../item/item.model"
import User from "../user/user.modal"
import mongoose from "mongoose"
import redis from "../../config/redis"

const CACHE_TTL = 3600;

const getUserByClerkId = async (clerkId: string) => {
    const user = await User.findOne({ clerkId });
    if (!user) throw new AppError("User not found", 404);
    return user;
}

const createCollection = async (name: string, userId: string) => {
    if (!name || !userId) {
        throw new AppError("Please provide name", 400)
    }

    const user = await getUserByClerkId(userId);

    const collection = await Collection.create({
        name,
        owner: user._id
    })

    await redis.del(`collections:list:${userId}`);

    return await collection.populate([
        { path: "owner", select: "firstName lastName email clerkId" },
        { path: "members", select: "firstName lastName email clerkId" },
        { path: "itemIds", select: "-embeddings" }
    ])
}

const getCollections = async (userId: string) => {
    const cacheKey = `collections:list:${userId}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const user = await getUserByClerkId(userId);

    const collections = await Collection.find({
        $or: [
            { owner: user._id },
            { members: user._id }
        ]
    })
        .populate("itemIds", '-embeddings')
        .populate("owner", "firstName lastName email clerkId")
        .populate("members", "firstName lastName email clerkId")

    await redis.set(cacheKey, JSON.stringify(collections), "EX", CACHE_TTL);
    return collections
}

const getCollectionById = async (userId: string, collectionId: string) => {
    if (!collectionId) {
        throw new AppError("Please provide collection Id", 404)
    }

    const cacheKey = `collection:detail:${collectionId}`;
    const cachedData = await redis.get(cacheKey);

    const user = await getUserByClerkId(userId);

    if (cachedData) {
        const collection = JSON.parse(cachedData);
        const isMember = collection.members.some((m: any) => (m._id || m).toString() === user._id.toString())
        const isOwner = (collection.owner._id || collection.owner).toString() === user._id.toString()
        if (!isMember && !isOwner) {
            throw new AppError("You are not authorized to access this collection", 403)
        }
        return collection;
    }

    const collection = await Collection.findById(collectionId)
        .populate("itemIds", '-embeddings')
        .populate("owner", "firstName lastName email")
        .populate("members", "firstName lastName email")

    if (!collection) {
        throw new AppError("Collection not found", 404)
    }
    const isMember = collection.members.some(m => (m as any)._id.toString() === user._id.toString())
    const isOwner = (collection.owner as any)._id.toString() === user._id.toString()

    if (!isMember && !isOwner) {
        throw new AppError("You are not authorized to access this collection", 403)
    }

    await redis.set(cacheKey, JSON.stringify(collection), "EX", CACHE_TTL);
    return collection
}

const addItemToCollection = async (userId: string, collectionId: string, itemId: string) => {
    if (!collectionId || !itemId) {
        throw new AppError("Please provide CollectionId and ItemId", 400)
    }

    const user = await getUserByClerkId(userId);

    const collection = await Collection.findById(collectionId)
    if (!collection) {
        throw new AppError("Collection not found", 404)
    }

    const isOwner = collection.owner.toString() === user._id.toString()
    const isMember = collection.members.some(m => m.toString() === user._id.toString())
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

    await redis.del(`collections:list:${userId}`)
    await redis.del(`collection:detail:${collectionId}`)
    await redis.del(`item:feed:${userId}`);

    return collection
}

const removeItemFromCollection = async (userId: string, collectionId: string, itemId: string) => {
    if (!collectionId || !itemId) {
        throw new AppError("Please provide CollectionId and ItemId", 400)
    }

    const user = await getUserByClerkId(userId);

    const collection = await Collection.findById(collectionId)
    if (!collection) {
        throw new AppError("Collection not found", 404)
    }

    const item = await Item.findById(itemId)
    if (!item) {
        throw new AppError("Item not found", 404)
    }

    const isOwner = collection.owner.toString() === user._id.toString()
    const isItemSaver = item.userId === user._id.toString() || item.clerkId === userId

    if (!isOwner && !isItemSaver) {
        throw new AppError("You are not authorized to remove this item", 403)
    }

    collection.itemIds = collection.itemIds.filter(id => id.toString() !== itemId)
    item.collectionId = null
    await Promise.all([collection.save(), item.save()])

    await redis.del(`collections:list:${userId}`)
    await redis.del(`collection:detail:${collectionId}`)
    await redis.del(`item:feed:${userId}`);

    return collection
}

const deleteCollection = async (userId: string, collectionId: string) => {
    if (!collectionId) {
        throw new AppError("Please provide collection Id", 400)
    }

    const user = await getUserByClerkId(userId);

    const collection = await Collection.findById(collectionId)
    if (!collection) {
        throw new AppError("Collection not found", 404)
    }

    if (collection.owner.toString() !== user._id.toString()) {
        throw new AppError("You are not authorized to delete this collection", 403)
    }

    await Item.updateMany({ collectionId: collectionId }, { $unset: { collectionId: "" } })
    await collection.deleteOne()

    await redis.del(`collections:list:${userId}`)
    await redis.del(`collection:detail:${collectionId}`)

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