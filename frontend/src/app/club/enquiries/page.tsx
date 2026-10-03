"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, AlertCircle, TrendingUp, Users, CheckCircle2,
} from "lucide-react";
import { EnquiryStatusBadge } from "@/components/enquiries/EnquiryStatusBadge";
import { fetchEnquiries } from "@/services/enquiryService";
import {
  computeStats, isFollowUpOverdue, SOURCE_LABEL,
} from "@/lib/enquiryRules";
import type { Enquiry, EnquiryStatus } from "@/types/enquiry.types";

const TABS: Array<"All" | EnquiryStatus> = [
  "All", "New", "Assigned", "Contacted", "Quoted", "Converted", "Lost",
];

export default function EnquiriesPage() {
  const [list, setList] = useState<Enquiry[]>([]);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchEnquiries().then(setList);
  }, []);

  const filtered = useMemo(() => {
    return list.filter((e) => {
      if (tab !== "All" && e.status !== tab) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
      );
    });
  }, [list, tab, query]);

  const stats = useMemo(() => computeStats(list), [list]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Enquiries</h1>
          <p className="text-sm text-muted">
            Leads and enquiries from the public site, phone, and walk-ins
          </p>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Stat icon={Users}       label="Total"      value={String(stats.total)} />
        <Stat icon={AlertCircle} label="New"        value={String(stats.new)} tone="warn" />
        <Stat icon={TrendingUp}  label="In progress" value={String(stats.inProgress)} />
        <Stat
          icon={CheckCircle2}
          label="Converted"
          value={`${stats.converted} · ${stats.conversionRate}%`}
          tone="positive"
        />
      </section>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone, message…"
            className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-moss/40"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              tab === t
                ? "border-moss bg-moss text-white"
                : "border-line bg-white text-muted hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <ul className="space-y-3">
        {filtered.map((e) => {
          const overdue = isFollowUpOverdue(e);
          return (
            <li key={e.id}>
              <Link
                href={`/club/enquiries/${e.id}`}
                className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-line bg-card p-4 transition-shadow hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{e.name}</span>
                    <EnquiryStatusBadge status={e.status} />
                    {overdue && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                        Overdue follow-up
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{e.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span>{SOURCE_LABEL[e.source]}</span>
                    <span>·</span>
                    <span>{e.sportInterest ?? "—"}</span>
                    <span>·</span>
                    <span>
                      Assigned: {e.assignedToName ?? "Unassigned"}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="rounded-xl border border-dashed border-line bg-card p-10 text-center text-sm text-muted">
            No enquiries match your filters.
          </li>
        )}
      </ul>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

function Stat({
  icon: Icon, label, value, tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "default" | "warn" | "positive";
}) {
  const toneClass =
    tone === "warn"
      ? "bg-amber-100 text-amber-800"
      : tone === "positive"
        ? "bg-lime/30 text-moss"
        : "bg-sand text-muted";
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
        <span className={`grid h-7 w-7 place-items-center rounded-md ${toneClass}`}>
          <Icon size={14} />
        </span>
        {label}
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
    </div>
  );
}