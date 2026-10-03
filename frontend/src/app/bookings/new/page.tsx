"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { BookingWizard } from "@/components/bookings/BookingWizard";

export default function NewBookingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 md:p-6">
      <button
        type="button"
        onClick={() => router.push("/bookings")}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> Back to bookings
      </button>

      <header>
        <h1 className="text-2xl font-bold md:text-3xl">Book a court</h1>
        <p className="text-sm text-muted">
          Sessions last 1 hour · new slots every 30 min · max 2 per day
        </p>
      </header>

      <BookingWizard
        onClose={() => router.push("/bookings")}
        onBooked={() => router.push("/bookings")}
      />
    </div>
  );
}