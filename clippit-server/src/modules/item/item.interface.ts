import { Types } from "mongoose";
import { ItemType } from "./item.enum";

export interface IItem {
    userId: string;
    clerkId: string;
    type: ItemType,
    title?: string,
    content?: string,
    imageUrl?: string,
    sourceUrl: string,
    collectionId: Types.ObjectId | null,
    note?: string,
    tags?: string[],
    pageTitle?: string,
    pageDescription?: string,
    embeddings: number[],
    isEmbedded: boolean,
    createdAt?: Date,
    updatedAt?: Date
}