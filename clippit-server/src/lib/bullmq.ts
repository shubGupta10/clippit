import { Queue } from "bullmq";
import dotenv from "dotenv"

dotenv.config();

const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379")
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