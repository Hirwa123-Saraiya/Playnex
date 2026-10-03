'use client';

import React from 'react';
import {
  UserCog,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileCheck,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HRSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const HRSidebar: React.FC<HRSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'ROSTER', label: 'Workstation Shift Roster', icon: Calendar, badge: 'Active' },
    { id: 'ATTENDANCE', label: 'Staff Attendance & Logins', icon: Clock, badge: null },
    { id: 'ROLES', label: 'Role Capability Matrix', icon: Layers, badge: '7 Roles' },
    { id: 'LEAVE', label: 'Leave & Substitution', icon: FileCheck, badge: '2 Req' },
    { id: 'DEPARTMENTS', label: 'Club Departments', icon: Briefcase, badge: null },
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
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              <UserCog size={20} strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-[10px] font-black tracking-widest text-rose-400 uppercase block">
                  HR WORKSTATION
                </span>
                <span className="text-sm font-black text-white truncate block">
                  {user?.tenantName || 'Personnel Office'}
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

        {/* HR Profile Badge */}
        <div className="p-3">
          <div className={`rounded-xl border border-rose-500/20 bg-rose-500/10 ${collapsed ? 'p-2 text-center' : 'px-3 py-2 flex items-center gap-2.5'}`}>
            <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse shrink-0 inline-block" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">HR Administrator</p>
                <p className="text-xs text-white font-bold truncate">{user?.name || 'HR Lead'}</p>
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
                    ? 'bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-slate-950/20 text-white' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed && (
          <div className="mb-2 px-2">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Workstation Login</p>
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
