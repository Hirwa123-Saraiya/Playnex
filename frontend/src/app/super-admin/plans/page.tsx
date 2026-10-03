"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Layers, Plus, Edit2, Trash2, CheckCircle2, ShieldCheck,
  Sparkles, Check, X, AlertCircle, Loader2, ArrowRight,
  TrendingUp, Users, Building2, Zap,
} from "lucide-react";
import { inr } from "@/lib/mockData";
import { platformPlansService as plansService, type PlatformPlan, type CreatePlanPayload } from "@/services/platformPlans.service";
import { clubsService } from "@/services/clubs.service";

export default function SuperAdminPlansPage() {
  const [plans, setPlans] = useState<PlatformPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Annual">("Monthly");
  const [totalClubs, setTotalClubs] = useState(0);

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlatformPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<PlatformPlan | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formMonthly, setFormMonthly] = useState<number | string>("");
  const [formAnnual, setFormAnnual] = useState<number | string>("");
  const [formMaxCourts, setFormMaxCourts] = useState<number>(5);
  const [formMaxMembers, setFormMaxMembers] = useState<number>(500);
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [featuresList, setFeaturesList] = useState<string[]>([
    "Online Slot Booking & Court Scheduler",
    "Member Profile & Wallet Management",
    "Daily Z-Report & Invoicing",
  ]);
  const [newFeatureText, setNewFeatureText] = useState("");

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const [plansRes, clubsRes] = await Promise.all([
        plansService.getPlans(),
        clubsService.getClubs(),
      ]);
      if (plansRes.success && plansRes.data) {
        setPlans(plansRes.data);
      }
      if (clubsRes.success && clubsRes.data) {
        setTotalClubs(clubsRes.data.length);
      }
    } catch (e: any) {
      console.error("Failed to load plans:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormName("");
    setFormTagline("");
    setFormMonthly("");
    setFormAnnual("");
    setFormMaxCourts(6);
    setFormMaxMembers(500);
    setFormIsPopular(false);
    setFeaturesList([
      "Online Slot Booking & Court Scheduler",
      "Member Directory & Mobile App Access",
      "GST Invoicing & Financial Reports",
      "Standard Email & Chat Support",
    ]);
    setNewFeatureText("");
    setFormError(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (plan: PlatformPlan) => {
    setEditingPlan(plan);
    setFormName(plan.name);
    setFormTagline(plan.tagline || "");
    setFormMonthly(plan.monthlyPrice);
    setFormAnnual(plan.annualPrice);
    setFormMaxCourts(plan.maxCourts || 5);
    setFormMaxMembers(plan.maxMembers || 500);
    setFormIsPopular(Boolean(plan.isPopular));
    setFeaturesList(Array.isArray(plan.features) ? [...plan.features] : []);
    setNewFeatureText("");
    setFormError(null);
    setIsCreateOpen(true);
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeaturesList([...featuresList, newFeatureText.trim()]);
    setNewFeatureText("");
  };

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };

  const applyDiscountOnAnnual = () => {
    const monthlyNum = Number(formMonthly);
    if (!monthlyNum || monthlyNum <= 0) return;
    // 20% discount on 12 months = 12 * monthly * 0.8
    const annualCalculated = Math.round(monthlyNum * 12 * 0.8);
    setFormAnnual(annualCalculated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMonthly || !formAnnual) {
      setFormError("Plan name, monthly fee, and annual fee are required.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload: CreatePlanPayload = {
      name: formName.trim(),
      tagline: formTagline.trim(),
      monthlyPrice: Number(formMonthly),
      annualPrice: Number(formAnnual),
      maxCourts: Number(formMaxCourts),
      maxMembers: Number(formMaxMembers),
      isPopular: formIsPopular,
      features: featuresList.filter((f) => f.trim().length > 0),
    };

    try {
      if (editingPlan) {
        const res = await plansService.updatePlan(editingPlan.id, payload);
        if (res.success) {
          showToast(`Plan "${formName}" updated successfully!`);
          setIsCreateOpen(false);
          await fetchPlans();
        } else {
          setFormError(res.message || "Failed to update plan");
        }
      } else {
        const res = await plansService.createPlan(payload);
        if (res.success) {
          showToast(`Plan "${formName}" created and live!`);
          setIsCreateOpen(false);
          await fetchPlans();
        } else {
          setFormError(res.message || "Failed to create plan");
        }
      }
    } catch (err: any) {
      setFormError(err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!deletingPlan) return;
    setSaving(true);
    try {
      const res = await plansService.deletePlan(deletingPlan.id);
      if (res.success) {
        showToast(`Plan "${deletingPlan.name}" removed.`);
        setDeletingPlan(null);
        await fetchPlans();
      } else {
        alert(res.message || "Failed to delete plan");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete plan");
    } finally {
      setSaving(false);
    }
  };

  const popularPlan = useMemo(() => plans.find((p) => p.isPopular) || plans[0], [plans]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-navy text-white px-4 py-3 shadow-2xl border border-blue/40 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blueSoft text-blue">
              <Layers size={18} />
            </span>
            <h1 className="text-xl font-bold text-navy sm:text-2xl md:text-3xl">Platform Plans</h1>
            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">
              Live Database
            </span>
          </div>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Create, configure, and manage monthly &amp; annual SaaS subscription tiers for club owners. Club owners can purchase these directly using Razorpay.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-blue px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-blueHover transition-all cursor-pointer"
        >
          <Plus size={16} /> Create New Plan
        </button>
      </header>

      {/* Stats KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Total Available Plans</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blueSoft text-blue">
              <Layers size={16} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">{plans.length}</div>
          <p className="mt-0.5 text-[11px] text-muted">Active SaaS subscription tiers</p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Flagship Popular Tier</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600">
              <Sparkles size={16} />
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-navy truncate">
            {popularPlan ? popularPlan.name : "Growth Pro"}
          </div>
          <p className="mt-0.5 text-[11px] text-muted">High-conversion recommended tier</p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Subscribed Club Tenants</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <Building2 size={16} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">{totalClubs}</div>
          <p className="mt-0.5 text-[11px] text-muted">Actively billed via Razorpay</p>
        </div>
      </div>

      {/* Billing Cycle Toggle Preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-navy">Plan Pricing Preview</h3>
          <p className="text-xs text-muted">
            Toggle how club owners view monthly vs. annual pricing in their club portal
          </p>
        </div>

        <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-line">
          <button
            type="button"
            onClick={() => setBillingCycle("Monthly")}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              billingCycle === "Monthly"
                ? "bg-white text-navy shadow-sm"
                : "text-muted hover:text-navy"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("Annual")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              billingCycle === "Annual"
                ? "bg-blue text-white shadow-sm"
                : "text-muted hover:text-navy"
            }`}
          >
            <span>Annual Billing</span>
            <span className="rounded-md bg-amber-400 px-1.5 py-0.2 text-[10px] font-extrabold text-navy">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex h-64 items-center justify-center gap-2 text-sm text-muted">
          <Loader2 size={18} className="animate-spin text-blue" />
          <span>Loading plans from database...</span>
        </div>
      )}

      {/* Plans Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => {
            const monthly = Number(p.monthlyPrice);
            const annual = Number(p.annualPrice);
            const price = billingCycle === "Annual" ? annual : monthly;
            const savings = Math.max(0, monthly * 12 - annual);

            return (
              <div
                key={p.id}
                className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-card transition-all hover:shadow-lg ${
                  p.isPopular ? "border-blue ring-2 ring-blue/20" : "border-line"
                }`}
              >
                {/* Popular Badge */}
                {p.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                    <Sparkles size={11} /> Most Popular
                  </span>
                )}

                <div>
                  {/* Title & Tagline */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-navy">{p.name}</h3>
                      <p className="mt-0.5 text-xs text-muted min-h-[32px]">{p.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 pb-4 border-b border-line">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-navy">{inr(price)}</span>
                      <span className="text-xs font-semibold text-muted">
                        /{billingCycle === "Annual" ? "year" : "month"}
                      </span>
                    </div>

                    {billingCycle === "Annual" && savings > 0 ? (
                      <div className="mt-1 text-[11px] font-bold text-emerald-600">
                        Club owners save {inr(savings)} annually
                      </div>
                    ) : (
                      <div className="mt-1 text-[11px] text-muted">
                        Billed monthly via Razorpay auto-debit
                      </div>
                    )}
                  </div>

                  {/* Limits Badges */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-blueSoft px-2.5 py-1 text-[11px] font-semibold text-blue border border-blue/20">
                      Up to {p.maxCourts || 5} Facilities / Courts
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200">
                      {(p.maxMembers || 500).toLocaleString()} Members
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="mt-5 space-y-2.5 text-xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                      Included Capabilities:
                    </div>
                    {Array.isArray(p.features) &&
                      p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-700">
                          <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-4 border-t border-line flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:border-blue hover:text-blue transition-colors cursor-pointer"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingPlan(p)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <span className="text-[11px] text-muted font-medium">
                    ID: <code className="text-slate-600">{p.id}</code>
                  </span>
                </div>
              </div>
            );
          })}

          {plans.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center text-muted">
              No platform plans created yet. Click "+ Create New Plan" to add the first plan tier.
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          CREATE / EDIT PLAN MODAL
          ======================================================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line px-6 py-4 bg-[#F8FAFC]">
              <div>
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                  <Layers size={18} className="text-blue" />
                  {editingPlan ? `Edit Plan: ${editingPlan.name}` : "Create New Platform Plan"}
                </h3>
                <p className="text-xs text-muted">
                  Configure monthly and annual SaaS fees for club owners
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-slate-200 hover:text-navy transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-rose-700">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Plan Name */}
              <div>
                <label className="block font-semibold text-navy mb-1">
                  Plan Tier Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Starter Club, Growth Pro, Enterprise Elite"
                  className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-blue transition-colors"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block font-semibold text-navy mb-1">Tagline / Short Summary</label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="e.g. For scaling multi-sport clubs and high-traffic venues"
                  className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-blue transition-colors"
                />
              </div>

              {/* Pricing: Monthly & Annual */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-line">
                <div>
                  <label className="block font-semibold text-navy mb-1">
                    Monthly SaaS Fee (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-bold">₹</span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={formMonthly}
                      onChange={(e) => setFormMonthly(e.target.value)}
                      placeholder="4999"
                      className="w-full h-9 rounded-xl border border-line bg-white pl-7 pr-3 text-xs font-bold text-navy outline-none focus:border-blue transition-colors"
                    />
                  </div>
                  <span className="text-[10px] text-muted">Billed monthly</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-navy">
                      Annual Fee (₹) <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={applyDiscountOnAnnual}
                      className="text-[10px] font-bold text-blue hover:underline"
                    >
                      -20% Auto
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-bold">₹</span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={formAnnual}
                      onChange={(e) => setFormAnnual(e.target.value)}
                      placeholder="47990"
                      className="w-full h-9 rounded-xl border border-line bg-white pl-7 pr-3 text-xs font-bold text-navy outline-none focus:border-blue transition-colors"
                    />
                  </div>
                  <span className="text-[10px] text-muted">Billed once per year</span>
                </div>
              </div>

              {/* Resource Capacity Limits */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy mb-1">Max Facilities / Courts</label>
                  <input
                    type="number"
                    min="1"
                    value={formMaxCourts}
                    onChange={(e) => setFormMaxCourts(parseInt(e.target.value, 10) || 1)}
                    className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-blue transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-navy mb-1">Max Club Members</label>
                  <input
                    type="number"
                    min="10"
                    value={formMaxMembers}
                    onChange={(e) => setFormMaxMembers(parseInt(e.target.value, 10) || 100)}
                    className="w-full h-9 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-blue transition-colors"
                  />
                </div>
              </div>

              {/* Feature Bullet Points */}
              <div className="space-y-2">
                <label className="block font-semibold text-navy">Features &amp; Capabilities</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {featuresList.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-line text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Check size={13} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-muted hover:text-rose-500 shrink-0 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Add feature (e.g. 24/7 Phone Support)..."
                    className="flex-1 h-9 rounded-xl border border-line bg-white px-3 text-xs outline-none focus:border-blue transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="rounded-xl border border-line bg-slate-100 px-3 py-2 font-bold text-navy hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Most Popular Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={formIsPopular}
                  onChange={(e) => setFormIsPopular(e.target.checked)}
                  className="h-4 w-4 rounded border-line text-blue focus:ring-blue cursor-pointer"
                />
                <label htmlFor="popularCheck" className="font-semibold text-navy cursor-pointer">
                  Mark as "Most Popular" highlighted plan
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-line flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-line px-4 py-2 font-semibold text-muted hover:bg-slate-100 hover:text-navy transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue px-4 py-2 font-bold text-white hover:bg-blueHover transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingPlan ? "Update Plan" : "Publish Plan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL
          ======================================================== */}
      {deletingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy">Delete Plan?</h3>
              <p className="mt-1 text-xs text-muted">
                Are you sure you want to delete <span className="font-bold text-navy">{deletingPlan.name}</span>? Existing subscribed clubs will not be affected.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingPlan(null)}
                className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleDeletePlan}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-sm"
              >
                {saving ? "Deleting..." : "Delete Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
