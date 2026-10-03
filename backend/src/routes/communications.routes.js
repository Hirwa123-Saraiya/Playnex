import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from '../controllers/communications.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAnnouncements);
router.post('/', createAnnouncement);
router.delete('/:id', deleteAnnouncement);

export default router;
