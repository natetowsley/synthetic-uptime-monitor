import logger from '../config/logger.js';
import { createUser } from '../services/userService.js';
import { Request, Response } from 'express';

export async function registerUser(req: Request, res: Response) {
    const { email, name } = req.body;

    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }

    try {
        const user = await createUser({ email, name });
        const { passwordHash, ...safeUser } = user; // Exclude sensitive information
        res.status(201).json(safeUser);
    } catch (error) {
        if (error instanceof Error && error.message === 'Email already in use') {
            res.status(409).json({ message: error.message });
            return;
        }

        logger.error({ error }, 'Error in registerUser controller');
        res.status(500).json({ message: 'Internal server error' });
    }
}