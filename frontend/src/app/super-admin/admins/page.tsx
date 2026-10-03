"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Mail, MoreHorizontal } from "lucide-react";
import { type AdminStatus } from "@/lib/mockData";
import { clubsService, type AdminItem } from "@/services/clubs.service";

const STATUS_STYLE: Record<AdminStatus, string> = {
  Active:   "bg-lime text-ink",
  Invited:  "bg-blue-100 text-blue-800",
  Disabled: "bg-red-100 text-red-800",
};

export default function AdminsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | AdminStatus>("All");
  const [adminsList, setAdminsList] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchAdmins() {
      try {
        const res = await clubsService.getAdmins();
        if (isMounted && res.success && res.data) {
          setAdminsList(res.data);
        }
      } catch (e) {
        console.error("Failed to load admins:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAdmins();
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(
    () =>
      adminsList.filter(
        (a) =>
          (status === "All" || a.status === status) &&
          (a.name + a.email + a.club).toLowerCase().includes(query.toLowerCase())
      ),
    [adminsList, query, status]
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">
            Club admins
          </h1>
          <p className="text-xs text-muted sm:text-sm">
            {adminsList.length} admins across all clubs
          </p>
        </div>
        <Link
          href="/super-admin/clubs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-mossDark"
        >
          <Plus size={16} /> Add club & admin
        </Link>
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
            className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-moss/40"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "All" | AdminStatus)}
          className="h-10 rounded-lg border border-line bg-white px-3 text-sm"
        >
          <option>All</option>
          <option>Active</option>
          <option>Invited</option>
          <option>Disabled</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-card">
        <div className="-mx-px overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-sand/60 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-5">Admin</th>
                <th className="px-4 py-3 font-medium sm:px-5">Club</th>
                <th className="px-4 py-3 font-medium sm:px-5">Role</th>
                <th className="px-4 py-3 font-medium sm:px-5">Status</th>
                <th className="px-4 py-3 font-medium sm:px-5">Last login</th>
                <th className="px-4 py-3 text-right font-medium sm:px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 sm:px-5">
                    <div className="font-medium">{a.name}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                      <Mail size={12} /> {a.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-5">{a.club}</td>
                  <td className="px-4 py-3 sm:px-5">
                    <span className="rounded-md bg-sand px-2 py-0.5 text-xs font-medium">
                      {a.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[a.status]}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted sm:px-5">{a.lastLogin}</td>
                  <td className="px-4 py-3 text-right sm:px-5">
                    <button
                      aria-label="More"
                      className="rounded-md border border-line p-1.5 text-muted hover:text-text"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    No admins match your search.
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