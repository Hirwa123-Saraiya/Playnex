"use client";

import { useMemo, useState } from "react";
import {
  busyness, relativeDateLabel, SLOT_BUSYNESS_CLASS, totalFreeSlots,
} from "@/lib/publicSiteRules";
import type { DayAvailability } from "@/types/publicSite.types";

export function WeeklyAvailabilityGrid({
  week, onPickSlot,
}: {
  week: DayAvailability[];
  onPickSlot?: (date: string, time: string) => void;
}) {
  const [activeDay, setActiveDay] = useState(0);
  const day = week[activeDay];

  const freeTotal = useMemo(() => totalFreeSlots(day), [day]);

  return (
    <div className="space-y-4">
      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {week.map((d, i) => (
          <button
            key={d.date}
            onClick={() => setActiveDay(i)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              i === activeDay
                ? "border-moss bg-moss text-white"
                : "border-line bg-white text-muted hover:text-text"
            }`}
          >
            <div>{relativeDateLabel(d.date)}</div>
            <div className="mt-0.5 text-[10px] opacity-70">
              {totalFreeSlots(d)} free
            </div>
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="text-muted">
          <span className="font-semibold text-text">{freeTotal}</span> slots free on{" "}
          {relativeDateLabel(day.date)}
        </div>
        <div className="flex gap-3 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-lime" /> Open
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Filling
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-400" /> Packed
          </span>
        </div>
      </div>

      {/* Friday Night Social Play Banner */}
      {day.day === "Fri" && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-xs text-indigo-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🎾</span>
            <span>
              <strong>Friday Night Social Play:</strong> 18:00 – 21:00 courts open for shared community matches.
            </span>
          </div>
          <span className="shrink-0 rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
            Court Sharing
          </span>
        </div>
      )}

      {/* Slots */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {day.slots.map((slot) => {
          const tone = busyness(slot.freeCount, slot.totalCount);
          const disabled = tone === "packed";
          return (
            <button
              key={slot.time}
              disabled={disabled}
              onClick={() => !disabled && onPickSlot?.(day.date, slot.time)}
              title={slot.socialPlayTag}
              className={`relative rounded-lg px-2 py-2.5 text-xs font-medium transition-colors ${
                slot.isSocialPlay
                  ? "border border-indigo-300 bg-indigo-50 text-indigo-950 hover:bg-indigo-100"
                  : SLOT_BUSYNESS_CLASS[tone]
              }`}
            >
              <div>{slot.time}</div>
              <div className="mt-0.5 text-[10px] opacity-80">
                {slot.isSocialPlay ? "Social Play" : `${slot.freeCount}/${slot.totalCount}`}
              </div>
              {slot.isSocialPlay && (
                <span className="absolute -top-1.5 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}