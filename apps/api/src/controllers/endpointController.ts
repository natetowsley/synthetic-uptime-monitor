import logger from '../config/logger.js';
import { createEndpoint, getEndpointsByUserId, listActiveEndpoints } from '../services/endpointService.js';
import { Request, Response } from 'express';
import z from 'zod';
import { endpointSchema } from '../validators/endpointValidators.js';

export async function registerEndpoint(req: Request, res: Response) {
    try {
        const data = endpointSchema.parse(req.body);
        const endpoint = await createEndpoint(data);
        res.status(201).json(endpoint);
    } catch (error) {
        if (error instanceof z.ZodError) {
            logger.error({ error }, 'Validation error in registerEndpoint controller');
            res.status(400).json({ message: 'Invalid request data' });
            return;
        }
        if (error instanceof Error && error.message === 'The referenced userId does not correspond to an existing user.') {
            res.status(404).json({ message: error.message });
            return;
        }

        logger.error({ error }, 'Error in registerEndpoint controller');
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getEndpointsByUser(req: Request, res: Response) {
  const userId = req.query.userId;

  if (typeof userId !== 'string') {
    res.status(400).json({ message: 'userId query parameter is required' });
    return;
  }

  const endpoints = await getEndpointsByUserId(userId);
  res.status(200).json(endpoints);
}

export async function getActiveEndpoints(req: Request, res: Response) {
    const endpoints = await listActiveEndpoints();
    res.status(200).json(endpoints);
}