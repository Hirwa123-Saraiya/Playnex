"use client";

import { useEffect, useState } from "react";
import { PlanCard } from "@/components/public/PlanCard";
import { fetchPlans } from "@/services/publicSiteService";
import type { PublicPlan } from "@/types/publicSite.types";

export default function PlansPage() {
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  useEffect(() => {
    fetchPlans().then(setPlans);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Plans & pricing
        </h1>
        <p className="mt-3 text-base text-muted">
          Pick a plan that fits. Upgrade, downgrade, or cancel anytime.
        </p>

        <div className="mt-6 inline-flex rounded-lg border border-line bg-white p-1 text-sm">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-md px-4 py-1.5 font-medium ${
              billing === "monthly" ? "bg-moss text-white" : "text-muted hover:text-text"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`rounded-md px-4 py-1.5 font-medium ${
              billing === "annual" ? "bg-moss text-white" : "text-muted hover:text-text"
            }`}
          >
            Annual <span className="ml-1 text-[10px] text-lime">Save 2 months</span>
          </button>
        </div>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <PlanCard key={p.tier} plan={p} billing={billing} />
        ))}
      </div>

      <p className="mt-12 text-center text-xs text-muted">
        All prices in INR. Taxes as applicable. Walk-in guests pay a day rate at the front desk.
      </p>
    </div>
  );
}