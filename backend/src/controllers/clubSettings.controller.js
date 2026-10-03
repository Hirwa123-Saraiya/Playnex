import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getClubSettings(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const club = await dbService.getClubDetails(tenantId);
    if (!club) return errorResponse(res, 'Club not found', 404);
    return successResponse(res, club, 'Club settings retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function updateClubSettings(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const updated = await dbService.updateClubSettings(tenantId, req.body);
    if (!updated) return errorResponse(res, 'Club not found', 404);
    return successResponse(res, updated, 'Club settings updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
