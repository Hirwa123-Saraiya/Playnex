"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";
import { fetchMyBookings } from "@/services/bookingService";
import { BookingWizardModal } from "@/components/bookings/BookingWizardModal";
import type { Booking } from "@/types/booking.types";

const STATUS_STYLE: Record<string, string> = {
  Confirmed: "bg-blue text-white",
  Completed: "bg-page text-muted",
  Cancelled: "bg-red-100 text-red-800",
  NoShow:    "bg-amber-100 text-amber-800",
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<"Upcoming" | "Past" | "Cancelled">("Upcoming");
  const [wizardOpen, setWizardOpen] = useState(false);

  async function load() {
    const data = await fetchMyBookings();
    setBookings(data);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = bookings.filter((b) => {
    if (tab === "Upcoming") return b.status === "Confirmed";
    if (tab === "Past") return b.status === "Completed";
    return b.status === "Cancelled" || b.status === "NoShow";
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy md:text-3xl">My bookings</h1>
          <p className="text-sm text-muted">Your court reservations</p>
        </div>
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blueHover"
        >
          <Plus size={16} /> Book a court
        </button>
      </header>

      <div className="flex gap-2">
        {(["Upcoming", "Past", "Cancelled"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              tab === t
                ? "border-blue bg-blue text-white"
                : "border-line bg-white text-muted hover:text-navy"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.map((b) => (
          <li
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-4 shadow-card"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/bookings/${b.id}`}
                  className="truncate font-semibold text-navy hover:underline"
                >
                  {b.courtName}
                </Link>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[b.status]}`}
                >
                  {b.status}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={12} /> {b.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} /> {b.startTime}–{b.endTime}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} /> {b.sport}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-navy">₹{b.amount}</div>
              <div className="text-[11px] text-muted">{b.paymentMethod}</div>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
            No {tab.toLowerCase()} bookings.
          </li>
        )}
      </ul>

      <BookingWizardModal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onBooked={() => {
          load();
        }}
      />
    </div>
  );
}