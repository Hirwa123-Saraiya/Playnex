"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, User, Mail, Phone, MessageSquare,
  Send, CheckCircle2, XCircle,
} from "lucide-react";
import { EnquiryStatusBadge } from "@/components/enquiries/EnquiryStatusBadge";
import { QuoteBuilder } from "@/components/enquiries/QuoteBuilder";
import { FollowUpPicker } from "@/components/enquiries/FollowUpPicker";
import { AssignStaffSelect } from "@/components/enquiries/AssignStaffSelect";
import {
  fetchEnquiry, fetchStaff, updateEnquiry, convertToMember,
} from "@/services/enquiryService";
import {
  ALLOWED_TRANSITIONS, PLAN_LABEL, SOURCE_LABEL,
} from "@/lib/enquiryRules";
import type {
  Enquiry, StaffMember, UpdateEnquiryInput,
} from "@/types/enquiry.types";

export default function EnquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [noteText, setNoteText] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const [e, s] = await Promise.all([fetchEnquiry(id), fetchStaff()]);
    setEnquiry(e);
    setStaff(s);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function patch(input: UpdateEnquiryInput) {
    if (!enquiry) return;
    setBusy(true);
    try {
      const updated = await updateEnquiry(enquiry.id, input);
      setEnquiry(updated);
    } finally {
      setBusy(false);
    }
  }

  async function handleConvert() {
    if (!enquiry) return;
    setBusy(true);
    try {
      const result = await convertToMember(enquiry.id);
      const updated = await updateEnquiry(enquiry.id, {
        status: "Converted",
        convertedAt: new Date().toISOString(),
        convertedMemberId: result.memberId,
      });
      setEnquiry(updated);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!enquiry) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-sm text-muted">Loading…</div>
    );
  }

  const nextStatuses = ALLOWED_TRANSITIONS[enquiry.status] ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 md:p-6">
      <Link
        href="/club/enquiries"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-text"
      >
        <ArrowLeft size={14} /> Back to enquiries
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold md:text-3xl">{enquiry.name}</h1>
          <p className="mt-1 text-sm text-muted">
            From {SOURCE_LABEL[enquiry.source]} · {PLAN_LABEL[enquiry.planInterest]}
          </p>
        </div>
        <EnquiryStatusBadge status={enquiry.status} />
      </header>

      {/* Contact */}
      <section className="rounded-xl border border-line bg-card p-5">
        <h2 className="text-sm font-bold">Contact</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <User size={14} className="text-muted" /> {enquiry.name}
          </li>
          <li className="flex items-center gap-2">
            <Mail size={14} className="text-muted" /> {enquiry.email}
          </li>
          <li className="flex items-center gap-2">
            <Phone size={14} className="text-muted" /> {enquiry.phone || "—"}
          </li>
          <li className="flex items-center gap-2">
            <MessageSquare size={14} className="text-muted" /> Prefers {enquiry.preferredContact}
          </li>
        </ul>
        <p className="mt-4 rounded-lg bg-sand/60 px-3 py-2 text-sm">
          &ldquo;{enquiry.message}&rdquo;
        </p>
      </section>

      {/* Pipeline controls */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-card p-5">
          <h3 className="text-sm font-bold">Assign to</h3>
          <AssignStaffSelect
            staff={staff}
            value={enquiry.assignedToId}
            onChange={(staffId) => patch({ assignedToId: staffId })}
          />
        </div>

        <div className="rounded-xl border border-line bg-card p-5">
          <h3 className="text-sm font-bold">Follow-up</h3>
          <FollowUpPicker
            value={enquiry.followUpAt}
            onChange={(iso) => patch({ followUpAt: iso })}
          />
        </div>
      </section>

      {/* Status actions */}
      <section className="rounded-xl border border-line bg-card p-5">
        <h3 className="text-sm font-bold">Move to</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {nextStatuses.length === 0 && (
            <p className="text-sm text-muted">No further transitions.</p>
          )}
          {nextStatuses.map((s) => {
            const isConvert = s === "Converted";
            return (
              <button
                key={s}
                disabled={busy}
                onClick={() => (isConvert ? handleConvert() : patch({ status: s }))}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                  isConvert
                    ? "border-lime bg-lime/30 text-moss hover:bg-lime/50"
                    : s === "Lost"
                      ? "border-red-300 text-red-700 hover:bg-red-50"
                      : "border-line bg-white hover:border-moss/40"
                }`}
              >
                {isConvert && <CheckCircle2 size={12} className="mr-1 inline" />}
                {s === "Lost" && <XCircle size={12} className="mr-1 inline" />}
                Mark as {s}
              </button>
            );
          })}
        </div>
      </section>

      {/* Quote builder */}
      {["Contacted", "Quoted"].includes(enquiry.status) && (
        <section className="rounded-xl border border-line bg-card p-5">
          <h3 className="text-sm font-bold">Quote</h3>
          <QuoteBuilder
            currentAmount={enquiry.quoteAmount}
            planInterest={enquiry.planInterest}
            onSend={(amount) =>
              patch({
                quoteAmount: amount,
                quoteSentAt: new Date().toISOString(),
                status: enquiry.status === "Contacted" ? "Quoted" : enquiry.status,
              })
            }
          />
        </section>
      )}

      {/* Notes */}
      <section className="rounded-xl border border-line bg-card p-5">
        <h3 className="text-sm font-bold">Activity</h3>
        <ul className="mt-3 space-y-3">
          {enquiry.notes.map((n) => (
            <li key={n.id} className="rounded-lg bg-sand/60 p-3">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="font-medium">{n.authorName}</span>
                <span>{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-sm">{n.text}</p>
            </li>
          ))}
          {enquiry.notes.length === 0 && (
            <li className="text-sm text-muted">No notes yet.</li>
          )}
        </ul>

        <div className="mt-4 flex gap-2">
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note…"
            className="h-10 flex-1 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-moss/40"
          />
          <button
            type="button"
            disabled={!noteText.trim() || busy}
            onClick={async () => {
              await patch({ noteText });
              setNoteText("");
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-moss px-3 py-2 text-sm font-semibold text-white hover:bg-mossDark disabled:opacity-40"
          >
            <Send size={14} /> Add
          </button>
        </div>
      </section>
    </div>
  );
}