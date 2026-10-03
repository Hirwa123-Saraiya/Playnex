"use client";

import { Check, Star, Gift } from "lucide-react";
import { MembershipPlan } from "@/data/membershipData";

interface CardProps {
  plan: MembershipPlan;
  billingCycle: "monthly" | "annual";
}

export default function MembershipCard({ plan, billingCycle }: CardProps) {
  const isAnnual = billingCycle === "annual";
  const displayPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const annualSavings = plan.monthlyPrice ? plan.monthlyPrice * 12 - plan.annualPrice : null;

  return (
    <div
      className={`relative flex flex-col rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
        plan.popular
          ? "bg-slate-900/90 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/10 lg:-translate-y-2"
          : "bg-slate-900/50 border border-slate-800 hover:border-slate-700"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs px-4 py-1 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-slate-950" />
          MOST POPULAR
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
        <p className="text-xs text-slate-400 min-h-[32px]">{plan.tagline}</p>
      </div>

      <div className="mb-6 pb-6 border-b border-slate-800">
        {displayPrice !== null ? (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-white">
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-slate-400 text-sm font-medium">
              /{isAnnual ? "year" : "month"}
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">
              ₹{plan.annualPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-slate-400 text-sm font-medium">/year</span>
          </div>
        )}

        {isAnnual && annualSavings && annualSavings > 0 && (
          <span className="inline-block mt-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            Save ₹{annualSavings.toLocaleString("en-IN")} per year
          </span>
        )}
      </div>

      <ul className="space-y-3.5 mb-8 flex-1 text-sm text-slate-300">
        <li className="flex items-center gap-3">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><strong>{plan.discount}</strong> Member Shop/Café Discount</span>
        </li>
        <li className="flex items-center gap-3">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Court limit: <strong>{plan.bookingLimit}</strong></span>
        </li>
        <li className="flex items-center gap-3">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Priority Booking: <strong>{plan.bookingPriority}</strong></span>
        </li>
        <li className="flex items-center gap-3">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Guest Passes: <strong>{plan.guestPasses}</strong></span>
        </li>
      </ul>

      <div className="mb-6 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Gift className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200 block mb-0.5">Annual Perk:</span>
          <span className="text-slate-400">{plan.annualBonus}</span>
        </div>
      </div>

      <button
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${
          plan.popular
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20"
            : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
        }`}
      >
        Select {plan.name}
      </button>
    </div>
  );
}