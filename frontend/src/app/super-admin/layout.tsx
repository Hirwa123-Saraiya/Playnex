'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/super-admin/Sidebar";
import { useAuth } from '@/context/AuthContext';
import {
  Search, Bell, MessageSquare, ChevronDown, MapPin, CalendarDays,
  LogOut, LayoutDashboard, Building2,
} from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = user?.name || 'Super Admin';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-sand text-text md:flex-row">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex flex-wrap items-center gap-3 border-b border-line bg-sand px-5 py-3 md:px-8">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1 md:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              placeholder="Search clubs, admins, users…"
              className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-14 text-sm outline-none placeholder:text-muted focus:border-moss/40"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-line bg-sand px-1.5 py-0.5 text-[10px] font-medium text-muted">
              ⌘K
            </span>
          </div>

          {/* Date chip */}
          <button className="hidden h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm text-muted hover:text-text md:flex">
            <CalendarDays size={15} />
            Mon, 14 Oct 2026
          </button>

          {/* Scope chip */}
          <button className="hidden h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm md:flex">
            <MapPin size={15} className="text-muted" />
            <span className="font-medium">All clubs</span>
            <ChevronDown size={14} className="text-muted" />
          </button>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-muted hover:text-text"
            >
              <Bell size={16} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button
              aria-label="Messages"
              className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-muted hover:text-text"
            >
              <MessageSquare size={16} />
            </button>

            {/* Profile Pill & Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-10 items-center gap-2 rounded-lg border border-line bg-white pl-1 pr-3 hover:bg-slate-50 transition-colors"
              >
                <span className="grid h-8 w-8 place-items-center rounded-md bg-moss text-sm font-semibold text-white">
                  {initial}
                </span>
                <span className="hidden text-left leading-tight md:block">
                  <span className="block text-xs font-semibold">{displayName}</span>
                  <span className="block text-[10px] text-muted">Super admin</span>
                </span>
                <ChevronDown size={14} className={`text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl border border-line bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="border-b border-line px-3 py-2">
                    <p className="text-xs font-bold text-text">{displayName}</p>
                    <p className="text-[11px] text-muted truncate">{user?.email || 'superadmin@playnex.com'}</p>
                    <span className="mt-1 inline-block rounded bg-lime/30 px-1.5 py-0.5 text-[10px] font-semibold text-ink">
                      Platform Super Admin
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text hover:bg-sand transition-colors"
                    >
                      <Building2 size={14} className="text-moss" />
                      <span>Switch to Club Dashboard</span>
                    </Link>
                  </div>

                  <div className="border-t border-line pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}