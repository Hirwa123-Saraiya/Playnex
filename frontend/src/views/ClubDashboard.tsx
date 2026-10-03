'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import { ClubKpiCard } from '../components/club/ClubKpiCard';
import { ClubRevenueChart } from '../components/club/ClubRevenueChart';
import { ClubOccupancyWidget } from '../components/club/ClubOccupancyWidget';
import { ClubBookingTable } from '../components/club/ClubBookingTable';
import { ClubMembershipWidget } from '../components/club/ClubMembershipWidget';
import { ClubApprovalWidget } from '../components/club/ClubApprovalWidget';
import { ClubQuickActions } from '../components/club/ClubQuickActions';
import { ClubEventsWidget } from '../components/club/ClubEventsWidget';
import { ClubActivityFeed } from '../components/club/ClubActivityFeed';
import { ClubNotificationPanel } from '../components/club/ClubNotificationPanel';
import { Sparkles } from 'lucide-react';

export const ClubDashboard: React.FC = () => {
  const { kpis, club, selectedBranch, user } = useClub();

  return (
    <div className="space-y-6 pb-12 w-full min-w-0 overflow-x-hidden">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {user.name}!
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              <Sparkles className="w-3 h-3 text-blue-600 flex-shrink-0" />
              {club.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1 break-words">
            Here's what's happening at{' '}
            <span className="font-semibold text-slate-700">{club.name}</span> (
            {selectedBranch.shortName}) today.
          </p>
        </div>
      </div>

      {/* SECTION 1: 6 KPI CARDS */}
      <section aria-label="Key Performance Indicators" className="w-full min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
          {kpis.map((kpi) => (
            <ClubKpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* SECTION 2 & 3: REVENUE OVERVIEW & FACILITY OCCUPANCY */}
      <section aria-label="Revenue and Occupancy Metrics" className="w-full min-w-0">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          {/* Revenue Section (col-span-7) */}
          <div className="xl:col-span-7 h-full min-w-0">
            <ClubRevenueChart />
          </div>

          {/* Occupancy Section (col-span-5) */}
          <div className="xl:col-span-5 h-full min-w-0">
            <ClubOccupancyWidget />
          </div>
        </div>
      </section>

      {/* SECTION 4, 5, 6, 7: TODAY'S BOOKINGS, MEMBERSHIP SUMMARY, PENDING APPROVALS, QUICK ACTIONS */}
      <section aria-label="Operational Summaries and Actions" className="w-full min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
          {/* Section 4: Today's Bookings */}
          <div className="h-full min-w-0">
            <ClubBookingTable />
          </div>

          {/* Section 5: Membership Summary */}
          <div className="h-full min-w-0">
            <ClubMembershipWidget />
          </div>

          {/* Section 6: Pending Approvals */}
          <div className="h-full min-w-0">
            <ClubApprovalWidget />
          </div>

          {/* Section 7: Quick Actions */}
          <div className="h-full min-w-0">
            <ClubQuickActions />
          </div>
        </div>
      </section>

      {/* SECTION 8, 9, 10: UPCOMING EVENTS, RECENT ACTIVITY, NOTIFICATIONS & ALERTS */}
      <section aria-label="Events, Feed and Alerts" className="w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* Section 8: Upcoming Events */}
          <div className="h-full min-w-0">
            <ClubEventsWidget />
          </div>

          {/* Section 9: Recent Activity */}
          <div className="h-full min-w-0">
            <ClubActivityFeed />
          </div>

          {/* Section 10: Notifications & Alerts */}
          <div className="h-full min-w-0">
            <ClubNotificationPanel />
          </div>
        </div>
      </section>
    </div>
  );
};
