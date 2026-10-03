import express from 'express';
import { authenticate, requireSystemRole } from '../middlewares/auth.middleware.js';
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  createOrder,
  processPayment,
} from '../controllers/plans.controller.js';

const router = express.Router();

// Require authentication for plans routes
router.use(authenticate);

// Plans listing (available to Super Admin and Club Owners for subscription upgrade)
router.get('/', getPlans);

// Plan modifications restricted to Super Admin
router.post('/', requireSystemRole('SUPER_ADMIN'), createPlan);
router.put('/:id', requireSystemRole('SUPER_ADMIN'), updatePlan);
router.delete('/:id', requireSystemRole('SUPER_ADMIN'), deletePlan);

// Payment processing via Razorpay
router.post('/create-order', createOrder);
router.post('/checkout', processPayment);

export default router;
