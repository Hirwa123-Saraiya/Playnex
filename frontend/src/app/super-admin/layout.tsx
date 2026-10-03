'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/super-admin/Sidebar';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  MapPin,
  CalendarDays,
  LogOut,
  Settings,
  BarChart3,
  Users,
  Shield,
} from 'lucide-react';

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

  const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex h-screen w-full overflow-hidden flex-col md:flex-row bg-[#F7FAFC] text-[#1E293B] font-sans">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#D9E6F5] bg-white/95 backdrop-blur-md px-4 md:px-8 transition-all">
          {/* Global Search */}
          <div className="relative order-2 w-full min-w-0 md:order-1 md:max-w-md md:flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
            />
            <input
              placeholder="Search clubs, tenant IDs, administrators..."
              className="h-10 w-full rounded-xl border border-[#D9E6F5] bg-[#F7FAFC] pl-9 pr-12 text-xs sm:text-sm text-[#1E293B] outline-none placeholder:text-[#64748B] focus:border-[#1565D8] focus:bg-white focus:ring-2 focus:ring-[#1565D8]/10 transition-all"
            />
            <span className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-[#D9E6F5] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#64748B] shadow-xs md:inline-block">
              ⌘K
            </span>
          </div>

          {/* Right Controls */}
          <div className="order-1 ml-auto flex items-center gap-2 sm:gap-2.5 md:order-3 md:ml-0">
            {/* Live Date Pill */}
            <div className="hidden lg:flex h-9 items-center gap-2 rounded-xl border border-[#D9E6F5] bg-[#F7FAFC] px-3 text-xs font-semibold text-[#1E293B]">
              <CalendarDays size={14} className="text-[#1565D8]" />
              <span>{currentDateFormatted}</span>
            </div>

            {/* Platform Scope Badge */}
            <div className="hidden md:flex h-9 items-center gap-1.5 rounded-xl border border-[#D9E6F5] bg-[#EAF3FF] px-3 text-xs font-bold text-[#1565D8]">
              <MapPin size={13} className="text-[#1565D8]" />
              <span>All Clubs</span>
            </div>

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-xl border border-[#D9E6F5] bg-white text-[#64748B] hover:bg-[#EAF3FF] hover:text-[#1565D8] transition-colors"
            >
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Message Center */}
            <button
              aria-label="Messages"
              className="grid h-9 w-9 place-items-center rounded-xl border border-[#D9E6F5] bg-white text-[#64748B] hover:bg-[#EAF3FF] hover:text-[#1565D8] transition-colors"
            >
              <MessageSquare size={15} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-10 items-center gap-2.5 rounded-xl border border-[#D9E6F5] bg-white pl-1.5 pr-2.5 hover:bg-[#F7FAFC] transition-colors shadow-xs"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#1565D8] text-xs font-extrabold text-white shadow-xs">
                  {initial}
                </span>
                <span className="hidden text-left leading-tight md:block">
                  <span className="block text-xs font-bold text-[#0B1F4D]">{displayName}</span>
                  <span className="block text-[10px] font-semibold text-[#64748B]">Super Admin</span>
                </span>
                <ChevronDown
                  size={13}
                  className={`text-[#64748B] transition-transform duration-150 ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#D9E6F5] bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* Dropdown Header */}
                  <div className="border-b border-[#D9E6F5]/80 px-3 py-2.5">
                    <p className="text-xs font-bold text-[#0B1F4D]">{displayName}</p>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {user?.email || 'superadmin@playnex.com'}
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#EAF3FF] px-2 py-0.5 text-[10px] font-bold text-[#1565D8]">
                      <Shield size={10} />
                      Platform Super Administrator
                    </span>
                  </div>

                  {/* Super Admin Navigation Links (Strictly no client/club dashboard link) */}
                  <div className="py-1.5 space-y-0.5">
                    <Link
                      href="/super-admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#EAF3FF] hover:text-[#1565D8] transition-colors"
                    >
                      <Settings size={14} className="text-[#64748B]" />
                      <span>Platform Settings</span>
                    </Link>

                    <Link
                      href="/super-admin/reports"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#EAF3FF] hover:text-[#1565D8] transition-colors"
                    >
                      <BarChart3 size={14} className="text-[#64748B]" />
                      <span>Reports & Analytics</span>
                    </Link>

                    <Link
                      href="/super-admin/admins"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#1E293B] hover:bg-[#EAF3FF] hover:text-[#1565D8] transition-colors"
                    >
                      <Users size={14} className="text-[#64748B]" />
                      <span>Club Administrators</span>
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-[#D9E6F5]/80 pt-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
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

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}