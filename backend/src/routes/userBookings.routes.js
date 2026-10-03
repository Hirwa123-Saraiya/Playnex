import express from 'express';
import {
  getUserBookings,
  createUserBooking,
  cancelUserBooking,
} from '../controllers/userBookings.controller.js';

const router = express.Router();

router.get('/', getUserBookings);
router.post('/', createUserBooking);
router.patch('/:id/cancel', cancelUserBooking);

export default router;
