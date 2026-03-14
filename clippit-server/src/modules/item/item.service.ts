import AppError from "../../lib/AppError";
import { embeddingQueue } from "../../lib/bullmq";
import User from "../user/user.modal";
import { ItemType } from "./item.enum";
import { IItem } from "./item.interface";
import Item from "./item.model";

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

    await embeddingQueue.add("generate-embedding", {
        itemId: item._id.toString(),
        content: item.content || item.imageUrl || item.sourceUrl
    })

    return item
}

const fetchUserItem = async (clerkId: string) => {
    return await Item.find({ clerkId })
        .select("-embeddings")
        .sort({ createdAt: -1 })
        .lean();
}

const getItemById = async (itemId: string) => {
    const item = await Item.findById(itemId).select("-embeddings").lean();
    if (!item) {
        throw new AppError("Item not found", 404);
    }
    return item;
};

const deleteItem = async (itemId: string, clerkId: string) => {
    const deleted = await Item.findOneAndDelete({ _id: itemId, clerkId });
    if (!deleted) {
        throw new AppError("Item not found or not authorized", 404);
    }
    return deleted;
};

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

export const ItemService = {
    createItem,
    fetchUserItem,
    getItemById,
    deleteItem,
    updateItemEmbedding
}