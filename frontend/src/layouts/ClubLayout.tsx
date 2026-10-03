'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import { ClubSidebar } from '../components/club/ClubSidebar';
import { ClubHeader } from '../components/club/ClubHeader';
import { ClubModal } from '../components/club/ClubModal';

// Views
import { ClubDashboard } from '../views/ClubDashboard';
import { ClubBookings } from '../views/ClubBookings';
import { ClubMembers } from '../views/ClubMembers';
import { ClubFacilities } from '../views/ClubFacilities';
import { ClubDepartments } from '../views/ClubDepartments';
import { ClubRestaurant } from '../views/ClubRestaurant';
import { ClubEvents } from '../views/ClubEvents';
import { ClubMembership } from '../views/ClubMembership';
import { ClubStaff } from '../views/ClubStaff';
import { ClubFinance } from '../views/ClubFinance';
import { ClubReports } from '../views/ClubReports';
import { ClubCommunications } from '../views/ClubCommunications';
import { ClubApprovals } from '../views/ClubApprovals';
import { ClubRoles } from '../views/ClubRoles';
import { ClubSettings } from '../views/ClubSettings';

interface ClubLayoutProps {
  children?: React.ReactNode;
}

export const ClubLayout: React.FC<ClubLayoutProps> = ({ children }) => {
  const { activeNav, sidebarCollapsed } = useClub();

  const renderCurrentView = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <ClubDashboard />;
      case 'Bookings':
        return <ClubBookings />;
      case 'Members':
        return <ClubMembers />;
      case 'Facilities':
        return <ClubFacilities />;
      case 'Departments':
        return <ClubDepartments />;
      case 'Restaurant & Bar':
        return <ClubRestaurant />;
      case 'Events & Tournaments':
        return <ClubEvents />;
      case 'Membership Plans':
        return <ClubMembership />;
      case 'Staff Management':
        return <ClubStaff />;
      case 'Finance & Payments':
        return <ClubFinance />;
      case 'Reports & Analytics':
        return <ClubReports />;
      case 'Communications':
        return <ClubCommunications />;
      case 'Approvals':
        return <ClubApprovals />;
      case 'Settings':
        return <ClubSettings />;
      default:
        return children || <ClubDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex w-full min-w-0 overflow-x-hidden">
      {/* Sidebar Navigation */}
      <ClubSidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 w-full transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Header */}
        <ClubHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1680px] w-full mx-auto min-w-0">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <ClubModal />
    </div>
  );
};
