import express from 'express';
import {
  listCourts,
  listSlots,
  listMyBookings,
  createUserBooking,
  cancelUserBooking,
} from '../controllers/userBookings.controller.js';
import {
  validateCreateBooking,
  validateIdParam,
} from '../validators/bookingValidator.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireActiveMembership } from '../middlewares/requireActiveMembership.js';

const router = express.Router();

router.get('/courts', authenticate, listCourts);
router.get('/courts/:id/slots', authenticate, validateIdParam, listSlots);

router.get('/bookings', authenticate, listMyBookings);
router.post('/bookings', authenticate, validateCreateBooking, requireActiveMembership, createUserBooking);
router.patch('/bookings/:id/cancel', authenticate, validateIdParam, cancelUserBooking);

export default router;

// import express from 'express';
// import {
//   getUserBookings,
//   createUserBooking,
//   cancelUserBooking,
// } from '../controllers/userBookings.controller.js';
// import { optionalAuthenticate } from '../middlewares/auth.middleware.js';

// const router = express.Router();

// router.use(optionalAuthenticate);
// router.get('/', getUserBookings);
// router.post('/', createUserBooking);
// router.patch('/:id/cancel', cancelUserBooking);

// export default router;
