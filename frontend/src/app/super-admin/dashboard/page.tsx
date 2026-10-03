"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Users, CalendarCheck, Wallet, LayoutGrid, Clock, Trophy,
  TrendingUp, TrendingDown, Sparkles, ArrowRight,
} from "lucide-react";
import {
  superAdminKpis, revenueStacked, revenueCategoryColors,
  topClubsOccupancy, inr, clubs, type ClubStatus,
} from "@/lib/mockData";

const STATUS_STYLE: Record<ClubStatus, string> = {
  Active:    "bg-blue text-white",
  Pending:   "bg-amber-100 text-amber-800",
  Suspended: "bg-red-100 text-red-800",
};

const KPI_ICONS = [Users, CalendarCheck, Wallet, LayoutGrid, Clock, Trophy];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | ClubStatus>("All");

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.systemRole !== "SUPER_ADMIN") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  const filtered = useMemo(
    () =>
      clubs.filter(
        (c) =>
          (status === "All" || c.status === status) &&
          (c.name + c.admin + c.sport).toLowerCase().includes(query.toLowerCase())
      ),
    [query, status]
  );

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const row of revenueStacked) {
      for (const [k, v] of Object.entries(row)) {
        if (k === "day") continue;
        totals[k] = (totals[k] ?? 0) + (v as number);
      }
    }
    const grand = Object.values(totals).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(totals)
      .map(([k, v]) => ({ label: k, value: v, pct: Math.round((v / grand) * 100) }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const grandTotal = categoryTotals.reduce((s, c) => s + c.value, 0);

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
        <button className="rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blueHover">
          Add club
        </button>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {superAdminKpis.map((k, i) => {
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
                  {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {k.delta}
                </span>
                <span className="truncate text-muted">{k.note}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Chart + occupancy */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-navy">Revenue Overview</h2>
              <p className="text-xs text-muted">
                Real-time revenue across all Playnex clubs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-blueSoft px-2 py-0.5 text-[11px] font-semibold text-blue sm:inline-block">
                +15% Growth
              </span>
              <button className="flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs text-muted hover:text-navy">
                Last 30 Days
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-64 md:col-span-2 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueStacked} barCategoryGap={18}>
                  <CartesianGrid vertical={false} stroke="#D9E6F5" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis
                    tickFormatter={(v: number) => `₹${Math.round(v / 1000)}k`}
                    tickLine={false}
                    axisLine={false}
                    width={42}
                    fontSize={11}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(21,101,216,0.06)" }}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #D9E6F5",
                      fontSize: 12,
                    }}
                    formatter={(value: number, name: string) => [inr(value), name]}
                  />
                  {Object.keys(revenueCategoryColors).map((key) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="rev"
                      fill={revenueCategoryColors[key]}
                      radius={key === "Others" ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg border border-line bg-[#F4F8FD] p-3 md:p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Revenue breakdown
              </div>
              <div className="mt-1 text-lg font-bold text-navy md:text-xl">
                {inr(grandTotal)}
              </div>
              <ul className="mt-3 space-y-2 md:space-y-2.5">
                {categoryTotals.map((c) => (
                  <li key={c.label} className="text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: revenueCategoryColors[c.label] }}
                      />
                      <span className="flex-1 truncate text-text">{c.label}</span>
                      <span className="text-muted">{c.pct}%</span>
                    </div>
                    <div className="mt-0.5 pl-4 text-[11px] font-semibold text-navy">
                      {inr(c.value)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy">Top Clubs by Bookings</h2>
              <p className="text-xs text-muted">Today&apos;s slot utilisation</p>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-blue hover:underline">
              View all <ArrowRight size={12} />
            </button>
          </div>

          <ul className="space-y-4">
            {topClubsOccupancy.map((row) => {
              const pct = Math.round((row.used / row.total) * 100);
              return (
                <li key={row.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate pr-2 font-medium text-text">{row.label}</span>
                    <span className="text-muted">
                      {row.used}/{row.total}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-blue"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-xs font-semibold text-navy">
                      {pct}%
                    </span>
                  </div>
                </li>
              );
            })}
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