"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { PlanInterest } from "@/types/enquiry.types";

const PLAN_PRICES: Record<Exclude<PlanInterest, "Undecided">, number> = {
  Gold: 6000,
  Silver: 4500,
  Junior: 2400,
};

export function QuoteBuilder({
  currentAmount, planInterest, onSend,
}: {
  currentAmount?: number;
  planInterest: PlanInterest;
  onSend: (amount: number) => void;
}) {
  const suggested =
    planInterest !== "Undecided" ? PLAN_PRICES[planInterest] : 4500;
  const [amount, setAmount] = useState(currentAmount ?? suggested);

  return (
    <div className="mt-3 space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted">
          Quote amount (₹ / month)
        </span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-moss/40"
        />
      </label>

      <button
        type="button"
        onClick={() => onSend(amount)}
        className="inline-flex items-center gap-2 rounded-lg bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-mossDark"
      >
        <Send size={14} /> Send quote
      </button>

      {currentAmount !== undefined && (
        <p className="text-xs text-muted">
          Current quote: ₹{currentAmount}
        </p>
      )}
    </div>
  );
}