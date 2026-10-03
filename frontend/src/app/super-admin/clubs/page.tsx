"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2, MapPin, Users, CalendarCheck, Wallet, Plus, Search,
} from "lucide-react";
import { clubs, inr, type ClubStatus } from "@/lib/mockData";

const STATUS_STYLE: Record<ClubStatus, string> = {
  Active:    "bg-lime text-ink",
  Pending:   "bg-amber-100 text-amber-800",
  Suspended: "bg-red-100 text-red-800",
};

export default function ClubsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | ClubStatus>("All");

  const filtered = useMemo(
    () =>
      clubs.filter(
        (c) =>
          (status === "All" || c.status === status) &&
          (c.name + c.sport + c.location).toLowerCase().includes(query.toLowerCase())
      ),
    [query, status]
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Clubs</h1>
          <p className="text-xs text-muted sm:text-sm">
            {clubs.length} clubs on Playnex · manage access, location, and status
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-mossDark">
          <Plus size={16} /> Add club
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full min-w-0 md:max-w-sm md:flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search club, sport or location"
            className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-moss/40"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "All" | ClubStatus)}
          className="h-10 rounded-lg border border-line bg-white px-3 text-sm"
        >
          <option>All</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Suspended</option>
        </select>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/super-admin/clubs/${c.id}`}
            className="group flex flex-col rounded-xl border border-line bg-card p-4 transition-shadow hover:shadow-md sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-moss/10 text-moss">
                  <Building2 size={18} />
                </span>
                <div className="min-w-0">
                  <div className="truncate font-semibold leading-tight group-hover:underline">
                    {c.name}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted">
                    {c.sport}
                  </div>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[c.status]}`}
              >
                {c.status}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs text-muted">
              <MapPin size={12} /> <span className="truncate">{c.location}</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-xs">
              <div>
                <div className="flex items-center gap-1 text-muted">
                  <Users size={12} /> Members
                </div>
                <div className="mt-1 text-base font-semibold">{c.members}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted">
                  <CalendarCheck size={12} /> Today
                </div>
                <div className="mt-1 text-base font-semibold">
                  {c.bookingsToday}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted">
                  <Wallet size={12} /> Month
                </div>
                <div className="mt-1 text-base font-semibold">
                  {inr(c.revenue)}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end border-t border-line pt-3 text-xs">
              <span className="font-medium text-moss group-hover:underline">
                View details →
              </span>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-line bg-card p-8 text-center text-sm text-muted">
            No clubs match your search.
          </div>
        )}
      </div>
    </div>
  );
}