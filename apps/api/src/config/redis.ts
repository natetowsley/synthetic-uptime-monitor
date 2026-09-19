import { Redis } from 'ioredis';
import logger from './logger.js';

const PORT = Number(process.env.REDIS_PORT) || 6379

export const queueConnection = new Redis({
    port: PORT,
    host: process.env.REDIS_HOST || '127.0.0.1',
    enableOfflineQueue: false,
    retryStrategy: function (times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

export const workerConnection = new Redis({
    port: PORT,
    host: process.env.REDIS_HOST || '127.0.0.1',
    maxRetriesPerRequest: null,
    retryStrategy: function (times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

function attachLogging(redis: Redis, role: "queue" | "worker") {
    redis.on('connect', () => {
        logger.info({ role: role, port: PORT }, 'Redis connected');
    });

    redis.on('error', (error) => {
        logger.error({ role: role, name: error.name, message: error.message, stack: error.stack }, 'An error with Redis has occurred');
    });

    redis.on('reconnecting', (...args) => {
        const [delay] = args as unknown[];
        logger.warn({ role: role, port: PORT, delay: delay + 'ms' }, 'Redis reconnecting');
    });

    redis.on('ready', () => {
        logger.info({ role: role, port: PORT }, 'Redis is now ready');
    });

    redis.on('close', () => {
        logger.warn({ role: role, port: PORT }, 'Redis closed');
    });
}

attachLogging(queueConnection, 'queue');
attachLogging(workerConnection, 'worker');
