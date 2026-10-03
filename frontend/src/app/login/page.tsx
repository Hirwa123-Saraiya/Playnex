'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  Mail,
  Loader2,
  ArrowRight,
  Zap,
  Eye,
  EyeOff,
  ShieldCheck,
  CalendarCheck,
  Store,
  UtensilsCrossed,
  Landmark,
  CheckCircle2,
} from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: CalendarCheck,
    title: 'Court & Slot Management',
    desc: 'Real-time 30-minute booking intervals, member pricing & anti-double booking locks.',
  },
  {
    icon: Store,
    title: 'Pro Shop & Central Stock',
    desc: 'Unified shelf inventory across emergency counter sales and online orders.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Bar & Kitchen POS',
    desc: 'Digital KOT & KDS routing, running member tabs, and automated tier discounts.',
  },
  {
    icon: Landmark,
    title: 'Finance & Accounting ERP',
    desc: 'Aggregated revenue streams, member invoicing, GST liabilities, and closing Z-reports.',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.systemRole === 'SUPER_ADMIN') {
        router.push('/super-admin/dashboard');
      } else if (user.systemRole === 'MEMBER') {
        router.push('/user');
      } else if (user.roleName?.toLowerCase().includes('pro shop')) {
        router.push('/pro-shop-inventory');
      } else if (user.roleName?.toLowerCase().includes('bar') || user.roleName?.toLowerCase().includes('kitchen')) {
        router.push('/bar-kitchen');
      } else {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const loggedInUser = await login(email.trim(), password);
      if (loggedInUser) {
        if (loggedInUser.systemRole === 'SUPER_ADMIN') {
          router.push('/super-admin/dashboard');
        } else if (loggedInUser.systemRole === 'MEMBER') {
          router.push('/user');
        } else if (loggedInUser.roleName?.toLowerCase().includes('pro shop')) {
          router.push('/pro-shop-inventory');
        } else if (loggedInUser.roleName?.toLowerCase().includes('bar') || loggedInUser.roleName?.toLowerCase().includes('kitchen')) {
          router.push('/bar-kitchen');
        } else {
          router.push('/');
        }
      } else {
        setError('Invalid email or password credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 font-sans selection:bg-[#1565D8] selection:text-white bg-[#F7FAFC]">
      {/* ================= LEFT HALF: PLATFORM DETAILS & SHOWCASE ================= */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-gradient-to-b from-[#071A3D] to-[#0B1F4D] text-white overflow-hidden">
        {/* Subtle decorative glow overlays */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#1565D8]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-[#2F80ED]/15 blur-3xl" />

        {/* Top Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#1565D8] text-white shadow-lg shadow-[#1565D8]/30 transition-transform group-hover:scale-105">
              <Zap size={22} strokeWidth={2.5} />
            </span>
            <div>
              <div className="text-2xl font-black tracking-tight text-white leading-none">
                Playnex
              </div>
              <div className="text-[11px] font-semibold text-[#5AA9FF] uppercase tracking-wider mt-1">
                The Champions Club OS
              </div>
            </div>
          </Link>
        </div>

        {/* Middle: Details & Features Showcase */}
        <div className="relative z-10 my-auto py-8 space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1565D8]/30 border border-[#1565D8]/50 text-[#A9D0FF]">
              <ShieldCheck size={14} className="text-[#5AA9FF]" />
              Enterprise Club Management
            </span>
            <h1 className="mt-4 text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              The digital backbone for modern sports clubs & academies.
            </h1>
            <p className="mt-3 text-sm xl:text-base text-[#D9E6F5]/80 leading-relaxed max-w-lg">
              One unified platform replacing chaotic WhatsApp groups, loose Excel sheets, and handwritten receipts. Built for tennis, padel, badminton, and multi-sport complexes.
            </p>
          </div>

          {/* 4 Core Modules List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-4 transition-all hover:bg-white/[0.1] hover:border-[#1565D8]/60"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#1565D8] text-white shadow-sm">
                      <Icon size={16} />
                    </span>
                    <h2 className="text-xs font-bold text-white tracking-wide">
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-[11px] text-[#D9E6F5]/70 leading-normal pl-10.5">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Trust Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#D9E6F5]/60">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#22C55E]" />
            <span>Bank-grade multi-tenant security · Live PostgreSQL sync</span>
          </div>
          <div>© 2026 Playnex Inc.</div>
        </div>
      </div>

      {/* ================= RIGHT HALF: CLEAN ENTERPRISE LOGIN FORM ================= */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 bg-[#F7FAFC]">
        {/* Mobile Header (visible only on smaller screens) */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1565D8] text-white shadow-md">
              <Zap size={20} strokeWidth={2.5} />
            </span>
            <span className="text-2xl font-black tracking-tight text-[#0B1F4D]">
              Playnex
            </span>
          </Link>
        </div>

        {/* Center Login Form Card */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0B1F4D]">
              Sign in to your account
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#64748B]">
              Enter your credentials to access the club management console.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#D9E6F5] rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(11,31,77,0.06)] space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-150">
                <span className="font-bold">Error:</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#64748B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FFFFFF] border border-[#D9E6F5] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#1E293B] placeholder-[#64748B]/50 focus:outline-none focus:border-[#1565D8] focus:ring-2 focus:ring-[#1565D8]/15 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1E293B]">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Please contact your Club Super Admin or Front Desk to reset your account password.');
                    }}
                    className="text-xs font-medium text-[#1565D8] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#64748B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FFFFFF] border border-[#D9E6F5] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1E293B] placeholder-[#64748B]/50 focus:outline-none focus:border-[#1565D8] focus:ring-2 focus:ring-[#1565D8]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#0B1F4D] transition-colors p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#D9E6F5] text-[#1565D8] focus:ring-[#1565D8]/20 accent-[#1565D8]"
                  />
                  <span className="text-xs text-[#64748B]">Stay signed in for 7 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1565D8] hover:bg-[#0E5BD8] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1565D8]/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Links Section */}
            <div className="pt-3 border-t border-[#D9E6F5] space-y-2 text-center text-xs text-[#64748B]">
              <div>
                Member looking to book courts?{' '}
                <Link href="/users" className="font-semibold text-[#1565D8] hover:underline">
                  Open Member Portal
                </Link>
              </div>
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#0B1F4D] font-medium transition-colors"
                >
                  ← Back to Playnex Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Watermark */}
        <div className="mt-8 text-center text-xs text-[#64748B] flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-[#1565D8]" />
          <span>256-bit SSL encrypted administrative portal</span>
        </div>
      </div>
    </div>
  );
}
