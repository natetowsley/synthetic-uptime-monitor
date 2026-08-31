import { registerUser } from '../controllers/userController.js';
import { Router } from 'express';

const router = Router();

router.post('/', registerUser);

export default router;

