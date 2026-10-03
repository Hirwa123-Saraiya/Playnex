import Link from "next/link";
import {
  CalendarCheck, Users, Store, UtensilsCrossed, BarChart3, Globe,
  Zap, ArrowRight, Check, Menu, X, Star, ShieldCheck, Sparkles,
} from "lucide-react";
import { MobileNav } from "@/components/landing/MobileNav";

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Court bookings",
    note: "Real-time availability, half-hour slots, member pricing, no double-bookings. Ever.",
  },
  {
    icon: Users,
    title: "Memberships",
    note: "Gold, Silver and Junior tiers with plan-based rates, discounts and renewal tracking.",
  },
  {
    icon: Store,
    title: "Pro shop",
    note: "Rackets, balls, shoes, apparel — one inventory, whether sold at the counter or online.",
  },
  {
    icon: UtensilsCrossed,
    title: "Bar & cafeteria",
    note: "Table tracking, running tabs, member discounts, and shift-based settlements.",
  },
  {
    icon: BarChart3,
    title: "Revenue & reports",
    note: "See today, this week and this month — from courts, shop and bar in one place.",
  },
  {
    icon: Globe,
    title: "Public website",
    note: "Let new members find you, see prices, check availability and book a trial.",
  },
];

const STEPS = [
  { n: "01", title: "Bring your club online", note: "Members, courts, shop and bar — all on one platform." },
  { n: "02", title: "Let members book themselves", note: "From phone or laptop, 24/7. No more WhatsApp." },
  { n: "03", title: "Watch the numbers add up", note: "Live revenue, occupancy and stock — one dashboard." },
];

const TESTIMONIALS = [
  {
    quote: "We cut front-desk admin time by 60% in a month. Bookings just… happen.",
    name: "Rahul Patel",
    role: "Owner, Champions Club",
  },
  {
    quote: "The bar tabs alone used to cost us thousands a month. Now nothing slips.",
    name: "Priya Shah",
    role: "Manager, Riverside Tennis",
  },
  {
    quote: "Our members love that they can see court availability before they leave home.",
    name: "Amit Shah",
    role: "Owner, Smash Badminton Hub",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "₹0",
    period: "forever",
    note: "For clubs getting off WhatsApp & Excel.",
    features: ["Up to 200 members", "Court bookings", "Basic reports", "Email support"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹4,999",
    period: "/ month",
    note: "For growing clubs with shop and bar operations.",
    features: [
      "Unlimited members",
      "Shop + bar modules",
      "Advanced revenue reports",
      "Custom website",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    note: "Multi-branch clubs, franchises, and academies.",
    features: [
      "Everything in Pro",
      "Multi-branch support",
      "Role-based access",
      "Dedicated success manager",
      "API & integrations",
    ],
    cta: "Book a demo",
    highlight: false,
  },
];

export default function LandingPage() {
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

          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#features" className="hover:text-text">Features</a>
            <a href="#how" className="hover:text-text">How it works</a>
            <a href="#pricing" className="hover:text-text">Pricing</a>
            <a href="#stories" className="hover:text-text">Stories</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium hover:border-moss/40"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-mossDark"
            >
              Get started free
            </Link>
          </div>

          <MobileNav />
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-lime/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-moss/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
              <Sparkles size={12} className="text-moss" />
              Built for modern sports clubs
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
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
                href="/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-moss px-6 py-3 text-sm font-semibold text-white hover:bg-mossDark sm:w-auto"
              >
                Get started free <ArrowRight size={16} />
              </Link>
              <Link
                href="/book-demo"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-6 py-3 text-sm font-semibold text-text hover:border-moss/40 sm:w-auto"
              >
                Book a demo
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

          {/* Dev shortcut — remove before production */}
          <div className="mx-auto mt-10 max-w-md text-center">
            <Link
              href="/super-admin/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-dashed border-moss/40 bg-white/60 px-3 py-1.5 text-[11px] font-medium text-moss hover:bg-white"
            >
              <ShieldCheck size={12} /> Dev: open super-admin dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ PROBLEM → SOLUTION ============ */}
      {/* <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-12 md:py-16">
          {/* <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Sound familiar?
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-muted sm:text-base">
              <li className="flex items-start gap-2">
                <X size={16} className="mt-1 shrink-0 text-red-500" />
                Court bookings arranged over WhatsApp
              </li>
              <li className="flex items-start gap-2">
                <X size={16} className="mt-1 shrink-0 text-red-500" />
                Member lists kept in Excel sheets
              </li>
              <li className="flex items-start gap-2">
                <X size={16} className="mt-1 shrink-0 text-red-500" />
                Bar receipts scribbled on paper
              </li>
              <li className="flex items-start gap-2">
                <X size={16} className="mt-1 shrink-0 text-red-500" />
                Court availability checked by phone calls
              </li>
              <li className="flex items-start gap-2">
                <X size={16} className="mt-1 shrink-0 text-red-500" />
                No visibility on revenue or operations
              </li>
            </ul>
          </div>
          {/* <div className="rounded-2xl bg-sand p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-moss sm:text-3xl">
              …meet Playnex.
            </h2>
            <ul className="mt-5 space-y-3 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-1 shrink-0 text-moss" />
                Bookings that members make themselves, 24/7
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-1 shrink-0 text-moss" />
                One member database with tiered plans
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-1 shrink-0 text-moss" />
                Digital bar tabs, receipts, and settlements
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-1 shrink-0 text-moss" />
                Live court availability, everywhere
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="mt-1 shrink-0 text-moss" />
                Real-time revenue across courts, shop, and bar
              </li>
            </ul>
          </div>
        </div>
      </section> */}

      {/* ============ FEATURES ============ */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{f.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      {/* <section id="how" className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Up and running in a day
            </h2>
            <p className="mt-3 text-base text-muted">
              No complicated setup. Import your members, go live, watch
              the numbers.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl bg-sand p-6 sm:p-8">
                <div className="text-3xl font-bold text-moss/30">{s.n}</div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ============ TESTIMONIALS ============ */}
      <section id="stories" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
              className="rounded-2xl border border-line bg-white p-6"
            >
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm text-text">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-xs">
                <div className="font-semibold">{t.name}</div>
                <div className="text-muted">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ PRICING ============ */}
      {/* <section id="pricing" className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-base text-muted">
              Start free. Upgrade when your club grows. Cancel anytime.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PRICING.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl border p-6 sm:p-8 ${
                  p.highlight
                    ? "border-moss bg-sand shadow-lg"
                    : "border-line bg-white"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-bold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted">{p.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{p.note}</p>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={15} className="mt-0.5 shrink-0 text-moss" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.name === "Enterprise" ? "/book-demo" : "/signup"}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                    p.highlight
                      ? "bg-moss text-white hover:bg-mossDark"
                      : "border border-line bg-white text-text hover:border-moss/40"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ============ FINAL CTA ============ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to run a modern club?
            </h2>
            <p className="mt-3 text-sm text-white/70 sm:text-base">
              Join hundreds of clubs that left WhatsApp and Excel behind.
              Get your club online in a single day.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-lime px-6 py-3 text-sm font-semibold text-ink hover:bg-lime/90 sm:w-auto"
              >
                Get started free <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
              >
                Already a member? Login
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
            <span className="font-semibold">Playnex</span>
            <span className="text-muted">· The Champions Club</span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
            <a href="#" className="hover:text-text">Terms</a>
            <a href="#" className="hover:text-text">Privacy</a>
            <a href="#" className="hover:text-text">Contact</a>
            <span>© 2026 Playnex</span>
          </div>
        </div>
      </footer>
    </div>
  );
}