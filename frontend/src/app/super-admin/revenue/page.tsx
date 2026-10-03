"use client";

import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { revenueStacked, revenueByClub, inr } from "@/lib/mockData";

export default function RevenuePage() {
  const total = revenueByClub.reduce((s, c) => s + c.month, 0);
  const weekTotal = revenueByClub.reduce((s, c) => s + c.week, 0);
  const todayTotal = revenueByClub.reduce((s, c) => s + c.today, 0);

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-navy sm:text-2xl md:text-3xl">Revenue</h1>
          <p className="text-xs text-muted sm:text-sm">
            Platform-wide revenue across all clubs
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:border-blue/40">
          <Download size={15} /> <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Stat label="This month"  value={inr(total)}     note="All clubs combined" />
        <Stat label="Last 7 days" value={inr(weekTotal)} note="Trailing week" />
        <Stat label="Today"       value={inr(todayTotal)} note="Live as of now" />
      </div>

      <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy">Revenue by category</h2>
            <p className="text-xs text-muted">Last 7 days, stacked</p>
          </div>
        </div>
        <div className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueStacked} barCategoryGap={22}>
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
                contentStyle={{ borderRadius: 10, border: "1px solid #D9E6F5", fontSize: 12 }}
                formatter={(value: number, name: string) => [inr(value), name]}
              />
              <Bar dataKey="Restaurant"  stackId="r" fill="#0B1F4D" />
              <Bar dataKey="Bar"         stackId="r" fill="#1565D8" />
              <Bar dataKey="Courts"      stackId="r" fill="#2F80ED" />
              <Bar dataKey="Memberships" stackId="r" fill="#5AA9FF" />
              <Bar dataKey="Events"      stackId="r" fill="#A9D0FF" />
              <Bar dataKey="Others"      stackId="r" fill="#0B1F4D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
        <h2 className="mb-4 text-base font-bold text-navy">Revenue by club</h2>
        <div className="-mx-4 overflow-x-auto md:mx-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-[#F4F8FD] text-navy">
              <tr>
                <th className="px-4 py-2 font-medium md:px-0 md:bg-transparent md:pl-2">Club</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">Today</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">Last 7 days</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">This month</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">Growth</th>
              </tr>
            </thead>
            <tbody>
              {revenueByClub.map((r) => {
                const up = r.growth >= 0;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-line last:border-0 hover:bg-[#F8FBFF] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-navy md:px-0 md:pl-2">{r.club}</td>
                    <td className="px-4 py-3 text-right text-text md:px-0">{inr(r.today)}</td>
                    <td className="px-4 py-3 text-right text-text md:px-0">{inr(r.week)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy md:px-0">
                      {inr(r.month)}
                    </td>
                    <td className="px-4 py-3 text-right md:px-0">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          up ? "text-positive" : "text-negative"
                        }`}
                      >
                        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {up ? "+" : ""}{r.growth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-xl font-bold text-navy md:text-2xl">{value}</div>
      <div className="mt-1 text-xs text-muted">{note}</div>
    </div>
  );
}