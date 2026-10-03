export type UserRole = 'member' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  membershipId?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  sportsInterests: string[];
  preferredClubId?: string;
  joinedDate: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relation: 'Spouse' | 'Child' | 'Parent' | 'Sibling';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  avatarUrl: string;
  assignedMembershipClubId?: string;
  assignedMembershipPlanId?: string;
  sportsInterests: string[];
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Club {
  id: string;
  name: string;
  tagline: string;
  city: string;
  address: string;
  rating: number;
  reviewsCount: number;
  heroImage: string;
  gallery: string[];
  sports: string[];
  amenities: string[];
  membershipAvailable: boolean;
  minPricePerHour: number;
  operatingHours: string;
  phone: string;
  email: string;
  description: string;
  isFeatured?: boolean;
}

export interface TimeSlot {
  id: string;
  time: string; // e.g., "08:00 AM - 09:00 AM"
  period: 'Morning' | 'Afternoon' | 'Evening';
  price: number;
  isAvailable: boolean;
}

export interface Facility {
  id: string;
  clubId: string;
  clubName: string;
  name: string;
  category: 'Tennis Court' | 'Badminton Court' | 'Swimming Pool' | 'Gym' | 'Spa' | 'Restaurant' | 'Banquet Hall' | 'Conference Room' | 'Squash Court' | 'Padel Court';
  type: string; // e.g. "Outdoor | Flood Lights | Clay Court"
  pricingPerHour: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  rules: string[];
  cancellationPolicy: string;
  capacity: number;
  coachingAvailable: boolean;
}

export type BookingStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string; // e.g., "#BK20251014001"
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  clubId: string;
  clubName: string;
  clubCity: string;
  facilityId: string;
  facilityName: string;
  facilityCategory: string;
  facilityImage: string;
  date: string; // YYYY-MM-DD or readable "14 Oct 2025"
  timeSlot: string; // "12:00 PM - 1:00 PM (1 Hour)"
  duration: string;
  amount: number;
  tax: number;
  totalPaid: number;
  status: BookingStatus;
  paymentMethod: 'Credit / Debit Card' | 'UPI' | 'Wallet' | 'Net Banking';
  paymentId: string;
  bookedForFamilyMemberId?: string;
  bookedForName?: string;
  notes?: string;
  createdAt: string;
  qrCodeUrl?: string;
}

export interface MembershipPlan {
  id: string;
  clubId: string;
  clubName: string;
  name: string; // e.g. "Gold Annual Pass", "Family Club All-Access", "Tennis & Fitness Club"
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Family';
  tagline: string;
  priceMonthly: number;
  priceQuarterly: number;
  priceAnnual: number;
  discountBadge?: string;
  includedFacilities: string[];
  guestPassesPerMonth: number;
  maxFamilyMembers: number;
  benefits: string[];
  isPopular?: boolean;
}

export interface UserMembership {
  id: string;
  membershipNumber: string; // e.g. "PLX-SUN-88492"
  userId: string;
  clubId: string;
  clubName: string;
  clubCity: string;
  planId: string;
  planName: string;
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Family';
  status: 'Active' | 'Expired' | 'Renewing Soon';
  startDate: string;
  endDate: string;
  durationMonths: number;
  amountPaid: number;
  qrCode: string;
  linkedFamilyMembers: string[]; // member names or IDs
}

export interface ClubEvent {
  id: string;
  clubId: string;
  clubName: string;
  clubCity: string;
  title: string;
  category: 'Tournament' | 'Social' | 'Workshop' | 'Fitness' | 'Youth';
  date: string;
  time: string;
  image: string;
  price: number; // 0 for free
  spotsTotal: number;
  spotsLeft: number;
  description: string;
  schedule: { time: string; activity: string }[];
  prizes?: string[];
  isRegistered?: boolean;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  description: string;
  clubName: string;
  amount: number;
  method: 'Credit / Debit Card' | 'UPI' | 'Wallet' | 'Net Banking';
  status: 'Success' | 'Pending' | 'Failed';
  type: 'Booking' | 'Membership' | 'Event' | 'Refund';
  referenceId: string;
  invoiceNumber: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'membership' | 'event' | 'payment';
  isRead: boolean;
  linkView?: string;
}

export interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  targetType: 'club' | 'facility';
  targetId: string;
  targetName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export type UserViewType =
  | 'home'
  | 'clubs'
  | 'club-details'
  | 'facilities'
  | 'facility-details'
  | 'booking-create'
  | 'booking-confirmation'
  | 'bookings'
  | 'memberships'
  | 'membership-purchase'
  | 'membership-details'
  | 'events'
  | 'event-details'
  | 'family'
  | 'profile'
  | 'payments'
  | 'favorites'
  | 'reviews'
  | 'notifications'
  | 'login'
  | 'register'
  | 'forgot-password';
