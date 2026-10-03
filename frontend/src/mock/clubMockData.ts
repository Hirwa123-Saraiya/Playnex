import {
  Club,
  ClubKpiItem,
  RevenueDepartmentBreakdown,
  RevenueTrendPoint,
  FacilityOccupancyItem,
  TodayBookingItem,
  MembershipSummaryData,
  ApprovalItem,
  QuickActionItem,
  UpcomingEventItem,
  ActivityTimelineItem,
  NotificationAlertItem,
  UserProfile,
} from '../types/club.types';

export const mockClub: Club = {
  id: 'club_sunrise_01',
  name: 'Sunrise Sports Club',
  tagline: 'Club Owner Dashboard',
  tenantId: 'tenant_playnex_west',
  branches: [
    {
      id: 'branch_ahmedabad_main',
      name: 'Ahmedabad (Main Branch)',
      shortName: 'Ahmedabad Main',
      city: 'Ahmedabad',
      isMain: true,
      address: 'Near SG Highway, Bodakdev, Ahmedabad, Gujarat 380054',
      phone: '+91 79 4001 2300',
    },
    {
      id: 'branch_ahmedabad_complex',
      name: 'Ahmedabad Sports Complex',
      shortName: 'Sports Complex',
      city: 'Ahmedabad',
      address: 'South Bopal Ring Road, Ahmedabad, Gujarat 380058',
      phone: '+91 79 4001 8820',
    },
    {
      id: 'branch_gandhinagar',
      name: 'Gandhinagar Club',
      shortName: 'Gandhinagar',
      city: 'Gandhinagar',
      address: 'Sector 11, Infocity Corridor, Gandhinagar, Gujarat 382010',
      phone: '+91 79 2324 1100',
    },
    {
      id: 'branch_surat',
      name: 'Surat Club',
      shortName: 'Surat Club',
      city: 'Surat',
      address: 'Dumas Road, Piplod, Surat, Gujarat 395007',
      phone: '+91 261 278 9900',
    },
  ],
};

export const mockCurrentUser: UserProfile = {
  id: 'usr_deval_shah',
  name: 'Deval Shah',
  email: 'deval.shah@playnex.club',
  role: 'Club Owner',
  activeClubId: 'club_sunrise_01',
  activeBranchId: 'branch_ahmedabad_main',
};

// Branch specific multipliers for realistic multi-tenant data switching
export function getBranchMultiplier(branchId: string): number {
  switch (branchId) {
    case 'branch_ahmedabad_complex':
      return 0.82;
    case 'branch_gandhinagar':
      return 0.65;
    case 'branch_surat':
      return 0.74;
    case 'branch_ahmedabad_main':
    default:
      return 1.0;
  }
}

export function getMockKpis(branchId: string): ClubKpiItem[] {
  const mult = getBranchMultiplier(branchId);
  const totalMembers = Math.round(1245 * mult);
  const todaysBookings = Math.round(186 * mult);
  const todaysRevenue = Math.round(185000 * mult);
  const monthlyRevenue = Math.round(2840000 * mult);
  const activeFac = Math.round(42 * (mult > 0.8 ? 1 : 0.85));
  const totalFac = 48;
  const approvals = Math.round(23 * mult);
  const events = Math.max(3, Math.round(5 * mult));

  return [
    {
      id: 'kpi_members',
      title: 'Total Members',
      value: totalMembers.toLocaleString('en-IN'),
      numericValue: totalMembers,
      growth: 8,
      isPositive: true,
      growthLabel: `+${Math.round(92 * mult)} this month`,
      secondaryText: 'Active membership base',
      icon: 'users',
      accentColor: 'blue',
      linkTo: '/club/members',
    },
    {
      id: 'kpi_bookings',
      title: "Today's Bookings",
      value: todaysBookings.toString(),
      numericValue: todaysBookings,
      growth: 12,
      isPositive: true,
      growthLabel: `+${Math.round(20 * mult)} from yesterday`,
      secondaryText: 'Courts, dining & slots',
      icon: 'calendar',
      accentColor: 'emerald',
      linkTo: '/club/bookings',
    },
    {
      id: 'kpi_revenue',
      title: "Today's Revenue",
      value: `₹ ${todaysRevenue.toLocaleString('en-IN')}`,
      numericValue: todaysRevenue,
      growth: 15,
      isPositive: true,
      growthLabel: 'vs last week',
      secondaryText: `This month: ₹ ${monthlyRevenue.toLocaleString('en-IN')}`,
      icon: 'revenue',
      accentColor: 'amber',
      linkTo: '/club/finance',
    },
    {
      id: 'kpi_facilities',
      title: 'Active Facilities',
      value: `${activeFac} / ${totalFac}`,
      numericValue: activeFac,
      growth: Math.round((activeFac / totalFac) * 100),
      isPositive: true,
      growthLabel: `${Math.round((activeFac / totalFac) * 100)}% operational`,
      secondaryText: `${totalFac - activeFac} under scheduled routine`,
      icon: 'building',
      accentColor: 'purple',
      linkTo: '/club/facilities',
    },
    {
      id: 'kpi_approvals',
      title: 'Pending Approvals',
      value: approvals.toString(),
      numericValue: approvals,
      growth: 4,
      isPositive: false,
      growthLabel: 'Requires action',
      secondaryText: 'Memberships, Events, Bookings',
      icon: 'clock',
      accentColor: 'rose',
      linkTo: '/club/approvals',
    },
    {
      id: 'kpi_events',
      title: 'Upcoming Events',
      value: events.toString(),
      numericValue: events,
      growth: 2,
      isPositive: true,
      growthLabel: 'Next: 18 Oct 2025',
      secondaryText: 'Next 30 calendar days',
      icon: 'trophy',
      accentColor: 'cyan',
      linkTo: '/club/events',
    },
  ];
}

export function getMockRevenueDepartments(branchId: string): RevenueDepartmentBreakdown[] {
  const mult = getBranchMultiplier(branchId);
  return [
    {
      department: 'Restaurant',
      amount: Math.round(420000 * mult),
      formattedAmount: `₹ ${Math.round(420000 * mult).toLocaleString('en-IN')}`,
      percentage: 28,
      color: '#F97316', // Orange
    },
    {
      department: 'Bar',
      amount: Math.round(210000 * mult),
      formattedAmount: `₹ ${Math.round(210000 * mult).toLocaleString('en-IN')}`,
      percentage: 14,
      color: '#8B5CF6', // Purple
    },
    {
      department: 'Courts',
      amount: Math.round(185000 * mult),
      formattedAmount: `₹ ${Math.round(185000 * mult).toLocaleString('en-IN')}`,
      percentage: 12,
      color: '#0284C7', // Blue
    },
    {
      department: 'Membership',
      amount: Math.round(350000 * mult),
      formattedAmount: `₹ ${Math.round(350000 * mult).toLocaleString('en-IN')}`,
      percentage: 24,
      color: '#10B981', // Emerald
    },
    {
      department: 'Events',
      amount: Math.round(220000 * mult),
      formattedAmount: `₹ ${Math.round(220000 * mult).toLocaleString('en-IN')}`,
      percentage: 15,
      color: '#EC4899', // Pink
    },
    {
      department: 'Rooms & Others',
      amount: Math.round(105000 * mult),
      formattedAmount: `₹ ${Math.round(105000 * mult).toLocaleString('en-IN')}`,
      percentage: 7,
      color: '#64748B', // Slate
    },
  ];
}

export function getMockRevenueTrend(branchId: string, timeframe: string = '30days'): RevenueTrendPoint[] {
  const mult = getBranchMultiplier(branchId);
  const dates = [
    '15 Sep', '18 Sep', '20 Sep', '22 Sep', '25 Sep',
    '28 Sep', '30 Sep', '2 Oct', '5 Oct', '8 Oct',
    '10 Oct', '12 Oct', '14 Oct'
  ];

  return dates.map((date, idx) => {
    const baseFactor = (1 + (idx * 0.04) + Math.sin(idx) * 0.15) * mult;
    const restaurant = Math.round((28000 + (idx % 3) * 6000) * baseFactor);
    const bar = Math.round((14000 + (idx % 2) * 5000) * baseFactor);
    const courts = Math.round((16000 + (idx % 4) * 4000) * baseFactor);
    const membership = Math.round((32000 + (idx % 5) * 8000) * baseFactor);
    const events = Math.round((18000 + (idx % 3) * 7000) * baseFactor);
    const others = Math.round((8000 + (idx % 2) * 3000) * baseFactor);
    const total = restaurant + bar + courts + membership + events + others;

    return {
      date,
      label: date,
      restaurant,
      bar,
      courts,
      membership,
      events,
      others,
      total,
    };
  });
}

export function getMockFacilityOccupancy(branchId: string): FacilityOccupancyItem[] {
  const mult = getBranchMultiplier(branchId);
  return [
    {
      id: 'fac_tennis',
      name: 'Tennis Courts',
      category: 'tennis',
      occupancyRate: Math.min(100, Math.round(95 * (mult > 0.9 ? 1 : 0.92))),
      currentOccupied: Math.round(19 * (mult > 0.9 ? 1 : 0.85)),
      totalCapacity: 20,
      unit: 'courts',
      status: 'high',
    },
    {
      id: 'fac_badminton',
      name: 'Badminton Courts',
      category: 'badminton',
      occupancyRate: 80,
      currentOccupied: 8,
      totalCapacity: 10,
      unit: 'courts',
      status: 'normal',
    },
    {
      id: 'fac_pool',
      name: 'Swimming Pool',
      category: 'pool',
      occupancyRate: 72,
      currentOccupied: 9,
      totalCapacity: 12,
      unit: 'lanes',
      status: 'normal',
    },
    {
      id: 'fac_gym',
      name: 'Gym & Fitness Center',
      category: 'gym',
      occupancyRate: 68,
      currentOccupied: Math.round(34 * mult),
      totalCapacity: 50,
      unit: 'members',
      status: 'normal',
    },
    {
      id: 'fac_restaurant',
      name: 'Restaurant',
      category: 'restaurant',
      occupancyRate: 75,
      currentOccupied: Math.round(30 * mult),
      totalCapacity: 40,
      unit: 'tables',
      status: 'normal',
    },
    {
      id: 'fac_banquet',
      name: 'Banquet Hall',
      category: 'banquet',
      occupancyRate: 40,
      currentOccupied: 2,
      totalCapacity: 5,
      unit: 'halls',
      status: 'normal',
    },
  ];
}

export function getMockTodayBookings(branchId: string): TodayBookingItem[] {
  const mult = getBranchMultiplier(branchId);
  return [
    {
      id: 'tb_restaurant',
      facility: 'Restaurant',
      category: 'restaurant',
      bookingCount: Math.round(75 * mult),
      growth: 12,
      growthDirection: 'up',
      status: 'Tables booked',
    },
    {
      id: 'tb_bar',
      facility: 'Bar & Lounge',
      category: 'bar',
      bookingCount: Math.round(42 * mult),
      growth: 8,
      growthDirection: 'up',
      status: 'Tables booked',
    },
    {
      id: 'tb_tennis',
      facility: 'Tennis Courts',
      category: 'tennis',
      bookingCount: Math.round(56 * mult),
      growth: 15,
      growthDirection: 'up',
      status: 'Court bookings',
    },
    {
      id: 'tb_badminton',
      facility: 'Badminton Courts',
      category: 'badminton',
      bookingCount: Math.round(40 * mult),
      growth: 5,
      growthDirection: 'down',
      status: 'Court bookings',
    },
    {
      id: 'tb_gym',
      facility: 'Gym & Fitness',
      category: 'gym',
      bookingCount: Math.round(55 * mult),
      growth: 10,
      growthDirection: 'up',
      status: 'Slot bookings',
    },
    {
      id: 'tb_pool',
      facility: 'Swimming Pool',
      category: 'pool',
      bookingCount: Math.round(31 * mult),
      growth: 7,
      growthDirection: 'up',
      status: 'Slot bookings',
    },
    {
      id: 'tb_banquet',
      facility: 'Events / Banquet',
      category: 'events',
      bookingCount: Math.round(12 * mult),
      growth: 20,
      growthDirection: 'up',
      status: 'Event bookings',
    },
  ];
}

export function getMockMembershipSummary(branchId: string): MembershipSummaryData {
  const mult = getBranchMultiplier(branchId);
  return {
    activeMembers: Math.round(1020 * mult),
    activeGrowth: 5,
    newMembersThisMonth: Math.round(92 * mult),
    renewalsDueNext30Days: Math.round(67 * mult),
    renewalsGrowth: 10,
    expiredMembers: Math.round(21 * mult),
    pendingApplications: Math.round(15 * mult),
  };
}

export function getMockPendingApprovals(branchId: string): ApprovalItem[] {
  const mult = getBranchMultiplier(branchId);
  return [
    {
      id: 'appr_memberships',
      type: 'membership',
      title: 'Membership Requests',
      count: Math.round(12 * mult),
      description: 'Gold & Silver plan applications awaiting verification',
      items: [
        {
          id: 'app_m_1',
          applicantName: 'Priya Shah',
          details: 'Gold Tier (Family Package)',
          amount: '₹ 85,000 / yr',
          requestedTime: '25 mins ago',
          status: 'pending',
        },
        {
          id: 'app_m_2',
          applicantName: 'Aditya Mehta',
          details: 'Silver Tier (Individual Tennis)',
          amount: '₹ 45,000 / yr',
          requestedTime: '1 hour ago',
          status: 'pending',
        },
      ],
    },
    {
      id: 'appr_facilities',
      type: 'facility',
      title: 'Facility Bookings',
      count: Math.round(6 * mult),
      description: 'Prime slot reservations and corporate blocks',
      items: [
        {
          id: 'app_f_1',
          applicantName: 'Reliance Sports Club Wing',
          details: 'Banquet Hall + 4 Tennis Courts (Corporate tournament)',
          amount: '₹ 1,20,000',
          requestedTime: '2 hours ago',
          status: 'pending',
        },
      ],
    },
    {
      id: 'appr_events',
      type: 'event',
      title: 'Event Registrations',
      count: Math.round(4 * mult),
      description: 'Guest passes and tournament entry confirmations',
      items: [
        {
          id: 'app_e_1',
          applicantName: 'Sanjay Varma & 3 Guests',
          details: 'Diwali Gala Dinner (VIP Table)',
          amount: '₹ 12,000',
          requestedTime: '3 hours ago',
          status: 'pending',
        },
      ],
    },
    {
      id: 'appr_refunds',
      type: 'refund',
      title: 'Refund Requests',
      count: Math.max(1, Math.round(1 * mult)),
      description: 'Court cancellation and bar ledger adjustments',
      items: [
        {
          id: 'app_r_1',
          applicantName: 'Ketan Patel',
          details: 'Rain cancellation - Court 3 reserved 12 Oct',
          amount: '₹ 1,200',
          requestedTime: '1 hour ago',
          status: 'pending',
        },
      ],
    },
  ];
}

export const mockQuickActions: QuickActionItem[] = [
  {
    id: 'qa_facility',
    title: 'Add Facility',
    description: 'Setup court, table or hall',
    icon: 'building',
    bgColor: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
    textColor: 'text-blue-700',
    actionKey: 'add-facility',
  },
  {
    id: 'qa_event',
    title: 'Create Event',
    description: 'Tournament or dinner gala',
    icon: 'calendar',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
    textColor: 'text-emerald-700',
    actionKey: 'create-event',
  },
  {
    id: 'qa_member',
    title: 'Add Member',
    description: 'Onboard new club member',
    icon: 'user-plus',
    bgColor: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
    textColor: 'text-purple-700',
    actionKey: 'add-member',
  },
  {
    id: 'qa_staff',
    title: 'Manage Staff',
    description: 'Roles, duties & shifts',
    icon: 'users',
    bgColor: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200',
    textColor: 'text-amber-700',
    actionKey: 'manage-staff',
  },
  {
    id: 'qa_offer',
    title: 'Create Offer',
    description: 'Promo code or festival rebate',
    icon: 'tag',
    bgColor: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200',
    textColor: 'text-rose-700',
    actionKey: 'create-offer',
  },
  {
    id: 'qa_reports',
    title: 'View Reports',
    description: 'Financial & operational audit',
    icon: 'bar-chart',
    bgColor: 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200',
    textColor: 'text-sky-700',
    actionKey: 'view-reports',
  },
];

export function getMockUpcomingEvents(branchId: string): UpcomingEventItem[] {
  return [
    {
      id: 'evt_1',
      name: 'Inter Club Tennis Tournament',
      date: '2025-10-18',
      formattedDate: '18 Oct 2025',
      location: 'Tennis Courts',
      facility: 'Tennis Courts (Courts 1-6)',
      status: 'Registrations Open',
      statusVariant: 'success',
      imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=400&q=80',
      registeredCount: 48,
      capacity: 64,
    },
    {
      id: 'evt_2',
      name: 'Diwali Celebration Dinner',
      date: '2025-10-25',
      formattedDate: '25 Oct 2025',
      location: 'Grand Ballroom & Restaurant',
      facility: 'Restaurant & Banquet Hall',
      status: 'Invites Sent',
      statusVariant: 'indigo',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      registeredCount: 180,
      capacity: 250,
    },
    {
      id: 'evt_3',
      name: 'Kids Swimming Championship',
      date: '2025-11-02',
      formattedDate: '2 Nov 2025',
      location: 'Olympic Pool Complex',
      facility: 'Swimming Pool',
      status: 'Planning',
      statusVariant: 'amber',
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=400&q=80',
      registeredCount: 22,
      capacity: 80,
    },
  ];
}

export function getMockActivities(branchId: string): ActivityTimelineItem[] {
  return [
    {
      id: 'act_1',
      user: 'Rahul Mehta',
      action: 'booked Tennis Court 1',
      detail: 'Slot: 6:00 PM - 7:00 PM (Floodlights)',
      timestamp: '10 mins ago',
      icon: 'calendar',
      color: 'emerald',
    },
    {
      id: 'act_2',
      user: 'Priya Shah',
      action: 'submitted new membership request',
      detail: 'Gold Annual Family Plan',
      timestamp: '25 mins ago',
      icon: 'user-plus',
      color: 'blue',
    },
    {
      id: 'act_3',
      user: 'Front Desk / Capt. Anand',
      action: 'confirmed Restaurant booking (Table for 4)',
      detail: 'Reservation #TB-884 for Dr. Desai',
      timestamp: '40 mins ago',
      icon: 'utensils',
      color: 'amber',
    },
    {
      id: 'act_4',
      user: 'Ketan Patel',
      action: 'submitted refund request',
      detail: 'Reason: Rain cancellation Court 3',
      timestamp: '1 hour ago',
      icon: 'rotate-ccw',
      color: 'rose',
    },
    {
      id: 'act_5',
      user: 'Tournament Desk',
      action: 'Event registration: 5 new participants',
      detail: 'Inter Club Tennis Tournament (Singles)',
      timestamp: '2 hours ago',
      icon: 'users-group',
      color: 'purple',
    },
  ];
}

export function getMockNotifications(branchId: string): NotificationAlertItem[] {
  return [
    {
      id: 'notif_1',
      title: '5 memberships expiring today',
      subtitle: 'Review accounts and dispatch automated WhatsApp & email renewal notice',
      timestamp: '2 hours ago',
      type: 'expiry',
      severity: 'danger',
      unread: true,
    },
    {
      id: 'notif_2',
      title: '3 facilities under maintenance',
      subtitle: 'Tennis Court 3 (Resurfacing), Gym (HVAC Filter), Pool (Chlorination)',
      timestamp: '3 hours ago',
      type: 'maintenance',
      severity: 'amber',
      unread: true,
    },
    {
      id: 'notif_3',
      title: 'Event starting tomorrow',
      subtitle: 'Inter Club Tennis Tournament: Check referee assignments & court balls',
      timestamp: '5 hours ago',
      type: 'event',
      severity: 'blue',
      unread: false,
    },
    {
      id: 'notif_4',
      title: 'New refund request',
      subtitle: '#RF20251014-001 from Ketan Patel requires Club Owner sign-off',
      timestamp: '6 hours ago',
      type: 'refund',
      severity: 'purple',
      unread: true,
    },
  ];
}
