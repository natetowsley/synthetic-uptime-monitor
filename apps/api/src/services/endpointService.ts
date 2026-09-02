import prisma from '../config/prisma.js';
import logger from '../config/logger.js';
import { PrismaClient, Prisma, HttpMethod } from '../generated/prisma/client.js';
import z from 'zod';
import { endpointSchema } from '../validators/endpointValidators.js';

export async function createEndpoint(data: z.infer<typeof endpointSchema>) {
    try {
        return await prisma.endpoint.create({
            data: {
                ...data,
                body: data.body as Prisma.InputJsonValue | undefined, // Must cast body from zod schema to Prisma's InputJsonValue type
            },
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