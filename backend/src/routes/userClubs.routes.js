import express from 'express';
import { getUserClubs, getUserClubDetails } from '../controllers/userClubs.controller.js';

const router = express.Router();

router.get('/', getUserClubs);
router.get('/:id', getUserClubDetails);

export default router;
