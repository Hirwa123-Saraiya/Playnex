import express from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public auth routes (Tokens set in cookies)
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected routes (Validated against accessToken cookie)
router.get('/me', authenticate, getMe);

export default router;
