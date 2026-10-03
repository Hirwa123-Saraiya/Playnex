"use client";

import { Sparkles } from "lucide-react";

interface MembershipHeroProps {
  billingCycle: "monthly" | "annual";
  setBillingCycle: (cycle: "monthly" | "annual") => void;
}

export default function MembershipHero({ billingCycle, setBillingCycle }: MembershipHeroProps) {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-slate-950">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          PREMIUM SPORTS CLUB MEMBERSHIP
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
          Membership Built Around <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Your Performance & Game
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 font-normal leading-relaxed mb-10">
          Unlock priority court access, exclusive member discounts on shop & dining, complimentary guest passes, and tournament entries.
        </p>

        <div className="inline-flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-slate-800 text-white shadow-md border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Monthly Billing
          </button>
          
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              billingCycle === "annual"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-slate-950/80 text-emerald-400 border border-emerald-500/30">
              SAVE UP TO 20%
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}