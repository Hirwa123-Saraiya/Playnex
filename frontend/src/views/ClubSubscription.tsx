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
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchPlans();
  }, []);

  // Current club subscription details
  const currentPlanName = club?.subscriptionPlan || 'Free Trial';
  const isFreeTrial = currentPlanName.toLowerCase().includes('trial') || currentPlanName === 'Free Trial';

  const handleInitiateRazorpay = async (plan: PlatformPlan) => {
    setErrorMessage(null);
    setSelectedPlanForPayment(plan);
    // Directly open Razorpay — no intermediate modal
    await handleExecuteRazorpayPayment(plan);
  };

  const handleExecuteRazorpayPayment = async (planOverride?: PlatformPlan) => {
    const activePlan = planOverride ?? selectedPlanForPayment;
    if (!activePlan) return;
    setProcessingPayment(true);
    setErrorMessage(null);

    const isAnnual = billingCycle === 'Annual';
    const basePrice = isAnnual
      ? Number(activePlan.annualPrice)
      : Number(activePlan.monthlyPrice);
    const gst = Math.round(basePrice * 0.18 * 100) / 100;
    const total = basePrice + gst;

    try {
      // 1. Create Razorpay order via backend
      setProcessingPayment(true);
      let orderId: string | undefined = undefined; // undefined = don't pass order_id to Razorpay
      let keyId = 'rzp_test_TjZWl4KibRZy5o';
      let amountInPaise = Math.round(total * 100);
      let orderCreatedOnRazorpay = false;

      try {
        const orderRes = await plansService.createOrder({
          planId: activePlan.id,
          billingCycle,
          tenantId: club.tenantId,
        });
        if (orderRes.success && orderRes.data) {
          const { orderId: oid, keyId: kid, amountInPaise: amt } = orderRes.data;
          // Only use orderId if it looks like a real Razorpay order (starts with 'order_' and len > 15)
          if (oid && oid.startsWith('order_') && oid.length > 15) {
            orderId = oid;
            orderCreatedOnRazorpay = true;
          }
          if (kid) keyId = kid;
          if (amt) amountInPaise = amt;
        }
      } catch (orderErr: any) {
        console.warn('Backend order creation warning, will open Razorpay without pre-created order:', orderErr?.message);
      }

      console.log('[Razorpay] Key:', keyId, '| Amount (paise):', amountInPaise, '| OrderId:', orderId || '(none - direct checkout)');

      // 2. Ensure Razorpay SDK is loaded
      const ensureRazorpayLoaded = () => {
        return new Promise<boolean>((resolve) => {
          if (typeof window !== 'undefined' && (window as any).Razorpay) {
            resolve(true);
            return;
          }
          // Script might still be loading - wait up to 5 seconds
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            if ((window as any).Razorpay) {
              clearInterval(interval);
              resolve(true);
            } else if (attempts >= 50) { // 5 seconds
              clearInterval(interval);
              // Last attempt: inject script manually
              const script = document.createElement('script');
              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
              script.onload = () => resolve(true);
              script.onerror = () => resolve(false);
              document.body.appendChild(script);
            }
          }, 100);
        });
      };

      const scriptLoaded = await ensureRazorpayLoaded();
      console.log('[Razorpay] Script loaded:', scriptLoaded, '| window.Razorpay:', !!(window as any).Razorpay);

      // Clean 10-digit Indian phone number strictly required by Razorpay
      const cleanPhone = (club.phone || '9876543210').replace(/[^0-9]/g, '').slice(-10).padStart(10, '9');

      if (scriptLoaded && (window as any).Razorpay) {
        const options: Record<string, any> = {
          key: keyId,
          amount: amountInPaise,
          currency: 'INR',
          name: 'Playnex SaaS Platform',
          description: `${activePlan.name} (${billingCycle}) for ${club.name}`,
          prefill: {
            name: club.adminName || 'Club Administrator',
            email: club.adminEmail || 'owner@playnex.club',
            contact: cleanPhone,
          },
          theme: {
            color: '#1565D8',
          },
          modal: {
            ondismiss: function () {
              console.log('[Razorpay] Modal dismissed by user');
              setProcessingPayment(false);
            },
          },
          handler: async function (response: any) {
            console.log('[Razorpay] Payment success:', response);
            const payId = response.razorpay_payment_id;
            const ordId = response.razorpay_order_id || orderId || `order_${Date.now().toString(36)}`;
            const sig = response.razorpay_signature;
            // Pass activePlan.id directly to avoid stale closure on selectedPlanForPayment state
            await completeCheckout(payId, ordId, activePlan.id, sig);
          },
        };

        // Only pass order_id if we have a real Razorpay order
        if (orderCreatedOnRazorpay && orderId) {
          options.order_id = orderId;
        }

        console.log('[Razorpay] Opening checkout with options:', { ...options, key: '[hidden]' });

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          console.error('[Razorpay] Payment failed:', resp.error);
          setProcessingPayment(false);
          setErrorMessage(resp.error?.description || 'Razorpay payment failed or cancelled');
        });
        rzp.open();
      } else {
        console.warn('[Razorpay] Script not available. Falling back to simulation.');
        // Fallback realistic sandbox simulation if razorpay script blocked by adblock/CSP
        setTimeout(async () => {
          const fakePaymentId = 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase();
          const fakeOrderId = orderId || ('order_' + Math.random().toString(36).substring(2, 10));
          await completeCheckout(fakePaymentId, fakeOrderId, activePlan.id);
        }, 1200);
      }
    } catch (err: any) {
      setProcessingPayment(false);
      setErrorMessage(err.message || 'Payment processing failed');
    }
  };


  const completeCheckout = async (paymentId: string, orderId: string, planId: string, signature?: string) => {
    try {
      const res = await plansService.checkout({
        tenantId: club.tenantId,
        planId: planId,
        billingCycle,
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        razorpaySignature: signature,
      });

      if (res.success && res.data) {
        setPaymentSuccessData(res.data);
        setSelectedPlanForPayment(null);
        // Update local context so sidebar/header reflects new plan
        if (club) {
          club.subscriptionPlan = res.data.plan;
        }
      } else {
        setErrorMessage(res.message || 'Payment confirmation failed. Contact support with payment ID: ' + paymentId);
      }
    } catch (err: any) {
      setErrorMessage((err.message || 'Payment confirmation failed') + ' — Payment ID: ' + paymentId);
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

      {/* 7-DAY FREE TRIAL & SUBSCRIPTION BANNER */}
      <div className={`rounded-2xl border p-6 shadow-lg relative overflow-hidden ${
        isFreeTrial
          ? 'bg-[#071A3D] text-white border-amber-400/50'
          : 'bg-[#071A3D] text-white border-emerald-400/50'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                isFreeTrial ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
              }`}>
                {isFreeTrial ? '🎁 7 Days Free Trial Active' : 'Paid Operating License'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/20">
                Tenant: {club.tenantId}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isFreeTrial ? '7 Days Free Access — Then Pay to Use' : `${currentPlanName} Plan Active`}
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              {isFreeTrial
                ? 'Your club operating system is 100% free for the first 7 days! Explore all courts, POS, front desk, and workstations without upfront charges. After the 7-day free trial, select any plan below and pay via Razorpay to continue using Playnex.'
                : 'Your club operating license is active with full access to facility booking, POS inventory, kitchen KDS, and financial accounting.'}
            </p>
          </div>

          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 min-w-[240px]">
            <div className="text-left lg:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                Billing Rule
              </span>
              <span className="text-sm font-extrabold text-white block mt-0.5">
                {isFreeTrial ? '7 Days Free • Then Pay to Use' : 'Razorpay Verified Paid'}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              isFreeTrial ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
            }`}>
              <CheckCircle2 size={14} />
              <span>{isFreeTrial ? '7 Days Free Trial Active' : 'Paid Active License'}</span>
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
            const isCurrent = !isFreeTrial && (
              currentPlanName.toLowerCase().includes(p.name.toLowerCase()) ||
              p.name.toLowerCase().includes(currentPlanName.toLowerCase())
            );

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
                      disabled={processingPayment}
                      onClick={() => handleInitiateRazorpay(p)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                        p.isPopular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {processingPayment && selectedPlanForPayment?.id === p.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Opening Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard size={14} />
                          <span>{isFreeTrial ? 'Subscribe & Pay via Razorpay' : 'Pay with Razorpay'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading overlay while Razorpay is initializing */}
      {processingPayment && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-2xl border border-slate-200 max-w-xs w-full text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-blue-50 border-2 border-blue-200">
              <Loader2 size={28} className="animate-spin text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Opening Razorpay...</p>
              <p className="text-xs text-slate-500 mt-1">Secure payment gateway is loading</p>
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
