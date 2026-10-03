/* ============================================================
   Enquiry → Member pipeline types
   ============================================================ */

export type EnquirySource =
  | "LandingHero"
  | "BookDemo"
  | "ContactForm"
  | "WalkIn"
  | "Phone"
  | "Referral"
  | "TrialBooking";

export type EnquiryStatus =
  | "New"          // just arrived, nobody assigned
  | "Assigned"     // assigned to a staff member
  | "Contacted"    // first contact made
  | "Quoted"       // a quote has been sent
  | "Converted"    // became a member
  | "Lost"         // not interested / no response
  | "Archived";    // manual close

export type PlanInterest = "Gold" | "Silver" | "Junior" | "Undecided";

export type PreferredContact = "Email" | "Phone" | "WhatsApp";

export interface Enquiry {
  id: string;
  tenantId: string;
  source: EnquirySource;

  /** Contact info */
  name: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;

  /** What they're interested in */
  sportInterest?: string;        // "Tennis", "Padel", ...
  planInterest: PlanInterest;
  message: string;

  /** Pipeline state */
  status: EnquiryStatus;
  assignedToId: string | null;
  assignedToName: string | null;
  followUpAt: string | null;      // ISO datetime
  quoteAmount?: number;           // INR
  quoteSentAt?: string | null;

  /** Audit */
  createdAt: string;
  updatedAt: string;
  convertedAt?: string | null;
  convertedMemberId?: string | null;

  /** Log of what happened */
  notes: EnquiryNote[];
}

export interface EnquiryNote {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

/** Staff members who can be assigned an enquiry. */
export interface StaffMember {
  id: string;
  name: string;
  role: "Front Desk" | "Manager" | "Owner" | "Sales";
  email: string;
  active: boolean;
}

/** Input for creating a public enquiry. */
export interface CreateEnquiryInput {
  name: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
  sportInterest?: string;
  planInterest: PlanInterest;
  message: string;
  source: EnquirySource;
}

/** Input for updating an enquiry (admin side). */
export interface UpdateEnquiryInput {
  status?: EnquiryStatus;
  assignedToId?: string | null;
  followUpAt?: string | null;
  quoteAmount?: number;
  quoteSentAt?: string | null;
  noteText?: string;
  convertedAt?: string | null;
  convertedMemberId?: string | null;
}

/** Result of converting an enquiry to a member. */
export interface ConversionResult {
  memberId: string;
  memberName: string;
  tier: PlanInterest;
}