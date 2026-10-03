import bcrypt from 'bcryptjs';
import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getStaff(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const staff = await dbService.getStaffByTenant(tenantId);
    return successResponse(res, staff, 'Staff list retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function getRoles(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const roles = await dbService.getRoles(tenantId);
    return successResponse(res, roles, 'Club roles retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createRole(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { name, description, targetModule, permissions, departmentId } = req.body;
    if (!name) return errorResponse(res, 'Role name is required', 400);

    const roleId = `role_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createRole({
      roleId,
      tenantId,
      departmentId,
      name: name.trim(),
      description: description ? description.trim() : '',
      targetModule: targetModule || 'Pro Shop & Inventory',
      permissions: Array.isArray(permissions) ? permissions : [],
    });

    return successResponse(res, created, 'Role created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deleteRole(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { id } = req.params;
    const deleted = await dbService.deleteRole(id, tenantId);
    if (!deleted) return errorResponse(res, 'Role not found or could not be deleted', 404);
    return successResponse(res, { id }, 'Role deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createStaff(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { name, email, phone, departmentId, roleId, roleName, targetModule, permissions, password } = req.body;
    if (!name || !email) return errorResponse(res, 'Name and email are required', 400);

    const existing = await dbService.findUserByEmail(email);
    if (existing) return errorResponse(res, 'An account with this email already exists', 409);

    let effectiveRoleId = roleId;
    if (!effectiveRoleId && roleName) {
      const existingRoles = await dbService.getRoles(tenantId);
      const match = existingRoles.find((r) => r.name.toLowerCase() === roleName.toLowerCase());
      if (match) {
        effectiveRoleId = match.id || match.roleId;
      } else {
        const newRole = await dbService.createRole({
          roleId: `role_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          tenantId,
          name: roleName,
          targetModule: targetModule || 'Pro Shop & Inventory',
          permissions: permissions || [],
        });
        if (newRole) effectiveRoleId = newRole.id || newRole.roleId;
      }
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const passwordHash = bcrypt.hashSync(password || 'password123', 10);

    const created = await dbService.createStaff({
      userId,
      tenantId,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      departmentId,
      roleId: effectiveRoleId,
      passwordHash,
    });
    return successResponse(res, created, 'Staff member onboarded successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function updateStaff(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const updated = await dbService.updateStaff(id, tenantId, req.body);
    if (!updated) return errorResponse(res, 'Staff member not found', 404);
    return successResponse(res, updated, 'Staff member updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deleteStaff(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const deleted = await dbService.deleteStaff(id, tenantId);
    if (!deleted) return errorResponse(res, 'Staff member not found', 404);
    return successResponse(res, { id }, 'Staff member deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
