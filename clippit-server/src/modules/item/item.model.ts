import mongoose, { Schema, Document } from "mongoose";
import { ItemType } from "./item.enum";
import { IItem } from "./item.interface";

export interface ItemDocument extends IItem, Document { }

const ItemSchema = new Schema<ItemDocument>(
    {
        userId: {
            type: String,
            required: true
        },
        clerkId: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: Object.values(ItemType),
            required: true
        },
        content: {
            type: String
        },
        imageUrl: {
            type: String
        },
        sourceUrl: {
            type: String,
            required: true
        },
        note: {
            type: String
        },
        tags: {
            type: [String],
            default: []
        },
        embeddings: {
            type: [Number],
            default: []
        },
        isEmbedded: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
)

ItemSchema.index({ clerkId: 1, createdAt: -1 });

const Item = mongoose.model<ItemDocument>("Item", ItemSchema);

export default Item