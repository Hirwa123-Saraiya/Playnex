import express from 'express';
import {
  getUserBookings,
  createUserBooking,
  cancelUserBooking,
} from '../controllers/userBookings.controller.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(optionalAuthenticate);
router.get('/', getUserBookings);
router.post('/', createUserBooking);
router.patch('/:id/cancel', cancelUserBooking);

export default router;
