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

//trail
import { requireActiveMembership } from '../middlewares/requireActiveMembership.js';

const router = express.Router();

router.get('/user/courts', listCourts);
router.get('/user/courts/:id/slots', validateIdParam, listSlots);

router.get('/user/bookings', listMyBookings);
router.post('/user/bookings', validateCreateBooking, createUserBooking);
router.patch('/user/bookings/:id/cancel', validateIdParam, cancelUserBooking);

//trail
router.post('/user/bookings', validateCreateBooking, requireActiveMembership, createUserBooking);

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
