import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getApprovals,
  createApproval,
  updateApproval,
} from '../controllers/approvals.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getApprovals);
router.post('/', createApproval);
router.put('/:id', updateApproval);

export default router;
