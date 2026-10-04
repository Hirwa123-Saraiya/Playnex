'use client';

import React from 'react';
import { Bell, Search, Clock3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TAB_LABELS: Record<string, string> = {
  QUICK_BOOKING: 'Quick Booking',
  TIMELINE: 'Court Timeline',
  WALKIN: 'Walk-In Booking',
  CHECKIN: 'Player Check-In',
  MEMBERS: 'Member Directory',
  ENQUIRIES: 'Enquiries & Leads',
  STAFF: 'Duty Staff Roster',
  LOGS: 'Daily Shift Audit',
};

interface FrontDeskHeaderProps {
  activeTab: string;
}

export const FrontDeskHeader: React.FC<FrontDeskHeaderProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0 shadow-sm">
      <div>
        <h1 className="text-sm font-black text-slate-900">{TAB_LABELS[activeTab] || activeTab}</h1>
        <p className="text-[11px] text-slate-500">{user?.tenantName || 'Sports Club'} — Front Desk Workstation</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Live clock */}
        <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-700">
          <Clock3 size={13} className="text-emerald-500" />
          <span>{timeStr}</span>
          <span className="text-emerald-400">·</span>
          <span className="font-semibold text-emerald-600">{dateStr}</span>
        </div>

        {/* Search */}
        <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
          <Search size={16} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
            {(user?.name || 'F')[0].toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'Front Desk'}</p>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">Front Desk Operator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
