/* ============================================================
   Booking domain types — matches the PDF rules
   ============================================================ */

export type MemberTier = "Gold" | "Silver" | "Junior" | "WalkIn";

export type CourtSport = "Tennis" | "Cricket" | "Padel" | "Badminton";

export type BookingStatus =
  | "Confirmed"
  | "Cancelled"
  | "Completed"
  | "NoShow";

export type BookingMode = "Standard" | "SocialPlay";

export type PaymentMethod = "Cash" | "Card" | "UPI" | "Plan";

export interface Court {
  id: string;
  name: string;
  sport: CourtSport;
  surface?: string;
  indoor?: boolean;
  active: boolean;
}

/** A 30-min slot on a specific date for a specific court. */
export interface Slot {
  id: string;
  courtId: string;
  /** ISO date "2026-10-15" */
  date: string;
  /** "HH:mm" 24h, e.g. "18:00" */
  startTime: string;
  /** "HH:mm" — always start + 1 hour for a standard booking */
  endTime: string;
  /** Does a confirmed booking already occupy this slot? */
  booked: boolean;
  /** Is the slot disabled (maintenance, past, blocked)? */
  blocked: boolean;
  /** If social play is enabled for this slot */
  socialPlay: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userTier: MemberTier;
  courtId: string;
  courtName: string;
  sport: CourtSport;
  date: string;
  startTime: string;
  endTime: string;
  /** Duration in minutes (60 for standard, longer for social) */
  durationMinutes: number;
  mode: BookingMode;
  /** Only used for social play — additional players besides the creator */
  participants: string[];
  status: BookingStatus;
  /** Rupee amount charged */
  amount: number;
  /** How it was paid */
  paymentMethod: PaymentMethod;
  createdAt: string;
  cancelledAt?: string;
}

/* ---------- Pricing rules ---------- */

export interface PricingRule {
  tier: MemberTier;
  /** Base rate per hour, in INR */
  ratePerHour: number;
  /** Discount percent on the rate (0–100) */
  discountPercent: number;
}

/* ---------- Input types for actions ---------- */

export interface CreateBookingInput {
  courtId: string;
  date: string;
  startTime: string;
  mode: BookingMode;
  /** Only for social play */
  participants?: string[];
  /** Only for walk-ins without an account */
  walkInName?: string;
  walkInPhone?: string;
}

export interface CancelBookingInput {
  bookingId: string;
  reason?: string;
}