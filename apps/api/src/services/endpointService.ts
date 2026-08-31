import prisma from '../config/prisma.js';
import logger from '../config/logger.js';
import { PrismaClient, Prisma, HttpMethod } from '../generated/prisma/client.js';

export async function createEndpoint(data: {
    userId: string; //TEMPORARY: This should be removed once we implement user authentication and authorization
    url: string;
    name: string;
    description?: string;
    method: HttpMethod;
    headers?: Prisma.InputJsonValue;
    body?: Prisma.InputJsonValue;
    expectedCode: number;
    intervalMs?: number;
    timeoutMs?: number;
    consecutiveFailureThreshold?: number;
    isPaused?: boolean;
}) {
    try {
        return await prisma.endpoint.create({
            data,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                logger.error({ error }, 'Foreign key constraint violation while creating endpoint');
                throw new Error('The referenced userId does not correspond to an existing user.');
            }

        }
        
        logger.error({ error }, 'Error creating endpoint');
        throw error;
    }
}