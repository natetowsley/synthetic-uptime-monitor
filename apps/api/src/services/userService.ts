import prisma from '../config/prisma.js';
import logger from '../config/logger.js';
import { PrismaClient, Prisma } from '../generated/prisma/client.js';

export async function createUser(data: { email: string; name?: string }) {
    try {
        return await prisma.user.create({
            data,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                logger.warn({ error }, 'Attempted to create user with existing email');
                throw new Error('Email already in use');
            }
        }
        logger.error({ error }, 'Error creating user');
        throw error;
    }
}
