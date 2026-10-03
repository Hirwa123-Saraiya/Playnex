'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { clubsService } from '../services/clubs.service';
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
  const { user: authUser } = useAuth();
  const [liveClubDetails, setLiveClubDetails] = useState<any | null>(null);

  useEffect(() => {
    if (authUser?.tenantId) {
      clubsService
        .getClubById(authUser.tenantId)
        .then((res) => {
          if (res.success && res.data) {
            setLiveClubDetails(res.data);
          }
        })
        .catch((err) => {
          console.warn('Could not load dynamic club details:', err);
        });
    }
  }, [authUser?.tenantId]);

  const club: Club = useMemo(() => {
    const clubName = liveClubDetails?.name || authUser?.tenantName || 'Sports Club';
    const tenantId = authUser?.tenantId || 'tenant_main';
    const location = liveClubDetails?.location || 'Local';
    const address = liveClubDetails?.address || `${location} Sports Complex`;
    const phone = liveClubDetails?.phone || '+91 98765 43210';
    return {
      id: tenantId,
      name: clubName,
      tagline: `${authUser?.roleName || (authUser?.systemRole === 'CLUB_OWNER' ? 'Club Owner' : 'Club')} Dashboard`,
      tenantId: tenantId,
      branches: [
        {
          id: `${tenantId}_branch_main`,
          name: `${clubName} (Main Facility)`,
          shortName: 'Main Facility',
          city: location,
          isMain: true,
          address: address,
          phone: phone,
        },
      ],
    };
  }, [authUser, liveClubDetails]);

  const user: UserProfile = useMemo(() => {
    const clubName = liveClubDetails?.name || authUser?.tenantName || 'Sports Club';
    return {
      id: authUser?.userId || 'usr_current',
      name: authUser?.name || 'Club Administrator',
      email: authUser?.email || 'admin@playnex.com',
      role: (authUser?.roleName || (authUser?.systemRole === 'CLUB_OWNER' ? 'Club Owner' : authUser?.systemRole || 'Staff')) as any,
      clubName: clubName,
      activeClubId: authUser?.tenantId || 'club_main',
      activeBranchId: `${authUser?.tenantId || 'tenant'}_branch_main`,
    };
  }, [authUser, liveClubDetails]);

  const [selectedBranchId, setSelectedBranchId] = useState<BranchId>(`${authUser?.tenantId || 'tenant'}_branch_main`);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year' | '30days'>('30days');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    if (club.branches[0]) {
      setSelectedBranchId(club.branches[0].id);
    }
  }, [club]);

  const selectedBranch = useMemo(() => {
    return (
      club.branches.find((b) => b.id === selectedBranchId) ||
      club.branches[0]
    );
  }, [club, selectedBranchId]);

  const kpis: ClubKpiItem[] = useMemo(() => [
    {
      id: 'kpi_members',
      title: 'Total Members',
      value: '1',
      numericValue: 1,
      growth: 100,
      isPositive: true,
      growthLabel: 'Active Admin Account',
      secondaryText: 'Registered club users',
      icon: 'users',
      accentColor: 'blue',
      linkTo: '/club/members',
    },
    {
      id: 'kpi_bookings',
      title: "Today's Bookings",
      value: '0',
      numericValue: 0,
      growth: 0,
      isPositive: true,
      growthLabel: 'Live slot sync',
      secondaryText: 'Courts & slots',
      icon: 'calendar',
      accentColor: 'emerald',
      linkTo: '/club/bookings',
    },
    {
      id: 'kpi_revenue',
      title: "Today's Revenue",
      value: '₹ 0',
      numericValue: 0,
      growth: 0,
      isPositive: true,
      growthLabel: 'Real-time billing',
      secondaryText: 'This month: ₹ 0',
      icon: 'revenue',
      accentColor: 'amber',
      linkTo: '/club/finance',
    },
    {
      id: 'kpi_facilities',
      title: 'Active Facilities',
      value: '0 / 0',
      numericValue: 0,
      growth: 0,
      isPositive: true,
      growthLabel: 'Ready for setup',
      secondaryText: 'Configure in facilities',
      icon: 'building',
      accentColor: 'purple',
      linkTo: '/club/facilities',
    },
    {
      id: 'kpi_approvals',
      title: 'Pending Approvals',
      value: '0',
      numericValue: 0,
      growth: 0,
      isPositive: true,
      growthLabel: 'All clear',
      secondaryText: 'No pending requests',
      icon: 'clock',
      accentColor: 'rose',
      linkTo: '/club/approvals',
    },
    {
      id: 'kpi_events',
      title: 'Upcoming Events',
      value: '0',
      numericValue: 0,
      growth: 0,
      isPositive: true,
      growthLabel: 'Schedule events',
      secondaryText: 'Next 30 calendar days',
      icon: 'trophy',
      accentColor: 'cyan',
      linkTo: '/club/events',
    },
  ], [authUser]);

  const revenueDepartments: RevenueDepartmentBreakdown[] = useMemo(() => [
    { department: 'Courts & Turf Arena', amount: 0, formattedAmount: '₹ 0', percentage: 0, color: '#0284C7' },
    { department: 'Bar & Restaurant', amount: 0, formattedAmount: '₹ 0', percentage: 0, color: '#F97316' },
    { department: 'Pro Shop', amount: 0, formattedAmount: '₹ 0', percentage: 0, color: '#10B981' },
    { department: 'Finance & Memberships', amount: 0, formattedAmount: '₹ 0', percentage: 0, color: '#8B5CF6' },
  ], []);

  const revenueTrend: RevenueTrendPoint[] = useMemo(() => [
    { date: 'Mon', label: 'Mon', restaurant: 0, bar: 0, courts: 0, membership: 0, events: 0, others: 0, total: 0 },
    { date: 'Tue', label: 'Tue', restaurant: 0, bar: 0, courts: 0, membership: 0, events: 0, others: 0, total: 0 },
    { date: 'Wed', label: 'Wed', restaurant: 0, bar: 0, courts: 0, membership: 0, events: 0, others: 0, total: 0 },
    { date: 'Thu', label: 'Thu', restaurant: 0, bar: 0, courts: 0, membership: 0, events: 0, others: 0, total: 0 },
    { date: 'Fri', label: 'Fri', restaurant: 0, bar: 0, courts: 0, membership: 0, events: 0, others: 0, total: 0 },
    { date: 'Sat', label: 'Sat', restaurant: 0, bar: 0, courts: 0, membership: 0, events: 0, others: 0, total: 0 },
    { date: 'Sun', label: 'Sun', restaurant: 0, bar: 0, courts: 0, membership: 0, events: 0, others: 0, total: 0 },
  ], []);

  const occupancies: FacilityOccupancyItem[] = useMemo(() => [], []);
  const bookings: TodayBookingItem[] = useMemo(() => [], []);
  const upcomingEvents: UpcomingEventItem[] = useMemo(() => [], []);

  const membershipSummary: MembershipSummaryData = useMemo(() => ({
    activeMembers: 1,
    activeGrowth: 0,
    newMembersThisMonth: 1,
    renewalsDueNext30Days: 0,
    renewalsGrowth: 0,
    expiredMembers: 0,
    pendingApplications: 0,
  }), []);

  const activities: ActivityTimelineItem[] = useMemo(() => [
    {
      id: 'act_1',
      title: 'Tenant Live',
      description: `${authUser?.tenantName || 'Club'} account active in PostgreSQL`,
      timestamp: 'Recently',
      category: 'system',
      user: authUser?.name || 'Club Owner',
      branchId: selectedBranchId,
    },
  ], [authUser, selectedBranchId]);

  const [approvalsState, setApprovalsState] = useState<ApprovalItem[]>([]);
  const [notificationsState, setNotificationsState] = useState<NotificationAlertItem[]>([
    {
      id: 'notif_welcome',
      title: `Welcome to ${authUser?.tenantName || 'Playnex'}`,
      message: 'Your club dashboard is connected directly to PostgreSQL.',
      timestamp: 'Just now',
      type: 'info',
      unread: true,
      category: 'system',
    },
  ]);

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

  const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const value: ClubContextValue = {
    tenantId: club.tenantId,
    clubId: club.id,
    club,
    user,
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
