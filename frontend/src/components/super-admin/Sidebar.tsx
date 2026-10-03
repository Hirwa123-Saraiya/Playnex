"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid, Building2, UserCog, Wallet, Settings,
  Zap, ShieldCheck, PanelLeftClose, Trophy, BarChart3,
} from "lucide-react";
import { clubsService } from "@/services/clubs.service";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  badgeTone?: "blue" | "danger" | "lime";
};
export default function Sidebar() {
  const pathname = usePathname();
  const [clubCount, setClubCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await clubsService.getStats();
        if (isMounted && res.success && res.data) {
          setClubCount(res.data.total_clubs);
        }
      } catch (e) {
        // Ignored
      }
    }
    loadStats();
    return () => { isMounted = false; };
  }, [pathname]);

  const links: NavItem[] = [
    { label: "Dashboard",   href: "/super-admin/dashboard", icon: LayoutGrid },
    { label: "Clubs",       href: "/super-admin/clubs",     icon: Building2, badge: clubCount !== null ? clubCount : undefined, badgeTone: "lime" },
    { label: "Club admins", href: "/super-admin/admins",    icon: UserCog },
    { label: "Revenue",     href: "/super-admin/revenue",   icon: Wallet },
    { label: "Events",      href: "/super-admin/events",    icon: Trophy },
    { label: "Reports",     href: "/super-admin/reports",   icon: BarChart3 },
    { label: "Settings",    href: "/super-admin/settings",  icon: Settings },
  ];

  return (
    <aside
      className="relative flex w-full shrink-0 flex-col gap-2 px-3 py-3 text-white md:min-h-screen md:w-[248px] md:px-4 md:py-5"
      style={{
        background: "linear-gradient(180deg, #071A3D 0%, #0B1F4D 100%)",
      }}
    >
      {/* Brand */}
      <div className="mb-3 flex items-start gap-3 px-1 md:mb-6">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue text-white md:h-10 md:w-10">
          <Zap size={18} strokeWidth={2.5} />
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold leading-tight">Playnex</div>
          <div className="truncate text-[11px] text-white/60">Super admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="no-scrollbar -mx-3 flex flex-1 gap-1 overflow-x-auto px-3 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
        {links.map((l) => {
          const active = pathname === l.href;
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`
                group flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors
                md:gap-3 md:py-2.5
                ${
                  active
                    ? "bg-blue font-semibold text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <Icon size={18} className="shrink-0" />
              <span className="whitespace-nowrap md:flex-1 md:truncate">
                {l.label}
              </span>
              {l.badge !== undefined && (
                <span
                  className={`
                    rounded-full px-2 py-0.5 text-[10px] font-semibold
                    ${
                      l.badgeTone === "danger"
                        ? "bg-red-500 text-white"
                        : active
                          ? "bg-white/25 text-white"
                          : "bg-white/15 text-white group-hover:bg-white/25"
                    }
                  `}
                >
                  {l.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tenant verified card */}
      <div className="mt-4 hidden rounded-xl border border-white/10 bg-white/5 p-3 md:block">
        <div className="flex items-center gap-2 text-xs font-semibold text-blueAlt">
          <ShieldCheck size={14} />
          Tenant verified
        </div>
        <div className="mt-1 text-[11px] text-white/60">
          All payments are secure &amp; encrypted.
        </div>
      </div>

      {/* Collapse handle */}
      <button
        type="button"
        aria-label="Collapse sidebar"
        className="absolute -right-3 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-navyDeep text-white/70 hover:text-white md:flex"
      >
        <PanelLeftClose size={14} />
      </button>
    </aside>
  );
}