import express from 'express';
import {
  getUserMemberships,
  purchaseUserMembership,
} from '../controllers/userMemberships.controller.js';

const router = express.Router();

router.get('/', getUserMemberships);
router.post('/purchase', purchaseUserMembership);

export default router;
