"use client";

import { useState } from "react";
import type { Booking } from "@/types/booking.types";
import { refundAmount, refundFor } from "@/lib/bookingRules";
import { X } from "lucide-react";

interface Props {
  booking: Booking;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
}

export function CancelBookingModal({ booking, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const policy = refundFor(booking);
  const refund = refundAmount(booking);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-card p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold">Cancel booking?</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-lg border border-line"
          >
            <X size={14} />
          </button>
        </div>

        <p className="mt-2 text-sm text-muted">
          {booking.courtName} · {booking.date} · {booking.startTime}
        </p>

        <div className="mt-4 rounded-lg bg-sand/60 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Paid</span>
            <span className="font-medium">₹{booking.amount}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-muted">Refund</span>
            <span className="font-medium">₹{refund}</span>
          </div>
          <p className="mt-2 text-[11px] text-muted">{policy.reason}</p>
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-medium text-muted">
            Reason (optional)
          </span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-moss/40"
          />
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium"
          >
            Keep booking
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              try {
                await onConfirm(reason || undefined);
                onClose();
              } finally {
                setSubmitting(false);
              }
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {submitting ? "Cancelling…" : "Cancel booking"}
          </button>
        </div>
      </div>
    </div>
  );
}