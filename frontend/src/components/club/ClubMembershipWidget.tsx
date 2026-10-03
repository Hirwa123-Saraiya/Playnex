'use client';

import React from 'react';
import {
  Users,
  UserPlus,
  CalendarClock,
  UserX,
  Clock,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { useClub } from '../../context/ClubContext';

export const ClubMembershipWidget: React.FC = () => {
  const { membershipSummary, setActiveNav } = useClub();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[400px] h-full overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 min-w-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
            Membership Summary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Active tiers, renewals & onboarding
          </p>
        </div>
        <button
          onClick={() => setActiveNav('Members')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors flex-shrink-0 ml-2"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Membership Metrics List */}
      <div className="space-y-3 py-2 flex-1 flex flex-col justify-around min-w-0">
        {/* 1. Active Members */}
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
              Active Members
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {membershipSummary.activeMembers.toLocaleString('en-IN')}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              {membershipSummary.activeGrowth}%
            </span>
          </div>
        </div>

        {/* 2. New Members (This Month) */}
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
              New Members (This Month)
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-900 flex-shrink-0">
            {membershipSummary.newMembersThisMonth}
          </span>
        </div>

        {/* 3. Renewals Due (Next 30 Days) */}
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
              <CalendarClock className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
              Renewals Due (Next 30 Days)
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {membershipSummary.renewalsDueNext30Days}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-rose-600">
              <ArrowUpRight className="w-3 h-3" />
              {membershipSummary.renewalsGrowth}%
            </span>
          </div>
        </div>

        {/* 4. Expired Members */}
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <UserX className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
              Expired Members
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-900 flex-shrink-0">
            {membershipSummary.expiredMembers}
          </span>
        </div>

        {/* 5. Pending Applications */}
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
              Pending Applications
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-900 flex-shrink-0">
            {membershipSummary.pendingApplications}
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 min-w-0">
        <span className="truncate mr-2">Gold, Silver, Junior Tiers</span>
        <button
          onClick={() => setActiveNav('Membership Plans')}
          className="font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex-shrink-0"
        >
          Manage Plans →
        </button>
      </div>
    </div>
  );
};
