export type ClubStatus = "Active" | "Pending" | "Suspended";

export type Club = {
  id: string;
  name: string;
  sport: string;
  admin: string;
  members: number;
  bookingsToday: number;
  revenue: number; // this month, in INR
  status: ClubStatus;
};

// Replace with: fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/superadmin/clubs`)
export const clubs: Club[] = [
  { id: "c1", name: "Champions Club", sport: "Tennis, Cricket", admin: "Rahul Patel", members: 248, bookingsToday: 32, revenue: 485000, status: "Active" },
  { id: "c2", name: "Riverside Tennis", sport: "Tennis", admin: "Priya Shah", members: 132, bookingsToday: 18, revenue: 264000, status: "Active" },
  { id: "c3", name: "Smash Badminton Hub", sport: "Badminton", admin: "Amit Shah", members: 96, bookingsToday: 24, revenue: 171000, status: "Active" },
  { id: "c4", name: "Turf Arena", sport: "Football, Cricket", admin: "Karan Mehta", members: 74, bookingsToday: 9, revenue: 98000, status: "Pending" },
  { id: "c5", name: "Lakeside Padel", sport: "Padel", admin: "Neha Patel", members: 41, bookingsToday: 0, revenue: 22000, status: "Suspended" },
];

export const revenueByDay = [
  { day: "Mon", revenue: 82000 },
  { day: "Tue", revenue: 64000 },
  { day: "Wed", revenue: 91000 },
  { day: "Thu", revenue: 77000 },
  { day: "Fri", revenue: 143000 },
  { day: "Sat", revenue: 168000 },
  { day: "Sun", revenue: 121000 },
];

export const recentActivity = [
  { id: 1, text: "Turf Arena requested club approval", time: "10 min ago" },
  { id: 2, text: "Dev Joshi registered at Champions Club", time: "32 min ago" },
  { id: 3, text: "Lakeside Padel was suspended", time: "2 hours ago" },
  { id: 4, text: "Riverside Tennis added 3 new courts", time: "Yesterday" },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");