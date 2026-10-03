import type { AuthUser } from "@/types/auth.types";

/* ============================================================
   Trial rules — pure helpers for the UI
   ============================================================ */

export const TRIAL_DURATION_DAYS = 7;

export type TrialUrgency = "fresh" | "warning" | "critical" | "expired" | "paid";

export function trialIsActive(user: AuthUser | null): boolean {
  if (!user) return false;
  if (user.trialActive) return true;
  if (!user.trialEndsAt) return false;
  return new Date(user.trialEndsAt).getTime() > Date.now();
}

export function trialDaysRemaining(user: AuthUser | null): number {
  if (!user?.trialEndsAt) return 0;
  const ms = new Date(user.trialEndsAt).getTime() - Date.now();
  if (ms <= 0) return 0;
  return Math.floor(ms / 86_400_000);
}

export function trialHoursRemaining(user: AuthUser | null): number {
  if (!user?.trialEndsAt) return 0;
  const ms = new Date(user.trialEndsAt).getTime() - Date.now();
  if (ms <= 0) return 0;
  return Math.floor(ms / 3_600_000);
}

export function trialProgressPercent(user: AuthUser | null): number {
  if (!user?.trialStartedAt || !user.trialEndsAt) return 0;
  const start = new Date(user.trialStartedAt).getTime();
  const end   = new Date(user.trialEndsAt).getTime();
  const now   = Date.now();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
}

export function trialUrgency(user: AuthUser | null): TrialUrgency {
  if (!user) return "expired";
  if (!user.trialEndsAt && !user.trialActive) return "paid";

  const days = trialDaysRemaining(user);
  const hours = trialHoursRemaining(user);

  if (days <= 0 && hours <= 0) return "expired";
  if (days < 1) return "critical";
  if (days <= 2) return "warning";
  return "fresh";
}

/** Human label for the banner. */
export function trialLabel(user: AuthUser | null): string {
  const urgency = trialUrgency(user);
  const days = trialDaysRemaining(user);
  const hours = trialHoursRemaining(user);

  switch (urgency) {
    case "expired":
      return "Your trial has ended";
    case "critical":
      return hours <= 1
        ? "Less than an hour left in your trial"
        : `${hours} hours left in your trial`;
    case "warning":
      return `${days} day${days === 1 ? "" : "s"} left in your trial`;
    case "fresh":
      return `${days} days left in your trial`;
    default:
      return "";
  }
}