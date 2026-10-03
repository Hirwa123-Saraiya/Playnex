import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getClubSettings,
  updateClubSettings,
} from '../controllers/clubSettings.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getClubSettings);
router.put('/', updateClubSettings);

export default router;
