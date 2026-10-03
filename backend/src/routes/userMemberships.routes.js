import express from 'express';
import {
  getUserMemberships,
  purchaseUserMembership,
  getMembershipPlans,
} from '../controllers/userMemberships.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Publicly browsable membership plans
router.get('/plans', optionalAuthenticate, getMembershipPlans);

// User membership purchases & list require authentication
router.get('/', authenticate, getUserMemberships);
router.post('/purchase', authenticate, purchaseUserMembership);

export default router;
