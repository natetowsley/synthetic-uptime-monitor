import { Router } from 'express';
import { registerEndpoint, getEndpointsByUser, getActiveEndpoints } from '../controllers/endpointController.js';

const router = Router();

router.post('/', registerEndpoint);
router.get('/', getEndpointsByUser);

export default router;