'use client';

import React from 'react';
import {
  ShieldCheck,
  CalendarDays,
  Clock3,
  UserCheck,
  Radio,
  MessageSquare,
  Users,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FrontDeskSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { id: 'QUICK_BOOKING', label: 'Quick Booking',     icon: CalendarDays,   badge: 'Live',   badgeColor: 'bg-emerald-600' },
  { id: 'TIMELINE',      label: 'Court Timeline',    icon: Clock3,         badge: null },
  { id: 'WALKIN',        label: 'Walk-In Booking',   icon: Radio,          badge: null },
  { id: 'CHECKIN',       label: 'Player Check-In',   icon: UserCheck,      badge: 'Active', badgeColor: 'bg-blue-600' },
  { id: 'MEMBERS',       label: 'Member Directory',  icon: Users,          badge: null },
  { id: 'ENQUIRIES',     label: 'Enquiries & Leads', icon: MessageSquare,  badge: null },
  { id: 'STAFF',         label: 'Duty Staff Roster', icon: Users,          badge: null },
  { id: 'LOGS',          label: 'Daily Shift Audit', icon: FileSpreadsheet,badge: null },
];

export const FrontDeskSidebar: React.FC<FrontDeskSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`bg-slate-950 text-slate-300 flex flex-col h-full justify-between transition-all duration-300 ease-in-out z-30 shrink-0 border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col min-h-0">
        {/* Brand Banner */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center shadow-md shrink-0">
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
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Live Status */}
        {!collapsed && (
          <div className="px-4 py-2 shrink-0">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Station Online</p>
                <p className="text-[10px] text-slate-400 truncate">Operator: {user?.name || 'Front Desk'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        isActive ? 'bg-slate-950/20 text-slate-950' : `${item.badgeColor || 'bg-slate-700'} text-white`
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/80 shrink-0">
        {!collapsed && (
          <div className="mb-2 px-2">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Logged In</p>
            <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-bold transition border border-slate-800"
        >
          <LogOut size={15} />
          {!collapsed && <span>Exit Workstation</span>}
        </button>
      </div>
    </aside>
  );
};
