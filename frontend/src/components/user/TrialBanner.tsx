"use client";

import Link from "next/link";
import { Sparkles, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  trialIsActive,
  trialLabel,
  trialProgressPercent,
  trialUrgency,
} from "@/lib/trialRules";

export function TrialBanner() {
  const { user } = useAuth();

  if (!user || user.systemRole !== "MEMBER") return null;
  if (!trialIsActive(user)) return null;

  const urgency = trialUrgency(user);
  const label = trialLabel(user);
  const progress = trialProgressPercent(user);

  const tone =
    urgency === "critical"
      ? { bar: "bg-rose-500",     chip: "bg-rose-100 text-rose-700",       icon: <AlertTriangle size={14} /> }
      : urgency === "warning"
        ? { bar: "bg-amber-500",    chip: "bg-amber-100 text-amber-800",     icon: <Clock size={14} /> }
        : { bar: "bg-blue",         chip: "bg-blueSoft text-blue",           icon: <Sparkles size={14} /> };

  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tone.chip}`}>
            {tone.icon}
            7-day free trial
          </span>
          <span className="truncate text-xs font-medium text-text sm:text-sm">{label}</span>
        </div>

        <Link
          href="/user?view=memberships"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-blueHover"
        >
          Choose a plan <ArrowRight size={13} />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-line">
        <div
          className={`h-full ${tone.bar} transition-all`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}