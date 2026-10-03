'use client';

import React from 'react';
import {
  Wrench,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers,
  Activity,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface FacilityOpsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const FacilityOpsSidebar: React.FC<FacilityOpsSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'COURTS', label: 'Court Availability Matrix', icon: Layers, badge: '4 Courts' },
    { id: 'TURF', label: 'Surface & Turf Health', icon: Activity, badge: '98%' },
    { id: 'MAINTENANCE', label: 'Maintenance Schedule', icon: Sliders, badge: '1 Due' },
    { id: 'LOGS', label: 'Inspection Audit Trail', icon: ShieldCheck, badge: null },
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
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
              <Wrench size={20} strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-[10px] font-black tracking-widest text-teal-400 uppercase block">
                  FACILITY OPS
                </span>
                <span className="text-sm font-black text-white truncate block">
                  {user?.tenantName || 'Grounds & Courts'}
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

        {/* Groundskeeper Profile Badge */}
        <div className="p-3">
          <div className={`rounded-xl border border-teal-500/20 bg-teal-500/10 ${collapsed ? 'p-2 text-center' : 'px-3 py-2 flex items-center gap-2.5'}`}>
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse shrink-0 inline-block" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">Lead Groundskeeper</p>
                <p className="text-xs text-white font-bold truncate">{user?.name || 'Grounds Lead'}</p>
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
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-teal-500/20 text-teal-400'
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
