import express from 'express';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  createOrder,
  processPayment,
} from '../controllers/plans.controller.js';

const router = express.Router();

router.get('/', getPlans);
router.post('/', createPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);
router.post('/create-order', createOrder);
router.post('/checkout', processPayment);

export default router;
