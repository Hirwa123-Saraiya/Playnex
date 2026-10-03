import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getFinanceData(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const data = await dbService.getFinanceData(tenantId);
    return successResponse(res, data, 'Finance data retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
