"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { submitTrialBooking } from "@/services/publicSiteService";
import { SPORTS_LIST } from "@/mock/publicSiteMockData";
import type { TrialBookingInput } from "@/types/publicSite.types";

interface Props {
  /** Pre-selected plan from ?plan= on the URL. */
  defaultPlan?: string;
}

const CONTACT_METHODS: TrialBookingInput["preferredContact"][] = [
  "Email", "Phone", "WhatsApp",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Deterministic formatter — same output on server and client. */
function formatOptionDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function next7Days(): string[] {
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function slotTimes(): string[] {
  const out: string[] = [];
  for (let h = 6; h < 22; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
}

export function TrialBookingForm({ defaultPlan }: Props) {
  const days = next7Days();
  const times = slotTimes();

  const [submitted, setSubmitted] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<TrialBookingInput>({
    name: "",
    email: "",
    phone: "",
    preferredContact: "Email",
    sport: "Tennis",
    preferredDate: days[1],
    preferredTime: "18:00",
    message: defaultPlan ? `I'd like to try the ${defaultPlan} plan.` : "",
  });

  function set<K extends keyof TrialBookingInput>(k: K, v: TrialBookingInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitTrialBooking(form);
      setSubmitted(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-lime/40 text-moss">
          <CheckCircle2 size={24} />
        </span>
        <h3 className="mt-4 text-xl font-bold">You&apos;re on the list!</h3>
        <p className="mt-2 text-sm text-muted">{submitted}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name *">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-moss/40"
          />
        </Field>
        <Field label="Email *">
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-moss/40"
          />
        </Field>
        <Field label="Phone">
          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-moss/40"
          />
        </Field>
        <Field label="Preferred contact">
          <select
            value={form.preferredContact}
            onChange={(e) =>
              set("preferredContact", e.target.value as TrialBookingInput["preferredContact"])
            }
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm"
          >
            {CONTACT_METHODS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Sport">
          <select
            value={form.sport}
            onChange={(e) => set("sport", e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm"
          >
            {SPORTS_LIST.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred date">
          <select
            value={form.preferredDate}
            onChange={(e) => set("preferredDate", e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {formatOptionDate(d)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred time" className="sm:col-span-2">
          <select
            value={form.preferredTime}
            onChange={(e) => set("preferredTime", e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm"
          >
            {times.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Anything we should know?" className="mt-4">
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Coaching needs, family members joining, preferred sport…"
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-moss/40"
        />
      </Field>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white hover:bg-mossDark disabled:opacity-50"
      >
        {submitting ? "Booking…" : (<><Send size={15} /> Book my trial</>)}
      </button>
    </form>
  );
}

function Field({
  label, children, className = "",
}: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}