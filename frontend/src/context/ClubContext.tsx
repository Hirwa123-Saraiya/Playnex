'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  TenantId,
  ClubId,
  BranchId,
  Branch,
  Club,
  UserProfile,
  ClubKpiItem,
  RevenueDepartmentBreakdown,
  RevenueTrendPoint,
  FacilityOccupancyItem,
  TodayBookingItem,
  MembershipSummaryData,
  ApprovalItem,
  UpcomingEventItem,
  ActivityTimelineItem,
  NotificationAlertItem,
} from '../types/club.types';
import {
  mockClub,
  mockCurrentUser,
  getMockKpis,
  getMockRevenueDepartments,
  getMockRevenueTrend,
  getMockFacilityOccupancy,
  getMockTodayBookings,
  getMockMembershipSummary,
  getMockPendingApprovals,
  getMockUpcomingEvents,
  getMockActivities,
  getMockNotifications,
} from '../mock/clubMockData';

interface ClubContextValue {
  tenantId: TenantId;
  clubId: ClubId;
  club: Club;
  user: UserProfile;
  selectedBranchId: BranchId;
  selectedBranch: Branch;
  setSelectedBranchId: (branchId: BranchId) => void;
  kpis: ClubKpiItem[];
  revenueDepartments: RevenueDepartmentBreakdown[];
  revenueTrend: RevenueTrendPoint[];
  occupancies: FacilityOccupancyItem[];
  bookings: TodayBookingItem[];
  membershipSummary: MembershipSummaryData;
  approvals: ApprovalItem[];
  upcomingEvents: UpcomingEventItem[];
  activities: ActivityTimelineItem[];
  notifications: NotificationAlertItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  timeframe: 'today' | 'week' | 'month' | 'year' | '30days';
  setTimeframe: (tf: 'today' | 'week' | 'month' | 'year' | '30days') => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  handleApprove: (approvalId: string, subItemId?: string) => void;
  handleReject: (approvalId: string, subItemId?: string) => void;
  markNotificationRead: (id: string) => void;
  currentDateFormatted: string;
}

const ClubContext = createContext<ClubContextValue | undefined>(undefined);

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId>('branch_ahmedabad_main');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year' | '30days'>('30days');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Dynamic state for approvals so user can interactively approve/reject
  const [approvalsState, setApprovalsState] = useState<ApprovalItem[]>([]);
  const [notificationsState, setNotificationsState] = useState<NotificationAlertItem[]>([]);

  // Update data when branch changes
  useEffect(() => {
    setApprovalsState(getMockPendingApprovals(selectedBranchId));
    setNotificationsState(getMockNotifications(selectedBranchId));
  }, [selectedBranchId]);

  const selectedBranch = useMemo(() => {
    return (
      mockClub.branches.find((b) => b.id === selectedBranchId) ||
      mockClub.branches[0]
    );
  }, [selectedBranchId]);

  const kpis = useMemo(() => getMockKpis(selectedBranchId), [selectedBranchId]);
  const revenueDepartments = useMemo(() => getMockRevenueDepartments(selectedBranchId), [selectedBranchId]);
  const revenueTrend = useMemo(() => getMockRevenueTrend(selectedBranchId, timeframe), [selectedBranchId, timeframe]);
  const occupancies = useMemo(() => getMockFacilityOccupancy(selectedBranchId), [selectedBranchId]);
  const bookings = useMemo(() => getMockTodayBookings(selectedBranchId), [selectedBranchId]);
  const membershipSummary = useMemo(() => getMockMembershipSummary(selectedBranchId), [selectedBranchId]);
  const upcomingEvents = useMemo(() => getMockUpcomingEvents(selectedBranchId), [selectedBranchId]);
  const activities = useMemo(() => getMockActivities(selectedBranchId), [selectedBranchId]);

  const handleApprove = (approvalId: string, subItemId?: string) => {
    setApprovalsState((prev) =>
      prev.map((app) => {
        if (app.id === approvalId) {
          return {
            ...app,
            count: Math.max(0, app.count - 1),
            items: subItemId ? app.items.filter((item) => item.id !== subItemId) : app.items.slice(1),
          };
        }
        return app;
      })
    );
  };

  const handleReject = (approvalId: string, subItemId?: string) => {
    setApprovalsState((prev) =>
      prev.map((app) => {
        if (app.id === approvalId) {
          return {
            ...app,
            count: Math.max(0, app.count - 1),
            items: subItemId ? app.items.filter((item) => item.id !== subItemId) : app.items.slice(1),
          };
        }
        return app;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotificationsState((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const currentDateFormatted = 'Mon, 14 Oct 2025';

  const value: ClubContextValue = {
    tenantId: mockClub.tenantId,
    clubId: mockClub.id,
    club: mockClub,
    user: mockCurrentUser,
    selectedBranchId,
    selectedBranch,
    setSelectedBranchId,
    kpis,
    revenueDepartments,
    revenueTrend,
    occupancies,
    bookings,
    membershipSummary,
    approvals: approvalsState,
    upcomingEvents,
    activities,
    notifications: notificationsState,
    searchQuery,
    setSearchQuery,
    timeframe,
    setTimeframe,
    activeNav,
    setActiveNav,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    activeModal,
    setActiveModal,
    handleApprove,
    handleReject,
    markNotificationRead,
    currentDateFormatted,
  };

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export function useClub() {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
}
