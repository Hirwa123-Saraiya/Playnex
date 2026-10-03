"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { submitEnquiry } from "@/services/enquiryService";
import type {
  CreateEnquiryInput, EnquirySource, PlanInterest, PreferredContact,
} from "@/types/enquiry.types";

interface Props {
  source?: EnquirySource;
  /** Optional heading; defaults are fine for most placements. */
  title?: string;
  subtitle?: string;
}

const SPORTS = ["Tennis", "Cricket", "Padel", "Badminton", "Other"];

export function EnquiryForm({
  source = "LandingHero",
  title = "Book a free trial",
  subtitle = "We'll get back to you within 24 hours.",
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateEnquiryInput>({
    name: "",
    email: "",
    phone: "",
    preferredContact: "Email",
    sportInterest: "Tennis",
    planInterest: "Undecided",
    message: "",
    source,
  });

  function set<K extends keyof CreateEnquiryInput>(key: K, value: CreateEnquiryInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Name, email, and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      await submitEnquiry(form);
      setSubmitted(true);
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
        <h3 className="mt-4 text-xl font-bold">Thanks — we got it!</h3>
        <p className="mt-2 text-sm text-muted">
          Someone from the club will reach out within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-white p-6 sm:p-8"
    >
      <div className="mb-5">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>

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
            onChange={(e) => set("preferredContact", e.target.value as PreferredContact)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm"
          >
            <option>Email</option>
            <option>Phone</option>
            <option>WhatsApp</option>
          </select>
        </Field>
        <Field label="Sport of interest">
          <select
            value={form.sportInterest}
            onChange={(e) => set("sportInterest", e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm"
          >
            {SPORTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Plan interest">
          <select
            value={form.planInterest}
            onChange={(e) => set("planInterest", e.target.value as PlanInterest)}
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm"
          >
            <option value="Undecided">Not sure yet</option>
            <option value="Gold">Gold plan</option>
            <option value="Silver">Silver plan</option>
            <option value="Junior">Junior plan</option>
          </select>
        </Field>
      </div>

      <Field label="Your message *" className="mt-4">
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us what you're looking for — family membership, coaching, trial session…"
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
        {submitting ? "Sending…" : (<><Send size={15} /> Send enquiry</>)}
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