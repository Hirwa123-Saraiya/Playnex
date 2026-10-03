export type ClubStatus = "Active" | "Pending" | "Suspended";

export type Club = {
  id: string;
  name: string;
  sport: string;
  admin: string;
  adminEmail?: string;
  location: string;
  members: number;
  bookingsToday: number;
  revenue: number;
  status: ClubStatus;
};

export const initialClubs: Club[] = [];

export let clubs: Club[] = [];

export function getStoredClubs(): Club[] {
  if (typeof window === "undefined") return clubs;
  try {
    const raw = localStorage.getItem("playnex_clubs_list");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        clubs = parsed;
        return parsed;
      }
    }
  } catch (e) {
    // Fallback to in-memory list
  }
  return clubs;
}

export function addStoredClub(newClub: Club): Club[] {
  // Prepend to array
  clubs = [newClub, ...clubs.filter((c) => c.id !== newClub.id)];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("playnex_clubs_list", JSON.stringify(clubs));
    } catch (e) {
      // Ignored
    }
  }
  return clubs;
}

/* ---------- KPI strip ---------- */
export type Kpi = {
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down";
  note: string;
};

export const superAdminKpis: Kpi[] = [];

/* ---------- Revenue chart (stacked, by category) ---------- */
export type RevenueRow = {
  day: string;
  Restaurant: number;
  Bar: number;
  Courts: number;
  Memberships: number;
  Events: number;
  Others: number;
};

export const revenueStacked: RevenueRow[] = [];

export const revenueCategoryColors: Record<string, string> = {
  Restaurant:  "#F97316",
  Bar:         "#A855F7",
  Courts:      "#3B82F6",
  Memberships: "#0F9D58",
  Events:      "#EAB308",
  Others:      "#E11D48",
};

/* ---------- Facility / club occupancy ---------- */
export type OccupancyRow = {
  id: string;
  label: string;
  used: number;
  total: number;
};

export const topClubsOccupancy: OccupancyRow[] = [];

/* ---------- Misc ---------- */
export const recentActivity: { id: number; text: string; time: string }[] = [];

/* ============================================================
   Extended data for admin pages
   ============================================================ */

/* ---------- Club admins ---------- */
export type AdminStatus = "Active" | "Invited" | "Disabled";

export type Admin = {
  id: string;
  name: string;
  email: string;
  club: string;
  role: "Owner" | "Manager" | "Staff";
  status: AdminStatus;
  lastLogin: string;
};

export const admins: Admin[] = [];

/* ---------- End users ---------- */
export type UserPlan = "Trial" | "Monthly" | "Annual";

export type EndUser = {
  id: string;
  name: string;
  email: string;
  club: string;
  plan: UserPlan;
  joined: string;
  active: boolean;
};

export const users: EndUser[] = [];

/* ---------- Revenue by club ---------- */
export type ClubRevenue = {
  id: string;
  club: string;
  month: number;
  week: number;
  today: number;
  growth: number;
};

export const revenueByClub: ClubRevenue[] = [];

/* ---------- Events ---------- */
export type EventStatus = "Upcoming" | "Live" | "Completed";

export type ClubEvent = {
  id: string;
  title: string;
  club: string;
  date: string;
  slots: number;
  filled: number;
  status: EventStatus;
};

export const events: ClubEvent[] = [];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");