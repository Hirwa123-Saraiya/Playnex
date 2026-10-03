export type ClubStatus = "Active" | "Pending" | "Suspended";

export type Club = {
  id: string;
  name: string;
  sport: string;
  admin: string;
  location: string;
  members: number;
  bookingsToday: number;
  revenue: number;
  status: ClubStatus;
};

export const clubs: Club[] = [
  { id: "c1", name: "Champions Club",      sport: "Tennis, Cricket",   admin: "Rahul Patel", location: "Ahmedabad, GJ", members: 248, bookingsToday: 32, revenue: 485000, status: "Active" },
  { id: "c2", name: "Riverside Tennis",    sport: "Tennis",            admin: "Priya Shah",  location: "Surat, GJ",     members: 132, bookingsToday: 18, revenue: 264000, status: "Active" },
  { id: "c3", name: "Smash Badminton Hub", sport: "Badminton",         admin: "Amit Shah",   location: "Vadodara, GJ",  members: 96,  bookingsToday: 24, revenue: 171000, status: "Active" },
  { id: "c4", name: "Turf Arena",          sport: "Football, Cricket", admin: "Karan Mehta", location: "Rajkot, GJ",    members: 74,  bookingsToday: 9,  revenue: 98000,  status: "Pending" },
  { id: "c5", name: "Lakeside Padel",      sport: "Padel",             admin: "Neha Patel",  location: "Ahmedabad, GJ", members: 41,  bookingsToday: 0,  revenue: 22000,  status: "Suspended" },
];

/* ---------- KPI strip ---------- */
export type Kpi = {
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down";
  note: string;
};

export const superAdminKpis: Kpi[] = [
  { label: "Total Members",       value: "1,245",       delta: "8%",  direction: "up",   note: "+92 this month" },
  { label: "Today's Bookings",    value: "186",         delta: "12%", direction: "up",   note: "+20 from yesterday" },
  { label: "Today's Revenue",     value: "₹1,85,000",   delta: "15%", direction: "up",   note: "vs last week" },
  { label: "Active Facilities",   value: "42 / 48",     delta: "88%", direction: "up",   note: "operational" },
  { label: "Pending Approvals",   value: "23",          delta: "4%",  direction: "down", note: "Requires action" },
  { label: "Upcoming Events",     value: "5",           delta: "2%",  direction: "up",   note: "Next: 18 Oct 2026" },
];

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

export const revenueStacked: RevenueRow[] = [
  { day: "Mon", Restaurant: 22000, Bar: 9000,  Courts: 14000, Memberships: 19000, Events: 8000,  Others: 10000 },
  { day: "Tue", Restaurant: 26000, Bar: 11000, Courts: 16000, Memberships: 21000, Events: 9000,  Others: 12000 },
  { day: "Wed", Restaurant: 31000, Bar: 14000, Courts: 19000, Memberships: 24000, Events: 12000, Others: 15000 },
  { day: "Thu", Restaurant: 29000, Bar: 13000, Courts: 17000, Memberships: 22000, Events: 11000, Others: 14000 },
  { day: "Fri", Restaurant: 46000, Bar: 21000, Courts: 24000, Memberships: 31000, Events: 18000, Others: 20000 },
  { day: "Sat", Restaurant: 66000, Bar: 28000, Courts: 32000, Memberships: 40000, Events: 22000, Others: 26000 },
  { day: "Sun", Restaurant: 47000, Bar: 20000, Courts: 25000, Memberships: 34000, Events: 19000, Others: 21000 },
];

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

export const topClubsOccupancy: OccupancyRow[] = [
  { id: "o1", label: "Champions Club",      used: 19, total: 20 },
  { id: "o2", label: "Riverside Tennis",    used: 8,  total: 10 },
  { id: "o3", label: "Smash Badminton Hub", used: 9,  total: 12 },
  { id: "o4", label: "Turf Arena",          used: 34, total: 50 },
  { id: "o5", label: "Lakeside Padel",      used: 3,  total: 4  },
];

/* ---------- Misc ---------- */
export const recentActivity = [
  { id: 1, text: "Turf Arena requested club approval", time: "10 min ago" },
  { id: 2, text: "Dev Joshi registered at Champions Club", time: "32 min ago" },
  { id: 3, text: "Lakeside Padel was suspended", time: "2 hours ago" },
  { id: 4, text: "Riverside Tennis added 3 new courts", time: "Yesterday" },
];

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

export const admins: Admin[] = [
  { id: "a1", name: "Rahul Patel",   email: "rahul@champions.in",  club: "Champions Club",      role: "Owner",   status: "Active",   lastLogin: "2 hours ago" },
  { id: "a2", name: "Priya Shah",    email: "priya@riverside.in",  club: "Riverside Tennis",    role: "Owner",   status: "Active",   lastLogin: "Yesterday" },
  { id: "a3", name: "Amit Shah",     email: "amit@smashhub.in",    club: "Smash Badminton Hub", role: "Manager", status: "Active",   lastLogin: "10 min ago" },
  { id: "a4", name: "Karan Mehta",   email: "karan@turfarena.in",  club: "Turf Arena",          role: "Owner",   status: "Invited",  lastLogin: "—" },
  { id: "a5", name: "Neha Patel",    email: "neha@lakeside.in",    club: "Lakeside Padel",      role: "Manager", status: "Disabled", lastLogin: "3 weeks ago" },
  { id: "a6", name: "Sanjay Verma",  email: "sanjay@champions.in", club: "Champions Club",      role: "Staff",   status: "Active",   lastLogin: "5 min ago" },
];

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

export const users: EndUser[] = [
  { id: "u1",  name: "Dev Joshi",      email: "dev@example.com",     club: "Champions Club",      plan: "Annual",  joined: "12 Jan 2026", active: true },
  { id: "u2",  name: "Riya Desai",     email: "riya@example.com",    club: "Riverside Tennis",    plan: "Monthly", joined: "03 Feb 2026", active: true },
  { id: "u3",  name: "Arjun Nair",     email: "arjun@example.com",   club: "Champions Club",      plan: "Monthly", joined: "22 Feb 2026", active: true },
  { id: "u4",  name: "Mira Kapoor",    email: "mira@example.com",    club: "Smash Badminton Hub", plan: "Trial",   joined: "10 Mar 2026", active: true },
  { id: "u5",  name: "Kunal Bhatt",    email: "kunal@example.com",   club: "Turf Arena",          plan: "Annual",  joined: "18 Mar 2026", active: false },
  { id: "u6",  name: "Tanya Mehra",    email: "tanya@example.com",   club: "Riverside Tennis",    plan: "Monthly", joined: "01 Apr 2026", active: true },
  { id: "u7",  name: "Vivaan Shah",    email: "vivaan@example.com",  club: "Champions Club",      plan: "Trial",   joined: "15 Apr 2026", active: true },
  { id: "u8",  name: "Aisha Khan",     email: "aisha@example.com",   club: "Lakeside Padel",      plan: "Monthly", joined: "02 May 2026", active: false },
];

/* ---------- Revenue by club ---------- */
export type ClubRevenue = {
  id: string;
  club: string;
  month: number;
  week: number;
  today: number;
  growth: number;
};

export const revenueByClub: ClubRevenue[] = [
  { id: "r1", club: "Champions Club",      month: 485000, week: 132000, today: 26800, growth:  12 },
  { id: "r2", club: "Riverside Tennis",    month: 264000, week:  74000, today: 14900, growth:   8 },
  { id: "r3", club: "Smash Badminton Hub", month: 171000, week:  48000, today:  9800, growth:  -3 },
  { id: "r4", club: "Turf Arena",          month:  98000, week:  26000, today:  4200, growth:   5 },
  { id: "r5", club: "Lakeside Padel",      month:  22000, week:   5000, today:     0, growth: -18 },
];

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

export const events: ClubEvent[] = [
  { id: "e1", title: "Inter-Club Tennis Cup",    club: "Riverside Tennis",    date: "18 Oct 2026", slots: 32, filled: 28, status: "Upcoming" },
  { id: "e2", title: "Badminton Doubles League", club: "Smash Badminton Hub", date: "22 Oct 2026", slots: 24, filled: 24, status: "Live" },
  { id: "e3", title: "Football 5-a-side Night",  club: "Turf Arena",          date: "25 Oct 2026", slots: 20, filled:  6, status: "Upcoming" },
  { id: "e4", title: "Cricket Coaching Camp",    club: "Champions Club",      date: "01 Nov 2026", slots: 40, filled: 12, status: "Upcoming" },
  { id: "e5", title: "Padel Open Finals",        club: "Lakeside Padel",      date: "05 Nov 2026", slots: 16, filled:  0, status: "Upcoming" },
  { id: "e6", title: "Members Fitness Challenge",club: "Champions Club",      date: "12 Oct 2026", slots: 50, filled: 50, status: "Completed" },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");