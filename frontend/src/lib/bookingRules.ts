import type {
  Booking, Court, MemberTier, PricingRule, Slot,
} from "@/types/booking.types";

/* ============================================================
   Pricing
   ============================================================ */

export const PRICING: Record<MemberTier, PricingRule> = {
  Gold:    { tier: "Gold",    ratePerHour: 600, discountPercent: 50 }, // ₹300/hr
  Silver:  { tier: "Silver",  ratePerHour: 600, discountPercent: 25 }, // ₹450/hr
  Junior:  { tier: "Junior",  ratePerHour: 600, discountPercent: 60 }, // ₹240/hr
  WalkIn:  { tier: "WalkIn",  ratePerHour: 600, discountPercent: 0  }, // ₹600/hr
};

/** Amount in INR for a single standard 1-hour booking. */
export function priceForBooking(
  tier: MemberTier,
  durationMinutes: number
): number {
  const rule = PRICING[tier];
  const gross = (rule.ratePerHour * durationMinutes) / 60;
  const net = gross * (1 - rule.discountPercent / 100);
  return Math.round(net);
}

/** Whether this tier plays free (100% discount). */
export function isFreeForTier(tier: MemberTier): boolean {
  return PRICING[tier].discountPercent >= 100;
}

/* ============================================================
   Slot rules — "a new slot opens every 30 minutes"
   ============================================================ */

export const SLOT_INTERVAL_MIN = 30;
export const STANDARD_DURATION_MIN = 60;
export const MAX_BOOKINGS_PER_DAY_PER_MEMBER = 2;

/** Generate all 30-minute start times for a day (e.g. 06:00 → 22:00). */
export function generateStartTimes(
  openHour = 6,
  closeHour = 22
): string[] {
  const times: string[] = [];
  for (let h = openHour; h < closeHour; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    times.push(`${String(h).padStart(2, "0")}:30`);
  }
  return times;
}

/** Add minutes to an "HH:mm" string. */
export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/* ============================================================
   Conflict prevention
   ============================================================ */

/**
 * Two bookings conflict if they're on the same court & date
 * and their [start, end) intervals overlap.
 *
 * Standard: 60-minute booking.
 * Social play: same 60-minute window, but many players share one court.
 */
export function intervalsOverlap(
  aStart: string,
  aDuration: number,
  bStart: string,
  bDuration: number
): boolean {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const aS = toMin(aStart);
  const aE = aS + aDuration;
  const bS = toMin(bStart);
  const bE = bS + bDuration;
  return aS < bE && bS < aE;
}

/** Returns true if the slot cannot be booked because of a conflict. */
export function isSlotAvailable(
  slot: Slot,
  existingBookings: Booking[]
): boolean {
  if (slot.blocked) return false;
  if (slot.booked) return false;
  const start = slot.startTime;
  const dur = STANDARD_DURATION_MIN;
  return !existingBookings.some(
    (b) =>
      b.courtId === slot.courtId &&
      b.date === slot.date &&
      b.status === "Confirmed" &&
      intervalsOverlap(start, dur, b.startTime, b.durationMinutes)
  );
}

/* ============================================================
   Per-day limit — "at most twice a day"
   ============================================================ */

export function countUserBookingsOnDate(
  userId: string,
  date: string,
  bookings: Booking[]
): number {
  return bookings.filter(
    (b) =>
      b.userId === userId &&
      b.date === date &&
      b.status === "Confirmed"
  ).length;
}

export function canUserBookOnDate(
  userId: string,
  date: string,
  bookings: Booking[]
): { ok: boolean; reason?: string } {
  const count = countUserBookingsOnDate(userId, date, bookings);
  if (count >= MAX_BOOKINGS_PER_DAY_PER_MEMBER) {
    return {
      ok: false,
      reason: `You've reached the limit of ${MAX_BOOKINGS_PER_DAY_PER_MEMBER} bookings per day.`,
    };
  }
  return { ok: true };
}

/* ============================================================
   Social play — "Friday night many people share one court"
   ============================================================ */

/** Social play is only enabled Friday 18:00–22:00. */
export function isSocialPlaySlot(date: string, startTime: string): boolean {
  const d = new Date(date);
  const isFriday = d.getDay() === 5;
  const [h] = startTime.split(":").map(Number);
  return isFriday && h >= 18 && h < 22;
}

/* ============================================================
   Cancellation & refund
   ============================================================ */

export interface RefundPolicy {
  refundPercent: number;
  reason: string;
}

/**
 * Simple policy:
 *  - > 24 hours before start: 100% refund
 *  - 2–24 hours before: 50%
 *  - < 2 hours: no refund
 *  - Social play: no refund
 */
export function refundFor(
  booking: Booking,
  now: Date = new Date()
): RefundPolicy {
  if (booking.mode === "SocialPlay") {
    return { refundPercent: 0, reason: "Social play bookings are non-refundable." };
  }
  const start = new Date(`${booking.date}T${booking.startTime}:00`);
  const hours = (start.getTime() - now.getTime()) / 3_600_000;
  if (hours > 24) return { refundPercent: 100, reason: "Full refund (more than 24h notice)." };
  if (hours > 2)  return { refundPercent: 50,  reason: "Partial refund (2–24h notice)." };
  return { refundPercent: 0, reason: "No refund (less than 2h notice)." };
}

/** Amount refunded, based on the original charge. */
export function refundAmount(booking: Booking, now: Date = new Date()): number {
  const { refundPercent } = refundFor(booking, now);
  return Math.round((booking.amount * refundPercent) / 100);
}