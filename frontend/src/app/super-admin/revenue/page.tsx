"use client";

import { useState, useEffect } from "react";
import { Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { inr } from "@/lib/mockData";
import { clubsService, type ClubRevenueItem, type PlatformStats } from "@/services/clubs.service";

export default function RevenuePage() {
  const [revenueList, setRevenueList] = useState<ClubRevenueItem[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchRevenue() {
      try {
        const [revRes, statsRes] = await Promise.all([
          clubsService.getRevenue(),
          clubsService.getStats(),
        ]);
        if (isMounted) {
          if (revRes.success && revRes.data?.revenueByClub) {
            setRevenueList(revRes.data.revenueByClub);
          }
          if (statsRes.success && statsRes.data) {
            setStats(statsRes.data);
          }
        }
      } catch (e) {
        console.error("Failed to load revenue data:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchRevenue();
    return () => { isMounted = false; };
  }, []);

  const total = revenueList.reduce((s, c) => s + Number(c.month || 0), 0);
  const weekTotal = revenueList.reduce((s, c) => s + Number(c.week || 0), 0);
  const todayTotal = stats?.today_revenue ? Number(stats.today_revenue) : revenueList.reduce((s, c) => s + Number(c.today || 0), 0);

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Revenue</h1>
          <p className="text-xs text-muted sm:text-sm">
            Platform-wide revenue across all clubs (Live PostgreSQL sync)
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-text hover:border-moss/40">
          <Download size={15} /> <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Stat label="This month"  value={inr(total)}     note="All clubs combined" />
        <Stat label="Last 7 days" value={inr(weekTotal)} note="Trailing week" />
        <Stat label="Today"       value={inr(todayTotal)} note="Live as of now" />
      </div>

      <section className="rounded-xl border border-line bg-card p-6 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-lime/30 text-moss">
            <DollarSign size={24} />
          </div>
          <h2 className="text-base font-bold">Live Transaction Tracking</h2>
          <p className="mt-1 text-xs text-muted">
            All member court bookings, equipment rentals, tabs, and subscription plans across all tenants are automatically tracked in the PostgreSQL database.
          </p>
        </div>
      </section>
      <section className="rounded-xl border border-line bg-card p-4 md:p-5">
        <h2 className="mb-4 text-base font-bold">Revenue by club</h2>
        <div className="-mx-4 overflow-x-auto md:mx-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-2 font-medium md:px-0">Club</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">Today</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">Last 7 days</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">This month</th>
                <th className="px-4 py-2 text-right font-medium md:px-0">Growth</th>
              </tr>
            </thead>
            <tbody>
              {revenueList.map((r) => {
                const up = r.growth >= 0;
                return (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium md:px-0">{r.club}</td>
                    <td className="px-4 py-3 text-right md:px-0">{inr(Number(r.today || 0))}</td>
                    <td className="px-4 py-3 text-right md:px-0">{inr(Number(r.week || 0))}</td>
                    <td className="px-4 py-3 text-right font-semibold md:px-0">
                      {inr(Number(r.month || 0))}
                    </td>
                    <td className="px-4 py-3 text-right md:px-0">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          up ? "text-positive" : "text-negative"
                        }`}
                      >
                        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {up ? "+" : ""}
                        {r.growth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {revenueList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No club revenue records yet. Bookings will show live metrics here.
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

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4 md:p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </div>
      <div className="mt-1 text-xl font-bold md:text-2xl">{value}</div>
      <div className="mt-1 text-xs text-muted">{note}</div>
    </div>
  );
}