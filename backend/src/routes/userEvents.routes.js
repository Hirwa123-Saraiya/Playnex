import express from 'express';
import { getUserEvents, registerForEvent } from '../controllers/userEvents.controller.js';

const router = express.Router();

router.get('/', getUserEvents);
router.post('/:id/register', registerForEvent);

export default router;
