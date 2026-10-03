"use client";

import { useMemo, useState } from "react";
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
  Active:    "bg-lime text-ink",
  Pending:   "bg-amber-100 text-amber-800",
  Suspended: "bg-red-100 text-red-800",
};

const KPI_ICONS = [Users, CalendarCheck, Wallet, LayoutGrid, Clock, Trophy];

export default function SuperAdminDashboard() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | ClubStatus>("All");

  const filtered = useMemo(
    () =>
      clubs.filter(
        (c) =>
          (status === "All" || c.status === status) &&
          (c.name + c.admin + c.sport).toLowerCase().includes(query.toLowerCase())
      ),
    [query, status]
  );

  /* Chart totals for the legend panel */
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

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome, Super Admin!
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted">
            <span>Here&apos;s what&apos;s happening across all Playnex clubs today.</span>
            <span className="hidden items-center gap-1 rounded-full bg-lime/40 px-2 py-0.5 text-[11px] font-semibold text-moss md:inline-flex">
              <Sparkles size={12} /> Live multi-tenant sync
            </span>
          </div>
        </div>
        <button className="rounded-lg bg-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-mossDark">
          Add club
        </button>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {superAdminKpis.map((k, i) => {
          const Icon = KPI_ICONS[i % KPI_ICONS.length];
          const positive = k.direction === "up";
          return (
            <div
              key={k.label}
              className="rounded-xl border border-line bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-lime/30 text-moss">
                  <Icon size={14} />
                </span>
                <span className="truncate">{k.label}</span>
              </div>
              <div className="mt-3 text-2xl font-bold leading-none">{k.value}</div>
              <div className="mt-3 flex items-center gap-1 text-[11px]">
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
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <section className="rounded-xl border border-line bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">Revenue Overview</h2>
              <p className="text-xs text-muted">
                Real-time revenue across all Playnex clubs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-lime/30 px-2 py-0.5 text-[11px] font-semibold text-moss">
                +15% Growth
              </span>
              <button className="flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs text-muted hover:text-text">
                Last 30 Days
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Chart */}
            <div className="h-72 md:col-span-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueStacked} barCategoryGap={18}>
                  <CartesianGrid vertical={false} stroke="#EAECE6" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickFormatter={(v: number) => `₹${Math.round(v / 1000)}k`}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                    fontSize={12}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(23,64,43,0.06)" }}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E5E7E1",
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

            {/* Legend panel */}
            <div className="rounded-lg border border-line bg-sand/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Revenue breakdown
              </div>
              <div className="mt-1 text-xl font-bold">{inr(grandTotal)}</div>
              <ul className="mt-3 space-y-2.5">
                {categoryTotals.map((c) => (
                  <li key={c.label} className="text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: revenueCategoryColors[c.label] }}
                      />
                      <span className="flex-1 truncate">{c.label}</span>
                      <span className="text-muted">{c.pct}%</span>
                    </div>
                    <div className="mt-0.5 pl-4 text-[11px] font-semibold text-text">
                      {inr(c.value)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Occupancy */}
        <section className="rounded-xl border border-line bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Top Clubs by Bookings</h2>
              <p className="text-xs text-muted">Today&apos;s slot utilisation</p>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-moss hover:underline">
              View all <ArrowRight size={12} />
            </button>
          </div>

          <ul className="space-y-4">
            {topClubsOccupancy.map((row) => {
              const pct = Math.round((row.used / row.total) * 100);
              return (
                <li key={row.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate pr-2 font-medium">{row.label}</span>
                    <span className="text-muted">
                      {row.used}/{row.total}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-moss"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-xs font-semibold">{pct}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Clubs table */}
      <section className="rounded-xl border border-line bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold">Clubs</h2>
          <div className="flex flex-wrap gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search club, admin or sport"
              aria-label="Search clubs"
              className="w-64 rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-moss/40"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "All" | ClubStatus)}
              aria-label="Filter by status"
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="py-2 font-medium">Club</th>
                <th className="py-2 font-medium">Club admin</th>
                <th className="py-2 text-right font-medium">Members</th>
                <th className="py-2 text-right font-medium">Bookings today</th>
                <th className="py-2 text-right font-medium">Revenue (month)</th>
                <th className="py-2 pl-6 font-medium">Status</th>
                <th className="py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="py-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted">{c.sport}</div>
                  </td>
                  <td className="py-3">{c.admin}</td>
                  <td className="py-3 text-right">{c.members}</td>
                  <td className="py-3 text-right">{c.bookingsToday}</td>
                  <td className="py-3 text-right">{inr(c.revenue)}</td>
                  <td className="py-3 pl-6">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="rounded-md border border-moss px-3 py-1 text-xs font-medium text-moss hover:bg-moss hover:text-white">
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