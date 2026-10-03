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

export async function createStaff(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { name, email, phone, departmentId, roleId, password } = req.body;
    if (!name || !email) return errorResponse(res, 'Name and email are required', 400);

    const existing = await dbService.findUserByEmail(email);
    if (existing) return errorResponse(res, 'An account with this email already exists', 409);

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const passwordHash = bcrypt.hashSync(password || 'password123', 10);

    const created = await dbService.createStaff({
      userId,
      tenantId,
      name,
      email,
      phone,
      departmentId,
      roleId,
      passwordHash,
    });
    return successResponse(res, created, 'Staff member created successfully', 201);
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
