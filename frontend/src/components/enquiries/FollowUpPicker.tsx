"use client";

import { Calendar } from "lucide-react";

export function FollowUpPicker({
  value, onChange,
}: {
  value: string | null;
  onChange: (iso: string | null) => void;
}) {
  // Convert ISO → "YYYY-MM-DDTHH:mm" for datetime-local input
  const local = value ? value.slice(0, 16) : "";

  return (
    <div className="mt-3">
      <div className="relative">
        <Calendar size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="datetime-local"
          value={local}
          onChange={(e) =>
            onChange(e.target.value ? new Date(e.target.value).toISOString() : null)
          }
          className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-moss/40"
        />
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-2 text-xs text-muted hover:text-red-600"
        >
          Clear
        </button>
      )}
    </div>
  );
}