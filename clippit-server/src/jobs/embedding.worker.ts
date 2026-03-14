import { Worker } from 'bullmq';
import { emeddingProcessor } from './embedding.processor';

const worker = new Worker('embedding', emeddingProcessor, {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    concurrency: 5, // process 5 jobs at a time
});
console.log('Embedding worker running');

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
    console.error('Worker error:', err);
});

export default worker;