import Link from "next/link";
import { Zap } from "lucide-react";

export function PublicHeader() {
  return (
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
          <Link href="/plans" className="hover:text-text">Plans</Link>
          <Link href="/availability" className="hover:text-text">Availability</Link>
          <Link href="/shop" className="hover:text-text">Shop</Link>
          <Link href="/trial" className="hover:text-text">Book a trial</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium hover:border-moss/40"
          >
            Login
          </Link>
          <Link
            href="/trial"
            className="hidden rounded-lg bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-mossDark sm:inline-block"
          >
            Book a trial
          </Link>
        </div>
      </div>
    </header>
  );
}