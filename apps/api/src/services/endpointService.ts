import prisma from '../config/prisma.js';
import logger from '../config/logger.js';
import { PrismaClient, Prisma, HttpMethod } from '../generated/prisma/client.js';
import z from 'zod';
import { endpointSchema } from '../validators/endpointValidators.js';
import probeQueue from '../queues/probeQueue.js';

export async function createEndpoint(data: z.infer<typeof endpointSchema>) {
    let entry;
    // Endpoint write to postgres
    try {
        entry = await prisma.endpoint.create({
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
    // Schedule job
    try {
        await probeQueue.upsertJobScheduler(
            entry.id,
            { every: entry.intervalMs },
            {
                name: 'probe',
                data: { endpointId: entry.id },
            }
        );
    } catch (error) {
        await prisma.endpoint.delete({
            where: { id: entry.id }
        });

        if (error instanceof Error) {
            logger.error({ name: error.name, message: error.message, stack: error.stack }, 'Failed to schedule endpoint job to BullMQ');
        } else {
            logger.error({ error: String(error) }, 'Non-Error value thrown while scheduling');
        }

        throw new Error('Scheduling failed, endpoint not saved');
    }
    return entry;
}

export async function getEndpointsByUserId(userId: string) {
    return await prisma.endpoint.findMany({
        where: { userId }
    });
}

export async function listActiveEndpoints() {
    return await prisma.endpoint.findMany({
        where: { isPaused: false }
    });
}