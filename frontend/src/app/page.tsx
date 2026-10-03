'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Users,
  Store,
  UtensilsCrossed,
  BarChart3,
  Globe,
  Zap,
  ArrowRight,
  Check,
  Star,
  ShieldCheck,
  Sparkles,
  User,
  Building2,
  Landmark,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  QrCode,
  DollarSign,
  Receipt,
  BadgePercent,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { MobileNav } from '@/components/landing/MobileNav';
import PWAInstallButton from '@/components/layout/PWAInstallButton';
import { useAuth } from '@/context/AuthContext';
import { ClubLayout } from '../layouts/ClubLayout';

interface ModuleFeature {
  icon: LucideIcon;
  title: string;
  tag: string;
  note: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

const MODULE_FEATURES: ModuleFeature[] = [
  {
    icon: CalendarCheck,
    title: 'Court Bookings & Schedules',
    tag: 'Live Grid',
    note: 'Real-time court availability, half-hour slots, member pricing, and zero double-bookings.',
    primaryHref: '/users',
    primaryLabel: 'Open Booking Grid',
    secondaryHref: '/availability',
    secondaryLabel: 'Live Schedule',
  },
  {
    icon: Store,
    title: 'Pro Shop & Inventory',
    tag: 'Station Route',
    note: 'Rackets, balls, shoes, apparel — central inventory, barcode scanning, member discounts & POS.',
    primaryHref: '/pro-shop',
    primaryLabel: 'Launch Pro Shop Station',
    secondaryHref: '/shop',
    secondaryLabel: 'Public Store',
  },
  {
    icon: UtensilsCrossed,
    title: 'Bar & Kitchen Operations',
    tag: 'Station Route',
    note: 'Table tracking, live KOT tickets, running tabs, member discounts, and shift-based settlements.',
    primaryHref: '/bar-kitchen',
    primaryLabel: 'Launch Bar & Kitchen POS',
  },
  {
    icon: Building2,
    title: 'Front Desk & Walk-in Terminal',
    tag: 'Station Route',
    note: 'Fast member RFID check-in, daily quota enforcement, guest walk-ins, and shift duty logs.',
    primaryHref: '/front-desk',
    primaryLabel: 'Launch Front Desk Station',
    secondaryHref: '/walk-in',
    secondaryLabel: 'Walk-in Desk',
  },
  {
    icon: Landmark,
    title: 'Finance ERP & Invoicing',
    tag: 'ERP Route',
    note: 'End-to-end ledger, automated GST invoicing, receivables, payables, and unified multi-station revenue.',
    primaryHref: '/finance',
    primaryLabel: 'Open Finance ERP',
  },
  {
    icon: Users,
    title: 'Memberships & Tier Management',
    tag: 'Memberships',
    note: 'Gold, Silver and Junior tiers with plan-based court rates, discounts, renewals, and wallet balances.',
    primaryHref: '/memberships',
    primaryLabel: 'Explore Memberships',
    secondaryHref: '/users',
    secondaryLabel: 'Member Portal',
  },
];

const TESTIMONIALS = [
  {
    quote: 'We cut front-desk admin time by 60% in a month. Bookings just… happen.',
    name: 'Rahul Patel',
    role: 'Owner, Champions Club',
  },
  {
    quote: 'The bar tabs alone used to cost us thousands a month. Now nothing slips.',
    name: 'Priya Shah',
    role: 'Manager, Riverside Tennis',
  },
  {
    quote: 'Our members love that they can see court availability before they leave home.',
    name: 'Amit Shah',
    role: 'Owner, Smash Badminton Hub',
  },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();

  // If club owner or staff is logged in, show the Club Management Portal
  if (!isLoading && user && (user.systemRole === 'CLUB_OWNER' || user.systemRole === 'STAFF')) {
    return <ClubLayout />;
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#1E293B]">
      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-40 border-b border-[#D9E6F5] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1565D8] text-white shadow-md shadow-blue-500/20">
              <Zap size={18} strokeWidth={2.5} />
            </span>
            <span className="text-lg font-black tracking-tight text-[#0B1F4D]">
              Playnex
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-[#64748B] md:flex">
            <a href="#features" className="hover:text-[#1565D8] font-medium transition-colors">Features</a>
            <Link href="/memberships" className="hover:text-[#1565D8] font-medium transition-colors">Memberships</Link>
            <Link href="/users" className="hover:text-[#1565D8] font-medium transition-colors">User Portal</Link>
            <Link href="/front-desk" className="hover:text-[#1565D8] font-medium transition-colors">Front Desk</Link>
            <Link href="/pro-shop" className="hover:text-[#1565D8] font-medium transition-colors">Pro Shop</Link>
            <Link href="/bar-kitchen" className="hover:text-[#1565D8] font-medium transition-colors">Bar & Kitchen</Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <PWAInstallButton />
            <Link
              href="/login"
              className="rounded-xl border border-[#D9E6F5] bg-white px-4 py-2 text-sm font-semibold text-[#1E293B] hover:border-[#1565D8]/40 hover:text-[#1565D8] transition-all shadow-xs"
            >
              Login
            </Link>
            <Link
              href="/users"
              className="rounded-xl bg-[#1565D8] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-[#0E5BD8] transition-all"
            >
              Book a Court
            </Link>
          </div>

          <MobileNav />
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
        {/* Soft background glows */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-sky-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9E6F5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1565D8] shadow-xs">
            <Sparkles size={13} className="text-[#1565D8]" />
            Built for modern sports clubs & academies
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-[#0B1F4D]">
            The digital backbone
            <br />
            <span className="text-[#1565D8]">your club has been missing.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-[#64748B] sm:text-lg">
            Bookings, members, courts, pro shop, bar, and payments — one unified
            platform instead of WhatsApp threads, Excel sheets and paper
            receipts. Built for clubs that have outgrown the chaos.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/users"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1565D8] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-[#0E5BD8] sm:w-auto transition-all"
            >
              <User size={16} />
              <span>Open User / Member Portal</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/memberships"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9E6F5] bg-white px-6 py-3.5 text-sm font-semibold text-[#1E293B] shadow-xs hover:border-[#1565D8]/40 hover:text-[#1565D8] sm:w-auto transition-all"
            >
              Explore Memberships
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9E6F5] bg-white/80 px-5 py-3.5 text-sm font-semibold text-[#1E293B] hover:bg-white hover:border-[#1565D8]/40 sm:w-auto transition-all"
            >
              Club Admin Login
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#64748B]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Check size={14} className="text-emerald-600" /> No credit card required
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Check size={14} className="text-emerald-600" /> Set up in 1 day
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Check size={14} className="text-emerald-600" /> Free for small clubs
            </span>
          </div>

          {/* Super Admin Shortcut */}
          <div className="mt-8">
            <Link
              href="/super-admin/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#1565D8]/30 bg-blue-50/60 px-3.5 py-1.5 text-xs font-semibold text-[#1565D8] hover:bg-blue-50 transition-colors"
            >
              <ShieldCheck size={13} />
              <span>Open Super Admin Dashboard →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURES & MODULES (EACH ON ITS RESPECTIVE ROUTE) ============ */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 border-t border-[#D9E6F5]"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1565D8]">
            Modular Multi-Station Architecture
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0B1F4D]">
            Everything your club runs on — in dedicated routes
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            Six standalone modules with dedicated sub-account views, permissions, and specialized workflows. Built for tennis, padel, badminton and multi-sport clubs.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODULE_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#D9E6F5] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#1565D8]/40 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[#1565D8] group-hover:bg-[#1565D8] group-hover:text-white transition-colors">
                      <Icon size={22} />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] bg-[#F7FAFC] border border-[#D9E6F5] px-2.5 py-1 rounded-md">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#0B1F4D] group-hover:text-[#1565D8] transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                    {f.note}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={f.primaryHref}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1565D8] hover:text-[#0E5BD8] transition-colors"
                  >
                    <span>{f.primaryLabel}</span>
                    <ChevronRight size={13} />
                  </Link>

                  {f.secondaryHref && f.secondaryLabel && (
                    <Link
                      href={f.secondaryHref}
                      className="text-xs font-semibold text-[#64748B] hover:text-[#1E293B] transition-colors"
                    >
                      {f.secondaryLabel}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section
        id="stories"
        className="border-y border-[#D9E6F5] bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0B1F4D]">
              Loved by clubs across India
            </h2>
            <p className="mt-3 text-base text-[#64748B]">
              From single-court academies to multi-sport franchises.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-[#D9E6F5] bg-[#F7FAFC]/60 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm text-[#1E293B] leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="mt-5 text-xs border-t border-[#D9E6F5]/70 pt-3">
                  <div className="font-bold text-[#0B1F4D]">{t.name}</div>
                  <div className="text-[#64748B] mt-0.5">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#071A3D] via-[#0B1F4D] to-[#1565D8] px-6 py-12 text-white sm:px-12 sm:py-16 shadow-xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">
              Ready to run a modern club?
            </h2>
            <p className="mt-3 text-sm text-blue-100 sm:text-base">
              Join clubs that left WhatsApp and Excel behind.
              Get your club online in a single day with dedicated sub-account stations.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/users"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#0B1F4D] hover:bg-blue-50 transition-all sm:w-auto shadow-md"
              >
                Explore Member Portal <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all sm:w-auto"
              >
                Club Admin Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[#D9E6F5] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#1565D8] text-white">
              <Zap size={15} strokeWidth={2.5} />
            </span>
            <span className="font-extrabold text-[#0B1F4D]">Playnex</span>
            <span className="text-[#64748B]">· Sports Club Operating System</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#64748B]">
            <Link href="/login" className="hover:text-[#1565D8] transition-colors">Admin Login</Link>
            <Link href="/users" className="hover:text-[#1565D8] transition-colors">User Portal</Link>
            <Link href="/memberships" className="hover:text-[#1565D8] transition-colors">Memberships</Link>
            <Link href="/pro-shop-inventory" className="hover:text-[#1565D8] transition-colors">Pro Shop</Link>
            <Link href="/bar-kitchen" className="hover:text-[#1565D8] transition-colors">Bar & Kitchen</Link>
            <Link href="/finance" className="hover:text-[#1565D8] transition-colors">Finance ERP</Link>
            <Link href="/super-admin/dashboard" className="hover:text-[#1565D8] transition-colors">Super Admin</Link>
            <span>© 2026 Playnex</span>
          </div>
        </div>
      </footer>

      {/* ============ QUICK PORTAL STATION SWITCHER DOCK ============ */}
      <div className="fixed bottom-4 right-4 z-50 bg-[#071A3D]/95 backdrop-blur-md border border-[#1565D8]/30 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1 text-white">
        <Link
          href="/pro-shop"
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-white/10"
          title="Pro Shop Inventory & POS"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
          <span>Pro Shop</span>
        </Link>

        <Link
          href="/finance"
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-white/10"
          title="Finance ERP & Invoicing"
        >
          <Landmark className="w-3.5 h-3.5 text-emerald-400" />
          <span>Finance ERP</span>
        </Link>

        <Link
          href="/bar-kitchen"
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-white/10"
          title="Bar & Kitchen POS"
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
          <span>Bar & Kitchen</span>
        </Link>

        <Link
          href="/front-desk"
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-white/10"
          title="Front Desk Terminal"
        >
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Front Desk</span>
        </Link>

        <Link
          href="/users"
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-[#1565D8] text-white shadow-md hover:bg-[#0E5BD8]"
          title="Member App & Bookings"
        >
          <User className="w-3.5 h-3.5" />
          <span>Member App</span>
        </Link>
      </div>
    </div>
  );
}

