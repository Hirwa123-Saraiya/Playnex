"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Trophy, Plus, Users } from "lucide-react";
import { events, type EventStatus } from "@/lib/mockData";

const STATUS_STYLE: Record<EventStatus, string> = {
  Upcoming:  "bg-blue-100 text-blue-800",
  Live:      "bg-lime text-ink",
  Completed: "bg-sand text-muted",
};

export default function EventsPage() {
  const [status, setStatus] = useState<"All" | EventStatus>("All");

  const filtered = useMemo(
    () => events.filter((e) => status === "All" || e.status === status),
    [status]
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Events</h1>
          <p className="text-xs text-muted sm:text-sm">
            {events.length} events across all clubs
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-mossDark">
          <Plus size={16} /> Create event
        </button>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["All", "Upcoming", "Live", "Completed"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              status === s
                ? "border-moss bg-moss text-white"
                : "border-line bg-white text-muted hover:text-text"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => {
          const pct = Math.round((e.filled / e.slots) * 100);
          return (
            <div
              key={e.id}
              className="rounded-xl border border-line bg-card p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-moss/10 text-moss">
                    <Trophy size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold leading-tight">
                      {e.title}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted">
                      {e.club}
                    </div>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[e.status]}`}
                >
                  {e.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4 text-xs">
                <div className="flex items-center gap-1 text-muted">
                  <CalendarDays size={13} /> {e.date}
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <Users size={13} /> {e.filled}/{e.slots}
                </div>
              </div>

              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-moss"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 text-right text-[11px] font-semibold">
                  {pct}% filled
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-line bg-card p-8 text-center text-sm text-muted">
            No events in this category.
          </div>
        )}
      </div>
    </div>
  );
}