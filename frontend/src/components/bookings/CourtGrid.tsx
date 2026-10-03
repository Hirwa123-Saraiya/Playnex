"use client";

import { cn } from "@/lib/utils";
import type { Court } from "@/types/booking.types";
import { Building2 } from "lucide-react";

interface Props {
  courts: Court[];
  selectedId?: string;
  onSelect: (court: Court) => void;
}

export function CourtGrid({ courts, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {courts.map((c) => {
        const selected = c.id === selectedId;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c)}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
              selected
                ? "border-moss bg-moss text-white"
                : "border-line bg-white hover:border-moss/40"
            )}
          >
            <span
              className={cn(
                "grid h-10 w-10 place-items-center rounded-lg",
                selected ? "bg-white/15 text-white" : "bg-moss/10 text-moss"
              )}
            >
              <Building2 size={18} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-semibold">{c.name}</div>
              <div
                className={cn(
                  "mt-0.5 text-xs",
                  selected ? "text-white/70" : "text-muted"
                )}
              >
                {c.sport}
                {c.indoor ? " · Indoor" : ""}
                {c.surface ? ` · ${c.surface}` : ""}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}