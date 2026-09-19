import { Queue } from 'bullmq';
import { queueConnection } from '../config/redis.js';

const probeQueue = new Queue('probes', { connection: queueConnection });

export default probeQueue;