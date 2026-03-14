import { ItemType } from "./item.enum";

export interface IItem {
    userId: string;
    clerkId: string;
    type: ItemType,
    content?: string,
    imageUrl?: string,
    sourceUrl: string,
    note?: string,
    tags?: string[],
    embeddings: number[],
    isEmbedded: boolean
}