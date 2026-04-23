import express      from 'express';
import { getStats } from '../controllers/adminController.js';
import protect      from '../middlewares/isAuthenticate.js';

const router = express.Router();
router.get('/stats', protect, getStats);

export default router;
