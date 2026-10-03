import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getBookings(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const bookings = await dbService.getBookingsByTenant(tenantId);
    return successResponse(res, bookings, 'Bookings retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createBooking(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { facilityId, userId, memberName, bookingDate, startTime, endTime, totalAmount, status, paymentStatus } = req.body;
    if (!facilityId || !bookingDate || !startTime || !endTime) {
      return errorResponse(res, 'Facility, booking date, start time, and end time are required', 400);
    }

    const bookingId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createBooking({
      bookingId,
      tenantId,
      facilityId,
      userId,
      memberName,
      bookingDate,
      startTime,
      endTime,
      totalAmount: Number(totalAmount) || 0,
      status: status || 'confirmed',
      paymentStatus: paymentStatus || 'paid',
    });
    return successResponse(res, created, 'Booking created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function updateBooking(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const updated = await dbService.updateBooking(id, tenantId, req.body);
    if (!updated) return errorResponse(res, 'Booking not found', 404);
    return successResponse(res, updated, 'Booking updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deleteBooking(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const deleted = await dbService.deleteBooking(id, tenantId);
    if (!deleted) return errorResponse(res, 'Booking not found', 404);
    return successResponse(res, { id }, 'Booking cancelled successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
