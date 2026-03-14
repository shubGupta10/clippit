import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

export const connectRedis = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (redis.status === 'ready') {
            console.log('Redis connected');
            return resolve();
        }
        redis.once('ready', () => {
            console.log('Redis connected');
            resolve();
        });
        redis.once('error', reject);
    });
};

export default redis;