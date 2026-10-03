import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getRoles,
  createRole,
  deleteRole,
} from '../controllers/staff.controller.js';

const router = express.Router();

router.use(authenticate);

// Staff management
router.get('/', getStaff);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

// Role management
router.get('/roles', getRoles);
router.post('/roles', createRole);
router.delete('/roles/:id', deleteRole);

export default router;
