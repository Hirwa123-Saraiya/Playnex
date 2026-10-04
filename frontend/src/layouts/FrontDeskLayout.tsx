'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FrontDeskSidebar } from '../components/front-desk/FrontDeskSidebar';
import { FrontDeskHeader } from '../components/front-desk/FrontDeskHeader';
import { Loader2 } from 'lucide-react';

// Views — all built out
import FrontDeskBookingView from '../views/front-desk/FrontDeskBookingView';
import FrontDeskTimelineView from '../views/front-desk/FrontDeskTimelineView';
import FrontDeskMembersView from '../views/front-desk/FrontDeskMembersView';
import FrontDeskCheckinView from '../views/front-desk/FrontDeskCheckinView';
import FrontDeskStaffView from '../views/front-desk/FrontDeskStaffView';
import FrontDeskLogsView from '../views/front-desk/FrontDeskLogsView';
import FrontDeskEnquiriesView from '../views/front-desk/FrontDeskEnquiriesView';
import FrontDeskWalkInView from '../views/front-desk/FrontDeskWalkInView';

export const FrontDeskLayout: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('QUICK_BOOKING');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const renderView = () => {
    switch (activeTab) {
      case 'QUICK_BOOKING': return <FrontDeskBookingView />;
      case 'TIMELINE':      return <FrontDeskTimelineView />;
      case 'MEMBERS':       return <FrontDeskMembersView />;
      case 'CHECKIN':       return <FrontDeskCheckinView />;
      case 'WALKIN':        return <FrontDeskWalkInView />;
      case 'ENQUIRIES':     return <FrontDeskEnquiriesView />;
      case 'STAFF':         return <FrontDeskStaffView />;
      case 'LOGS':          return <FrontDeskLogsView />;
      default:              return <FrontDeskBookingView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-sans text-slate-900">
      <FrontDeskSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <FrontDeskHeader activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 max-w-[1720px] w-full mx-auto min-w-0">
          {renderView()}
        </main>
      </div>
    </div>
  );
};
