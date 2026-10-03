"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus, Search, Mail, MoreHorizontal, Edit2, KeyRound,
  ShieldAlert, ShieldCheck, CheckCircle2, Building2,
  ExternalLink, X, Copy, Check, Loader2, UserCheck, UserX,
} from "lucide-react";
import { type AdminStatus } from "@/lib/mockData";
import { clubsService, type AdminItem } from "@/services/clubs.service";

const STATUS_STYLE: Record<AdminStatus, string> = {
  Active:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Invited:  "bg-blue-50 text-blue-700 border border-blue-200",
  Disabled: "bg-rose-50 text-rose-700 border border-rose-200",
};

export default function AdminsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | AdminStatus>("All");
  const [adminsList, setAdminsList] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dropdown & Action states
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Edit Modal State
  const [editingAdmin, setEditingAdmin] = useState<AdminItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<'Owner' | 'Manager' | 'Staff'>('Owner');
  const [editStatus, setEditStatus] = useState<AdminStatus>('Active');
  const [isSaving, setIsSaving] = useState(false);

  // Password Reset Modal State
  const [resetModalData, setResetModalData] = useState<{ admin: AdminItem; tempPass: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await clubsService.getAdmins();
      if (res.success && res.data) {
        setAdminsList(res.data);
      }
    } catch (e) {
      console.error("Failed to load admins:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Close active dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenEdit = (admin: AdminItem) => {
    setActiveMenuId(null);
    setEditingAdmin(admin);
    setEditName(admin.name);
    setEditRole(admin.role);
    setEditStatus(admin.status);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    try {
      setIsSaving(true);
      const res = await clubsService.updateAdmin(editingAdmin.id, {
        name: editName,
        role: editRole,
        status: editStatus,
      });
      if (res.success) {
        setEditingAdmin(null);
        showToast(`Administrator ${editName} updated successfully`);
        await fetchAdmins();
      } else {
        showToast(res.message || "Failed to update admin");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update admin");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (admin: AdminItem) => {
    setActiveMenuId(null);
    const newStatus: AdminStatus = admin.status === "Active" ? "Disabled" : "Active";
    try {
      const res = await clubsService.updateAdmin(admin.id, {
        status: newStatus,
      });
      if (res.success) {
        showToast(`Admin ${admin.name} is now ${newStatus}`);
        await fetchAdmins();
      } else {
        showToast(res.message || "Failed to update status");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update status");
    }
  };

  const handleResetPassword = async (admin: AdminItem) => {
    setActiveMenuId(null);
    try {
      const res = await clubsService.resetAdminPassword(admin.id);
      if (res.success && res.data?.temporaryPassword) {
        setResetModalData({
          admin,
          tempPass: res.data.temporaryPassword,
        });
        showToast(`Temporary password generated for ${admin.name}`);
      } else {
        showToast("Password reset failed");
      }
    } catch (err: any) {
      showToast(err.message || "Password reset failed");
    }
  };

  const handleCopyPassword = () => {
    if (!resetModalData) return;
    navigator.clipboard.writeText(resetModalData.tempPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-navy text-white px-4 py-3 shadow-2xl border border-blue/40 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-navy sm:text-2xl md:text-3xl">Club Admins</h1>
          <p className="text-xs text-muted sm:text-sm">
            {adminsList.length} designated owners &amp; managers across all registered clubs
          </p>
        </div>
        <Link
          href="/super-admin/clubs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-blueHover transition-all"
        >
          <Plus size={16} /> Add Club &amp; Admin
        </Link>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full min-w-0 md:max-w-sm md:flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email or club"
            className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-blue/40 transition-all"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "All" | AdminStatus)}
          className="h-10 rounded-xl border border-line bg-white px-3 text-sm font-medium text-navy cursor-pointer"
        >
          <option>All</option>
          <option>Active</option>
          <option>Invited</option>
          <option>Disabled</option>
        </select>
      </div>

      {/* Admins Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        <div className="-mx-px overflow-x-auto min-h-[300px]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-[#F4F8FD] text-navy">
              <tr>
                <th className="px-4 py-3 font-semibold sm:px-5">Admin</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Assigned Club</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Role</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Status</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Last Login</th>
                <th className="px-4 py-3 text-right font-semibold sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => {
                const isMenuOpen = activeMenuId === a.id;
                const openUpward = filtered.length <= 4 || idx >= filtered.length - 2;
                return (
                  <tr
                    key={a.id}
                    className="border-b border-line last:border-0 hover:bg-[#F8FBFF] transition-colors"
                  >
                    <td className="px-4 py-3.5 sm:px-5">
                      <div className="font-bold text-navy">{a.name}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                        <Mail size={12} /> {a.email}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-text sm:px-5">
                      <div className="flex items-center gap-1.5 font-medium text-navy">
                        <Building2 size={13} className="text-blue" />
                        <span>{a.club}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 sm:px-5">
                      <span className="rounded-lg bg-blueSoft px-2.5 py-0.5 text-xs font-bold text-blue border border-blue/20">
                        {a.role}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 sm:px-5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_STYLE[a.status] || STATUS_STYLE.Active}`}>
                        {a.status === "Active" ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
                        {a.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-muted sm:px-5">{a.lastLogin}</td>

                    {/* Actions Column with Functional Dropdown */}
                    <td className="px-4 py-3.5 text-right sm:px-5 relative">
                      <div className="inline-block text-left" ref={isMenuOpen ? menuRef : undefined}>
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : a.id)}
                          aria-label="Admin Actions"
                          title="Actions Menu"
                          className={`rounded-lg border p-1.5 transition-all ${
                            isMenuOpen
                              ? "border-blue bg-blueSoft text-blue ring-2 ring-blue/15"
                              : "border-line bg-white text-muted hover:text-navy hover:border-blue/40"
                          }`}
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {/* Dropdown Menu - rendered outside cleanly */}
                        {isMenuOpen && (
                          <div
                            className={`absolute right-4 w-56 rounded-2xl border border-line bg-white p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 text-left ${
                              openUpward ? "bottom-full mb-2" : "top-full mt-2"
                            }`}
                          >
                            <div className="px-3 py-1.5 border-b border-line text-[10px] font-bold uppercase tracking-wider text-muted">
                              Admin Controls
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(a)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-navy hover:bg-[#F4F8FD] transition-colors"
                            >
                              <Edit2 size={13} className="text-blue" />
                              <span>Edit Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleResetPassword(a)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-navy hover:bg-[#F4F8FD] transition-colors"
                            >
                              <KeyRound size={13} className="text-amber-600" />
                              <span>Reset Password</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(a)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-navy hover:bg-[#F4F8FD] transition-colors"
                            >
                              {a.status === "Active" ? (
                                <>
                                  <UserX size={13} className="text-rose-500" />
                                  <span className="text-rose-600">Deactivate Admin</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck size={13} className="text-emerald-600" />
                                  <span className="text-emerald-700">Activate Admin</span>
                                </>
                              )}
                            </button>

                            <div className="border-t border-line my-1" />

                            {/* Opens Club Portal outside in a new tab */}
                            <a
                              href={a.subdomain ? `http://${a.subdomain}.localhost:3000/club/dashboard` : `/club/dashboard?tenantId=${a.tenantId || ''}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setActiveMenuId(null)}
                              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-navy hover:bg-[#F4F8FD] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Building2 size={13} className="text-blue" />
                                <span>View Club Portal</span>
                              </div>
                              <ExternalLink size={12} className="text-muted" />
                            </a>

                            <a
                              href={`mailto:${a.email}`}
                              onClick={() => setActiveMenuId(null)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-navy hover:bg-[#F4F8FD] transition-colors"
                            >
                              <Mail size={13} className="text-muted" />
                              <span>Send Direct Email</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted">
                    No administrators match your search.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted">
                    Loading club administrators...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Admin Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="text-base font-bold text-navy">Edit Administrator</h3>
                <p className="text-xs text-muted mt-0.5">{editingAdmin.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAdmin(null)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-slate-100 hover:text-navy transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line px-3 text-sm text-navy outline-none focus:border-blue transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Administrative Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium text-navy cursor-pointer"
                >
                  <option value="Owner">Owner (Full Operations Access)</option>
                  <option value="Manager">Manager (Facilities &amp; Shifts)</option>
                  <option value="Staff">Staff (POS &amp; Front Desk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as AdminStatus)}
                  className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium text-navy cursor-pointer"
                >
                  <option value="Active">Active (Permitted Login)</option>
                  <option value="Disabled">Disabled (Suspended)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-navy hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue px-4 py-2 text-xs font-bold text-white hover:bg-blueHover transition-all disabled:opacity-50"
                >
                  {isSaving && <Loader2 size={13} className="animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                  <KeyRound size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-navy">Password Reset Complete</h3>
                  <p className="text-xs text-muted">{resetModalData.admin.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetModalData(null)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-slate-100 hover:text-navy transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-muted leading-relaxed">
                The database password hash for <strong className="text-navy">{resetModalData.admin.email}</strong> has been updated. Provide the administrator with the temporary password below:
              </p>

              <div className="flex items-center justify-between rounded-xl border border-line bg-[#F8FBFF] p-3">
                <code className="text-sm font-mono font-bold text-blue tracking-wide">
                  {resetModalData.tempPass}
                </code>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-bold text-navy hover:bg-slate-50 transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[11px] text-amber-800">
                The administrator can use this password to sign in immediately and update their credentials in Club Settings.
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-line flex justify-end">
              <button
                type="button"
                onClick={() => setResetModalData(null)}
                className="rounded-xl bg-blue px-4 py-2 text-xs font-bold text-white hover:bg-blueHover transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}