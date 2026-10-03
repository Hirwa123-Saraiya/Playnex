import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from '../controllers/staff.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getStaff);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
