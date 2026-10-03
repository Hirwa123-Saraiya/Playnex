"use client";

import { cn } from "@/lib/utils";
import type { Slot } from "@/types/booking.types";
import { isSocialPlaySlot } from "@/lib/bookingRules";

interface Props {
  slots: Slot[];
  selectedId?: string;
  onSelect: (slot: Slot) => void;
}

export function SlotPicker({ slots, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {slots.map((slot) => {
        const selected = slot.id === selectedId;
        const disabled = slot.booked || slot.blocked;
        const social = isSocialPlaySlot(slot.date, slot.startTime);
        return (
          <button
            key={slot.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(slot)}
            className={cn(
              "rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors",
              disabled && "cursor-not-allowed border-line bg-sand/60 text-muted/60",
              !disabled && !selected && "border-line bg-white hover:border-moss/40",
              selected && "border-moss bg-moss text-white",
              social && !disabled && !selected && "border-lime/60 bg-lime/10"
            )}
            title={
              disabled
                ? slot.booked
                  ? "Already booked"
                  : "Unavailable"
                : social
                  ? "Social play"
                  : `Book ${slot.startTime}`
            }
          >
            <div>{slot.startTime}</div>
            {social && !disabled && (
              <div className="mt-0.5 text-[10px] opacity-80">Social</div>
            )}
          </button>
        );
      })}
    </div>
  );
}