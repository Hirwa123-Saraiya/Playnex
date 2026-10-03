"use client";

import { useState } from "react";
import { Save, Bell, Globe, Lock } from "lucide-react";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("Playnex");
  const [supportEmail, setSupportEmail] = useState("support@playnex.app");
  const [platformFee, setPlatformFee] = useState("5");

  const [toggles, setToggles] = useState({
    emailNotifs: true,
    smsNotifs: false,
    autoApprove: false,
    publicSignup: true,
  });

  const flip = (k: keyof typeof toggles) =>
    setToggles((t) => ({ ...t, [k]: !t[k] }));

  return (
    <div className="space-y-5 md:space-y-6">
      <header>
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Settings</h1>
        <p className="text-xs text-muted sm:text-sm">
          Platform-wide configuration
        </p>
      </header>

      <section className="rounded-xl border border-line bg-card p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Globe size={16} className="text-moss" />
          <h2 className="text-base font-bold">Organisation</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Organisation name" value={orgName} onChange={setOrgName} />
          <Field label="Support email"     value={supportEmail} onChange={setSupportEmail} />
          <Field label="Platform fee (%)"  value={platformFee}  onChange={setPlatformFee} type="number" />
        </div>
      </section>

      <section className="rounded-xl border border-line bg-card p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bell size={16} className="text-moss" />
          <h2 className="text-base font-bold">Notifications</h2>
        </div>
        <div className="space-y-3">
          <Toggle
            label="Email notifications"
            note="Send admins daily summaries and alerts."
            checked={toggles.emailNotifs}
            onChange={() => flip("emailNotifs")}
          />
          <Toggle
            label="SMS notifications"
            note="Send critical alerts via SMS."
            checked={toggles.smsNotifs}
            onChange={() => flip("smsNotifs")}
          />
        </div>
      </section>

      <section className="rounded-xl border border-line bg-card p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Lock size={16} className="text-moss" />
          <h2 className="text-base font-bold">Security &amp; onboarding</h2>
        </div>
        <div className="space-y-3">
          <Toggle
            label="Auto-approve new clubs"
            note="Skip manual review for newly registered clubs."
            checked={toggles.autoApprove}
            onChange={() => flip("autoApprove")}
          />
          <Toggle
            label="Public sign-up"
            note="Allow new users to register without an invite."
            checked={toggles.publicSignup}
            onChange={() => flip("publicSignup")}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-lg bg-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-mossDark">
          <Save size={16} /> Save changes
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-moss/40"
      />
    </label>
  );
}

function Toggle({
  label,
  note,
  checked,
  onChange,
}: {
  label: string;
  note: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-line p-3 hover:bg-sand/60">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted">{note}</div>
      </div>
      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-moss" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}