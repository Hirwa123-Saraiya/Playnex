import type { DayAvailability, PublicPlan, PublicProduct } from "@/types/publicSite.types";

/* ============================================================
   Currency
   ============================================================ */

export const inr = (n: number): string => "₹" + n.toLocaleString("en-IN");

/** Annual plan effective monthly price (for "₹X/mo billed yearly" lines). */
export function annualMonthly(annual: number): number {
  return Math.round(annual / 12);
}

/** Savings on annual vs 12× monthly, as a percent. */
export function annualSavingsPercent(plan: PublicPlan): number {
  if (!plan.monthlyPrice) return 0;
  const fullYear = plan.monthlyPrice * 12;
  return Math.round(((fullYear - plan.annualPrice) / fullYear) * 100);
}

/* ============================================================
   Shop
   ============================================================ */

/** Price a member of the given tier would pay for a product. */
export function memberPrice(
  product: PublicProduct,
  discountPercent: number
): number {
  const net = product.basePrice * (1 - discountPercent / 100);
  return Math.round(net);
}

export function isSoldOut(product: PublicProduct): boolean {
  return product.stock <= 0;
}

export function isLowStock(product: PublicProduct, threshold = 5): boolean {
  return product.stock > 0 && product.stock <= threshold;
}

/* ============================================================
   Availability
   ============================================================ */

/** How busy a slot looks, for color-coding. */
export type SlotBusyness = "open" | "filling" | "packed";

export function busyness(freeCount: number, totalCount: number): SlotBusyness {
  if (totalCount === 0) return "packed";
  const pctFree = freeCount / totalCount;
  if (pctFree >= 0.5) return "open";
  if (pctFree > 0) return "filling";
  return "packed";
}

export const SLOT_BUSYNESS_CLASS: Record<SlotBusyness, string> = {
  open: "bg-lime/40 text-moss hover:bg-lime/60",
  filling: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  packed: "bg-red-100 text-red-800 cursor-not-allowed opacity-70",
};

/* ============================================================
   Dates
   ============================================================ */

/** Format an ISO date as "Mon 14 Oct". */
export function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Human "Today" / "Tomorrow" / date label. */
export function relativeDateLabel(iso: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return shortDate(iso);
}

/** Total number of free slots on a day — used for badge counters. */
export function totalFreeSlots(day: DayAvailability): number {
  return day.slots.reduce((s, slot) => s + slot.freeCount, 0);
}