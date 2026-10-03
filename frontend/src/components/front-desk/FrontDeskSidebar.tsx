'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  UserCheck,
  UserRound,
  Users,
  Clock3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface FrontDeskSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const FrontDeskSidebar: React.FC<FrontDeskSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'QUICK_BOOKING', label: 'Quick Reservation', icon: CalendarDays, badge: 'Live' },
    { id: 'TIMELINE', label: 'Court Shift Timeline', icon: Clock3, badge: null },
    { id: 'MEMBERS', label: 'Member Directory', icon: UserRound, badge: null },
    { id: 'CHECKIN', label: 'Player Check-in', icon: UserCheck, badge: 'Active' },
    { id: 'STAFF', label: 'Duty Staff Roster', icon: Users, badge: null },
    { id: 'LOGS', label: 'Daily Shift Audit', icon: FileSpreadsheet, badge: null },
  ];

  return (
    <aside
      className={`bg-slate-950 text-slate-300 flex flex-col justify-between transition-all duration-300 ease-in-out z-30 shrink-0 border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Banner */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase block">
                  FRONT DESK STATION
                </span>
                <span className="text-sm font-black text-white truncate block">
                  {user?.tenantName || 'Command Center'}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Live Indicator */}
        <div className="p-3">
          <div className={`rounded-xl border border-emerald-500/20 bg-emerald-500/10 ${collapsed ? 'p-2 text-center' : 'px-3 py-2 flex items-center gap-2.5'}`}>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0 inline-block" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Station Online</p>
                <p className="text-xs text-slate-400 truncate">Operator: {user?.name || 'Front Desk Staff'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Operator Info & Logout */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed && (
          <div className="mb-2 px-2">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Logged In Workstation</p>
            <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-bold transition border border-slate-800"
        >
          <LogOut size={16} />
          {!collapsed && <span>Exit Workstation</span>}
        </button>
      </div>
    </aside>
  );
};
