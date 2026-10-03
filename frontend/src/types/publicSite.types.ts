/* ============================================================
   Public website types — discovery surface (no login)
   ============================================================ */

/* ---------- Plans & pricing ---------- */

export type PlanTier = "Gold" | "Silver" | "Junior";

export interface PublicPlan {
  tier: PlanTier;
  tagline: string;
  monthlyPrice: number;      // INR
  annualPrice: number;       // INR, discounted
  highlights: string[];      // marketing bullets
  courtDiscount: number;     // percent (0–100)
  shopDiscount: number;      // percent
  barDiscount: number;       // percent
  popular?: boolean;         // show "Most popular" badge
  note?: string;             // small print
}

/* ---------- Weekly availability (public calendar) ---------- */

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface AvailabilitySlot {
  /** "HH:mm" 24h */
  time: string;
  /** How many courts are free at this time across all sports */
  freeCount: number;
  /** Total courts in the club (for "3 of 5" display) */
  totalCount: number;
  /** Friday Night Social Play indicator */
  isSocialPlay?: boolean;
  socialPlayTag?: string;
}

export interface DayAvailability {
  day: DayOfWeek;
  /** ISO date "2026-10-15" */
  date: string;
  slots: AvailabilitySlot[];
}

/* ---------- Shop preview ---------- */

export type ProductCategory =
  | "Rackets"
  | "Balls"
  | "Shoes"
  | "Accessories"
  | "Apparel";

export interface PublicProduct {
  id: string;
  name: string;
  category: ProductCategory;
  /** Base price in INR (before member discount) */
  basePrice: number;
  /** Short marketing description */
  description: string;
  /** In-stock quantity — 0 means sold out */
  stock: number;
  /** Optional brand/label */
  brand?: string;
  /** Sport this product is for */
  sport?: string;
}

/* ---------- Trial booking form ---------- */

export interface TrialBookingInput {
  name: string;
  email: string;
  phone: string;
  preferredContact: "Email" | "Phone" | "WhatsApp";
  sport: string;
  preferredDate: string;      // "YYYY-MM-DD"
  preferredTime: string;      // "HH:mm"
  message?: string;
}

/** Re-uses the Enquiry type from feat/Enquiries after it's merged. */
export interface TrialBookingResult {
  enquiryId: string;
  message: string;            // confirmation to show the visitor
}

/* ---------- Club info (for the public landing) ---------- */

export interface PublicClubInfo {
  name: string;
  tagline: string;
  address: string;
  sports: string[];           // ["Tennis", "Cricket", "Padel", "Badminton"]
  hours: { open: string; close: string };
  phone: string;
  email: string;
}