"use client";

import { CalendarDays, Clock, MapPin, User, Users } from "lucide-react";
import type { BookingMode, Court, MemberTier, Slot } from "@/types/booking.types";
import { priceForBooking, PRICING, refundFor } from "@/lib/bookingRules";

interface Props {
  court?: Court;
  slot?: Slot;
  date: string;
  mode: BookingMode;
  tier: MemberTier;
  participants: string[];
}

export function BookingSummaryCard({
  court, slot, date, mode, tier, participants,
}: Props) {
  if (!court || !slot) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-card p-5 text-sm text-muted">
        Pick a court and a slot to see your booking summary.
      </div>
    );
  }

  const amount = priceForBooking(tier, 60);
  const rule = PRICING[tier];

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <h3 className="text-base font-bold">Booking summary</h3>

      <dl className="mt-4 space-y-3 text-sm">
        <Row icon={<MapPin size={14} />} label="Court"      value={court.name} />
        <Row icon={<CalendarDays size={14} />} label="Date" value={date} />
        <Row icon={<Clock size={14} />} label="Time"        value={`${slot.startTime} – ${slot.endTime}`} />
        <Row icon={<User size={14} />} label="Play mode"    value={mode === "SocialPlay" ? "Social play" : "Standard"} />
        {mode === "SocialPlay" && (
          <Row
            icon={<Users size={14} />}
            label="Players"
            value={`You + ${participants.length}`}
          />
        )}
      </dl>

      <div className="mt-5 border-t border-line pt-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Rate ({rule.tier})</span>
          <span>₹{rule.ratePerHour}/hr</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>Tier discount</span>
          <span>−{rule.discountPercent}%</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium">Payable</span>
          <span className="text-xl font-bold">₹{amount}</span>
        </div>
        <p className="mt-2 text-[11px] text-muted">
          {refundFor({} as any).reason /* placeholder — will compute per booking */}
        </p>
      </div>
    </div>
  );
}

function Row({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-muted">
        {icon}
        <span>{label}</span>
      </dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}