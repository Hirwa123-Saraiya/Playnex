import { frontDeskService } from '../services/frontDeskService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function searchMembers(req, res) {
  try {
    const tenantId = getTenantId(req) || req.query.tenantId;
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { q } = req.query;
    const members = await frontDeskService.searchMembers(tenantId, q || '');
    return successResponse(res, members, 'Members retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function getTimeline(req, res) {
  try {
    const tenantId = getTenantId(req) || req.query.tenantId;
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { date } = req.query;
    const bookings = await frontDeskService.getTodayBookings(tenantId, date);
    return successResponse(res, bookings, 'Timeline retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function checkInBooking(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { id } = req.params;
    const staffUserId = req.user?.userId || null;
    const result = await frontDeskService.checkIn(id, staffUserId, { tenantId });
    return successResponse(res, result, 'Checked in successfully');
  } catch (err) {
    return errorResponse(res, err.message, err.status || 500);
  }
}

export async function createWalkInBooking(req, res) {
  try {
    const tenantId = getTenantId(req) || req.body.tenantId;
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const staffUser = req.user
      ? { id: req.user.userId, name: req.user.name, tenantId }
      : null;

    const booking = await frontDeskService.createWalkIn(
      { ...req.body, tenantId },
      staffUser
    );
    return successResponse(res, booking, 'Walk-in booking created', 201);
  } catch (err) {
    return errorResponse(res, err.message, err.status || 500);
  }
}

export async function getStaffRoster(req, res) {
  try {
    const tenantId = getTenantId(req) || req.query.tenantId;
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { date } = req.query;
    const staff = await frontDeskService.getStaffRoster(tenantId, date);
    return successResponse(res, staff, 'Staff roster retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
