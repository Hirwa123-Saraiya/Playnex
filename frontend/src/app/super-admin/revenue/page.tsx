"use client";

import { useState, useEffect } from "react";
import { Download, TrendingUp, TrendingDown, Landmark, CheckCircle2, ShieldCheck, Building2, Calendar } from "lucide-react";
import { inr } from "@/lib/mockData";
import { clubsService, type ClubRevenueItem } from "@/services/clubs.service";

export default function RevenuePage() {
  const [revenueList, setRevenueList] = useState<ClubRevenueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchRevenue() {
      try {
        const revRes = await clubsService.getRevenue();
        if (isMounted && revRes.success && revRes.data?.revenueByClub) {
          setRevenueList(revRes.data.revenueByClub);
        }
      } catch (e) {
        console.error("Failed to load platform revenue data:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchRevenue();
    return () => { isMounted = false; };
  }, []);

  const totalMRR = revenueList.reduce((s, c) => s + Number(c.month || c.platformFee || 0), 0);
  const totalARR = totalMRR * 12;
  const activeClubsCount = revenueList.length;

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-navy sm:text-2xl md:text-3xl">Platform Revenue & Club Billing</h1>
          <p className="text-xs text-muted sm:text-sm">
            Subscription licensing, software tiers & platform charges paid by clubs to Playnex
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy shadow-xs hover:border-blue/40 transition-all">
          <Download size={15} /> <span className="hidden sm:inline">Export Billing CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
      </header>

      {/* Top SaaS Financial Metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Stat 
          label="Monthly Recurring Revenue (MRR)" 
          value={inr(totalMRR)} 
          note="Active club SaaS subscriptions" 
        />
        <Stat 
          label="Annual Run Rate (ARR)" 
          value={inr(totalARR)} 
          note="Projected annualized subscriptions" 
        />
        <Stat 
          label="Billed Clubs" 
          value={`${activeClubsCount} Clubs`} 
          note="On active platform tiers" 
        />
      </div>

      {/* Platform Subscription Explainer */}
      <section className="rounded-2xl border border-line bg-card p-6 shadow-card text-center">
        <div className="mx-auto max-w-xl">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-blueSoft text-blue shadow-xs">
            <Landmark size={24} />
          </div>
          <h2 className="text-base font-bold text-navy">Club SaaS Platform Subscriptions</h2>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Revenue generated from clubs paying Playnex for cloud platform hosting, multi-station modules (Pro Shop, Bar & Kitchen, Front Desk), and multi-tenant management. Customer court bookings and member tabs are isolated inside each club&apos;s own portal.
          </p>
        </div>
      </section>

      {/* Club Platform Charges Table */}
      <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-navy">Platform Charges by Club</h2>
            <p className="text-xs text-muted">Recurring software fees billed directly to club administrators</p>
          </div>
          <span className="text-xs font-semibold text-muted bg-[#F7FAFC] border border-line px-2.5 py-1 rounded-lg">
            {revenueList.length} Club Accounts
          </span>
        </div>

        <div className="-mx-4 overflow-x-auto md:mx-0">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-line bg-[#F4F8FD] text-navy">
              <tr>
                <th className="px-4 py-3 font-semibold md:px-0 md:pl-3">Club / Academy</th>
                <th className="px-4 py-3 font-semibold md:px-0">Platform Plan</th>
                <th className="px-4 py-3 font-semibold md:px-0">Billing Cycle</th>
                <th className="px-4 py-3 text-right font-semibold md:px-0">Platform Fee</th>
                <th className="px-4 py-3 text-right font-semibold md:px-0">Billed This Month</th>
                <th className="px-4 py-3 text-center font-semibold md:px-0">Status</th>
                <th className="px-4 py-3 text-right font-semibold md:px-0 md:pr-3">Next Renewal</th>
              </tr>
            </thead>
            <tbody>
              {revenueList.map((r) => {
                const planName = r.subscriptionPlan || "Enterprise";
                const isEnterprise = planName.toLowerCase() === "enterprise";
                const isGrowth = planName.toLowerCase() === "growth";
                const fee = Number(r.platformFee || r.month || 0);

                return (
                  <tr
                    key={r.id}
                    className="border-b border-line last:border-0 hover:bg-[#F8FBFF] transition-colors"
                  >
                    <td className="px-4 py-3.5 font-medium text-navy md:px-0 md:pl-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-blueSoft text-blue">
                          <Building2 size={14} />
                        </span>
                        <div>
                          <div className="font-bold text-navy">{r.club}</div>
                          <div className="text-[11px] text-muted">{r.subdomain ? `${r.subdomain}.playnex.club` : r.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 md:px-0">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-bold ${
                          isEnterprise
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : isGrowth
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-700"
                        }`}
                      >
                        <ShieldCheck size={11} />
                        {planName}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-muted md:px-0">
                      {r.billingCycle || "Monthly"}
                    </td>

                    <td className="px-4 py-3.5 text-right font-semibold text-text md:px-0">
                      {inr(fee)}<span className="text-[11px] text-muted font-normal">/mo</span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-bold text-navy md:px-0">
                      {inr(fee)}
                    </td>

                    <td className="px-4 py-3.5 text-center md:px-0">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 size={11} />
                        Paid
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right text-xs text-muted md:px-0 md:pr-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} className="text-muted/70" />
                        {r.nextInvoice || "Next Month"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {revenueList.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted">
                    No club platform subscriptions found yet.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted">
                    Loading platform revenue...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1.5 text-2xl font-black text-navy md:text-3xl">{value}</div>
      <div className="mt-1 text-xs text-muted font-medium">{note}</div>
    </div>
  );
}