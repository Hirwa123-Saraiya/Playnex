'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { clubsService } from '../services/clubs.service';
import { membersService } from '../services/members.service';
import { bookingsService } from '../services/bookings.service';
import { facilitiesService } from '../services/facilities.service';
import { approvalsService } from '../services/approvals.service';
import { eventsService } from '../services/events.service';
import { financeService } from '../services/finance.service';
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
    const tenantId = authUser?.tenantId || liveClubDetails?.id || 'tenant_main';
    const location = liveClubDetails?.location || 'Local';
    const address = liveClubDetails?.address || `${location} Sports Complex`;
    const phone = liveClubDetails?.phone || '+91 98765 43210';
    return {
      id: tenantId,
      name: clubName,
      tagline: `${authUser?.roleName || (authUser?.systemRole === 'CLUB_OWNER' ? 'Club Owner' : 'Club')} Dashboard`,
      tenantId: tenantId,
      subscriptionPlan: liveClubDetails?.subscriptionPlan || liveClubDetails?.subscription_plan || 'Free Trial',
      adminName: authUser?.name,
      adminEmail: authUser?.email,
      phone: phone,
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

  const [liveStats, setLiveStats] = useState({
    members: 0,
    bookingsToday: 0,
    revenueToday: 0,
    activeFacilities: 0,
    totalFacilities: 0,
    pendingApprovals: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    if (authUser?.tenantId) {
      Promise.allSettled([
        membersService.getMembers(authUser.tenantId),
        bookingsService.getBookings(authUser.tenantId),
        facilitiesService.getFacilities(authUser.tenantId),
        approvalsService.getApprovals(authUser.tenantId),
        eventsService.getEvents(authUser.tenantId),
        financeService.getFinanceData(authUser.tenantId),
      ]).then(([membersRes, bookingsRes, facRes, appRes, evtRes, finRes]) => {
        const memberCount = membersRes.status === 'fulfilled' && membersRes.value.success && Array.isArray(membersRes.value.data) ? membersRes.value.data.length : 0;
        const bookingCount = bookingsRes.status === 'fulfilled' && bookingsRes.value.success && Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data.length : 0;
        const facilities = facRes.status === 'fulfilled' && facRes.value.success && Array.isArray(facRes.value.data) ? facRes.value.data : [];
        const activeFacs = facilities.filter((f) => f.isActive).length;
        const approvals = appRes.status === 'fulfilled' && appRes.value.success && Array.isArray(appRes.value.data) ? appRes.value.data : [];
        const pendingApp = approvals.filter((a) => a.status === 'pending').length;
        const events = evtRes.status === 'fulfilled' && evtRes.value.success && Array.isArray(evtRes.value.data) ? evtRes.value.data.length : 0;
        const revenue = finRes.status === 'fulfilled' && finRes.value.success && finRes.value.data?.summary ? finRes.value.data.summary.grossRevenue : 0;

        setLiveStats({
          members: memberCount,
          bookingsToday: bookingCount,
          revenueToday: revenue,
          activeFacilities: activeFacs,
          totalFacilities: facilities.length,
          pendingApprovals: pendingApp,
          upcomingEvents: events,
        });
      });
    }
  }, [authUser?.tenantId]);

  const kpis: ClubKpiItem[] = useMemo(() => [
    {
      id: 'kpi_members',
      title: 'Total Members',
      value: String(liveStats.members),
      numericValue: liveStats.members,
      growth: 0,
      isPositive: true,
      growthLabel: liveStats.members === 0 ? 'No members yet' : `${liveStats.members} active enrolled`,
      secondaryText: 'Enrolled club members',
      icon: 'users',
      accentColor: 'blue',
      linkTo: '/club/members',
    },
    {
      id: 'kpi_bookings',
      title: "Today's Bookings",
      value: String(liveStats.bookingsToday),
      numericValue: liveStats.bookingsToday,
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
      value: `₹ ${liveStats.revenueToday.toLocaleString()}`,
      numericValue: liveStats.revenueToday,
      growth: 0,
      isPositive: true,
      growthLabel: 'Real-time billing',
      secondaryText: `Gross: ₹ ${liveStats.revenueToday.toLocaleString()}`,
      icon: 'revenue',
      accentColor: 'amber',
      linkTo: '/club/finance',
    },
    {
      id: 'kpi_facilities',
      title: 'Active Facilities',
      value: `${liveStats.activeFacilities} / ${liveStats.totalFacilities}`,
      numericValue: liveStats.activeFacilities,
      growth: 0,
      isPositive: true,
      growthLabel: liveStats.totalFacilities === 0 ? 'Ready for setup' : `${liveStats.activeFacilities} operational`,
      secondaryText: 'Configure in facilities',
      icon: 'building',
      accentColor: 'purple',
      linkTo: '/club/facilities',
    },
    {
      id: 'kpi_approvals',
      title: 'Pending Approvals',
      value: String(liveStats.pendingApprovals),
      numericValue: liveStats.pendingApprovals,
      growth: 0,
      isPositive: true,
      growthLabel: liveStats.pendingApprovals === 0 ? 'All clear' : `${liveStats.pendingApprovals} action needed`,
      secondaryText: 'Pending audit requests',
      icon: 'clock',
      accentColor: 'rose',
      linkTo: '/club/approvals',
    },
    {
      id: 'kpi_events',
      title: 'Upcoming Events',
      value: String(liveStats.upcomingEvents),
      numericValue: liveStats.upcomingEvents,
      growth: 0,
      isPositive: true,
      growthLabel: liveStats.upcomingEvents === 0 ? 'Schedule events' : `${liveStats.upcomingEvents} scheduled`,
      secondaryText: 'Next 30 calendar days',
      icon: 'trophy',
      accentColor: 'cyan',
      linkTo: '/club/events',
    },
  ], [liveStats]);

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
    activeMembers: liveStats.members,
    activeGrowth: 0,
    newMembersThisMonth: liveStats.members,
    renewalsDueNext30Days: 0,
    renewalsGrowth: 0,
    expiredMembers: 0,
    pendingApplications: 0,
  }), [liveStats.members]);

  const activities: ActivityTimelineItem[] = useMemo(() => [
    {
      id: 'act_1',
      user: authUser?.name || 'Club Owner',
      action: 'Tenant Live',
      detail: `${authUser?.tenantName || 'Club'} account active in PostgreSQL`,
      timestamp: 'Recently',
      icon: 'users-group',
      color: 'blue',
    },
  ], [authUser]);

  const [approvalsState, setApprovalsState] = useState<ApprovalItem[]>([]);
  const [notificationsState, setNotificationsState] = useState<NotificationAlertItem[]>([
    {
      id: 'notif_welcome',
      title: `Welcome to ${authUser?.tenantName || 'Playnex'}`,
      subtitle: 'Your club dashboard is connected directly to PostgreSQL.',
      timestamp: 'Just now',
      type: 'event',
      severity: 'blue',
      unread: true,
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
