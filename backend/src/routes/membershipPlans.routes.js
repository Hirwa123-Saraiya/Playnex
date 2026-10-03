import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from '../controllers/membershipPlans.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getPlans);
router.post('/', createPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

export default router;
