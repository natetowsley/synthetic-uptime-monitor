import { Redis } from 'ioredis';
import logger from './logger.js';

const PORT = Number(process.env.REDIS_PORT) || 6379

const redis = new Redis({
    port: PORT,
    host: process.env.REDIS_HOST || '127.0.0.1',
    maxRetriesPerRequest: null,
    retryStrategy: function (times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('connect', () => { 
    logger.info({port: PORT}, 'Redis connected');
});

redis.on('error', (error) => {
    logger.error({name: error.name, message:error.message, stack: error.stack}, 'An error with Redis has occurred');
});

redis.on('reconnecting', (...args) => {
    const [delay] = args as unknown[];
    logger.warn({port: PORT, delay: delay + 'ms'}, 'Redis reconnecting');
});

redis.on('ready', () => {
    logger.info({port: PORT}, 'Redis is now ready');
});

redis.on('close', () => {
    logger.warn({port: PORT}, 'Redis closed');
});

export default redis;