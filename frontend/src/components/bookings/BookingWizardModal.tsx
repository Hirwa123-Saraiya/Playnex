"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { BookingWizard } from "./BookingWizard";
import type { Booking } from "@/types/booking.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onBooked?: (booking: Booking) => void;
}

export function BookingWizardModal({ open, onClose, onBooked }: Props) {
  // Close on Esc
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative my-4 w-full max-w-3xl rounded-2xl border border-line bg-sand shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="text-lg font-bold">Book a court</h2>
            <p className="text-xs text-muted">
              Sessions last 1 hour · new slots every 30 min · max 2 per day
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white hover:border-moss/40"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <BookingWizard
            onClose={onClose}
            onBooked={(b) => {
              onBooked?.(b);
            }}
          />
        </div>
      </div>
    </div>
  );
}