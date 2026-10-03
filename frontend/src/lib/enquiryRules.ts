import type {
  Enquiry, EnquiryStatus, EnquirySource, PlanInterest,
} from "@/types/enquiry.types";

/* ============================================================
   Status transitions
   ============================================================ */

/**
 * Legal next statuses from a given current status.
 * Enforces the pipeline shape so the UI never shows nonsense options.
 */
export const ALLOWED_TRANSITIONS: Record<EnquiryStatus, EnquiryStatus[]> = {
  New:       ["Assigned", "Contacted", "Archived"],
  Assigned:  ["Contacted", "Lost", "Archived"],
  Contacted: ["Quoted", "Lost", "Archived"],
  Quoted:    ["Converted", "Lost", "Archived"],
  Converted: [],
  Lost:      ["Contacted"], // sometimes people come back
  Archived:  ["New"],
};

export function canTransition(
  from: EnquiryStatus,
  to: EnquiryStatus
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

/* ============================================================
   Age & SLA
   ============================================================ */

/** How many hours old this enquiry is. */
export function ageHours(e: Enquiry, now: Date = new Date()): number {
  return (now.getTime() - new Date(e.createdAt).getTime()) / 3_600_000;
}

/** Was this enquiry responded to within the SLA window? */
export function isWithinSla(
  e: Enquiry,
  slaHours = 24,
  now: Date = new Date()
): boolean {
  const hours = ageHours(e, now);
  return hours <= slaHours || e.status !== "New";
}

/** Is a follow-up overdue? */
export function isFollowUpOverdue(
  e: Enquiry,
  now: Date = new Date()
): boolean {
  if (!e.followUpAt) return false;
  if (["Converted", "Lost", "Archived"].includes(e.status)) return false;
  return new Date(e.followUpAt).getTime() < now.getTime();
}

/* ============================================================
   Labels
   ============================================================ */

export const STATUS_LABEL: Record<EnquiryStatus, string> = {
  New:       "New",
  Assigned:  "Assigned",
  Contacted: "Contacted",
  Quoted:    "Quoted",
  Converted: "Converted",
  Lost:      "Lost",
  Archived:  "Archived",
};

export const STATUS_COLOR: Record<EnquiryStatus, string> = {
  New:       "bg-blue-100 text-blue-800",
  Assigned:  "bg-amber-100 text-amber-800",
  Contacted: "bg-purple-100 text-purple-800",
  Quoted:    "bg-lime text-ink",
  Converted: "bg-positive/20 text-positive",
  Lost:      "bg-red-100 text-red-800",
  Archived:  "bg-sand text-muted",
};

export const SOURCE_LABEL: Record<EnquirySource, string> = {
  LandingHero: "Landing page",
  BookDemo:    "Book a demo",
  ContactForm: "Contact form",
  WalkIn:      "Walk-in",
  Phone:       "Phone call",
  Referral:    "Referral",
  TrialBooking: "Free Trial Booking",
};

export const PLAN_LABEL: Record<PlanInterest, string> = {
  Gold:      "Gold plan",
  Silver:    "Silver plan",
  Junior:    "Junior plan",
  Undecided: "Not sure yet",
};

/* ============================================================
   Stats
   ============================================================ */

export interface EnquiryStats {
  total: number;
  new: number;
  inProgress: number;
  converted: number;
  conversionRate: number;
  overdueFollowUps: number;
}

export function computeStats(
  list: Enquiry[],
  now: Date = new Date()
): EnquiryStats {
  const total = list.length;
  const converted = list.filter((e) => e.status === "Converted").length;
  const newCount = list.filter((e) => e.status === "New").length;
  const inProgress = list.filter((e) =>
    ["Assigned", "Contacted", "Quoted"].includes(e.status)
  ).length;
  const overdueFollowUps = list.filter((e) => isFollowUpOverdue(e, now)).length;

  return {
    total,
    new: newCount,
    inProgress,
    converted,
    conversionRate: total ? Math.round((converted / total) * 100) : 0,
    overdueFollowUps,
  };
}