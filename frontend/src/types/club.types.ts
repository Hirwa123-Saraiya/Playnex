export type TenantId = string;
export type ClubId = string;
export type BranchId = string;

export interface Branch {
  id: BranchId;
  name: string;
  shortName: string;
  city: string;
  isMain?: boolean;
  address?: string;
  phone?: string;
}

export interface Club {
  id: ClubId;
  name: string;
  tagline?: string;
  logoUrl?: string;
  tenantId: TenantId;
  branches: Branch[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Club Owner' | 'Super Admin' | 'Department Manager' | 'Staff';
  avatarUrl?: string;
  activeClubId: ClubId;
  activeBranchId: BranchId;
}

export interface ClubKpiItem {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  growth: number;
  isPositive: boolean;
  growthLabel: string;
  secondaryText?: string;
  icon: 'users' | 'calendar' | 'revenue' | 'building' | 'clock' | 'trophy';
  accentColor: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan';
  linkTo?: string;
}

export interface RevenueDepartmentBreakdown {
  department: string;
  amount: number;
  formattedAmount: string;
  percentage: number;
  color: string;
}

export interface RevenueTrendPoint {
  date: string;
  label: string;
  restaurant: number;
  bar: number;
  courts: number;
  membership: number;
  events: number;
  others: number;
  total: number;
}

export interface FacilityOccupancyItem {
  id: string;
  name: string;
  category: 'tennis' | 'badminton' | 'pool' | 'gym' | 'restaurant' | 'banquet';
  occupancyRate: number; // percentage (e.g. 95)
  currentOccupied: number;
  totalCapacity: number;
  unit: string;
  status: 'normal' | 'high' | 'near-capacity' | 'maintenance';
}

export interface TodayBookingItem {
  id: string;
  facility: string;
  category: 'restaurant' | 'bar' | 'tennis' | 'badminton' | 'gym' | 'pool' | 'events';
  bookingCount: number;
  growth: number;
  growthDirection: 'up' | 'down';
  status: string; // e.g., 'Tables booked', 'Court bookings', 'Slot bookings'
}

export interface MembershipSummaryData {
  activeMembers: number;
  activeGrowth: number;
  newMembersThisMonth: number;
  renewalsDueNext30Days: number;
  renewalsGrowth: number;
  expiredMembers: number;
  pendingApplications: number;
}

export interface ApprovalItem {
  id: string;
  type: 'membership' | 'facility' | 'event' | 'refund';
  title: string;
  count: number;
  badgeCount?: number;
  description: string;
  items: Array<{
    id: string;
    applicantName: string;
    details: string;
    amount?: string;
    requestedTime: string;
    status: 'pending' | 'approved' | 'rejected';
  }>;
}

export interface QuickActionItem {
  id: string;
  title: string;
  description?: string;
  icon: 'building' | 'calendar' | 'user-plus' | 'users' | 'tag' | 'bar-chart';
  bgColor: string;
  textColor: string;
  actionKey: 'add-facility' | 'create-event' | 'add-member' | 'manage-staff' | 'create-offer' | 'view-reports';
}

export interface UpcomingEventItem {
  id: string;
  name: string;
  date: string;
  formattedDate: string;
  location: string;
  facility: string;
  status: 'Registrations Open' | 'Invites Sent' | 'Planning' | 'Sold Out';
  statusVariant: 'success' | 'indigo' | 'amber' | 'slate';
  imageUrl: string;
  registeredCount: number;
  capacity: number;
}

export interface ActivityTimelineItem {
  id: string;
  user: string;
  action: string;
  detail?: string;
  timestamp: string;
  icon: 'calendar' | 'user-plus' | 'utensils' | 'rotate-ccw' | 'users-group';
  color: string;
}

export interface NotificationAlertItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: 'expiry' | 'maintenance' | 'event' | 'refund';
  severity: 'warning' | 'amber' | 'blue' | 'purple' | 'danger';
  unread: boolean;
}
