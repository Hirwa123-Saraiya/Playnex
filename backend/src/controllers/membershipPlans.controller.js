import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getPlans(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const plans = await dbService.getPlansByTenant(tenantId);
    return successResponse(res, plans, 'Membership plans retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createPlan(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { name, price, billingCycle, tier, features } = req.body;
    if (!name || price === undefined) return errorResponse(res, 'Plan name and price are required', 400);

    const planId = `pln_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createPlan({
      planId,
      tenantId,
      name,
      price: Number(price) || 0,
      billingCycle: billingCycle || 'monthly',
      tier: tier || 'Standard',
      features: features || [],
    });
    return successResponse(res, created, 'Membership plan created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function updatePlan(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const updated = await dbService.updatePlan(id, tenantId, req.body);
    if (!updated) return errorResponse(res, 'Membership plan not found', 404);
    return successResponse(res, updated, 'Membership plan updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deletePlan(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const deleted = await dbService.deletePlan(id, tenantId);
    if (!deleted) return errorResponse(res, 'Membership plan not found', 404);
    return successResponse(res, { id }, 'Membership plan deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
