"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Wallet, LayoutGrid, Clock,
  TrendingUp, TrendingDown, Sparkles, ArrowRight, Building2, UserCog,
  X, CheckCircle2, AlertCircle, Loader2, ExternalLink, ShieldCheck, Mail, MapPin,
} from "lucide-react";
import { inr, type ClubStatus } from "@/lib/mockData";
import { clubsService, type ClubItem, type PlatformStats } from "@/services/clubs.service";

const STATUS_STYLE: Record<ClubStatus, string> = {
  Active:    "bg-blue text-white",
  Pending:   "bg-amber-100 text-amber-800",
  Suspended: "bg-red-100 text-red-800",
};

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | ClubStatus>("All");
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Dedicated single-club management state
  const [managingClub, setManagingClub] = useState<ClubItem | null>(null);
  const [manageName, setManageName] = useState("");
  const [manageSport, setManageSport] = useState("");
  const [manageLocation, setManageLocation] = useState("");
  const [managePlan, setManagePlan] = useState("");
  const [manageStatus, setManageStatus] = useState<ClubStatus>("Active");
  const [isSavingClub, setIsSavingClub] = useState(false);
  const [manageToast, setManageToast] = useState<string | null>(null);
  const [manageError, setManageError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.systemRole !== "SUPER_ADMIN") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [clubsRes, statsRes] = await Promise.all([
          clubsService.getClubs(),
          clubsService.getStats(),
        ]);
        if (isMounted) {
          if (clubsRes.success && clubsRes.data) {
            setClubs(clubsRes.data);
          }
          if (statsRes.success && statsRes.data) {
            setStats(statsRes.data);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard dynamic data:", err);
      } finally {
        if (isMounted) setDataLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleOpenManage = (c: ClubItem) => {
    setManagingClub(c);
    setManageName(c.name);
    setManageSport(c.sport || "Multi-Sport");
    setManageLocation(c.location || "");
    setManagePlan(c.subscriptionPlan || "Standard");
    setManageStatus(c.status);
    setManageError(null);
  };

  const handleSaveManage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingClub) return;
    setIsSavingClub(true);
    setManageError(null);
    try {
      const res = await clubsService.updateClub(managingClub.id, {
        clubName: manageName.trim(),
        sport: manageSport,
        location: manageLocation.trim(),
        status: manageStatus,
        subscriptionPlan: managePlan,
      });
      if (res.success) {
        setManageToast(`Successfully updated ${manageName}!`);
        setTimeout(() => setManageToast(null), 3500);
        setManagingClub(null);
        // Refresh clubs list
        const refreshed = await clubsService.getClubs();
        if (refreshed.success && refreshed.data) {
          setClubs(refreshed.data);
        }
      } else {
        setManageError(res.message || "Failed to update club");
      }
    } catch (err: any) {
      setManageError(err.message || "Failed to update club");
    } finally {
      setIsSavingClub(false);
    }
  };

  const dynamicKpis = useMemo(() => {
    const totalClubs = stats?.total_clubs ?? clubs.length;
    const totalAdmins = stats?.total_admins ?? clubs.length;

    const mrr = clubs.reduce((acc, c) => {
      const plan = (c.subscriptionPlan || "Standard").toLowerCase();
      const fee = plan === "enterprise" ? 19999 : plan === "growth" ? 9999 : 4999;
      return acc + fee;
    }, 0);
    const arr = mrr * 12;

    return [
      { label: "Active Clubs", value: String(totalClubs), note: "Registered sports clubs", icon: Building2 },
      { label: "Club Admins", value: String(totalAdmins), note: "Designated club owners", icon: UserCog },
      { label: "Monthly Platform MRR", value: inr(mrr), note: "Active SaaS subscriptions", icon: Wallet },
      { label: "Annual Platform ARR", value: inr(arr), note: "Projected annual SaaS run rate", icon: TrendingUp },
    ];
  }, [stats, clubs]);

  const { mrr, enterpriseClubs, growthClubs, standardClubs } = useMemo(() => {
    let m = 0;
    let ent = 0;
    let gro = 0;
    let std = 0;

    clubs.forEach((c) => {
      const plan = (c.subscriptionPlan || "Standard").toLowerCase();
      if (plan === "enterprise") {
        m += 19999;
        ent += 1;
      } else if (plan === "growth") {
        m += 9999;
        gro += 1;
      } else {
        m += 4999;
        std += 1;
      }
    });

    return { mrr: m, enterpriseClubs: ent, growthClubs: gro, standardClubs: std };
  }, [clubs]);

  const filtered = useMemo(
    () =>
      clubs.filter(
        (c) =>
          (status === "All" || (c.status || "").toLowerCase() === status.toLowerCase()) &&
          ((c.name || "") + (c.admin || "") + (c.sport || "")).toLowerCase().includes(query.toLowerCase())
      ),
    [clubs, query, status]
  );

  if (isLoading || !user || user.systemRole !== "SUPER_ADMIN") {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-muted">
        Verifying super admin privileges...
      </div>
    );
  }

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Welcome header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-navy sm:text-2xl md:text-3xl">
            Welcome, Super Admin!
          </h1>
          <div className="mt-1 text-xs text-muted sm:text-sm">
            Overview of clubs, platform software subscriptions, and administrative operations.
          </div>
        </div>
      </div>

      {/* KPI cards - Focused 4 SaaS Platform Cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {dynamicKpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="rounded-2xl border border-line bg-card p-4 shadow-card"
            >
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-[11px]">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blueSoft text-blue">
                  <Icon size={16} />
                </span>
                <span className="truncate">{k.label}</span>
              </div>
              <div className="mt-2 text-xl font-bold leading-none text-navy sm:mt-3 sm:text-2xl">
                {k.value}
              </div>
              <div className="mt-2 text-[11px] text-muted truncate">
                {k.note}
              </div>
            </div>
          );
        })}
      </section>

      {/* SaaS Subscription Overview + Registered Clubs Directory */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Platform Subscription Billing Overview */}
        <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-navy">Platform SaaS Subscription Overview</h2>
              <p className="text-xs text-muted">
                Recurring software licensing fees billed directly to clubs
              </p>
            </div>
            <Link
              href="/super-admin/revenue"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue hover:underline"
            >
              Manage Billing <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Total MRR Highlight */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-[#F8FBFF] p-6 text-center md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Monthly Recurring Revenue</span>
              <div className="mt-2 text-3xl font-extrabold text-navy">
                {inr(mrr)}
              </div>
              <p className="mt-2 text-xs text-muted max-w-sm">
                Software platform charges billed across all active sports clubs & academies.
              </p>
              <div className="mt-5 flex items-center justify-center gap-6 border-t border-slate-200/80 pt-4 text-xs font-medium text-muted w-full">
                <div>Active Clubs: <span className="font-bold text-navy">{clubs.length}</span></div>
                <div>Billing Cycle: <span className="font-bold text-emerald-700">Monthly</span></div>
                <div>Status: <span className="font-bold text-blue">100% Current</span></div>
              </div>
            </div>

            {/* Plan Tier Distribution */}
            <div className="rounded-xl border border-line bg-[#F4F8FD] p-4 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Subscription Tiers
                </div>
                <div className="mt-1 text-sm font-semibold text-navy">
                  Active Club Breakdown
                </div>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center justify-between text-xs">
                    <span className="font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">Enterprise (₹19,999)</span>
                    <span className="font-bold text-navy">{enterpriseClubs} {enterpriseClubs === 1 ? 'Club' : 'Clubs'}</span>
                  </li>
                  <li className="flex items-center justify-between text-xs">
                    <span className="font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Growth (₹9,999)</span>
                    <span className="font-bold text-navy">{growthClubs} Clubs</span>
                  </li>
                  <li className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">Standard (₹4,999)</span>
                    <span className="font-bold text-navy">{standardClubs} Clubs</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-muted text-center">
                Avg. ARPU: <span className="font-bold text-navy">{clubs.length > 0 ? inr(Math.round(mrr / clubs.length)) : inr(0)}/club</span>
              </div>
            </div>
          </div>
        </section>

        {/* Registered Clubs Directory */}
        <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-navy">Registered Clubs</h2>
                <p className="text-xs text-muted">Active club operating tenants</p>
              </div>
              <Link href="/super-admin/clubs" className="flex items-center gap-1 text-xs font-bold text-blue hover:underline">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <ul className="space-y-3">
              {clubs.slice(0, 4).map((club) => {
                const planName = club.subscriptionPlan || "Enterprise";
                const isEnterprise = planName.toLowerCase() === "enterprise";
                return (
                  <li key={club.id} className="rounded-xl border border-line bg-[#F8FBFF] p-3 transition-colors hover:border-blue/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blueSoft text-blue">
                          <Building2 size={14} />
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-navy truncate">{club.name}</h4>
                          <p className="text-[11px] text-muted truncate">{club.adminEmail || club.location}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isEnterprise ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {planName}
                      </span>
                    </div>
                  </li>
                );
              })}

              {clubs.length === 0 && (
                <li className="py-6 text-center text-xs text-muted">
                  No clubs registered yet.
                </li>
              )}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-line">
            <Link
              href="/super-admin/clubs/new"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-blueHover transition-all"
            >
              <span>+ Register New Club Tenant</span>
            </Link>
          </div>
        </section>
      </div>

      {/* Clubs table */}
      <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-navy">Clubs</h2>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search club, admin or sport"
              aria-label="Search clubs"
              className="h-10 w-full min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-sm outline-none placeholder:text-muted focus:border-blue/40 sm:w-64 sm:flex-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "All" | ClubStatus)}
              aria-label="Filter by status"
              className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-navy"
            >
              <option>All</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="-mx-4 overflow-x-auto md:mx-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-navy bg-[#F4F8FD]">
              <tr>
                <th className="px-4 py-3 font-semibold md:px-0 md:pl-3">Club Tenant</th>
                <th className="px-4 py-3 font-semibold md:px-0">Designated Admin</th>
                <th className="px-4 py-3 font-semibold md:px-0">Platform Plan</th>
                <th className="px-4 py-3 text-right font-semibold md:px-0">Monthly SaaS Fee</th>
                <th className="px-4 py-3 pl-6 font-semibold md:pl-6">Status</th>
                <th className="px-4 py-3 text-right font-semibold md:px-0 md:pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const plan = c.subscriptionPlan || "Standard";
                const isEnterprise = plan.toLowerCase() === "enterprise";
                const fee = isEnterprise ? 19999 : plan.toLowerCase() === "growth" ? 9999 : 4999;
                return (
                  <tr
                    key={c.id}
                    className="border-b border-line last:border-0 hover:bg-[#F8FBFF] transition-colors"
                  >
                    <td className="px-4 py-3 md:px-0 md:pl-3">
                      <div className="font-semibold text-navy">{c.name}</div>
                      <div className="text-xs text-muted">
                        {c.subdomain ? `${c.subdomain}.playnex.club` : c.sport}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text md:px-0">
                      <div className="font-medium text-navy">{c.admin}</div>
                      <div className="text-xs text-muted">{c.adminEmail || "owner@playnex.club"}</div>
                    </td>
                    <td className="px-4 py-3 md:px-0">
                      <span className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded border ${
                        isEnterprise ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-navy md:px-0">
                      {inr(fee)}<span className="text-xs font-normal text-muted">/mo</span>
                    </td>
                    <td className="px-4 py-3 pl-6 md:pl-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[c.status] || "bg-emerald-500 text-white"}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right md:px-0 md:pr-3">
                      <button
                        type="button"
                        onClick={() => handleOpenManage(c)}
                        className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-semibold text-navy hover:border-blue hover:text-blue hover:bg-blueSoft/30 transition-all cursor-pointer shadow-2xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No clubs match your search. Clear the filters to see all clubs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Toast Alert */}
      {manageToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-navy text-white px-4 py-3 shadow-2xl border border-blue/40 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{manageToast}</span>
        </div>
      )}

      {/* Dedicated Single-Club Management Modal */}
      {managingClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-[#F8FAFC]">
              <div>
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                  <Building2 size={18} className="text-blue" />
                  Manage Club: {managingClub.name}
                </h3>
                <p className="text-xs text-muted">
                  Tenant ID: <span className="font-mono text-slate-700">{managingClub.id}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManagingClub(null)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-slate-200 hover:text-navy transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveManage} className="p-6 space-y-4 text-xs">
              {manageError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-rose-700">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{manageError}</span>
                </div>
              )}

              {/* Subdomain & Direct Portal Link */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-blueSoft/50 border border-blue/20">
                <div>
                  <div className="font-bold text-navy flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-blue" />
                    <span>Club Subdomain</span>
                  </div>
                  <div className="font-mono text-[11px] text-muted mt-0.5">
                    {managingClub.subdomain ? `${managingClub.subdomain}.playnex.club` : "playnex.club"}
                  </div>
                </div>
                <a
                  href={`/club/dashboard?tenantId=${managingClub.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-blueHover transition-colors shadow-2xs"
                >
                  <span>Open Portal</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Club Admin Details */}
              <div className="p-3 rounded-xl bg-slate-50 border border-line text-muted">
                <div className="font-semibold text-navy text-[11px] uppercase tracking-wider mb-1">
                  Designated Administrator
                </div>
                <div className="flex items-center justify-between text-navy font-medium">
                  <span>{managingClub.admin}</span>
                  <span className="flex items-center gap-1 text-muted text-xs">
                    <Mail size={12} /> {managingClub.adminEmail}
                  </span>
                </div>
              </div>

              {/* Club Name */}
              <div>
                <label className="block font-semibold text-navy mb-1">Club Name</label>
                <input
                  required
                  type="text"
                  value={manageName}
                  onChange={(e) => setManageName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-blue transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Sport */}
                <div>
                  <label className="block font-semibold text-navy mb-1">Primary Sport</label>
                  <select
                    value={manageSport}
                    onChange={(e) => setManageSport(e.target.value)}
                    className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-blue transition-colors cursor-pointer"
                  >
                    <option>Multi-Sport</option>
                    <option>Padel</option>
                    <option>Tennis</option>
                    <option>Badminton</option>
                    <option>Cricket</option>
                    <option>Football</option>
                    <option>Swimming</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block font-semibold text-navy mb-1">City / Location</label>
                  <input
                    type="text"
                    value={manageLocation}
                    onChange={(e) => setManageLocation(e.target.value)}
                    placeholder="e.g. Mumbai, MH"
                    className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-blue transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Subscription Plan */}
                <div>
                  <label className="block font-semibold text-navy mb-1">SaaS Plan Tier</label>
                  <select
                    value={managePlan}
                    onChange={(e) => setManagePlan(e.target.value)}
                    className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-blue transition-colors cursor-pointer"
                  >
                    <option value="Standard">Starter Club (₹4,999/mo)</option>
                    <option value="Growth">Growth Pro (₹9,999/mo)</option>
                    <option value="Enterprise">Enterprise Elite (₹19,999/mo)</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-semibold text-navy mb-1">Club Status</label>
                  <select
                    value={manageStatus}
                    onChange={(e) => setManageStatus(e.target.value as ClubStatus)}
                    className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-blue transition-colors cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setManagingClub(null)}
                  className="rounded-xl border border-line px-4 py-2 font-semibold text-muted hover:bg-slate-100 hover:text-navy transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingClub}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue px-4 py-2 font-bold text-white hover:bg-blueHover transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSavingClub && <Loader2 size={13} className="animate-spin" />}
                  <span>Save Club Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}