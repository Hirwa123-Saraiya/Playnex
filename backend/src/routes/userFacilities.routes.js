import express from 'express';
import { getUserFacilities } from '../controllers/userFacilities.controller.js';

const router = express.Router();

router.get('/', getUserFacilities);

export default router;
