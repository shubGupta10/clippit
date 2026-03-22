import { Job } from "bullmq";
import { generateEmbedding, generateTags } from "../config/models/gemini";
import { ItemService } from "../modules/item/item.service";
import AppError from "../lib/AppError";
import axios from "axios";
import * as cheerio from "cheerio";

export const emeddingProcessor = async (job: Job) => {
    const { itemId, content } = job.data;

    if (!itemId || !content) {
        throw new AppError("Job Item and content are required", 400);
    }

    const item = await ItemService.getItemById(itemId);
    if (!item) {
        throw new AppError(`Item ${itemId} not found`, 400);
    }

    if (item?.isEmbedded) {
        console.log(`Item ${itemId} already embedded, skipping`);
        return;
    }

    console.log(`Processing embedding for item ${itemId}`);

    let processedContent = content;
    let pageTitle: string | undefined;
    let pageDescription: string | undefined;

    if (!processedContent || processedContent.startsWith('http')) {
        try {
            const response = await axios.get(content, {
                timeout: 8000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            });
            const $ = cheerio.load(response.data as string);
            const title = $('title').text().trim();
            const description = $('meta[name="description"]').attr('content')?.trim() || '';
            const ogTitle = $('meta[property="og:title"]').attr('content')?.trim() || '';
            const ogDescription = $('meta[property="og:description"]').attr('content')?.trim() || '';

            pageTitle = ogTitle || title;
            pageDescription = ogDescription || description;

            processedContent = `${pageTitle || ""} ${pageDescription || ""}`.trim();

            if (!processedContent) {
                processedContent = content;
            }
        } catch {
            console.log(`Could not fetch content for ${content}, falling back to URL`);
            processedContent = content;
        }
    }

    const [embedding, tags] = await Promise.all([
        generateEmbedding(processedContent),
        generateTags(processedContent)
    ]);

    await ItemService.updateItemEmbedding(itemId, embedding, tags, pageTitle, pageDescription);

    console.log(`Embedding generated for item ${itemId} with tags: ${tags}`);
};