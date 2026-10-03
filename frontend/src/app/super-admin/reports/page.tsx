"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { FileText, Download, TrendingUp, Users, Building2, Wallet } from "lucide-react";
import { inr } from "@/lib/mockData";
import { clubsService, type PlatformStats } from "@/services/clubs.service";

const REPORTS = [
  { title: "Monthly revenue report", note: "All clubs · Live database sync", size: "1.2 MB", format: "PDF" },
  { title: "Membership growth",      note: "Rolling active members",         size: "860 KB", format: "CSV" },
  { title: "Club onboarding report", note: "Registered tenants",             size: "420 KB", format: "PDF" },
  { title: "Booking utilisation",    note: "All clubs · Live slot log",      size: "1.8 MB", format: "CSV" },
];

export default function ReportsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await clubsService.getStats();
        if (isMounted && res.success && res.data) {
          setStats(res.data);
        }
      } catch (e) {
        console.error("Failed to load reports stats:", e);
      }
    }
    loadStats();
    return () => { isMounted = false; };
  }, []);

  const totalClubs = stats?.total_clubs || 0;
  const totalUsers = stats?.total_members || 0;
  const totalRevenue = Number(stats?.today_revenue || 0);

  return (
    <div className="space-y-5 md:space-y-6">
      <header>
        <h1 className="text-xl font-bold text-navy sm:text-2xl md:text-3xl">Reports</h1>
        <p className="text-xs text-muted sm:text-sm">
          Generate and download platform reports from PostgreSQL database
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Clubs"           value={String(totalClubs)} icon={Building2} />
        <Kpi label="Users"           value={totalUsers.toLocaleString("en-IN")} icon={Users} />
        <Kpi label="Platform revenue" value={inr(totalRevenue)}        icon={Wallet} />
        <Kpi label="Growth"          value="Active"                 icon={TrendingUp} />
      </div>

      <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
        <h2 className="mb-4 text-base font-bold text-navy">Available reports</h2>
        <ul className="divide-y divide-line">
          {REPORTS.map((r) => (
            <li
              key={r.title}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blueSoft text-blue">
                  <FileText size={16} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-navy">{r.title}</div>
                  <div className="truncate text-xs text-muted">
                    {r.note} · {r.format} · {r.size}
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-navy hover:border-blue/40">
                <Download size={13} /> Download
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-3 shadow-card sm:p-4">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-[11px]">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-blueSoft text-blue">
          <Icon size={14} />
        </span>
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-2 text-lg font-bold text-navy sm:mt-3 sm:text-2xl">{value}</div>
    </div>
  );
}