import bcrypt from 'bcryptjs';
import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getMembers(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const members = await dbService.getMembersByTenant(tenantId);
    return successResponse(res, members, 'Members retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createMember(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { name, email, phone, tier, password } = req.body;
    if (!name || !email) return errorResponse(res, 'Name and email are required', 400);

    const existing = await dbService.findUserByEmail(email);
    if (existing) return errorResponse(res, 'An account with this email already exists', 409);

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const passwordHash = bcrypt.hashSync(password || 'password123', 10);

    const created = await dbService.createMember({
      userId,
      tenantId,
      name,
      email,
      phone,
      tier: tier || 'Standard',
      passwordHash,
    });
    return successResponse(res, created, 'Member created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function updateMember(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const updated = await dbService.updateMember(id, tenantId, req.body);
    if (!updated) return errorResponse(res, 'Member not found', 404);
    return successResponse(res, updated, 'Member updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deleteMember(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const deleted = await dbService.deleteMember(id, tenantId);
    if (!deleted) return errorResponse(res, 'Member not found', 404);
    return successResponse(res, { id }, 'Member deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
