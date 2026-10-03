import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/bookings.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getBookings);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
