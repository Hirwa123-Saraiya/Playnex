import { bookingService } from '../services/bookingService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function listCourts(req, res) {
  try {
    const tenantId = getTenantId(req) || req.query.tenantId;
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const courts = await bookingService.getCourts({ tenantId });
    return successResponse(res, courts, 'Courts retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function listSlots(req, res) {
  try {
    const tenantId = getTenantId(req) || req.query.tenantId;
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { id } = req.params;
    const { date } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return errorResponse(res, 'date query param required (YYYY-MM-DD)', 400);
    }
    const slots = await bookingService.getSlots(id, date, { tenantId });
    return successResponse(res, slots, 'Slots retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function listMyBookings(req, res) {
  try {
    const tenantId = getTenantId(req);
    const userId = req.user?.userId || req.query.userId;
    if (!userId) return errorResponse(res, 'User context missing', 400);
    const bookings = await bookingService.getMyBookings(userId, { tenantId });
    return successResponse(res, bookings, 'Bookings retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createUserBooking(req, res) {
  try {
    const tenantId = getTenantId(req) || req.body.tenantId;
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const user = req.user
      ? { id: req.user.userId, tier: req.user.tier, name: req.user.name, tenantId }
      : null;

    const booking = await bookingService.createBooking(
      { ...req.body, tenantId },
      user
    );
    return successResponse(res, booking, 'Booking created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, err.status || 500);
  }
}

export async function cancelUserBooking(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const userId = req.user?.userId || req.body.userId || null;
    const result = await bookingService.cancelBooking(id, userId, { tenantId });
    return successResponse(res, result, 'Booking cancelled successfully');
  } catch (err) {
    return errorResponse(res, err.message, err.status || 500);
  }
}
