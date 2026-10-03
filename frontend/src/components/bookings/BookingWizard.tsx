"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { CourtGrid } from "./CourtGrid";
import { SlotPicker } from "./SlotPicker";
import { BookingSummaryCard } from "./BookingSummaryCard";
import { SocialPlayParticipants } from "./SocialPlayParticipants";
import {
  canUserBookOnDate,
  isSlotAvailable,
  isSocialPlaySlot,
} from "@/lib/bookingRules";
import {
  fetchCourts, fetchSlots, fetchMyBookings, createBooking,
} from "@/services/bookingService";
import { useAuth } from "@/context/AuthContext";
import type {
  Booking, BookingMode, Court, MemberTier, Slot,
} from "@/types/booking.types";

const TODAY = new Date().toISOString().slice(0, 10);

interface Props {
  onBooked?: (booking: Booking) => void;
  onClose?: () => void;
  showBackLink?: boolean;
}

export function BookingWizard({ onBooked, onClose, showBackLink = false }: Props) {
  const { user, isLoading: authLoading } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [courts, setCourts] = useState<Court[]>([]);
  const [court, setCourt] = useState<Court | undefined>();
  const [date, setDate] = useState(TODAY);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slot, setSlot] = useState<Slot | undefined>();
  const [mode, setMode] = useState<BookingMode>("Standard");
  const [participants, setParticipants] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tier: MemberTier =
    user?.systemRole === "MEMBER" && user.tier
      ? (user.tier as MemberTier)
      : "WalkIn";

  const userId = user?.userId ?? "guest";

  useEffect(() => {
    fetchCourts().then(setCourts);
    if (userId !== "guest") {
      fetchMyBookings().then(setBookings);
    }
  }, [userId]);

  useEffect(() => {
    if (!court) return;
    fetchSlots(court.id, date).then(setSlots);
    setSlot(undefined);
  }, [court, date]);

  const availableSlots = useMemo(
    () => slots.filter((s) => isSlotAvailable(s, bookings)),
    [slots, bookings]
  );

  const limitCheck = useMemo(
    () => canUserBookOnDate(userId, date, bookings),
    [userId, date, bookings]
  );

  async function handleConfirm() {
    if (!court || !slot) return;
    setError(null);
    setSubmitting(true);
    try {
      const created = await createBooking({
        courtId: court.id,
        date,
        startTime: slot.startTime,
        mode,
        participants,
      });
      setStep(3);
      onBooked?.(created);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="rounded-xl border border-line bg-white p-8 text-center text-sm text-muted">
        Loading your account…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-line bg-white p-8 text-center text-sm text-muted">
        Please log in to book a court.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {showBackLink && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy"
        >
          <ArrowLeft size={14} /> Back
        </button>
      )}

      {/* Stepper */}
      <ol className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { n: 1, label: "Choose court" },
          { n: 2, label: "Pick slot" },
          { n: 3, label: "Confirm" },
        ].map(({ n, label }) => (
          <li key={n} className="flex items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                step >= n ? "bg-blue text-white" : "bg-line text-muted"
              }`}
            >
              {n}
            </span>
            <span className={step >= n ? "font-medium text-navy" : "text-muted"}>
              {label}
            </span>
            {n < 3 && <span className="mx-1 text-muted">·</span>}
          </li>
        ))}
      </ol>

      {/* Step 1 */}
      {step === 1 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-navy">Date</label>
            <input
              type="date"
              value={date}
              min={TODAY}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-text focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10"
            />
            {!limitCheck.ok && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-medium text-red-800">
                {limitCheck.reason}
              </span>
            )}
          </div>

          <CourtGrid
            courts={courts}
            selectedId={court?.id}
            onSelect={(c) => setCourt(c)}
          />

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!court || !limitCheck.ok}
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blueHover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* Step 2 */}
      {step === 2 && court && (
        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-navy">
                  {court.name} · {date}
                </h3>
                <span className="text-xs text-muted">
                  {availableSlots.length} available
                </span>
              </div>
              <SlotPicker
                slots={slots}
                selectedId={slot?.id}
                onSelect={(s) => {
                  setSlot(s);
                  setMode(
                    isSocialPlaySlot(s.date, s.startTime)
                      ? "SocialPlay"
                      : "Standard"
                  );
                  setParticipants([]);
                }}
              />
              {slot && isSocialPlaySlot(slot.date, slot.startTime) && (
                <div className="mt-3">
                  <p className="rounded-lg bg-blueSoft px-3 py-2 text-xs text-blue">
                    Friday-night social play — multiple players share this court.
                  </p>
                  <SocialPlayParticipants
                    participants={participants}
                    onChange={setParticipants}
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-1">
              <BookingSummaryCard
                court={court}
                slot={slot}
                date={date}
                mode={mode}
                tier={tier}
                participants={participants}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy hover:border-blue/40"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <button
              type="button"
              disabled={!slot}
              onClick={handleConfirm}
              className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blueHover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Booking…" : "Confirm booking"}
            </button>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </section>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <section className="rounded-xl border border-line bg-white p-6 text-center shadow-card">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={24} />
          </span>
          <h3 className="mt-4 text-lg font-bold text-navy">Booking confirmed</h3>
          <p className="mt-1 text-sm text-muted">
            {court?.name} · {date} · {slot?.startTime}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => onClose?.()}
              className="rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blueHover"
            >
              Done
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setCourt(undefined);
                setSlot(undefined);
                setParticipants([]);
              }}
              className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy hover:border-blue/40"
            >
              Book another
            </button>
          </div>
        </section>
      )}
    </div>
  );
}