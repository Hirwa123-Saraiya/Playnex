import { dbService } from '../data/dbService.js';
import {
  STANDARD_DURATION_MIN,
  addMinutes,
  intervalsOverlap,
  priceForBooking,
  isLegalStartTime,
} from '../utils/bookingRules.js';

/* ============================================================
   Front-desk service — walk-ins, member lookup, timeline, check-in
   ============================================================ */

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

async function fetchTenantBookings(tenantId) {
  if (typeof dbService.getBookingsByTenant === 'function') {
    return dbService.getBookingsByTenant(tenantId);
  }
  return [];
}

export const frontDeskService = {
  /* ---------- Member lookup ---------- */

  /**
   * Search members in the tenant by name / email / phone / memberId.
   * Uses existing dbService.getMembersByTenant if available,
   * else falls back to a generic users query.
   */
  async searchMembers(tenantId, query) {
    let all = [];

    if (typeof dbService.getMembersByTenant === 'function') {
      all = await dbService.getMembersByTenant(tenantId);
    } else if (typeof dbService.getUsersByTenant === 'function') {
      all = await dbService.getUsersByTenant(tenantId);
    } else {
      all = [];
    }

    const q = (query || '').trim().toLowerCase();
    if (!q) return (all || []).slice(0, 20);

    return (all || [])
      .filter((m) => {
        const name  = (m.name  || '').toLowerCase();
        const email = (m.email || '').toLowerCase();
        const phone = (m.phone || '').toLowerCase();
        const id    = (m.id    || '').toLowerCase();
        return (
          name.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          id.includes(q)
        );
      })
      .slice(0, 20);
  },

  /* ---------- Today's bookings (timeline) ---------- */

  async getTodayBookings(tenantId, date) {
    const all = await fetchTenantBookings(tenantId);
    const target = date || new Date().toISOString().slice(0, 10);

    return (all || [])
      .map(normalizeBooking)
      .filter((b) => b.date === target)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  /* ---------- Check-in ---------- */

  async checkIn(bookingId, staffUserId, { tenantId }) {
    const all = await fetchTenantBookings(tenantId);
    const booking = (all || [])
      .map(normalizeBooking)
      .find((b) => b.id === bookingId);

    if (!booking) {
      throw Object.assign(new Error('Booking not found'), { status: 404 });
    }
    if (booking.status === 'cancelled') {
      throw Object.assign(
        new Error('Cancelled bookings cannot be checked in'),
        { status: 409 }
      );
    }
    if (booking.status === 'completed') {
      throw Object.assign(new Error('Already checked in'), { status: 409 });
    }

    // ⚠️ Your teammate may need to extend dbService to persist check-in.
    if (typeof dbService.markBookingCheckedIn === 'function') {
      await dbService.markBookingCheckedIn(bookingId, staffUserId);
    } else if (typeof dbService.updateBooking === 'function') {
      await dbService.updateBooking(bookingId, tenantId, {
        status: 'checked_in',
        checkedInAt: new Date().toISOString(),
        checkedInBy: staffUserId || null,
      });
    }

    return {
      id: bookingId,
      status: 'checked_in',
      checkedInAt: new Date().toISOString(),
      checkedInBy: staffUserId || null,
    };
  },

  /* ---------- Walk-in booking (front-desk entry point) ---------- */

  /**
   * Front-desk staff books a slot for a walk-in guest or on behalf of a member.
   * - Guest: no account, pays walk-in rate (1.5× member rate).
   * - Member: tier discount applies; 2/day limit still enforced.
   */
  async createWalkIn(input, staffUser) {
    const {
      courtId,
      facilityId,
      date,
      bookingDate,
      startTime,
      endTime,
      guestName,
      guestPhone,
      guestEmail,
      memberId,
      paymentMethod = 'cash',
    } = input;

    const resolvedCourtId = courtId || facilityId;
    const resolvedDate    = date || bookingDate;
    const resolvedEnd     = endTime || addMinutes(startTime, STANDARD_DURATION_MIN);
    const durationMinutes = STANDARD_DURATION_MIN;

    if (!isLegalStartTime(startTime)) {
      throw Object.assign(new Error('Invalid slot time'), { status: 400 });
    }

    const tenantId = staffUser?.tenantId || input.tenantId;

    /* Overlap check */
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

    /* Pricing */
    let tier = 'WalkIn';
    let bookingUserId = null;
    let memberName = guestName;

    if (memberId) {
      // Booking on behalf of a member — fetch their tier
      const members = await this.searchMembers(tenantId, memberId);
      const member = members.find((m) => m.id === memberId);
      if (member) {
        tier = member.tier || 'Silver';
        bookingUserId = member.id;
        memberName = member.name;
      }
    } else if (!guestName || !guestPhone) {
      throw Object.assign(
        new Error('Guest name and phone are required for walk-in bookings'),
        { status: 400 }
      );
    }

    const amount = priceForBooking(tier, durationMinutes);

    /* Insert */
    const bookingId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createBooking({
      bookingId,
      tenantId,
      facilityId: resolvedCourtId,
      userId: bookingUserId,
      memberName,
      bookingDate: resolvedDate,
      startTime,
      endTime: resolvedEnd,
      totalAmount: amount,
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    return {
      ...created,
      source: memberId ? 'PHONE' : 'WALK_IN',
      paymentMethod,
      guestPhone: guestPhone || null,
      guestEmail: guestEmail || null,
    };
  },

  /* ---------- Staff roster ---------- */

  async getStaffRoster(tenantId, date) {
    if (typeof dbService.getStaffByTenant === 'function') {
      const staff = await dbService.getStaffByTenant(tenantId);
      const target = date || new Date().toISOString().slice(0, 10);
      return (staff || []).filter((s) => !s.date || s.date === target);
    }
    return [];
  },
};