'use client';

import React from 'react';
import {
  Users,
  Calendar,
  IndianRupee,
  Building2,
  Clock,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react';
import { ClubKpiItem } from '../../types/club.types';
import { useClub } from '../../context/ClubContext';

const iconMap = {
  users: Users,
  calendar: Calendar,
  revenue: IndianRupee,
  building: Building2,
  clock: Clock,
  trophy: Trophy,
};

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    hoverBorder: 'hover:border-blue-300',
  },
  emerald: {
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-300',
  },
  amber: {
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    hoverBorder: 'hover:border-amber-300',
  },
  purple: {
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-300',
  },
  rose: {
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    hoverBorder: 'hover:border-rose-300',
  },
  cyan: {
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    hoverBorder: 'hover:border-cyan-300',
  },
};

interface ClubKpiCardProps {
  kpi: ClubKpiItem;
}

export const ClubKpiCard: React.FC<ClubKpiCardProps> = ({ kpi }) => {
  const { setActiveNav } = useClub();
  const IconComponent = iconMap[kpi.icon] || Users;
  const style = colorStyles[kpi.accentColor] || colorStyles.blue;

  const handleClick = () => {
    if (kpi.id === 'kpi_members') setActiveNav('Members');
    else if (kpi.id === 'kpi_bookings') setActiveNav('Bookings');
    else if (kpi.id === 'kpi_revenue') setActiveNav('Finance & Payments');
    else if (kpi.id === 'kpi_facilities') setActiveNav('Facilities');
    else if (kpi.id === 'kpi_approvals') setActiveNav('Approvals');
    else if (kpi.id === 'kpi_events') setActiveNav('Events & Tournaments');
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[148px] h-full flex flex-col justify-between overflow-hidden min-w-0 ${style.hoverBorder}`}
    >
      {/* Top row: Icon and Title */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}
        >
          <IconComponent className={`w-5 h-5 ${style.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] xl:text-xs font-bold text-slate-500 uppercase tracking-wider leading-snug break-normal">
            {kpi.title}
          </p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {kpi.value}
            </h3>
          </div>
        </div>

        {kpi.id === 'kpi_approvals' && (
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
        )}
      </div>

      {/* Bottom row: Trend badge & Secondary explanation */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-xs min-w-0">
        <div className="flex items-center gap-1.5 font-medium min-w-0 flex-wrap">
          {kpi.growth !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold ${
                kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {kpi.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              {kpi.growth}%
            </span>
          )}
          <span className="text-slate-500 text-[11px] leading-tight break-words">
            {kpi.growthLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
