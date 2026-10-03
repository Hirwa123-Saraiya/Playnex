import express from 'express';
import {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  getPlatformStats,
  getClubAdmins,
  getClubUsers,
  getRevenue,
  getClubById,
} from '../controllers/clubs.controller.js';

const router = express.Router();

// GET /api/v1/clubs - List all clubs/tenants directly from database
router.get('/', getClubs);

// GET /api/v1/clubs/stats - Platform stats for Super Admin directly from database
router.get('/stats', getPlatformStats);

// GET /api/v1/clubs/admins - List all club admins
router.get('/admins', getClubAdmins);

// GET /api/v1/clubs/users - List all club members/users
router.get('/users', getClubUsers);

// GET /api/v1/clubs/revenue - Platform revenue by club
router.get('/revenue', getRevenue);

// GET /api/v1/clubs/:id - Single club details
router.get('/:id', getClubById);

// PUT /api/v1/clubs/:id - Update club details
router.put('/:id', updateClub);

// DELETE /api/v1/clubs/:id - Delete club
router.delete('/:id', deleteClub);

// POST /api/v1/clubs - Super Admin adds new club and creates its main admin account
router.post('/', createClub);

export default router;
