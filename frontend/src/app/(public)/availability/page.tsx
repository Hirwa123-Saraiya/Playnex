"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WeeklyAvailabilityGrid } from "@/components/public/WeeklyAvailabilityGrid";
import { fetchWeeklyAvailability } from "@/services/publicSiteService";
import type { DayAvailability } from "@/types/publicSite.types";

export default function AvailabilityPage() {
  const [week, setWeek] = useState<DayAvailability[]>([]);

  useEffect(() => {
    fetchWeeklyAvailability().then(setWeek);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          What&apos;s free this week
        </h1>
        <p className="mt-3 text-base text-muted">
          Live court availability across all sports. Pick a time and book a trial — no login needed.
        </p>
      </header>

      <section className="mt-12 rounded-2xl border border-line bg-white p-5 sm:p-6">
        {week.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">Loading…</p>
        ) : (
          <WeeklyAvailabilityGrid
            week={week}
            onPickSlot={(date, time) => {
              // Pre-fill the trial page with the chosen slot
              window.location.href = `/trial?date=${date}&time=${time}`;
            }}
          />
        )}
      </section>

      <div className="mt-8 text-center">
        <Link
          href="/trial"
          className="inline-flex items-center gap-2 rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white hover:bg-mossDark"
        >
          Book a trial session
        </Link>
      </div>
    </div>
  );
}