"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid, Building2, UserCog, Wallet, Settings,
  Zap, ShieldCheck, PanelLeftClose, PanelLeftOpen, Trophy, BarChart3,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("playnex_super_admin_collapsed");
      if (saved === "true") {
        setIsCollapsed(true);
      }
    } catch {
      // Ignored
    }
  }, []);

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

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("playnex_super_admin_collapsed", String(next));
      } catch {
        // Ignored
      }
      return next;
    });
  };

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
      className={`relative flex shrink-0 flex-col gap-2 py-3 text-white transition-all duration-300 ease-in-out md:h-screen md:overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
        isCollapsed
          ? "w-full md:w-[72px] px-2 md:py-5"
          : "w-full md:w-[248px] px-3 md:px-4 md:py-5"
      }`}
      style={{
        background: "linear-gradient(180deg, #071A3D 0%, #0B1F4D 100%)",
      }}
    >
      {/* Brand */}
      <div
        className={`mb-3 flex items-center md:mb-6 transition-all ${
          isCollapsed ? "justify-center px-0" : "gap-3 px-1"
        }`}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue text-white shadow-sm">
          <Zap size={20} strokeWidth={2.5} />
        </span>
        {!isCollapsed && (
          <div className="min-w-0 transition-opacity duration-200">
            <div className="truncate text-sm font-bold leading-tight">Playnex</div>
            <div className="truncate text-[11px] text-white/60">Super admin</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        className={`no-scrollbar -mx-2 flex flex-1 gap-1 overflow-x-auto px-2 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0 ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        {links.map((l) => {
          const active = pathname === l.href;
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              title={isCollapsed ? l.label : undefined}
              className={`
                group relative flex shrink-0 items-center rounded-xl transition-all duration-150
                ${
                  isCollapsed
                    ? "h-11 w-11 justify-center mx-auto"
                    : "gap-3 px-3 py-2.5 text-sm"
                }
                ${
                  active
                    ? "bg-blue font-semibold text-white shadow-xs"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <Icon size={19} className="shrink-0" />
              {!isCollapsed && (
                <span className="whitespace-nowrap md:flex-1 md:truncate">
                  {l.label}
                </span>
              )}
              {!isCollapsed && l.badge !== undefined && (
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
              {isCollapsed && l.badge !== undefined && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#071A3D]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tenant verified card */}
      {!isCollapsed && (
        <div className="mt-4 hidden rounded-xl border border-white/10 bg-white/5 p-3 md:block">
          <div className="flex items-center gap-2 text-xs font-semibold text-blueAlt">
            <ShieldCheck size={14} />
            Tenant verified
          </div>
          <div className="mt-1 text-[11px] text-white/60">
            All payments are secure &amp; encrypted.
          </div>
        </div>
      )}

      {/* Collapse handle */}
      <button
        type="button"
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3.5 top-6 hidden h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-[#0B1F4D] text-white/80 hover:text-white hover:bg-blue shadow-md transition-all md:flex z-50 cursor-pointer"
      >
        {isCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>
    </aside>
  );
}