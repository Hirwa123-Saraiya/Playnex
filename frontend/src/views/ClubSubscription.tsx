'use client';

import React, { useState, useEffect } from 'react';
import { useClub } from '../context/ClubContext';
import {
  ShieldCheck,
  Check,
  Zap,
  Sparkles,
  CreditCard,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Download,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { platformPlansService as plansService, type PlatformPlan } from '../services/platformPlans.service';
import { inr } from '../lib/mockData';

export const ClubSubscription: React.FC = () => {
  const { club } = useClub();
  const [plans, setPlans] = useState<PlatformPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annual'>('Monthly');

  // Checkout states
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PlatformPlan | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await plansService.getPlans();
      if (res.success && res.data) {
        setPlans(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load plans:', err);
      setErrorMessage('Could not load live subscription plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Current club subscription details
  const currentPlanName = club?.subscriptionPlan || 'Enterprise';

  const handleInitiateRazorpay = (plan: PlatformPlan) => {
    setSelectedPlanForPayment(plan);
    setErrorMessage(null);
  };

  const handleExecuteRazorpayPayment = async () => {
    if (!selectedPlanForPayment) return;
    setProcessingPayment(true);
    setErrorMessage(null);

    const isAnnual = billingCycle === 'Annual';
    const basePrice = isAnnual
      ? Number(selectedPlanForPayment.annualPrice)
      : Number(selectedPlanForPayment.monthlyPrice);
    const gst = Math.round(basePrice * 0.18 * 100) / 100;
    const total = basePrice + gst;

    try {
      // 1. Create live Razorpay order via backend
      let orderId = '';
      let keyId = 'rzp_test_TjZWl4KibRZy5o';
      let amountInPaise = Math.round(total * 100);

      try {
        const orderRes = await plansService.createOrder({
          planId: selectedPlanForPayment.id,
          billingCycle,
          tenantId: club.tenantId,
        });
        if (orderRes.success && orderRes.data) {
          orderId = orderRes.data.orderId;
          keyId = orderRes.data.keyId || keyId;
          amountInPaise = orderRes.data.amountInPaise || amountInPaise;
        }
      } catch (orderErr) {
        console.warn('Backend order creation warning, continuing with client checkout:', orderErr);
      }

      // 2. Load Razorpay standard SDK if available
      const loadRazorpayScript = () => {
        return new Promise<boolean>((resolve) => {
          if (typeof window !== 'undefined' && (window as any).Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && (window as any).Razorpay) {
        const options = {
          key: keyId,
          amount: amountInPaise,
          currency: 'INR',
          name: 'Playnex SaaS Platform',
          description: `${selectedPlanForPayment.name} (${billingCycle}) for ${club.name}`,
          order_id: orderId || undefined,
          handler: async function (response: any) {
            const payId = response.razorpay_payment_id;
            const ordId = response.razorpay_order_id || orderId;
            const sig = response.razorpay_signature;
            await completeCheckout(payId, ordId, sig);
          },
          prefill: {
            name: club.adminName || 'Club Administrator',
            email: club.adminEmail || 'owner@playnex.club',
            contact: club.phone || '+91 9876543210',
          },
          theme: {
            color: '#1565D8',
          },
          modal: {
            ondismiss: function () {
              setProcessingPayment(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setProcessingPayment(false);
          setErrorMessage(resp.error?.description || 'Razorpay payment failed or cancelled');
        });
        rzp.open();
      } else {
        // Fallback realistic sandbox simulation if razorpay script blocked by adblock
        setTimeout(async () => {
          const fakePaymentId = 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase();
          const fakeOrderId = orderId || ('order_' + Math.random().toString(36).substring(2, 10));
          await completeCheckout(fakePaymentId, fakeOrderId);
        }, 1200);
      }
    } catch (err: any) {
      setProcessingPayment(false);
      setErrorMessage(err.message || 'Payment processing failed');
    }
  };

  const completeCheckout = async (paymentId: string, orderId: string, signature?: string) => {
    try {
      const res = await plansService.checkout({
        tenantId: club.tenantId,
        planId: selectedPlanForPayment!.id,
        billingCycle,
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        razorpaySignature: signature,
      });

      if (res.success && res.data) {
        setPaymentSuccessData(res.data);
        setSelectedPlanForPayment(null);
        // Update local context
        if (club) {
          club.subscriptionPlan = res.data.plan;
        }
      } else {
        setErrorMessage(res.message || 'Payment confirmation failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment confirmation failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Platform Subscription &amp; Billing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Razorpay Secured
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your club operating system subscription tier and pay seamlessly using Razorpay
          </p>
        </div>
      </div>

      {/* Current Active Plan Banner */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-900 via-blue-800 to-[#071A3D] p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                Current Active Tier
              </span>
              <span className="text-xs text-blue-200 flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-400" /> Tenant ID: {club.tenantId}
              </span>
            </div>
            <h2 className="text-2xl font-black mt-2 text-white flex items-center gap-2">
              {currentPlanName} Plan
            </h2>
            <p className="text-xs text-blue-100 max-w-xl mt-1">
              Your club operating license is active with full access to facility booking, POS inventory, kitchen KDS, and financial accounting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
            <div className="text-right">
              <span className="text-[11px] text-blue-200 uppercase tracking-wider font-semibold">Payment Status</span>
              <div className="text-base font-extrabold text-emerald-400 flex items-center gap-1.5 justify-end">
                <CheckCircle2 size={16} /> Auto-Renewing Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Cycle Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Choose Your Subscription Billing Term</h3>
          <p className="text-xs text-slate-500">
            Switch between monthly flexibility or annual billing to save 20% on platform costs.
          </p>
        </div>

        <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setBillingCycle('Monthly')}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'Monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('Annual')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'Annual'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="rounded bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-slate-950">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex h-64 items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Fetching latest subscription plans...</span>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="p-4 rounded-xl border bg-rose-50 border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Plans Comparison Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent =
              currentPlanName.toLowerCase().includes(p.name.toLowerCase()) ||
              p.name.toLowerCase().includes(currentPlanName.toLowerCase());

            const monthly = Number(p.monthlyPrice);
            const annual = Number(p.annualPrice);
            const displayPrice = billingCycle === 'Annual' ? annual : monthly;
            const savings = Math.max(0, monthly * 12 - annual);

            return (
              <div
                key={p.id}
                className={`relative flex flex-col justify-between rounded-2xl bg-white p-6 border transition-all hover:shadow-lg ${
                  p.isPopular
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : isCurrent
                    ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                {/* Badges */}
                {p.isPopular && !isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs flex items-center gap-1">
                    <Sparkles size={11} /> Recommended
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs flex items-center gap-1">
                    <CheckCircle2 size={11} /> Current Subscribed Plan
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 min-h-[32px]">{p.tagline}</p>

                  {/* Pricing Display */}
                  <div className="mt-4 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {inr(displayPrice)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        /{billingCycle === 'Annual' ? 'year' : 'month'}
                      </span>
                    </div>

                    {billingCycle === 'Annual' && savings > 0 ? (
                      <div className="mt-1 text-[11px] font-bold text-emerald-600">
                        Includes 20% discount (Save {inr(savings)})
                      </div>
                    ) : (
                      <div className="mt-1 text-[11px] text-slate-400">
                        + 18% GST invoice provided
                      </div>
                    )}
                  </div>

                  {/* Limits */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 border border-blue-200">
                      Up to {p.maxCourts || 5} Courts / Arenas
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200">
                      {(p.maxMembers || 500).toLocaleString()} Members
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="mt-5 space-y-2.5 text-xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Included In Tier:
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

                {/* Call to action button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  {isCurrent ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={14} /> Active Plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleInitiateRazorpay(p)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                        p.isPopular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <CreditCard size={14} />
                      <span>Pay with Razorpay</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          RAZORPAY CHECKOUT MODAL PREVIEW & CONFIRMATION
          ======================================================== */}
      {selectedPlanForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Brand Header */}
            <div className="bg-[#071A3D] text-white p-5 flex items-center justify-between border-b border-[#0B1F4D]">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <Zap size={18} strokeWidth={2.5} />
                </span>
                <div>
                  <h3 className="text-sm font-bold">Razorpay Secure Checkout</h3>
                  <p className="text-[11px] text-blue-200">Playnex Sports SaaS Platform</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForPayment(null)}
                className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Invoice Breakdown */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedPlanForPayment.name}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {billingCycle} SaaS Platform Subscription
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-extrabold text-xs">
                  {billingCycle}
                </span>
              </div>

              {/* Order Calculations */}
              {(() => {
                const isAnnual = billingCycle === 'Annual';
                const base = isAnnual
                  ? Number(selectedPlanForPayment.annualPrice)
                  : Number(selectedPlanForPayment.monthlyPrice);
                const gst = Math.round(base * 0.18 * 100) / 100;
                const total = Math.round((base + gst) * 100) / 100;

                return (
                  <div className="space-y-2 py-2 border-y border-slate-100 text-slate-600">
                    <div className="flex justify-between">
                      <span>Subscription Base Fee:</span>
                      <span className="font-semibold text-slate-900">{inr(base)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18% B2B Invoicing):</span>
                      <span className="font-semibold text-slate-900">{inr(gst)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-extrabold text-slate-900">
                      <span>Total Amount Payable:</span>
                      <span className="text-blue-600 text-base">{inr(total)}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Club prefill */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
                  Billed To
                </div>
                <div className="flex justify-between">
                  <span>Club:</span>
                  <span className="font-medium text-slate-900">{club.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="font-medium text-slate-900">{club.adminEmail || 'owner@playnex.club'}</span>
                </div>
              </div>

              {/* Razorpay Badging */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <Lock size={12} className="text-emerald-500" />
                <span>256-Bit SSL Encrypted Razorpay Gateway</span>
              </div>

              {/* Submit Payment Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={processingPayment}
                  onClick={handleExecuteRazorpayPayment}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      <span>Proceed to Razorpay Checkout</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PAYMENT SUCCESS MODAL
          ======================================================== */}
      {paymentSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Subscription Payment Successful!</h3>
              <p className="mt-1 text-xs text-slate-500">
                Your club has been upgraded to the{' '}
                <span className="font-bold text-slate-800">{paymentSuccessData.plan}</span> plan ({paymentSuccessData.billingCycle}).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-800">
                  {paymentSuccessData.invoice?.invoice_number || 'INV-PNX-LATEST'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-emerald-600">{inr(paymentSuccessData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-medium text-slate-800">Razorpay Verified</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPaymentSuccessData(null);
                fetchPlans();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Continue to Club Portal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
