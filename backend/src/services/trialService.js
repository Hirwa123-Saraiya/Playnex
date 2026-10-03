/* ============================================================
   Trial service — 7-day free trial for new member signups
   ============================================================ */

export const TRIAL_DURATION_DAYS = 7;

/** Returns { startedAt, endsAt } — the window for a fresh trial. */
export function computeTrialWindow(fromDate = new Date()) {
  const started = new Date(fromDate);
  const ends = new Date(started);
  ends.setDate(ends.getDate() + TRIAL_DURATION_DAYS);
  return { startedAt: started.toISOString(), endsAt: ends.toISOString() };
}

/** True if the user has an active trial right now. */
export function isTrialActive(user, now = new Date()) {
  if (!user?.trial_ends_at) return false;
  return new Date(user.trial_ends_at).getTime() > now.getTime();
}

/** Days left in the trial (rounded down). 0 if expired or never started. */
export function daysLeftInTrial(user, now = new Date()) {
  if (!user?.trial_ends_at) return 0;
  const ms = new Date(user.trial_ends_at).getTime() - now.getTime();
  if (ms <= 0) return 0;
  return Math.floor(ms / 86_400_000);
}

/**
 * Whether the user has access to gated features.
 * A user has access if:
 *   - trial is still active, OR
 *   - they have a paid plan (memberships table — checked by caller),
 *   - OR they are SUPER_ADMIN / CLUB_OWNER / STAFF.
 */
export function hasActiveAccess(user, paidPlanCount = 0, now = new Date()) {
  if (!user) return false;

  /* Platform staff bypass */
  if (['SUPER_ADMIN', 'CLUB_OWNER', 'STAFF', 'SUPPORT_ADMIN'].includes(user.system_role)) {
    return true;
  }

  /* Paid plan → always allowed */
  if (paidPlanCount > 0) return true;

  /* Trial window */
  return isTrialActive(user, now);
}

/** Convenience: build the trial fields we return in the auth response. */
export function buildTrialProfile(user, now = new Date()) {
  const trialActive = isTrialActive(user, now);
  return {
    trialStartedAt: user?.trial_started_at || null,
    trialEndsAt:    user?.trial_ends_at    || null,
    trialUsed:      user?.trial_used       ?? false,
    trialActive,
    trialDaysLeft:  trialActive ? daysLeftInTrial(user, now) : 0,
  };
}