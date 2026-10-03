import express from 'express';
import {
  getFamilyMembers,
  addFamilyMember,
  deleteFamilyMember,
  addClubReview,
} from '../controllers/userProfile.controller.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(optionalAuthenticate);
router.get('/family', getFamilyMembers);
router.post('/family', addFamilyMember);
router.delete('/family/:id', deleteFamilyMember);
router.post('/reviews', addClubReview);

export default router;
