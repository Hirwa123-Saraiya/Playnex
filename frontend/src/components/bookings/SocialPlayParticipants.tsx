"use client";

import { useState } from "react";
import { Plus, Users, X } from "lucide-react";

interface Props {
  participants: string[];
  onChange: (participants: string[]) => void;
  max?: number;
}

export function SocialPlayParticipants({
  participants,
  onChange,
  max = 3,
}: Props) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (participants.includes(trimmed)) return;
    if (participants.length >= max) return;
    onChange([...participants, trimmed]);
    setName("");
  };

  const handleRemove = (index: number) => {
    onChange(participants.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-line bg-card p-4">
      <div className="flex items-center justify-between text-xs font-semibold text-muted">
        <span className="flex items-center gap-1.5">
          <Users size={14} className="text-moss" />
          Add Co-players (Optional)
        </span>
        <span>
          {participants.length}/{max} added
        </span>
      </div>

      <div className="mt-2.5 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Player name or email"
          disabled={participants.length >= max}
          className="flex-1 rounded-lg border border-line bg-white px-3 py-1.5 text-xs outline-none transition focus:border-moss disabled:cursor-not-allowed disabled:bg-sand/40"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!name.trim() || participants.length >= max}
          className="inline-flex items-center gap-1 rounded-lg bg-moss px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-mossDark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {participants.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {participants.map((p, idx) => (
            <span
              key={`${p}-${idx}`}
              className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-text"
            >
              {p}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="rounded-full p-0.5 text-muted hover:bg-line hover:text-text"
                aria-label={`Remove ${p}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
