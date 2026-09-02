import z from 'zod';

export const endpointSchema = z.object({
    userId: z.string(), //TEMPORARY: This should be removed once we implement user authentication and authorization
    url: z.string().url(),
    name: z.string(),
    description: z.string().optional(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']),
    headers: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
    body: z.unknown().optional(),
    expectedCode: z.number().int().min(100).max(599),
    intervalMs: z.number().int().positive().optional(),
    timeoutMs: z.number().int().positive().optional(),
    consecutiveFailureThreshold: z.number().int().positive().optional(),
    isPaused: z.boolean().optional(),
});