import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
} from '../controllers/facilities.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getFacilities);
router.post('/', createFacility);
router.put('/:id', updateFacility);
router.delete('/:id', deleteFacility);

export default router;
