  import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getAllEvents,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/events.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/all', getAllEvents);
router.get('/', getEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
