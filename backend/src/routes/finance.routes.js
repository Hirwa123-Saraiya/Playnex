import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getFinanceData } from '../controllers/finance.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getFinanceData);

export default router;
