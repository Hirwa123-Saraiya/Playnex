import express from 'express';
import { authenticate, requireSystemRole } from '../middlewares/auth.middleware.js';
import {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  getPlatformStats,
  getClubAdmins,
  updateClubAdmin,
  resetAdminPassword,
  getClubUsers,
  getRevenue,
  getClubById,
} from '../controllers/clubs.controller.js';

const router = express.Router();

// Require authentication for all club management routes
router.use(authenticate);

// GET /api/v1/clubs - List all clubs/tenants
router.get('/', getClubs);

// Super Admin platform statistics & global revenue
router.get('/stats', requireSystemRole('SUPER_ADMIN'), getPlatformStats);
router.get('/revenue', requireSystemRole('SUPER_ADMIN'), getRevenue);

// Super Admin Club Admins management
router.get('/admins', requireSystemRole('SUPER_ADMIN'), getClubAdmins);
router.put('/admins/:id', requireSystemRole('SUPER_ADMIN'), updateClubAdmin);
router.post('/admins/:id/reset-password', requireSystemRole('SUPER_ADMIN'), resetAdminPassword);

// Club users list (Super Admin or Club Owner)
router.get('/users', requireSystemRole('SUPER_ADMIN', 'CLUB_OWNER'), getClubUsers);

// Single club details & CRUD
router.get('/:id', getClubById);
router.put('/:id', requireSystemRole('SUPER_ADMIN', 'CLUB_OWNER'), updateClub);
router.delete('/:id', requireSystemRole('SUPER_ADMIN'), deleteClub);
router.post('/', requireSystemRole('SUPER_ADMIN'), createClub);

export default router;
