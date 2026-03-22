import AppError from "../../lib/AppError";
import { embeddingQueue } from "../../lib/bullmq";
import User from "../user/user.modal";
import { ItemType } from "./item.enum";
import { IItem } from "./item.interface";
import Item from "./item.model";
import Collection from "../collection/collection.model";
import { getFriendlyDateLabel } from "./item.utils";
import redis from "../../config/redis";

const CACHE_TTL = 3600;

const createItem = async (data: Partial<IItem>, clerkId: string) => {
    const user = await User.findOne({ clerkId });
    if (!user) {
        throw new AppError("User not found", 400)
    }

    data.userId = user._id.toString();
    data.clerkId = clerkId;

    if (data.type === ItemType.TEXT && !data.content?.trim()) {
        throw new AppError('Text items must have content', 400);
    }
    if (data.type === ItemType.IMAGE && !data.imageUrl?.trim()) {
        throw new AppError('Image items must have an image URL', 400);
    }
    if (!data.sourceUrl?.trim()) {
        throw new AppError('Source URL is required', 400);
    }

    const existing = await Item.findOne({
        clerkId,
        sourceUrl: data.sourceUrl,
        type: data.type
    });

    if (existing) {
        throw new AppError("Item already saved", 409)
    }

    const item = await Item.create(data);
    await redis.del(`item:feed:${clerkId}`);

    await embeddingQueue.add("generate-embedding", {
        itemId: item._id.toString(),
        content: item.content || item.imageUrl || item.sourceUrl
    })

    return item
}

const fetchUserItem = async (clerkId: string) => {
    const cacheKey = `item:feed:${clerkId}`

    const cacheData = await redis.get(cacheKey);
    if (cacheData) {
        return JSON.parse(cacheData);
    }

    const items = await Item.find({ clerkId })
        .select("-embeddings")
        .sort({ createdAt: -1 })
        .lean();

    // Transform the flat list into the grouped "Google Photos" structure
    const groupedFeed = items.reduce((acc: any[], item) => {
        const label = getFriendlyDateLabel(item.createdAt || new Date());

        let group = acc.find(g => g.label === label);

        if (!group) {
            group = { label, items: [] };
            acc.push(group);
        }

        group.items.push(item);
        return acc;
    }, []);

    await redis.set(cacheKey, JSON.stringify(groupedFeed), "EX", CACHE_TTL)
    return groupedFeed;
};

const getItemById = async (itemId: string, clerkId?: string) => {
    const cacheKey = `item:${itemId}`;
    const cacheData = await redis.get(cacheKey);
    if (cacheData) {
        return JSON.parse(cacheData);
    }

    const item = await Item.findById(itemId).select("-embeddings").lean();
    if (!item) {
        throw new AppError("Item not found", 404);
    }

    if (clerkId) {
        const user = await User.findOne({ clerkId });
        if (!user) throw new AppError("User not found", 401);

        // Check ownership
        if (item.clerkId === clerkId) return item;

        // Check collection access
        if (item.collectionId) {
            const collection = await Collection.findById(item.collectionId);
            if (collection) {
                const isMember = collection.members.some(m => m.toString() === user._id.toString());
                const isOwner = collection.owner.toString() === user._id.toString();
                if (isMember || isOwner) return item;
            }
        }
        throw new AppError("Unauthorized", 401);
    }

    await redis.set(cacheKey, JSON.stringify(item), "EX", CACHE_TTL);
    return item;
};

const deleteItem = async (itemId: string, clerkId: string) => {
    const deleted = await Item.findOneAndDelete({ _id: itemId, clerkId });
    await redis.del(`item:feed:${clerkId}`);
    if (!deleted) {
        throw new AppError("Item not found or not authorized", 404);
    }
    return deleted;
};

const editItem = async (
    ItemId: string,
    clerkId: string,
    data: { note?: string, tags?: string[] }
) => {
    if (!data.note && !data.tags) {
        throw new AppError("Nothing to update", 400);
    }

    if (data.tags && !Array.isArray(data.tags)) {
        throw new AppError("Tags must be an array", 400);
    }

    if (data.tags && data.tags.some(tag => typeof tag !== "string" || !tag.trim())) {
        throw new AppError("All tags must be non-empty strings", 400);
    }

    const updatedData: Partial<IItem> = {};
    if (data.note !== undefined) updatedData.note = data.note.trim();

    if (data.tags !== undefined) updatedData.tags = data.tags.map(t => t.trim());

    const item = await Item.findOneAndUpdate(
        { _id: ItemId, clerkId },
        { $set: updatedData },
        { returnDocument: "after" }
    );
    await redis.del(`item:feed:${clerkId}`);

    if (!item) {
        throw new AppError("Item not found or Unauthorized", 404)
    }
    return item
}

const updateItemEmbedding = async (
    itemId: string,
    embedding: number[],
    tags: string[]
) => {
    const item = await Item.findByIdAndUpdate(
        itemId,
        { embeddings: embedding, tags, isEmbedded: true },
        { returnDocument: 'after' }
    );

    if (!item) throw new AppError('Item not found', 404);

    return item;
};

const clearAllItems = async (clerkId: string) => {
    if (!clerkId) {
        throw new AppError("Unauthorized", 401)
    }

    const result = await Item.deleteMany({
        clerkId
    })
    await redis.del(`item:feed:${clerkId}`);
    if (result.deletedCount === 0) {
        throw new AppError("No Items found to delete", 404)
    }

    return result;
}

const deleteAccount = async (clerkId: string) => {
    if (!clerkId) {
        throw new AppError("Unauthorized", 401)
    }

    await Item.deleteMany({ clerkId });
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) throw new AppError("User not found", 404);

    return user;
}

export const ItemService = {
    createItem,
    fetchUserItem,
    getItemById,
    deleteItem,
    updateItemEmbedding,
    editItem,
    clearAllItems,
    deleteAccount
}