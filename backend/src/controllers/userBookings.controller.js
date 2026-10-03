import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function getUserBookings(req, res) {
  try {
    const userId = req.user?.userId || req.query.userId || 'usr_demo_customer';
    const bookings = await dbService.getUserBookings(userId);
    return successResponse(res, bookings, 'User bookings retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createUserBooking(req, res) {
  try {
    const userId = req.user?.userId || req.body.userId || 'usr_demo_customer';
    const { clubId, facilityId, memberName, bookingDate, startTime, endTime, totalPrice, paymentStatus, courtName } = req.body;

    if (!clubId || !facilityId || !bookingDate || !startTime || !endTime) {
      return errorResponse(res, 'Club, facility, date, and times are required', 400);
    }

    const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createUserBooking({
      bookingId,
      tenantId: clubId,
      facilityId,
      userId,
      memberName: memberName || req.user?.name || 'Customer',
      bookingDate,
      startTime,
      endTime,
      totalPrice: Number(totalPrice) || 500,
      paymentStatus: paymentStatus || 'paid',
      courtName: courtName || 'Court 1',
    });

    return successResponse(res, created, 'Booking confirmed successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function cancelUserBooking(req, res) {
  try {
    const userId = req.user?.userId || req.query.userId || 'usr_demo_customer';
    const { id } = req.params;
    const cancelled = await dbService.cancelUserBooking(id, userId);
    if (!cancelled) return errorResponse(res, 'Booking not found or already cancelled', 404);
    return successResponse(res, cancelled, 'Booking cancelled successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
