"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Trophy, Plus, Users, Loader2 } from "lucide-react";
import { eventsService, ClubEventItem } from "@/services/events.service";

const STATUS_STYLE: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-800",
  ongoing: "bg-emerald-100 text-emerald-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function EventsPage() {
  const [events, setEvents] = useState<ClubEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("All");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsService.getAllEvents();
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filtered = useMemo(
    () => events.filter((e) => status === "All" || e.status.toLowerCase() === status.toLowerCase()),
    [events, status]
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Platform Events & Tournaments</h1>
          <p className="text-xs text-muted sm:text-sm">
            {events.length} dynamic events across all registered clubs
          </p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {["All", "Upcoming", "Ongoing", "Completed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              status.toLowerCase() === s.toLowerCase()
                ? "border-moss bg-moss text-white"
                : "border-line bg-white text-muted hover:text-text"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-moss" size={32} />
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e) => {
            const slots = e.maxParticipants || 1;
            const filled = e.registeredCount || 0;
            const pct = Math.min(100, Math.round((filled / slots) * 100));
            return (
              <div
                key={e.id}
                className="rounded-xl border border-line bg-card p-4 sm:p-5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-moss/10 text-moss">
                      <Trophy size={18} />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-semibold leading-tight text-ink">
                        {e.title}
                      </div>
                      <div className="mt-0.5 truncate text-xs font-medium text-moss">
                        {e.club || "Club Event"} {e.sport ? `• ${e.sport}` : ""}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                      STATUS_STYLE[e.status.toLowerCase()] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {e.status}
                  </span>
                </div>

                {e.description && (
                  <p className="mt-3 text-xs text-muted line-clamp-2">
                    {e.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4 text-xs">
                  <div className="flex items-center gap-1 text-muted">
                    <CalendarDays size={13} /> {e.eventDate} ({e.startTime} - {e.endTime})
                  </div>
                  <div className="flex items-center gap-1 text-muted">
                    <Users size={13} /> {filled}/{slots}
                  </div>
                  {Number(e.entryFee) > 0 && (
                    <div className="font-semibold text-moss">
                      ₹{e.entryFee} entry
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-moss transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-[11px] font-semibold text-muted">
                    {pct}% filled
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-line bg-card p-12 text-center text-sm text-muted">
              <Trophy className="mx-auto mb-2 text-moss/50" size={32} />
              <div className="font-semibold text-ink">No events found</div>
              <div className="mt-1 text-xs text-muted">
                {status === "All"
                  ? "Clubs have not scheduled any tournaments or events yet."
                  : `No ${status.toLowerCase()} events scheduled.`}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}