"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { annualMonthly, annualSavingsPercent, inr } from "@/lib/publicSiteRules";
import type { PublicPlan } from "@/types/publicSite.types";

export function PlanCard({
  plan, billing,
}: {
  plan: PublicPlan;
  billing: "monthly" | "annual";
}) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  const savings = billing === "annual" ? annualSavingsPercent(plan) : 0;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 ${
        plan.popular
          ? "border-moss bg-sand shadow-lg"
          : "border-line bg-white"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-semibold text-ink">
          Most popular
        </span>
      )}

      <h3 className="text-lg font-bold">{plan.tier}</h3>
      <p className="mt-1 text-sm text-muted">{plan.tagline}</p>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-3xl font-bold">{inr(price)}</span>
        <span className="text-sm text-muted">
          / {billing === "monthly" ? "month" : "year"}
        </span>
      </div>
      {billing === "annual" && savings > 0 && (
        <p className="mt-1 text-xs text-positive">
          Save {savings}% · {inr(annualMonthly(plan.annualPrice))}/mo effective
        </p>
      )}

      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {plan.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2">
            <Check size={15} className="mt-0.5 shrink-0 text-moss" />
            {h}
          </li>
        ))}
      </ul>

      {plan.note && <p className="mt-4 text-xs text-muted">{plan.note}</p>}

      <Link
        href={`/trial?plan=${plan.tier}`}
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${
          plan.popular
            ? "bg-moss text-white hover:bg-mossDark"
            : "border border-line bg-white text-text hover:border-moss/40"
        }`}
      >
        Start with {plan.tier} <ArrowRight size={14} />
      </Link>
    </div>
  );
}