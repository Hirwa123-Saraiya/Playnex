/* ============================================================
   Booking rules — pure functions, no DB access
   ============================================================ */

export const SLOT_INTERVAL_MIN = 30;
export const STANDARD_DURATION_MIN = 60;
export const MAX_BOOKINGS_PER_DAY = 2;
export const CLUB_OPEN_HOUR = 6;
export const CLUB_CLOSE_HOUR = 22;

export const PRICING = {
  Gold:   { ratePerHour: 600, discountPercent: 50 },
  Silver: { ratePerHour: 600, discountPercent: 25 },
  Junior: { ratePerHour: 600, discountPercent: 60 },
  WalkIn: { ratePerHour: 600, discountPercent: 0  },
};

/* ---------- Time helpers ---------- */

export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function addMinutes(hhmm, minutes) {
  const total = toMinutes(hhmm) + minutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function generateStartTimes() {
  const times = [];
  for (let h = CLUB_OPEN_HOUR; h < CLUB_CLOSE_HOUR; h++) {
    times.push(`${String(h).padStart(2, '0')}:00`);
    times.push(`${String(h).padStart(2, '0')}:30`);
  }
  return times;
}

export function intervalsOverlap(aStart, aDur, bStart, bDur) {
  const aS = toMinutes(aStart);
  const aE = aS + aDur;
  const bS = toMinutes(bStart);
  const bE = bS + bDur;
  return aS < bE && bS < aE;
}

export function isLegalStartTime(hhmm) {
  return generateStartTimes().includes(hhmm);
}

export function isSocialPlaySlot(dateStr, startTime) {
  const d = new Date(dateStr + 'T00:00:00');
  const isFriday = d.getDay() === 5;
  const h = Number(startTime.split(':')[0]);
  return isFriday && h >= 18 && h < 22;
}

export function priceForBooking(tier, durationMinutes) {
  const rule = PRICING[tier] || PRICING.WalkIn;
  const gross = (rule.ratePerHour * durationMinutes) / 60;
  const net = gross * (1 - rule.discountPercent / 100);
  return Math.round(net);
}

export function refundFor(booking, now = new Date()) {
  if (booking.mode === 'SocialPlay') {
    return { refundPercent: 0, reason: 'Social play bookings are non-refundable.' };
  }
  const dateStr = booking.bookingDate || booking.date;
  const start = new Date(`${dateStr}T${booking.startTime}:00`);
  const hours = (start.getTime() - now.getTime()) / 3_600_000;
  if (hours > 24) return { refundPercent: 100, reason: 'Full refund (more than 24h notice).' };
  if (hours > 2)  return { refundPercent: 50,  reason: 'Partial refund (2–24h notice).' };
  return { refundPercent: 0, reason: 'No refund (less than 2h notice).' };
}

export function isValidTier(t) {
  return Object.keys(PRICING).includes(t);
}

export function validateBookingInput(input) {
  if (!input.courtId && !input.facilityId) return 'courtId is required';
  const date = input.date || input.bookingDate;
  if (!date) return 'date is required (YYYY-MM-DD)';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'date must be YYYY-MM-DD';
  if (!input.startTime || !/^\d{2}:\d{2}$/.test(input.startTime)) return 'startTime must be HH:mm';
  if (!isLegalStartTime(input.startTime)) return 'startTime is not on the 30-minute grid within club hours';
  if (input.mode && !['Standard', 'SocialPlay'].includes(input.mode)) return 'mode must be Standard or SocialPlay';
  return null;
}