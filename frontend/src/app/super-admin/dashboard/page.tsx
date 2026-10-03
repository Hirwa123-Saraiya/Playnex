"use client";

import { useMemo, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { clubs, inr, recentActivity, revenueByDay, type ClubStatus } from "@/lib/mockData";

const STATUS_STYLE: Record<ClubStatus, string> = {
  Active: "bg-[#D6F03C] text-[#1B2420]",
  Pending: "bg-[#FDE6B3] text-[#7A4B00]",
  Suspended: "bg-[#F6C9C2] text-[#8A1F11]",
};

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

  const totalMembers = clubs.reduce((s, c) => s + c.members, 0);
  const totalBookings = clubs.reduce((s, c) => s + c.bookingsToday, 0);
  const totalRevenue = clubs.reduce((s, c) => s + c.revenue, 0);
  const pendingCount = clubs.filter((c) => c.status === "Pending").length;

  const stats = [
    { label: "Clubs", value: String(clubs.length), note: `${pendingCount} waiting for approval` },
    { label: "Users across all clubs", value: totalMembers.toLocaleString("en-IN"), note: "Registrations are per club" },
    { label: "Bookings today", value: String(totalBookings), note: "All clubs combined" },
    { label: "Revenue this month", value: inr(totalRevenue), note: "All clubs combined" },
  ];

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">All clubs</h1>
          <p className="text-sm text-[#5C665F]">Saturday, 3 October 2026</p>
        </div>
        <button className="rounded-md bg-[#17402B] px-4 py-2 text-sm font-medium text-white">
          Add club
        </button>
      </header>

      {/* Stats */}
      <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-[#E3E1D6] bg-white p-4">
            <div className="text-sm text-[#5C665F]">{s.label}</div>
            <div className="mt-1 text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-[#5C665F]">{s.note}</div>
          </div>
        ))}
      </section>

      {/* Chart + activity */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-[#E3E1D6] bg-white p-4 md:p-5 lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold">Platform revenue, last 7 days</h2>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByDay}>
                <CartesianGrid vertical={false} stroke="#E3E1D6" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(v: number) => `₹${v / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip formatter={(v) => inr(Number(v))} />
                <Bar dataKey="revenue" fill="#17402B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer> 
          </div>
        </section>

        <section className="rounded-lg border border-[#E3E1D6] bg-white p-4 md:p-5">
          <h2 className="mb-3 text-lg font-bold">Recent activity</h2>
          <ul className="divide-y divide-[#E3E1D6]">
            {recentActivity.map((a) => (
              <li key={a.id} className="py-2.5 text-sm">
                <div>{a.text}</div>
                <div className="text-xs text-[#5C665F]">{a.time}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Clubs table */}
      <section className="rounded-lg border border-[#E3E1D6] bg-white p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Clubs</h2>
          <div className="flex flex-wrap gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search club, admin or sport"
              aria-label="Search clubs"
              className="w-64 rounded-md border border-[#E3E1D6] px-3 py-2 text-sm"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "All" | ClubStatus)}
              aria-label="Filter by status"
              className="rounded-md border border-[#E3E1D6] bg-white px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[#E3E1D6] text-[#5C665F]">
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
                <tr key={c.id} className="border-b border-[#E3E1D6] last:border-0">
                  <td className="py-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-[#5C665F]">{c.sport}</div>
                  </td>
                  <td className="py-3">{c.admin}</td>
                  <td className="py-3 text-right">{c.members}</td>
                  <td className="py-3 text-right">{c.bookingsToday}</td>
                  <td className="py-3 text-right">{inr(c.revenue)}</td>
                  <td className="py-3 pl-6">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="rounded-md border border-[#17402B] px-3 py-1 text-xs font-medium hover:bg-[#17402B] hover:text-white">
                      {c.status === "Pending" ? "Review" : "Open"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#5C665F]">
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