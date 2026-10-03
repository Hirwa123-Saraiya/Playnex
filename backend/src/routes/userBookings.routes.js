import express from 'express';
import {
  getUserBookings,
  createUserBooking,
  cancelUserBooking,
} from '../controllers/userBookings.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User bookings require authentication
router.use(authenticate);

router.get('/', getUserBookings);
router.post('/', createUserBooking);
router.patch('/:id/cancel', cancelUserBooking);

export default router;
