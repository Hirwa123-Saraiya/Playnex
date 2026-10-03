"use client";

import { useMemo, useState } from "react";
import { Search, Mail, UserPlus, CheckCircle2, XCircle } from "lucide-react";
import { users, type UserPlan } from "@/lib/mockData";

const PLAN_STYLE: Record<UserPlan, string> = {
  Trial:   "bg-amber-100 text-amber-800",
  Monthly: "bg-blueSoft text-blue",
  Annual:  "bg-blue text-white",
};

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState<"All" | UserPlan>("All");

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (plan === "All" || u.plan === plan) &&
          (u.name + u.email + u.club).toLowerCase().includes(query.toLowerCase())
      ),
    [query, plan]
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-navy sm:text-2xl md:text-3xl">Users</h1>
          <p className="text-xs text-muted sm:text-sm">
            {users.length} end users across all clubs
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blueHover">
          <UserPlus size={16} /> Invite user
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full min-w-0 md:max-w-sm md:flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email or club"
            className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-blue/40"
          />
        </div>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as "All" | UserPlan)}
          className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-navy"
        >
          <option>All</option>
          <option>Trial</option>
          <option>Monthly</option>
          <option>Annual</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        <div className="-mx-px overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-[#F4F8FD] text-navy">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-5">User</th>
                <th className="px-4 py-3 font-medium sm:px-5">Club</th>
                <th className="px-4 py-3 font-medium sm:px-5">Plan</th>
                <th className="px-4 py-3 font-medium sm:px-5">Joined</th>
                <th className="px-4 py-3 font-medium sm:px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-line last:border-0 hover:bg-[#F8FBFF] transition-colors"
                >
                  <td className="px-4 py-3 sm:px-5">
                    <div className="font-medium text-navy">{u.name}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                      <Mail size={12} /> {u.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text sm:px-5">{u.club}</td>
                  <td className="px-4 py-3 sm:px-5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${PLAN_STYLE[u.plan]}`}
                    >
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted sm:px-5">{u.joined}</td>
                  <td className="px-4 py-3 sm:px-5">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        u.active ? "text-positive" : "text-negative"
                      }`}
                    >
                      {u.active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}