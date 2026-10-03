"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TrialBookingForm } from "@/components/public/TrialBookingForm";

function TrialForm() {
  const params = useSearchParams();
  const plan = params.get("plan") ?? undefined;
  return <TrialBookingForm defaultPlan={plan} />;
}

export default function TrialPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Book a free trial
        </h1>
        <p className="mt-3 text-base text-muted">
          Come try the courts, meet the coaches, and see if it&apos;s a fit.
          No signup required — we&apos;ll reach out within 24 hours.
        </p>
      </header>

      <div className="mt-10">
        <Suspense fallback={<p className="text-center text-sm text-muted">Loading…</p>}>
          <TrialForm />
        </Suspense>
      </div>
    </div>
  );
}