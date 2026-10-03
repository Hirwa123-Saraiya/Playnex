import bcrypt from 'bcryptjs';
import { dbService } from '../data/dbService.js';
import { db } from '../data/db.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * List System Permissions Catalog
 */
export async function getPermissions(req, res) {
  const permissions = await dbService.getPermissionsCatalog();
  return successResponse(res, permissions, 'Permissions catalog fetched');
}

/**
 * List Departments for the current tenant club
 */
export async function getDepartments(req, res) {
  const tenantId = req.user.tenantId;
  if (!tenantId) {
    return successResponse(res, [], 'No departments for platform-wide user');
  }
  const departments = await dbService.getDepartments(tenantId);
  return successResponse(res, departments, 'Departments fetched');
}

/**
 * Create a new Department (Club Owner)
 */
export async function createDepartment(req, res) {
  const { name, description } = req.body;
  const tenantId = req.user.tenantId;

  if (!tenantId) {
    return errorResponse(res, 'Only club owners can create departments for a club', 403);
  }
  if (!name) {
    return errorResponse(res, 'Department name is required', 400);
  }

  const departmentId = `dept_${Date.now()}`;
  const newDept = await dbService.createDepartment({
    departmentId,
    tenantId,
    name,
    description: description || '',
  });

  return successResponse(res, newDept, 'Department created successfully', 201);
}

/**
 * List Dynamic Roles for the current tenant club
 */
export async function getRoles(req, res) {
  const tenantId = req.user.tenantId;
  if (!tenantId) {
    return successResponse(res, [], 'No roles for platform-wide user');
  }
  const roles = await dbService.getRoles(tenantId);
  return successResponse(res, roles, 'Club roles fetched');
}

/**
 * Create a Dynamic Role with Permissions (Club Owner)
 */
export async function createRole(req, res) {
  const { name, description, departmentId, permissions } = req.body;
  const tenantId = req.user.tenantId;

  if (!tenantId) {
    return errorResponse(res, 'Only club owners can create roles for a club', 403);
  }
  if (!name) {
    return errorResponse(res, 'Role name is required', 400);
  }

  const roleId = `role_${Date.now()}`;
  const newRole = await dbService.createRole({
    roleId,
    tenantId,
    departmentId,
    name,
    description,
    permissions: Array.isArray(permissions) ? permissions : [],
  });

  return successResponse(res, newRole, 'Role created successfully', 201);
}

/**
 * List Staff Members in the club
 */
export async function getStaff(req, res) {
  const tenantId = req.user.tenantId;
  const staff = db.users
    .filter((u) => u.tenant_id === tenantId && u.system_role === 'STAFF')
    .map((u) => {
      const role = db.roles.find((r) => r.role_id === u.role_id);
      return {
        userId: u.user_id,
        name: u.name,
        email: u.email,
        roleId: u.role_id,
        roleName: role ? role.name : 'Unassigned',
        permissions: role ? role.permissions : [],
        isActive: u.is_active,
        createdAt: u.created_at,
      };
    });

  return successResponse(res, staff, 'Club staff list fetched');
}

/**
 * Create / Onboard Staff member with Dynamic Role (Club Owner)
 */
export async function createStaff(req, res) {
  const { name, email, password, roleId } = req.body;
  const tenantId = req.user.tenantId;

  if (!tenantId) {
    return errorResponse(res, 'Only club owners can add staff members', 403);
  }
  if (!name || !email || !password || !roleId) {
    return errorResponse(res, 'Name, email, password, and roleId are required', 400);
  }

  const existing = await dbService.findUserByEmail(email);
  if (existing) {
    return errorResponse(res, 'User with this email already exists', 409);
  }

  const userId = `user_staff_${Date.now()}`;
  const passwordHash = bcrypt.hashSync(password, 10);

  await dbService.createUser({
    userId,
    tenantId,
    name,
    email,
    passwordHash,
    systemRole: 'STAFF',
    tier: null,
  });

  return successResponse(
    res,
    {
      userId,
      name,
      email,
      roleId,
    },
    'Staff member created and assigned role successfully',
    201
  );
}

/**
 * List Clubs / Tenants (Super Admin)
 */
export async function getTenants(req, res) {
  return successResponse(res, db.tenants, 'Clubs list fetched');
}
