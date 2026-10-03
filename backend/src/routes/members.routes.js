import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from '../controllers/members.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getMembers);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
