"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2, MapPin, Users, CalendarCheck, Wallet, Plus, Search, User, Loader2, Sparkles,
} from "lucide-react";
import { inr, type Club, type ClubStatus } from "@/lib/mockData";
import { clubsService } from "@/services/clubs.service";

const STATUS_STYLE: Record<ClubStatus, string> = {
  Active:    "bg-blue text-white",
  Pending:   "bg-amber-100 text-amber-800",
  Suspended: "bg-red-100 text-red-800",
};

export default function ClubsPage() {
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | ClubStatus>("All");

  // Modal states for CRUD
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [deletingClub, setDeletingClub] = useState<Club | null>(null);
  const [viewingClub, setViewingClub] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Edit form fields
  const [editName, setEditName] = useState("");
  const [editSport, setEditSport] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStatus, setEditStatus] = useState<ClubStatus>("Active");

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await clubsService.getClubs();
      if (res && res.data && Array.isArray(res.data)) {
        setAllClubs(res.data as Club[]);
      } else {
        setAllClubs([]);
      }
    } catch (err) {
      console.error("Error loading clubs from database:", err);
      setAllClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (club: Club) => {
    setEditingClub(club);
    setEditName(club.name);
    setEditSport(club.sport);
    setEditLocation(club.location);
    setEditStatus(club.status);
    setActionError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClub) return;
    setIsUpdating(true);
    setActionError(null);
    try {
      const res = await clubsService.updateClub(editingClub.id, {
        clubName: editName,
        sport: editSport,
        location: editLocation,
        status: editStatus,
      });
      if (res.success) {
        setEditingClub(null);
        await fetchClubs();
      } else {
        setActionError(res.message || "Failed to update club");
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to update club");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingClub) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      const res = await clubsService.deleteClub(deletingClub.id);
      if (res.success) {
        setDeletingClub(null);
        await fetchClubs();
      } else {
        setActionError(res.message || "Failed to delete club");
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to delete club");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const res = await clubsService.getClubById(id);
      if (res.success && res.data) {
        setViewingClub(res.data);
      }
    } catch (err) {
      console.error("Failed to load club details:", err);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const filtered = useMemo(
    () =>
      allClubs.filter(
        (c) =>
          (status === "All" || (c.status || "").toLowerCase() === status.toLowerCase()) &&
          ((c.name || "") + (c.sport || "") + (c.location || "") + (c.admin || "")).toLowerCase().includes(query.toLowerCase())
      ),
    [allClubs, query, status]
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold sm:text-2xl md:text-3xl text-ink">Clubs</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              Live Database
            </span>
          </div>
          <p className="text-xs text-muted sm:text-sm mt-0.5">
            {allClubs.length} {allClubs.length === 1 ? 'club' : 'clubs'} registered in database · multi-tenant management
          </p>
        </div>
        <Link
          href="/super-admin/clubs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-moss px-4 py-2.5 text-sm font-semibold text-white hover:bg-mossDark transition-colors shadow-sm"
        >
          <Plus size={16} /> Add club
        </Link>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full min-w-0 md:max-w-sm md:flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search club, sport, admin, or location"
            className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-moss/40"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "All" | ClubStatus)}
          className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-navy"
        >
          <option>All</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Suspended</option>
        </select>

        <button
          onClick={fetchClubs}
          className="ml-auto text-xs text-muted hover:text-text font-medium px-2 py-1"
        >
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted gap-2">
          <Loader2 size={18} className="animate-spin text-moss" />
          <span>Loading clubs from database...</span>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="group flex flex-col rounded-xl border border-line bg-card p-4 transition-all hover:shadow-md sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-moss/10 text-moss">
                    <Building2 size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold leading-tight text-text">
                      {c.name}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted">
                      {c.sport}
                    </div>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[c.status] || STATUS_STYLE.Active}`}
                >
                  {c.status}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-1 text-xs text-muted">
                <MapPin size={12} /> <span className="truncate">{c.location}</span>
              </div>

              {/* Main Admin Account Tag */}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-text border-t border-line/60 pt-2.5">
                <User size={13} className="text-muted shrink-0" />
                <span className="text-muted">Main Admin:</span>
                <span className="font-semibold truncate">{c.admin}</span>
                {c.adminEmail && (
                  <span className="text-[10px] text-muted truncate">({c.adminEmail})</span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-xs">
                <div>
                  <div className="flex items-center gap-1 text-muted">
                    <Users size={12} /> Members
                  </div>
                  <div className="mt-1 text-base font-semibold">{c.members || 0}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted">
                    <CalendarCheck size={12} /> Today
                  </div>
                  <div className="mt-1 text-base font-semibold">
                    {c.bookingsToday || 0}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted">
                    <Wallet size={12} /> Revenue
                  </div>
                  <div className="mt-1 text-base font-semibold">
                    {inr(Number(c.revenue) || 0)}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
                <span className="text-[11px] text-muted">
                  Plan: <strong className="text-emerald-700">{c.subscriptionPlan || 'Standard'}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="rounded-md border border-line px-2 py-1 text-[11px] font-medium text-text hover:bg-sand transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingClub(c)}
                    className="rounded-md border border-red-200 px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewDetails(c.id)}
                    className="font-medium text-moss hover:underline cursor-pointer"
                  >
                    Details →
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-line bg-card p-10 text-center space-y-4">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-moss/10 text-moss">
                <Building2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text">No Clubs Found</h3>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  {allClubs.length === 0
                    ? "No clubs have been registered in the database yet. Click below to add your first sports club and create its primary admin."
                    : "No clubs match your active search filters."}
                </p>
              </div>
              {allClubs.length === 0 && (
                <Link
                  href="/super-admin/clubs/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-moss px-5 py-2.5 text-xs font-semibold text-white hover:bg-mossDark transition-colors shadow-sm"
                >
                  <Plus size={15} /> Add First Club
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-base font-bold text-ink">Edit Club: {editingClub.name}</h3>
              <button
                onClick={() => setEditingClub(null)}
                className="text-xs text-muted hover:text-ink font-semibold"
              >
                ✕
              </button>
            </div>

            {actionError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 font-medium">
                {actionError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-text mb-1">Club Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-moss"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-text mb-1">Primary Sport</label>
                  <input
                    type="text"
                    required
                    value={editSport}
                    onChange={(e) => setEditSport(e.target.value)}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-moss"
                  />
                </div>
                <div>
                  <label className="block font-medium text-text mb-1">Location / City</label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-moss"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-text mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ClubStatus)}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-moss"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setEditingClub(null)}
                  className="rounded-lg border border-line px-4 py-2 font-medium text-muted hover:text-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-lg bg-moss px-4 py-2 font-semibold text-white hover:bg-mossDark transition-colors flex items-center gap-1.5"
                >
                  {isUpdating ? <Loader2 size={14} className="animate-spin" /> : null}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-red-600">Delete Club</h3>
            <p className="text-xs text-muted leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-text">{deletingClub.name}</strong> from PostgreSQL?
              All associated tenant accounts, staff, and departments will also be deleted.
            </p>
            {actionError && (
              <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 font-medium">
                {actionError}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingClub(null)}
                className="rounded-lg border border-line px-4 py-2 text-xs font-medium text-muted hover:text-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors flex items-center gap-1.5"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : null}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {viewingClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-base font-bold text-ink">{viewingClub.name}</h3>
                <span className="text-xs text-muted">{viewingClub.sport} · {viewingClub.location}</span>
              </div>
              <button
                onClick={() => setViewingClub(null)}
                className="text-xs text-muted hover:text-ink font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-sand/40 border border-line">
                <div>
                  <span className="text-muted block text-[10px] uppercase font-semibold">Tenant ID</span>
                  <span className="font-mono text-ink text-[11px]">{viewingClub.id}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase font-semibold">Subdomain</span>
                  <span className="text-ink font-semibold">{viewingClub.subdomain}.playnex.club</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase font-semibold">Plan</span>
                  <span className="text-ink font-semibold">{viewingClub.subscriptionPlan || 'Standard'}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px] uppercase font-semibold">Status</span>
                  <span className="inline-block rounded-full px-2 py-0.5 font-semibold text-[10px] bg-lime text-ink">
                    {viewingClub.status}
                  </span>
                </div>
              </div>

              {viewingClub.admin && (
                <div className="p-3 rounded-xl border border-line space-y-1">
                  <div className="font-semibold text-ink text-xs">Primary Administrator</div>
                  <div className="text-muted">{viewingClub.admin.name} ({viewingClub.admin.email})</div>
                  <div className="text-[11px] text-emerald-700 font-medium">Role: {viewingClub.admin.role}</div>
                </div>
              )}

              {viewingClub.departments && viewingClub.departments.length > 0 && (
                <div>
                  <div className="font-semibold text-ink mb-1.5">Configured Departments ({viewingClub.departments.length})</div>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingClub.departments.map((d: any) => (
                      <span key={d.id} className="rounded-md bg-sand px-2 py-1 text-[11px] font-medium text-text border border-line/60">
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setViewingClub(null)}
                className="rounded-lg bg-moss px-4 py-2 text-xs font-semibold text-white hover:bg-mossDark"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}