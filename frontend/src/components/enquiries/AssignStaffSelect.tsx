"use client";

import { UserCheck } from "lucide-react";
import type { StaffMember } from "@/types/enquiry.types";

export function AssignStaffSelect({
  staff, value, onChange,
}: {
  staff: StaffMember[];
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <div className="mt-3">
      <div className="relative">
        <UserCheck size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          className="h-10 w-full appearance-none rounded-lg border border-line bg-white pl-9 pr-3 text-sm"
        >
          <option value="">Unassigned</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {s.role}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}