'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  User,
  Key,
  Sliders,
  LogOut,
  Menu,
  Check,
  Building,
  Shield,
} from 'lucide-react';
import { useClub } from '../../context/ClubContext';
import { useAuth } from '@/context/AuthContext';

export const ClubHeader: React.FC = () => {
  const router = useRouter();
  const { user: authUser, logout: authLogout, isSuperAdmin } = useAuth();
  const {
    club,
    selectedBranchId,
    selectedBranch,
    setSelectedBranchId,
    user,
    notifications,
    searchQuery,
    setSearchQuery,
    setMobileSidebarOpen,
    currentDateFormatted,
    markNotificationRead,
    setActiveModal,
  } = useClub();

  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);

  const branchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) {
        setBranchDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between transition-all min-w-0">
      {/* Left Area: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md min-w-0">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members, bookings, courts, staff..."
            className="w-full pl-9 pr-10 py-1.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Date, Branch Switcher, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Current Date Widget */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentDateFormatted}</span>
        </div>

        {/* Branch Selector Dropdown */}
        <div className="relative" ref={branchRef}>
          <button
            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-700 transition-all shadow-xs"
            title="Switch Active Club Branch"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-[170px]">
              {selectedBranch.name}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                branchDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {branchDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Select Active Club Branch
                </p>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                  Tenant: {club.tenantId}
                </p>
              </div>
              <div className="py-1">
                {club.branches.map((branch) => {
                  const isSelected = branch.id === selectedBranchId;
                  return (
                    <button
                      key={branch.id}
                      onClick={() => {
                        setSelectedBranchId(branch.id);
                        setBranchDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-start gap-2.5 transition-colors ${
                        isSelected
                          ? 'bg-blue-50/80 text-blue-700'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Building
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          isSelected ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      />
                      <div className="flex-1 truncate">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs truncate">
                            {branch.name}
                          </span>
                          {branch.isMain && (
                            <span className="ml-1 text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              HQ
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {branch.address}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </button>

          {notificationsDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-800">
                  Notifications & Alerts
                </span>
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {unreadNotifs} unread
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                      n.unread ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.subtitle}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setNotificationsDropdownOpen(false)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All Activity & Logs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Messages Shortcut */}
        <button
          onClick={() => setActiveModal('messages')}
          className="hidden sm:flex p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Messages"
          title="Direct Communications"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 pl-2 pr-2.5 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 p-[1.5px] shadow-sm">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs font-bold text-white uppercase">
                    {(authUser?.name || user.name).slice(0, 2)}
                  </span>
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {authUser?.name || user.name}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {authUser?.roleName || authUser?.systemRole || user.role}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                profileDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{authUser?.name || user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{authUser?.email || user.email}</p>
                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                  {authUser?.roleName || authUser?.systemRole || user.role}
                </div>
              </div>
              <div className="py-1">
                {isSuperAdmin && (
                  <Link
                    href="/super-admin/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 flex items-center gap-2.5 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Super Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setActiveModal('profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setActiveModal('change-password');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <Key className="w-4 h-4 text-slate-400" />
                  Change Password
                </button>
                <button
                  onClick={() => {
                    setActiveModal('preferences');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  Preferences
                </button>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={async () => {
                    setProfileDropdownOpen(false);
                    await authLogout();
                    router.push('/login');
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
