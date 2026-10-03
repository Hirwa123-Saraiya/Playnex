"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, CalendarDays, Clock, MapPin, Users, Wallet, XCircle,
} from "lucide-react";
import { CancelBookingModal } from "@/components/bookings/CancelBookingModal";
import { fetchMyBookings, cancelBooking } from "@/services/bookingService";
import { refundFor } from "@/lib/bookingRules";
import type { Booking } from "@/types/booking.types";

const STATUS_STYLE: Record<string, string> = {
  Confirmed: "bg-lime text-ink",
  Completed: "bg-sand text-muted",
  Cancelled: "bg-red-100 text-red-800",
  NoShow:    "bg-amber-100 text-amber-800",
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const all = await fetchMyBookings();
      setBooking(all.find((b) => b.id === id) ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-sm text-muted">Loading…</div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-text"
        >
          <ArrowLeft size={14} /> Back to bookings
        </Link>
        <div className="rounded-xl border border-dashed border-line bg-card p-10 text-center">
          <p className="text-lg font-semibold">Booking not found</p>
          <p className="mt-1 text-sm text-muted">
            It may have been cancelled or removed.
          </p>
        </div>
      </div>
    );
  }

  const canCancel = booking.status === "Confirmed";
  const policy = refundFor(booking);

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 md:p-6">
      <Link
        href="/bookings"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> Back to bookings
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold md:text-3xl">{booking.courtName}</h1>
          <p className="text-sm text-muted">{booking.sport}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[booking.status]}`}
        >
          {booking.status}
        </span>
      </header>

      <section className="rounded-xl border border-line bg-card p-5">
        <dl className="space-y-3 text-sm">
          <Row icon={<CalendarDays size={14} />} label="Date" value={booking.date} />
          <Row
            icon={<Clock size={14} />}
            label="Time"
            value={`${booking.startTime} – ${booking.endTime}`}
          />
          <Row
            icon={<MapPin size={14} />}
            label="Mode"
            value={booking.mode === "SocialPlay" ? "Social play" : "Standard"}
          />
          {booking.mode === "SocialPlay" && booking.participants.length > 0 && (
            <Row
              icon={<Users size={14} />}
              label="Players"
              value={`You + ${booking.participants.join(", ")}`}
            />
          )}
          <Row
            icon={<Wallet size={14} />}
            label="Paid"
            value={`₹${booking.amount} · ${booking.paymentMethod}`}
          />
        </dl>
      </section>

      {canCancel && (
        <section className="rounded-xl border border-line bg-card p-5">
          <h2 className="text-sm font-bold">Cancellation policy</h2>
          <p className="mt-1 text-xs text-muted">{policy.reason}</p>
          <button
            type="button"
            onClick={() => setShowCancel(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            <XCircle size={15} /> Cancel booking
          </button>
        </section>
      )}

      {!canCancel && booking.status === "Cancelled" && booking.cancelledAt && (
        <p className="text-xs text-muted">
          Cancelled on {new Date(booking.cancelledAt).toLocaleString()}
        </p>
      )}

      {showCancel && (
        <CancelBookingModal
          booking={booking}
          onClose={() => setShowCancel(false)}
          onConfirm={async (reason) => {
            await cancelBooking(booking.id, reason);
            await load();
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function Row({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-muted">
        {icon} <span>{label}</span>
      </dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}