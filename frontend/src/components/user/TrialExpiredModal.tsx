"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { trialIsActive } from "@/lib/trialRules";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TrialExpiredModal({ open, onClose }: Props) {
  const { user } = useAuth();

  if (!open) return null;
  if (!user || user.systemRole !== "MEMBER") return null;
  if (trialIsActive(user)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-popover">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-page hover:text-navy"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertTriangle size={22} />
        </div>

        <h2 className="text-lg font-bold text-navy">Your free trial has ended</h2>
        <p className="mt-2 text-sm text-muted">
          To keep booking courts, choose a membership plan. Your account and past bookings
          are safe — you just need a plan to make new reservations.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <Link
            href="/user?view=memberships"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue px-4 py-3 text-sm font-bold text-white hover:bg-blueHover"
          >
            Choose a plan <ArrowRight size={15} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-muted hover:border-blue/40 hover:text-navy"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}