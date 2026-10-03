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
} from 'lucide-react';
import { MobileNav } from '@/components/landing/MobileNav';
import PWAInstallButton from '@/components/layout/PWAInstallButton';
import { useAuth } from '@/context/AuthContext';
import { ClubLayout } from '../layouts/ClubLayout';

const FEATURES = [
  {
    icon: CalendarCheck,
    title: 'Court bookings',
    note: 'Real-time availability, half-hour slots, member pricing, no double-bookings. Ever.',
  },
  {
    icon: Users,
    title: 'Memberships',
    note: 'Gold, Silver and Junior tiers with plan-based rates, discounts and renewal tracking.',
  },
  {
    icon: Store,
    title: 'Pro shop',
    note: 'Rackets, balls, shoes, apparel — one inventory, whether sold at the counter or online.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Bar & cafeteria',
    note: 'Table tracking, running tabs, member discounts, and shift-based settlements.',
  },
  {
    icon: BarChart3,
    title: 'Revenue & reports',
    note: 'See today, this week and this month — from courts, shop and bar in one place.',
  },
  {
    icon: Globe,
    title: 'Public website',
    note: 'Let new members find you, see prices, check availability and book a trial.',
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
    <div className="min-h-screen bg-sand text-text">
      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-40 border-b border-line bg-sand/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 md:py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-moss text-lime">
              <Zap size={18} strokeWidth={2.5} />
            </span>
            <span className="text-base font-bold tracking-tight sm:text-lg">
              Playnex
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#features" className="hover:text-text font-medium">Features</a>
            <Link href="/memberships" className="hover:text-text font-medium">Memberships</Link>
            <Link href="/users" className="hover:text-text font-medium">User Portal</Link>
            <Link href="/admin/front-desk" className="hover:text-text font-medium">Front Desk</Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <PWAInstallButton />
            <Link
              href="/login"
              className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium hover:border-moss/40"
            >
              Login
            </Link>
            <Link
              href="/users"
              className="rounded-lg bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-mossDark"
            >
              Book a Court
            </Link>
          </div>

          <MobileNav />
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-lime/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-moss/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted shadow-xs">
              <Sparkles size={12} className="text-moss" />
              Built for modern sports clubs & academies
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl text-ink">
              The digital backbone
              <br />
              <span className="text-moss">your club has been missing.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">
              Bookings, members, courts, pro shop, bar, and payments — one
              platform instead of WhatsApp threads, Excel sheets and paper
              receipts. Built for clubs that have outgrown the chaos.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/users"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-moss px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-mossDark sm:w-auto"
              >
                <User size={16} />
                <span>Open User / Member Portal</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/memberships"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-text shadow-xs hover:border-moss/40 sm:w-auto"
              >
                Explore Memberships
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white/70 px-5 py-3.5 text-sm font-semibold text-text hover:bg-white sm:w-auto"
              >
                Club Admin Login
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Check size={13} className="text-moss" /> No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={13} className="text-moss" /> Set up in 1 day
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={13} className="text-moss" /> Free for small clubs
              </span>
            </div>
          </div>

          {/* Dev shortcut */}
          <div className="mx-auto mt-10 max-w-md text-center">
            <Link
              href="/super-admin/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-dashed border-moss/40 bg-white/60 px-3 py-1.5 text-[11px] font-medium text-moss hover:bg-white"
            >
              <ShieldCheck size={12} /> Open Super Admin Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section
        id="features"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-ink">
            Everything your club runs on
          </h2>
          <p className="mt-3 text-base text-muted">
            Six modules that replace the chaos. Built for tennis, padel,
            badminton and multi-sport clubs.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-line bg-white p-6 transition-shadow hover:shadow-md"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-lime/30 text-moss">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{f.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section
        id="stories"
        className="border-y border-line bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-ink">
              Loved by clubs across India
            </h2>
            <p className="mt-3 text-base text-muted">
              From single-court academies to multi-sport franchises.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-line bg-sand/30 p-6"
              >
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm text-text">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-xs">
                  <div className="font-semibold text-ink">{t.name}</div>
                  <div className="text-muted">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white sm:px-12 sm:py-16 shadow-xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to run a modern club?
            </h2>
            <p className="mt-3 text-sm text-white/70 sm:text-base">
              Join clubs that left WhatsApp and Excel behind.
              Get your club online in a single day.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/users"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime px-6 py-3 text-sm font-semibold text-ink hover:bg-lime/90 sm:w-auto"
              >
                Explore Member Portal <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
              >
                Club Admin Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-moss text-lime">
              <Zap size={14} strokeWidth={2.5} />
            </span>
            <span className="font-semibold text-ink">Playnex</span>
            <span className="text-muted">· The Champions Club</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
            <Link href="/login" className="hover:text-text">Admin Login</Link>
            <Link href="/users" className="hover:text-text">User Portal</Link>
            <Link href="/memberships" className="hover:text-text">Memberships</Link>
            <Link href="/super-admin/dashboard" className="hover:text-text">Super Admin</Link>
            <span>© 2026 Playnex</span>
          </div>
        </div>
      </footer>

      {/* Quick Portal Switcher Banner */}
      <div className="fixed bottom-4 right-4 z-50 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1">
        <Link
          href="/pro-shop-inventory"
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
          <span>Pro Shop</span>
        </Link>

        <Link
          href="/finance"
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Landmark className="w-3.5 h-3.5 text-emerald-400" />
          <span>Finance ERP</span>
        </Link>

        <Link
          href="/bar-kitchen"
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
          <span>Bar & Kitchen</span>
        </Link>

        <Link
          href="/admin/front-desk"
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Front Desk</span>
        </Link>

        <Link
          href="/users"
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-blue-600 text-white shadow-md"
        >
          <User className="w-3.5 h-3.5" />
          <span>Member App</span>
        </Link>
      </div>
    </div>
  );
}
