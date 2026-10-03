import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getApprovals(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const approvals = await dbService.getApprovalsByTenant(tenantId);
    return successResponse(res, approvals, 'Approvals retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createApproval(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { type, title, requester, details, amount } = req.body;
    if (!title || !requester) return errorResponse(res, 'Title and requester are required', 400);

    const approvalId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createApproval({
      approvalId,
      tenantId,
      type: type || 'General Request',
      title,
      requester,
      details,
      amount: Number(amount) || 0,
    });
    return successResponse(res, created, 'Approval request submitted successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function updateApproval(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return errorResponse(res, 'Status is required', 400);

    const updated = await dbService.updateApprovalStatus(id, tenantId, status);
    if (!updated) return errorResponse(res, 'Approval not found', 404);
    return successResponse(res, updated, `Approval ${status} successfully`);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
