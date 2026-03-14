import { generateEmbedding } from "../config/models/gemini";

export const getEmbedding = async (text: string): Promise<number[]> => {
    return await generateEmbedding(text);
}