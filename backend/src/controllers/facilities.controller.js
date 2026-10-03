import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getFacilities(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const facilities = await dbService.getFacilitiesByTenant(tenantId);
    return successResponse(res, facilities, 'Facilities retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createFacility(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { name, type, hourlyRate, surface, openTime, closeTime, departmentId } = req.body;
    if (!name || !type) return errorResponse(res, 'Facility name and sport type are required', 400);

    const facilityId = `fac_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createFacility({
      facilityId,
      tenantId,
      departmentId,
      name,
      type,
      hourlyRate: Number(hourlyRate) || 500,
      surface: surface || 'Synthetic',
      openTime: openTime || '06:00:00',
      closeTime: closeTime || '23:00:00',
    });
    return successResponse(res, created, 'Facility created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function updateFacility(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const updated = await dbService.updateFacility(id, tenantId, req.body);
    if (!updated) return errorResponse(res, 'Facility not found', 404);
    return successResponse(res, updated, 'Facility updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deleteFacility(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const deleted = await dbService.deleteFacility(id, tenantId);
    if (!deleted) return errorResponse(res, 'Facility not found', 404);
    return successResponse(res, { id }, 'Facility deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
