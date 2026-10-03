"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Users, CalendarCheck, Wallet, LayoutGrid, Clock, Trophy,
  TrendingUp, TrendingDown, Sparkles, ArrowRight, Building2,
} from "lucide-react";
import { inr, type ClubStatus } from "@/lib/mockData";
import { clubsService, type ClubItem, type PlatformStats } from "@/services/clubs.service";

const STATUS_STYLE: Record<ClubStatus, string> = {
  Active:    "bg-blue text-white",
  Pending:   "bg-amber-100 text-amber-800",
  Suspended: "bg-red-100 text-red-800",
};

const KPI_ICONS = [Building2, Users, CalendarCheck, Wallet, LayoutGrid, Trophy];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | ClubStatus>("All");
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.systemRole !== "SUPER_ADMIN") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [clubsRes, statsRes] = await Promise.all([
          clubsService.getClubs(),
          clubsService.getStats(),
        ]);
        if (isMounted) {
          if (clubsRes.success && clubsRes.data) {
            setClubs(clubsRes.data);
          }
          if (statsRes.success && statsRes.data) {
            setStats(statsRes.data);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard dynamic data:", err);
      } finally {
        if (isMounted) setDataLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const dynamicKpis = useMemo(() => {
    const totalClubs = stats?.total_clubs ?? clubs.length;
    const totalMembers = stats?.total_members ?? 0;
    const todayBookings = stats?.today_bookings ?? 0;
    const todayRevenue = Number(stats?.today_revenue ?? 0);
    const activeFac = stats?.active_facilities ?? 0;
    const totalFac = stats?.total_facilities ?? 0;
    const totalAdmins = stats?.total_admins ?? clubs.length;

    return [
      { label: "Active Clubs", value: String(totalClubs), delta: "+100%", direction: "up" as const, note: "Live in PostgreSQL" },
      { label: "Total Members", value: totalMembers.toLocaleString("en-IN"), delta: "Live", direction: "up" as const, note: "Across all tenants" },
      { label: "Today's Bookings", value: String(todayBookings), delta: "Real-time", direction: "up" as const, note: "From bookings table" },
      { label: "Today's Revenue", value: inr(todayRevenue), delta: "Synced", direction: "up" as const, note: "Live transactions" },
      { label: "Active Facilities", value: `${activeFac} / ${totalFac}`, delta: "Active", direction: "up" as const, note: "Court & arena slots" },
      { label: "Club Admins", value: String(totalAdmins), delta: "Active", direction: "up" as const, note: "Tenant club owners" },
    ];
  }, [stats, clubs]);

  const filtered = useMemo(
    () =>
      clubs.filter(
        (c) =>
          (status === "All" || (c.status || "").toLowerCase() === status.toLowerCase()) &&
          ((c.name || "") + (c.admin || "") + (c.sport || "")).toLowerCase().includes(query.toLowerCase())
      ),
    [clubs, query, status]
  );

  const topClubs = useMemo(() => {
    return [...clubs].sort((a, b) => (b.members || 0) - (a.members || 0)).slice(0, 5);
  }, [clubs]);

  if (isLoading || !user || user.systemRole !== "SUPER_ADMIN") {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-muted">
        Verifying super admin privileges...
      </div>
    );
  }

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Welcome header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-navy sm:text-2xl md:text-3xl">
            Welcome, Super Admin!
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted sm:text-sm">
            <span>Here&apos;s what&apos;s happening across all Playnex clubs today.</span>
            <span className="hidden items-center gap-1 rounded-full bg-blueSoft px-2 py-0.5 text-[11px] font-semibold text-blue sm:inline-flex">
              <Sparkles size={12} /> Live multi-tenant sync
            </span>
          </div>
        </div>
        <Link
          href="/super-admin/clubs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blueHover"
        >
          Add club
        </Link>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {dynamicKpis.map((k, i) => {
          const Icon = KPI_ICONS[i % KPI_ICONS.length];
          const positive = k.direction === "up";
          return (
            <div
              key={k.label}
              className="rounded-2xl border border-line bg-card p-3 shadow-card sm:p-4"
            >
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-[11px]">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-blueSoft text-blue">
                  <Icon size={14} />
                </span>
                <span className="truncate">{k.label}</span>
              </div>
              <div className="mt-2 text-xl font-bold leading-none text-navy sm:mt-3 sm:text-2xl">
                {k.value}
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] sm:mt-3 sm:text-[11px]">
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold ${
                    positive ? "text-positive" : "text-negative"
                  }`}
                >
                  <TrendingUp size={12} />
                  {k.delta}
                </span>
                <span className="truncate text-muted">{k.note}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Chart + Top Clubs */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-navy">Revenue Overview</h2>
              <p className="text-xs text-muted">
                Real-time revenue across all registered clubs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blueSoft px-2 py-0.5 text-[11px] font-semibold text-blue">
                Live PostgreSQL Sync
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Chart */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-line bg-[#F8FBFF] p-6 text-center md:col-span-2">
              <div className="mb-2 text-2xl font-bold text-navy">
                {inr(Number(stats?.today_revenue || 0))}
              </div>
              <div className="text-xs text-muted max-w-sm">
                {Number(stats?.today_revenue || 0) > 0
                  ? "Recorded transactions today across all registered club facilities."
                  : "No transactions recorded yet today. Revenue from member bookings will reflect here live."}
              </div>
              <div className="mt-4 flex gap-4 text-xs font-medium text-muted">
                <div>Clubs: <span className="font-semibold text-navy">{clubs.length}</span></div>
                <div>Bookings: <span className="font-semibold text-navy">{stats?.today_bookings || 0}</span></div>
                <div>Members: <span className="font-semibold text-navy">{stats?.total_members || 0}</span></div>
              </div>
            </div>

            {/* Platform metrics panel */}
            <div className="rounded-lg border border-line bg-[#F4F8FD] p-3 md:p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Platform Breakdown
              </div>
              <div className="mt-1 text-lg font-bold text-navy md:text-xl">
                {inr(Number(stats?.today_revenue || 0))}
              </div>
              <ul className="mt-3 space-y-2 md:space-y-2.5">
                <li className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Total Clubs</span>
                    <span className="font-semibold text-navy">{stats?.total_clubs || clubs.length}</span>
                  </div>
                </li>
                <li className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Total Admins</span>
                    <span className="font-semibold text-navy">{stats?.total_admins || clubs.length}</span>
                  </div>
                </li>
                <li className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Active Facilities</span>
                    <span className="font-semibold text-navy">{stats?.active_facilities || 0}</span>
                  </div>
                </li>
                <li className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Total Facilities</span>
                    <span className="font-semibold text-navy">{stats?.total_facilities || 0}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Top Clubs */}
        <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy">Top Clubs by Members</h2>
              <p className="text-xs text-muted">Real-time tenant database</p>
            </div>
            <Link href="/super-admin/clubs" className="flex items-center gap-1 text-xs font-medium text-blue hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <ul className="space-y-4">
            {topClubs.map((club) => {
              const maxMem = Math.max(...topClubs.map(c => c.members || 1), 10);
              const pct = Math.min(100, Math.round(((club.members || 1) / maxMem) * 100));
              return (
                <li key={club.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate pr-2 font-medium text-text">{club.name}</span>
                    <span className="text-muted">
                      {club.members} {club.members === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-[11px] font-semibold text-blue">
                      {club.sport}
                    </span>
                  </div>
                </li>
              );
            })}
            {topClubs.length === 0 && (
              <li className="py-6 text-center text-xs text-muted">
                No clubs found. Create a club to see live metrics.
              </li>
            )}
          </ul>
        </section>
      </div>

      {/* Clubs table */}
      <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-navy">Clubs</h2>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search club, admin or sport"
              aria-label="Search clubs"
              className="h-10 w-full min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-sm outline-none placeholder:text-muted focus:border-blue/40 sm:w-64 sm:flex-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "All" | ClubStatus)}
              aria-label="Filter by status"
              className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-navy"
            >
              <option>All</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="-mx-4 overflow-x-auto md:mx-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-navy">
              <tr>
                <th className="px-4 py-2 font-medium md:px-0">Club</th>
                <th className="px-4 py-2 font-medium md:px-0">Club admin</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">Members</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">Bookings today</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">Revenue (month)</th>
                <th className="px-4 py-2 pl-6 font-medium md:pl-6">Status</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-line last:border-0 hover:bg-[#F8FBFF] transition-colors"
                >
                  <td className="px-4 py-3 md:px-0">
                    <div className="font-medium text-navy">{c.name}</div>
                    <div className="text-xs text-muted">{c.sport}</div>
                  </td>
                  <td className="px-4 py-3 text-text md:px-0">{c.admin}</td>
                  <td className="px-4 py-3 text-right text-text md:px-0">{c.members}</td>
                  <td className="px-4 py-3 text-right text-text md:px-0">{c.bookingsToday}</td>
                  <td className="px-4 py-3 text-right text-text md:px-0">{inr(c.revenue)}</td>
                  <td className="px-4 py-3 pl-6 md:pl-6">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[c.status]}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right md:px-0">
                    <button className="rounded-md border border-blue px-3 py-1 text-xs font-medium text-blue hover:bg-blue hover:text-white">
                      {c.status === "Pending" ? "Review" : "Open"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    No clubs match your search. Clear the filters to see all clubs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}