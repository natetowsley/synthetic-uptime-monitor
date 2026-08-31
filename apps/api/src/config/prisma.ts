import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import logger from './logger.js';

const isDev = process.env.NODE_ENV === 'development';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });


const prisma = new PrismaClient({
    adapter,
    log: isDev ? [
        { level: 'query', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'warn', emit: 'event' },
    ] : [
        { level: 'error', emit: 'event' },
    ],
});

prisma.$on('query', (event) => { 
    logger.debug({ query: event.query, params: event.params, duration: event.duration }, 'Prisma query');
});

export default prisma;
