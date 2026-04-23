import { z } from "zod";
import { ItemType } from "../modules/item/item.enum";

// ── Item Schemas ─────────────────────────────────────────────────────────────

export const CreateItemSchema = z.object({
    type: z.nativeEnum(ItemType),
    title: z.string().max(500).optional(),
    content: z.string().max(50000).optional(),
    imageUrl: z.string().url().max(2048).optional(),
    sourceUrl: z.string().url().max(2048),
    collectionId: z.string().max(50).optional().nullable(),
    note: z.string().max(5000).optional(),
    tags: z.array(z.string().trim().max(50)).max(20).optional(),
});

export const EditItemSchema = z.object({
    note: z.string().max(5000).optional(),
    tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
}).refine(data => data.note !== undefined || data.tags !== undefined, {
    message: "Nothing to update",
});

export const CreateCollectionSchema = z.object({
    name: z.string().trim().min(1, "Collection name is required").max(100),
});

export const CollectionItemSchema = z.object({
    itemId: z.string().min(1, "Item ID is required"),
});

export const SendInviteSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const SearchSchema = z.object({
    query: z.string().trim().min(1, "Search query is required").max(500),
    limit: z.number().int().min(1).max(50).optional().default(10),
});

export const MongoIdParamSchema = z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID format"),
});
