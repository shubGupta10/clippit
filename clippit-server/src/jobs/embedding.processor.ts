import { Job } from "bullmq";
import { generateEmbedding, generateTags } from "../config/models/gemini";
import { ItemService } from "../modules/item/item.service";
import AppError from "../lib/AppError";


export const emeddingProcessor = async (job: Job) => {
    const { itemId, content } = job.data;

    if (!itemId || !content) {
        throw new AppError("Job Item and content are required", 400)
    }

    const item = await ItemService.getItemById(itemId);
    if (!item) {
        throw new AppError(`Item ${itemId} not found`, 400)
    }

    //skip if already embedded
    if (item?.isEmbedded) {
        console.log(`Item ${itemId} already embedded, skipping`);
        return;
    }

    console.log(`Processing embedding for item ${itemId}`);

    // generate embedding and tags in parallel
    const [embedding, tags] = await Promise.all([
        generateEmbedding(content),
        generateTags(content)
    ]);

    await ItemService.updateItemEmbedding(itemId, embedding, tags);

    console.log(`Embedding generated for item ${itemId} with tags: ${tags}`);
}