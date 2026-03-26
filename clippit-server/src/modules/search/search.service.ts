import { generateEmbedding } from "../../config/models/gemini";
import Item from "../item/item.model";
import redis from "../../config/redis";
import AppError from "../../lib/AppError";
import { ISearchQuery } from "./search.interface";

const CACHE_TTL = 60 * 60;

const searchItems = async (clerkId: string, { query, limit = 10 }: ISearchQuery) => {
    if (!query?.trim()) {
        throw new AppError("Search query is required", 400)
    }

    const cacheKey = `search:${clerkId}:${query.trim().toLowerCase()}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        console.log('Returning cached search results');
        return JSON.parse(cached);
    }

    const queryEmbedding = await generateEmbedding(query);

    const results = await Item.aggregate([
        {
            $vectorSearch: {
                index: "embedding_index",
                path: "embeddings",
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit,
                filter: { clerkId }
            },
        },
        {
            $addFields: {
                score: { $meta: "vectorSearchScore" }
            }
        },
        {
            $match: {
                score: { $gte: 0.40 }
            }
        },
        {
            $project: {
                _id: 1,
                type: 1,
                content: 1,
                imageUrl: 1,
                sourceUrl: 1,
                tags: 1,
                note: 1,
                title: 1,
                pageTitle: 1,
                pageDescription: 1,
                createdAt: 1,
                score: 1
            },
        },
    ]);

    if (results.length > 0) {
        await redis.set(cacheKey, JSON.stringify(results), "EX", CACHE_TTL);
    }

    return results;
}


export const searchService = {
    searchItems
}