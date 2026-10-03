import express from 'express';
import {
  getUserMemberships,
  purchaseUserMembership,
  getMembershipPlans,
} from '../controllers/userMemberships.controller.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(optionalAuthenticate);
router.get('/', getUserMemberships);
router.get('/plans', getMembershipPlans);
router.post('/purchase', purchaseUserMembership);

export default router;
