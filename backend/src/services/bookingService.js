import { dbService } from '../data/dbService.js';
import {
  STANDARD_DURATION_MIN,
  MAX_BOOKINGS_PER_DAY,
  addMinutes,
  intervalsOverlap,
  priceForBooking,
  refundFor,
  isLegalStartTime,
  isSocialPlaySlot,
  generateStartTimes,
} from '../utils/bookingRules.js';

/* ============================================================
   Booking service — uses existing dbService methods only
   ============================================================ */

/** Try all known dbService method names for "get bookings by tenant". */
async function fetchTenantBookings(tenantId) {
  if (typeof dbService.getBookingsByTenant === 'function') {
    return dbService.getBookingsByTenant(tenantId);
  }
  if (typeof dbService.getAllBookings === 'function') {
    return dbService.getAllBookings(tenantId);
  }
  return [];
}

/** Try all known dbService method names for "get courts/facilities". */
async function fetchTenantCourts(tenantId) {
  if (typeof dbService.getCourtsByTenant === 'function') {
    return dbService.getCourtsByTenant(tenantId);
  }
  if (typeof dbService.getFacilitiesByTenant === 'function') {
    return dbService.getFacilitiesByTenant(tenantId);
  }
  return [];
}

/** Normalize a booking row regardless of whether dbService returns
 *  `facilityId` or `courtId`, `bookingDate` or `date`, etc. */
function normalizeBooking(b) {
  return {
    ...b,
    courtId: b.courtId || b.facilityId,
    facilityId: b.facilityId || b.courtId,
    date: b.date || b.bookingDate,
    bookingDate: b.bookingDate || b.date,
    startTime: (b.startTime || '').slice(0, 5),
    durationMinutes: b.durationMinutes || STANDARD_DURATION_MIN,
  };
}

export const bookingService = {
  /* ---------- Reads ---------- */

  async getCourts({ tenantId }) {
    return fetchTenantCourts(tenantId);
  },

  async getSlots(courtId, date, { tenantId }) {
    const all = await fetchTenantBookings(tenantId);
    const todays = (all || [])
      .map(normalizeBooking)
      .filter(
        (b) =>
          b.courtId === courtId &&
          b.date === date &&
          b.status === 'confirmed'
      );

    const now = new Date();

    return generateStartTimes().map((start) => {
      const end = addMinutes(start, STANDARD_DURATION_MIN);
      const taken = todays.some((b) =>
        intervalsOverlap(start, STANDARD_DURATION_MIN, b.startTime, b.durationMinutes)
      );
      const slotStart = new Date(`${date}T${start}:00`);
      const past = slotStart.getTime() < now.getTime();
      return {
        id: `${courtId}-${date}-${start}`,
        courtId,
        date,
        startTime: start,
        endTime: end,
        booked: taken,
        blocked: past,
        socialPlay: isSocialPlaySlot(date, start),
      };
    });
  },

  async getMyBookings(userId, { tenantId }) {
    const all = await fetchTenantBookings(tenantId);
    return (all || [])
      .map(normalizeBooking)
      .filter((b) => b.userId === userId);
  },

  /* ---------- Writes ---------- */

  async createBooking(input, user) {
    const {
      courtId,
      facilityId,
      date,
      bookingDate,
      startTime,
      endTime,
      mode = 'Standard',
      participants = [],
      walkInName,
      walkInPhone,
      paymentStatus,
    } = input;

    const resolvedCourtId = courtId || facilityId;
    const resolvedDate    = date || bookingDate;
    const resolvedEnd     = endTime || addMinutes(startTime, STANDARD_DURATION_MIN);
    const durationMinutes = STANDARD_DURATION_MIN;

    if (!isLegalStartTime(startTime)) {
      throw Object.assign(new Error('Invalid slot time'), { status: 400 });
    }

    const tenantId = user?.tenantId || input.tenantId;

    /* 1. Overlap check (server-side) */
    const all = await fetchTenantBookings(tenantId);
    const sameDay = (all || [])
      .map(normalizeBooking)
      .filter(
        (b) =>
          b.courtId === resolvedCourtId &&
          b.date === resolvedDate &&
          b.status === 'confirmed'
      );

    const collision = sameDay.find((b) =>
      intervalsOverlap(startTime, durationMinutes, b.startTime, b.durationMinutes)
    );
    if (collision) {
      throw Object.assign(new Error('This slot is already booked'), { status: 409 });
    }

    /* 2. Daily cap for logged-in members */
    let bookingUserId = null;
    let tier = 'WalkIn';

    if (user?.id) {
      bookingUserId = user.id;
      tier = user.tier || 'WalkIn';

      const userToday = sameDay.filter((b) => b.userId === user.id);
      if (userToday.length >= MAX_BOOKINGS_PER_DAY) {
        throw Object.assign(
          new Error(`You can book at most ${MAX_BOOKINGS_PER_DAY} slots per day.`),
          { status: 400 }
        );
      }
    }

    /* 3. Server-side price */
    const amount = priceForBooking(tier, durationMinutes);

    /* 4. Insert via existing dbService.createBooking */
    const bookingId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const created = await dbService.createBooking({
      bookingId,
      tenantId,
      facilityId: resolvedCourtId,
      userId: bookingUserId,
      memberName: walkInName || user?.name || 'Walk-in Guest',
      bookingDate: resolvedDate,
      startTime,
      endTime: resolvedEnd,
      totalAmount: amount,
      status: 'confirmed',
      paymentStatus: paymentStatus || 'paid',
    });

    return {
      ...created,
      mode,
      participants,
      walkInPhone: walkInPhone || null,
      amount,
    };
  },

  async cancelBooking(bookingId, userId, { tenantId }) {
    const all = await fetchTenantBookings(tenantId);
    const booking = (all || [])
      .map(normalizeBooking)
      .find((b) => b.id === bookingId);

    if (!booking) {
      throw Object.assign(new Error('Booking not found'), { status: 404 });
    }
    if (userId && booking.userId && booking.userId !== userId) {
      throw Object.assign(new Error('Not allowed'), { status: 403 });
    }
    if (booking.status !== 'confirmed') {
      throw Object.assign(
        new Error('Only confirmed bookings can be cancelled'),
        { status: 409 }
      );
    }

    const { refundPercent, reason } = refundFor(booking);
    const refundAmount = Math.round(
      ((booking.totalAmount || booking.amount || 0) * refundPercent) / 100
    );

    await dbService.deleteBooking(bookingId, tenantId);

    return { id: bookingId, refundAmount, refundPercent, reason };
  },
};