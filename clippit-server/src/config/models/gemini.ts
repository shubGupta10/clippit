import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY as string
});

export const generateEmbedding = async (text: string): Promise<number[]> => {
    const response = await genAI.models.embedContent({
        model: "gemini-embedding-001",
        contents: text
    })
    return response.embeddings?.[0].values as number[];
}

export const generateTags = async (text: string): Promise<string[]> => {
    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: `Generate 3 short descriptive tags for this content. Return only a JSON array of strings, nothing else. Content: ${text}`,
    });
    const raw = response.text as string;
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
};

export default genAI