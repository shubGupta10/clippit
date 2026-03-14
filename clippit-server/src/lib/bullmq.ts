import { Queue } from "bullmq";
import dotenv from "dotenv"

dotenv.config();

const connection = {
    url: process.env.REDIS_URL || "redis://localhost:6379"
}

export const embeddingQueue = new Queue("embedding", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000
        },
        removeOnComplete: true,
        removeOnFail: false
    },
});

embeddingQueue.on("error", (err) => {
    console.log("Embedding queue error", err);
});