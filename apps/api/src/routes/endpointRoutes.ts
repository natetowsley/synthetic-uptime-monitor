import { Router } from 'express';
import { registerEndpoint } from '../controllers/endpointController.js';

const router = Router();

router.post('/', registerEndpoint);

export default router;