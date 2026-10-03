import express from 'express';
import {
  getPermissions,
  getDepartments,
  createDepartment,
  getRoles,
  createRole,
  getStaff,
  createStaff,
  getTenants,
} from '../controllers/roles.controller.js';
import { authenticate, requireSystemRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Permissions Catalog
router.get('/permissions', getPermissions);

// Departments Management
router.get('/departments', getDepartments);
router.post('/departments', requireSystemRole('CLUB_OWNER', 'SUPER_ADMIN'), createDepartment);

// Dynamic Roles Management
router.get('/roles', getRoles);
router.post('/roles', requireSystemRole('CLUB_OWNER', 'SUPER_ADMIN'), createRole);

// Staff Management
router.get('/staff', requireSystemRole('CLUB_OWNER', 'SUPER_ADMIN'), getStaff);
router.post('/staff', requireSystemRole('CLUB_OWNER', 'SUPER_ADMIN'), createStaff);

// Super Admin Tenants
router.get('/tenants', requireSystemRole('SUPER_ADMIN'), getTenants);

export default router;
