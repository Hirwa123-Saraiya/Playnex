import Link from "next/link";
import { MapPin, Phone, Mail, Zap } from "lucide-react";
import type { PublicClubInfo } from "@/types/publicSite.types";

export function PublicFooter({ info }: { info: PublicClubInfo }) {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-moss text-lime">
              <Zap size={15} strokeWidth={2.5} />
            </span>
            <span className="font-semibold">{info.name}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted">{info.tagline}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <MapPin size={14} /> {info.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} /> {info.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} /> {info.email}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/plans" className="hover:text-text">Plans & pricing</Link></li>
            <li><Link href="/availability" className="hover:text-text">Weekly availability</Link></li>
            <li><Link href="/shop" className="hover:text-text">Shop</Link></li>
            <li><Link href="/trial" className="hover:text-text">Book a trial</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Hours</h4>
          <p className="mt-3 text-sm text-muted">
            Open daily
            <br />
            {info.hours.open} – {info.hours.close}
          </p>
          <p className="mt-3 text-sm text-muted">
            Sports: {info.sports.join(" · ")}
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted sm:px-6">
          <span>© 2026 {info.name}</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-text">Login</Link>
            <Link href="/signup" className="hover:text-text">Sign up</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}