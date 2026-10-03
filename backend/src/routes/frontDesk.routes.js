import express from 'express';
import {
  searchMembers,
  getTimeline,
  checkInBooking,
  createWalkInBooking,
  getStaffRoster,
} from '../controllers/frontDesk.controller.js';
import { validateIdParam } from '../validators/bookingValidator.js';

const router = express.Router();

/* Front-desk-only endpoints — should be protected by auth + role middleware
   in your existing setup. If you have `requireRole('FRONT_DESK')` or similar,
   add it after the path. */
router.get('/front-desk/members',       searchMembers);
router.get('/front-desk/bookings',      getTimeline);
router.get('/front-desk/staff',         getStaffRoster);
router.post('/front-desk/walk-in',      createWalkInBooking);
router.patch('/front-desk/bookings/:id/checkin', validateIdParam, checkInBooking);

export default router;