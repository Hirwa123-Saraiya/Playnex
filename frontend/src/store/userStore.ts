import { create } from 'zustand';
import {
  UserProfile,
  Club,
  Facility,
  Booking,
  MembershipPlan,
  UserMembership,
  ClubEvent,
  FamilyMember,
  PaymentTransaction,
  NotificationItem,
  ReviewItem,
  UserViewType,
  TimeSlot,
  BookingStatus,
} from '../types/user.types';
// import {
//   initialUserProfile,
//   mockClubs,
//   mockFacilities,
//   mockBookings,
//   mockMembershipPlans,
//   mockUserMemberships,
//   mockEvents,
//   mockFamilyMembers,
//   mockPaymentTransactions,
//   mockNotifications,
//   mockReviews,
//   mockTimeSlots,
// } from '../mock/userMockData';
import {
  initialUserProfile,
  mockTimeSlots,
} from '../mock/userMockData';
import { userClubsService } from '../services/userClubs.service';
import { userBookingsService } from '../services/userBookings.service';
import { userMembershipsService } from '../services/userMemberships.service';
import { userEventsService } from '../services/userEvents.service';
import { userProfileService } from '../services/userProfile.service';
import { authService } from '../services/auth.service';

export interface BookingWizardState {
  clubId: string;
  facilityId: string;
  date: string; // e.g. "14 Oct 2025"
  slot: TimeSlot | null;
  familyMemberId?: string;
  familyMemberName?: string;
  paymentMethod: 'Credit / Debit Card' | 'UPI' | 'Wallet' | 'Net Banking';
  notes?: string;
  step: number; // 1 to 7
}

export interface MembershipWizardState {
  clubId: string;
  planId: string;
  durationMonths: number;
  linkedFamilyNames: string[];
  paymentMethod: 'Credit / Debit Card' | 'UPI' | 'Wallet' | 'Net Banking';
  step: number; // 1 to 6
}

interface UserStoreState {
  // App view & auth
  portalMode: 'user' | 'club-owner';
  activeView: UserViewType;
  isGuest: boolean;
  currentUser: UserProfile;
  guestAuthModalOpen: boolean;
  guestActionPending?: () => void;

  // Selected entities for detail screens
  selectedClubId: string;
  selectedFacilityId: string;
  selectedEventId: string;
  selectedPlanId: string;
  selectedBookingId: string;
  selectedFamilyMemberId: string;
  lastConfirmedBooking: Booking | null;

  // Search & Global Filters
  searchQuery: string;
  selectedCity: string;
  selectedSport: string;
  selectedAmenity: string;
  filterMembershipOnly: boolean;

  // Data Collections
  clubs: Club[];
  facilities: Facility[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  membershipPlans: MembershipPlan[];
  userMemberships: UserMembership[];
  events: ClubEvent[];
  familyMembers: FamilyMember[];
  payments: PaymentTransaction[];
  notifications: NotificationItem[];
  reviews: ReviewItem[];

  // Favorites
  favoriteClubIds: string[];
  favoriteFacilityIds: string[];
  favoriteEventIds: string[];

  // Interactive Wizards
  bookingWizard: BookingWizardState;
  membershipWizard: MembershipWizardState;

  // Notification UI
  isNotificationPanelOpen: boolean;

  // Actions
  setPortalMode: (mode: 'user' | 'club-owner') => void;
  setActiveView: (view: UserViewType) => void;
  setIsGuest: (isGuest: boolean) => void;
  openGuestModal: (onSuccessCallback?: () => void) => void;
  closeGuestModal: () => void;
  loginAsUser: (user?: Partial<UserProfile>) => void;
  loginAsGuest: () => void;
  logout: () => void;

  // Navigation & selection helpers
  navigateToClubDetails: (clubId: string) => void;
  navigateToFacilityDetails: (facilityId: string) => void;
  navigateToEventDetails: (eventId: string) => void;
  navigateToBookingConfirmation: (booking: Booking) => void;

  // Search & Filters
  setSearchQuery: (query: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedSport: (sport: string) => void;
  setSelectedAmenity: (amenity: string) => void;
  setFilterMembershipOnly: (only: boolean) => void;
  resetFilters: () => void;

  // Booking Flow
  startBooking: (clubId?: string, facilityId?: string) => void;
  updateBookingWizard: (updates: Partial<BookingWizardState>) => void;
  confirmBooking: () => Booking | null;
  cancelBooking: (bookingId: string) => void;
  rescheduleBooking: (bookingId: string, newDate: string, newSlot: string) => void;

  // Membership Purchase Flow
  startMembershipPurchase: (clubId?: string, planId?: string) => void;
  updateMembershipWizard: (updates: Partial<MembershipWizardState>) => void;
  confirmMembershipPurchase: () => UserMembership | null;
  renewMembership: (membershipId: string) => void;

  // Family Management
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'userId'>) => void;
  removeFamilyMember: (memberId: string) => void;

  // Events
  registerForEvent: (eventId: string) => void;

  // Favorites
  toggleFavoriteClub: (clubId: string) => void;
  toggleFavoriteFacility: (facilityId: string) => void;
  toggleFavoriteEvent: (eventId: string) => void;

  // Reviews
  addReview: (review: Omit<ReviewItem, 'id' | 'userId' | 'userName' | 'userAvatar' | 'date'>) => void;

  // Notifications
  toggleNotificationPanel: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Live data fetch
  fetchLiveData: () => Promise<void>;

  // Profile update
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  portalMode: 'user',
  activeView: 'home',
  isGuest: true,
  currentUser: initialUserProfile,
  guestAuthModalOpen: false,

  selectedClubId: '',
  selectedFacilityId: '',
  selectedEventId: '',
  selectedPlanId: '',
  selectedBookingId: '',
  selectedFamilyMemberId: '',
  lastConfirmedBooking: null,

  searchQuery: '',
  selectedCity: 'All',
  selectedSport: 'All',
  selectedAmenity: 'All',
  filterMembershipOnly: false,

  clubs: [],
  facilities: [],
  timeSlots: [
    { id: 'slot-1', time: '06:00 AM - 07:00 AM', period: 'Morning', isAvailable: true, price: 500 },
    { id: 'slot-2', time: '07:00 AM - 08:00 AM', period: 'Morning', isAvailable: true, price: 500 },
    { id: 'slot-3', time: '08:00 AM - 09:00 AM', period: 'Morning', isAvailable: true, price: 650 },
    { id: 'slot-4', time: '09:00 AM - 10:00 AM', period: 'Morning', isAvailable: true, price: 650 },
    { id: 'slot-5', time: '04:00 PM - 05:00 PM', period: 'Afternoon', isAvailable: true, price: 650 },
    { id: 'slot-6', time: '05:00 PM - 06:00 PM', period: 'Evening', isAvailable: true, price: 800 },
    { id: 'slot-7', time: '06:00 PM - 07:00 PM', period: 'Evening', isAvailable: true, price: 800 },
    { id: 'slot-8', time: '07:00 PM - 08:00 PM', period: 'Evening', isAvailable: true, price: 800 },
    { id: 'slot-9', time: '08:00 PM - 09:00 PM', period: 'Evening', isAvailable: true, price: 700 },
  ],
  bookings: [],
  membershipPlans: [],
  userMemberships: [],
  events: [],
  familyMembers: [],
  payments: [],
  notifications: [],
  reviews: [],

  favoriteClubIds: [],
  favoriteFacilityIds: [],
  favoriteEventIds: [],

  isNotificationPanelOpen: false,

  bookingWizard: {
    clubId: '',
    facilityId: '',
    date: new Date().toISOString().split('T')[0],
    slot: null,
    paymentMethod: 'UPI',
    step: 1,
  },

  membershipWizard: {
    clubId: '',
    planId: '',
    durationMonths: 12,
    linkedFamilyNames: [],
    paymentMethod: 'UPI',
    step: 1,
  },

  setPortalMode: (mode) => set({ portalMode: mode }),
  setActiveView: (view) => {
    const { isGuest, openGuestModal } = get();
    if (isGuest && (view === 'bookings' || view === 'family' || view === 'profile' || view === 'payments')) {
      openGuestModal(() => set({ activeView: view }));
      return;
    }
    set({ activeView: view });
  },
  setIsGuest: (isGuest) => set({ isGuest }),

  openGuestModal: (onSuccessCallback) => {
    set({
      guestAuthModalOpen: true,
      guestActionPending: onSuccessCallback,
    });
  },

  closeGuestModal: () => {
    set({
      guestAuthModalOpen: false,
      guestActionPending: undefined,
    });
  },

  loginAsUser: (updates) => {
    const callback = get().guestActionPending;
    set((state) => ({
      isGuest: false,
      currentUser: { ...state.currentUser, ...(updates || {}) },
      guestAuthModalOpen: false,
      guestActionPending: undefined,
    }));
    get().fetchLiveData();
    if (callback) {
      callback();
    }
  },

  loginAsGuest: () => {
    set({
      isGuest: true,
      guestAuthModalOpen: false,
      activeView: 'home',
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    authService.logout().catch(() => {});
    set({
      isGuest: true,
      bookings: [],
      userMemberships: [],
      familyMembers: [],
      activeView: 'home',
    });
  },

  navigateToClubDetails: (clubId) => {
    set({
      selectedClubId: clubId,
      activeView: 'club-details',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  navigateToFacilityDetails: (facilityId) => {
    const fac = get().facilities.find((f) => f.id === facilityId);
    set({
      selectedFacilityId: facilityId,
      selectedClubId: fac ? fac.clubId : get().selectedClubId,
      activeView: 'facility-details',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  navigateToEventDetails: (eventId) => {
    set({
      selectedEventId: eventId,
      activeView: 'event-details',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  navigateToBookingConfirmation: (booking) => {
    set({
      lastConfirmedBooking: booking,
      activeView: 'booking-confirmation',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCity: (selectedCity) => set({ selectedCity }),
  setSelectedSport: (selectedSport) => set({ selectedSport }),
  setSelectedAmenity: (selectedAmenity) => set({ selectedAmenity }),
  setFilterMembershipOnly: (filterMembershipOnly) => set({ filterMembershipOnly }),

  resetFilters: () => {
    set({
      searchQuery: '',
      selectedCity: 'All',
      selectedSport: 'All',
      selectedAmenity: 'All',
      filterMembershipOnly: false,
    });
  },

  startBooking: (clubId, facilityId) => {
    const { isGuest, openGuestModal } = get();
    if (isGuest) {
      openGuestModal(() => {
        get().startBooking(clubId, facilityId);
      });
      return;
    }

    const cId = clubId || get().selectedClubId || 'club-sunrise';
    const availableFacilities = get().facilities.filter((f) => f.clubId === cId);
    const fId = facilityId || (availableFacilities.length > 0 ? availableFacilities[0].id : get().facilities[0].id);

    set({
      bookingWizard: {
        clubId: cId,
        facilityId: fId,
        date: '14 Oct 2025',
        slot: get().timeSlots[1],
        paymentMethod: 'Credit / Debit Card',
        step: 3, // jumps to date & slot if club and facility are already set
      },
      activeView: 'booking-create',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateBookingWizard: (updates) => {
    set((state) => ({
      bookingWizard: {
        ...state.bookingWizard,
        ...updates,
      },
    }));
  },

  confirmBooking: () => {
    const { bookingWizard, facilities, clubs, currentUser } = get();
    const facility = facilities.find((f) => f.id === bookingWizard.facilityId);
    const club = clubs.find((c) => c.id === bookingWizard.clubId);

    if (!facility || !club || !bookingWizard.slot) return null;

    const baseAmount = bookingWizard.slot.price || facility.pricingPerHour;
    const tax = Math.round(baseAmount * 0.09);
    const totalPaid = baseAmount + tax;
    const bookingId = `#BK${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      id: bookingId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      clubId: club.id,
      clubName: club.name,
      clubCity: club.city,
      facilityId: facility.id,
      facilityName: facility.name,
      facilityCategory: facility.category,
      facilityImage: facility.image,
      date: bookingWizard.date,
      timeSlot: `${bookingWizard.slot.time} (1 Hour)`,
      duration: '1 Hour',
      amount: baseAmount,
      tax: tax,
      totalPaid: totalPaid,
      status: 'Upcoming',
      paymentMethod: bookingWizard.paymentMethod,
      paymentId: `PAY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      notes: bookingWizard.notes,
      createdAt: 'Just now',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PLX-${bookingId}-${currentUser.name}`,
    };

    const newPayment: PaymentTransaction = {
      id: `TXN-${Date.now()}`,
      date: 'Today',
      description: `Booking: ${facility.name}`,
      clubName: club.name,
      amount: totalPaid,
      method: bookingWizard.paymentMethod,
      status: 'Success',
      type: 'Booking',
      referenceId: bookingId,
      invoiceNumber: `INV-PLX-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Booking Confirmed!',
      message: `Your booking for ${facility.name} at ${club.name} on ${bookingWizard.date} (${bookingWizard.slot.time}) is confirmed.`,
      timestamp: 'Just now',
      type: 'booking',
      isRead: false,
      linkView: 'bookings',
    };

    set((state) => ({
      bookings: [newBooking, ...state.bookings],
      payments: [newPayment, ...state.payments],
      notifications: [newNotification, ...state.notifications],
      lastConfirmedBooking: newBooking,
      activeView: 'booking-confirmation',
    }));

    userBookingsService
      .createBooking({
        clubId: club.id,
        facilityId: facility.id,
        userId: currentUser.id,
        memberName: currentUser.name,
        bookingDate: bookingWizard.date,
        startTime: bookingWizard.slot?.time?.split(' - ')[0] || '06:00:00',
        endTime: bookingWizard.slot?.time?.split(' - ')[1] || '07:00:00',
        totalPrice: totalPaid,
        paymentStatus: 'paid',
        courtName: facility.name,
      })
      .catch((err) => console.warn('Booking sync to db:', err));

    return newBooking;
  },

  cancelBooking: (bookingId) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'Cancelled' as BookingStatus } : b
      ),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Booking Cancelled',
          message: `Booking ${bookingId} has been successfully cancelled. Refund initiated.`,
          timestamp: 'Just now',
          type: 'booking',
          isRead: false,
        },
        ...state.notifications,
      ],
    }));

    userBookingsService
      .cancelBooking(bookingId, get().currentUser.id)
      .catch((err) => console.warn('Cancel sync:', err));
  },

  rescheduleBooking: (bookingId, newDate, newSlot) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, date: newDate, timeSlot: newSlot } : b
      ),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Booking Rescheduled',
          message: `Booking ${bookingId} has been updated to ${newDate} (${newSlot}).`,
          timestamp: 'Just now',
          type: 'booking',
          isRead: false,
        },
        ...state.notifications,
      ],
    }));
  },

  startMembershipPurchase: (clubId, planId) => {
    const { isGuest, openGuestModal } = get();
    if (isGuest) {
      openGuestModal(() => {
        get().startMembershipPurchase(clubId, planId);
      });
      return;
    }

    const cId = clubId || get().selectedClubId || 'club-sunrise';
    const availablePlans = get().membershipPlans.filter((p) => p.clubId === cId);
    const pId = planId || (availablePlans.length > 0 ? availablePlans[0].id : get().membershipPlans[0].id);

    set({
      membershipWizard: {
        clubId: cId,
        planId: pId,
        durationMonths: 12,
        linkedFamilyNames: [],
        paymentMethod: 'Credit / Debit Card',
        step: 2,
      },
      activeView: 'membership-purchase',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateMembershipWizard: (updates) => {
    set((state) => ({
      membershipWizard: {
        ...state.membershipWizard,
        ...updates,
      },
    }));
  },

  confirmMembershipPurchase: () => {
    const { membershipWizard, membershipPlans, clubs, currentUser } = get();
    const plan = membershipPlans.find((p) => p.id === membershipWizard.planId);
    const club = clubs.find((c) => c.id === membershipWizard.clubId);

    if (!plan || !club) return null;

    const amount =
      membershipWizard.durationMonths === 12
        ? plan.priceAnnual
        : membershipWizard.durationMonths === 3
        ? plan.priceQuarterly
        : plan.priceMonthly;

    const membershipNumber = `PLX-${club.name.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newMembership: UserMembership = {
      id: `mem-${Date.now()}`,
      membershipNumber: membershipNumber,
      userId: currentUser.id,
      clubId: club.id,
      clubName: club.name,
      clubCity: club.city,
      planId: plan.id,
      planName: plan.name,
      tier: plan.tier,
      status: 'Active',
      startDate: 'Today',
      endDate: `In ${membershipWizard.durationMonths} Months`,
      durationMonths: membershipWizard.durationMonths,
      amountPaid: amount,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=MEM-${membershipNumber}-${currentUser.name}`,
      linkedFamilyMembers: membershipWizard.linkedFamilyNames,
    };

    const newPayment: PaymentTransaction = {
      id: `TXN-${Date.now()}`,
      date: 'Today',
      description: `Membership: ${plan.name} (${membershipWizard.durationMonths} Months)`,
      clubName: club.name,
      amount: amount,
      method: membershipWizard.paymentMethod,
      status: 'Success',
      type: 'Membership',
      referenceId: newMembership.id,
      invoiceNumber: `INV-PLX-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Membership Activated!',
      message: `Congratulations! Your ${plan.name} at ${club.name} is now active. Access card generated.`,
      timestamp: 'Just now',
      type: 'membership',
      isRead: false,
      linkView: 'memberships',
    };

    set((state) => ({
      userMemberships: [newMembership, ...state.userMemberships],
      payments: [newPayment, ...state.payments],
      notifications: [newNotification, ...state.notifications],
      activeView: 'memberships',
    }));

    userMembershipsService
      .purchaseMembership({
        clubId: club.id,
        planId: plan.id,
        planName: plan.name,
        tier: plan.tier,
        durationMonths: membershipWizard.durationMonths,
        paymentMethod: membershipWizard.paymentMethod,
        amount: amount,
        userId: currentUser.id,
      })
      .catch((err) => console.warn('Membership purchase sync:', err));

    return newMembership;
  },

  renewMembership: (membershipId) => {
    set((state) => ({
      userMemberships: state.userMemberships.map((m) =>
        m.id === membershipId ? { ...m, status: 'Active', endDate: 'Extended by 12 Months' } : m
      ),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Membership Renewed!',
          message: `Your membership has been successfully extended for another 12 months with loyalty privileges applied.`,
          timestamp: 'Just now',
          type: 'membership',
          isRead: false,
        },
        ...state.notifications,
      ],
    }));
  },

  addFamilyMember: (memberData) => {
    const { isGuest, openGuestModal } = get();
    if (isGuest) {
      openGuestModal(() => {
        get().addFamilyMember(memberData);
      });
      return;
    }
    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      userId: get().currentUser.id,
      ...memberData,
    };
    set((state) => ({
      familyMembers: [...state.familyMembers, newMember],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Family Member Linked',
          message: `${memberData.name} has been added to your Playnex family circle.`,
          timestamp: 'Just now',
          type: 'membership',
          isRead: false,
        },
        ...state.notifications,
      ],
    }));
  },

  removeFamilyMember: (memberId) => {
    set((state) => ({
      familyMembers: state.familyMembers.filter((m) => m.id !== memberId),
    }));
  },

  registerForEvent: (eventId) => {
    const { isGuest, openGuestModal } = get();
    if (isGuest) {
      openGuestModal(() => {
        get().registerForEvent(eventId);
      });
      return;
    }

    const event = get().events.find((e) => e.id === eventId);
    if (!event) return;

    const newPayment: PaymentTransaction = {
      id: `TXN-${Date.now()}`,
      date: 'Today',
      description: `Event Entry: ${event.title}`,
      clubName: event.clubName,
      amount: event.price,
      method: 'UPI',
      status: 'Success',
      type: 'Event',
      referenceId: event.id,
      invoiceNumber: `INV-PLX-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId ? { ...e, isRegistered: true, spotsLeft: Math.max(0, e.spotsLeft - 1) } : e
      ),
      payments: event.price > 0 ? [newPayment, ...state.payments] : state.payments,
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Event Registration Confirmed!',
          message: `You are confirmed for ${event.title} at ${event.clubName} on ${event.date}.`,
          timestamp: 'Just now',
          type: 'event',
          isRead: false,
          linkView: 'events',
        },
        ...state.notifications,
      ],
    }));
  },

  toggleFavoriteClub: (clubId) => {
    set((state) => {
      const exists = state.favoriteClubIds.includes(clubId);
      return {
        favoriteClubIds: exists
          ? state.favoriteClubIds.filter((id) => id !== clubId)
          : [...state.favoriteClubIds, clubId],
      };
    });
  },

  toggleFavoriteFacility: (facilityId) => {
    set((state) => {
      const exists = state.favoriteFacilityIds.includes(facilityId);
      return {
        favoriteFacilityIds: exists
          ? state.favoriteFacilityIds.filter((id) => id !== facilityId)
          : [...state.favoriteFacilityIds, facilityId],
      };
    });
  },

  toggleFavoriteEvent: (eventId) => {
    set((state) => {
      const exists = state.favoriteEventIds.includes(eventId);
      return {
        favoriteEventIds: exists
          ? state.favoriteEventIds.filter((id) => id !== eventId)
          : [...state.favoriteEventIds, eventId],
      };
    });
  },

  // addReview: (reviewData) => {
  //   const { isGuest, openGuestModal } = get();
  //   if (isGuest) {
  //     openGuestModal(() => {
  //       get().addReview(reviewData);
  //     });
  //     return;
  //   }
  //   const { currentUser } = get();
  //   const newRev: ReviewItem = {
  //     id: `rev-${Date.now()}`,
  //     userId: currentUser.id,
  //     userName: currentUser.name,
  //     userAvatar: currentUser.avatarUrl,
  //     date: 'Today',
  //     ...reviewData,
  //   };
  //   set((state) => ({
  //     reviews: [newRev, ...state.reviews],
  //     notifications: [
  //       {
  //         id: `notif-${Date.now()}`,
  //         title: 'Review Published',
  //         message: `Thank you! Your feedback for ${reviewData.targetName} helps our sports community.`,
  //         timestamp: 'Just now',
  //         type: 'booking',
  //         isRead: false,
  //       },
  //       ...state.notifications,
  //     ],
  //   }));
  // },

    addReview: (reviewData) => {
    const { isGuest, openGuestModal } = get();
    if (isGuest) {
      openGuestModal(() => {
        get().addReview(reviewData);
      });
      return;
    }
    const { currentUser } = get();

    /* Optimistic local insert so the UI updates instantly */
    const tempId = `rev-${Date.now()}`;
    const newRev: ReviewItem = {
      id: tempId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      date: 'Today',
      ...reviewData,
    };
    set((state) => ({
      reviews: [newRev, ...state.reviews],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Review Published',
          message: `Thank you! Your feedback for ${reviewData.targetName} helps our sports community.`,
          timestamp: 'Just now',
          type: 'booking',
          isRead: false,
        },
        ...state.notifications,
      ],
    }));

    /* Persist to backend */
    userProfileService
      .submitReview({
        clubId: reviewData.targetId,
        userName: currentUser.name,
        rating: reviewData.rating,
        comment: reviewData.comment,
        userId: currentUser.id,
      })
      .then((res) => {
        /* If backend returned a real record with an id, swap the temp id */
        if (res?.success && res.data?.id) {
          set((state) => ({
            reviews: state.reviews.map((r) =>
              r.id === tempId ? { ...r, id: res.data.id } : r
            ),
          }));
        }
      })
      .catch((err) => {
        console.warn('Review submit failed:', err);
        /* Optionally: remove optimistic entry on failure */
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== tempId),
        }));
      });
  },

  toggleNotificationPanel: () => {
    set((state) => ({ isNotificationPanelOpen: !state.isNotificationPanelOpen }));
  },

  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  },

  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  fetchLiveData: async () => {
    try {

        const [clubsRes, facsRes, evtsRes, plansRes, bksRes, memsRes, famRes, reviewsRes] = await Promise.allSettled([
        userClubsService.getClubs(),
        userClubsService.getFacilities(),
        userEventsService.getEvents(),
        userMembershipsService.getMembershipPlans(),
        userBookingsService.getMyBookings(get().currentUser.id),
        userMembershipsService.getMyMemberships(get().currentUser.id),
        userProfileService.getFamilyMembers(get().currentUser.id),
        userProfileService.getReviews({ userId: get().currentUser.id }),
      ]);
      // const [clubsRes, facsRes, evtsRes, plansRes, bksRes, memsRes, famRes] = await Promise.allSettled([
      //   userClubsService.getClubs(),
      //   userClubsService.getFacilities(),
      //   userEventsService.getEvents(),
      //   userMembershipsService.getMembershipPlans(),
      //   userBookingsService.getMyBookings(get().currentUser.id),
      //   userMembershipsService.getMyMemberships(get().currentUser.id),
      //   userProfileService.getFamilyMembers(get().currentUser.id),
      // ]);

      set((state) => {
        const updates: Partial<UserStoreState> = {};

        if (clubsRes.status === 'fulfilled' && clubsRes.value.success && Array.isArray(clubsRes.value.data) && clubsRes.value.data.length > 0) {
          const liveClubs = clubsRes.value.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            tagline: `${c.sport || 'Sports'} & Country Club`,
            city: c.location || 'Local',
            address: c.address || `${c.location} Sports Complex`,
            rating: Number(c.rating) || 4.8,
            reviewsCount: Number(c.reviewCount) || 12,
            heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
            gallery: [
              'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
            ],
            sports: [c.sport || 'Tennis'],
            amenities: ['Parking', 'Pro Shop', 'Locker Room'],
            membershipAvailable: true,
            minPricePerHour: Number(c.startingPrice) || 500,
            operatingHours: '06:00 AM - 11:00 PM',
            phone: c.phone || '+91 98765 43210',
            email: 'info@playnex.club',
            description: `${c.name} is a premier sports destination in ${c.location}.`,
            isFeatured: true,
          }));
          updates.clubs = liveClubs;
        }

        if (facsRes.status === 'fulfilled' && facsRes.value.success && Array.isArray(facsRes.value.data) && facsRes.value.data.length > 0) {
          const liveFacs = facsRes.value.data.map((f: any) => ({
            id: f.id,
            clubId: f.clubId,
            clubName: f.clubName,
            name: f.name,
            category: 'Tennis Court' as const,
            type: f.surface ? `Outdoor | ${f.surface}` : 'Outdoor | Hard Court',
            pricingPerHour: Number(f.hourlyRate) || 500,
            rating: 4.8,
            reviewsCount: 15,
            image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
            gallery: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80'],
            description: `${f.name} offers premier playing surfaces.`,
            features: ['Flood Lights', 'Locker Room'],
            rules: ['Non-marking shoes mandatory', 'Arrive 10 mins prior'],
            cancellationPolicy: 'Free cancellation up to 4 hours before slot',
            capacity: 4,
            coachingAvailable: true,
          }));
          updates.facilities = liveFacs;
        }

        if (evtsRes.status === 'fulfilled' && evtsRes.value.success && Array.isArray(evtsRes.value.data) && evtsRes.value.data.length > 0) {
          const liveEvts = evtsRes.value.data.map((e: any) => ({
            id: e.id,
            clubId: e.clubId || 'club-main',
            clubName: e.club || 'Playnex Club',
            clubCity: 'Local',
            title: e.title,
            category: 'Tournament' as const,
            date: e.eventDate || 'Upcoming',
            time: `${e.startTime} - ${e.endTime}`,
            image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=600&q=80',
            price: Number(e.entryFee) || 0,
            spotsTotal: Number(e.maxParticipants) || 32,
            spotsLeft: Math.max(0, (Number(e.maxParticipants) || 32) - (Number(e.registeredCount) || 0)),
            description: e.description || '',
            schedule: [{ time: e.startTime || '09:00 AM', activity: 'Tournament Commencement' }],
            isRegistered: false,
          }));
          updates.events = liveEvts;
        }

        if (plansRes.status === 'fulfilled' && plansRes.value.success && Array.isArray(plansRes.value.data) && plansRes.value.data.length > 0) {
          const livePlans = plansRes.value.data.map((p: any) => {
            const rawPrice = Number(p.price) || 2499;
            const cycle = (p.billingCycle || 'monthly').toLowerCase();
            return {
              id: p.id,
              clubId: p.clubId,
              clubName: p.clubName || 'Playnex Club',
              name: p.name,
              tier: (['Silver', 'Gold', 'Platinum', 'Family'].includes(p.tier) ? p.tier : 'Gold') as any,
              tagline: `Official ${p.tier || 'Gold'} sports membership for ${p.clubName || 'Country Club'}`,
              priceMonthly: cycle === 'monthly' ? rawPrice : Math.round(rawPrice / (cycle === 'quarterly' ? 3 : 12)),
              priceQuarterly: cycle === 'quarterly' ? rawPrice : cycle === 'monthly' ? rawPrice * 3 : Math.round(rawPrice / 4),
              priceAnnual: cycle === 'yearly' ? rawPrice : cycle === 'monthly' ? rawPrice * 12 : rawPrice * 4,
              discountBadge: cycle === 'yearly' ? 'Save 25%' : cycle === 'quarterly' ? 'Popular' : undefined,
              includedFacilities: ['Olympic Badminton Arena', 'Clay Tennis Courts', 'Squash Courts', 'Swimming Pool'],
              guestPassesPerMonth: p.tier === 'Platinum' ? 4 : p.tier === 'Gold' ? 2 : 1,
              maxFamilyMembers: p.tier === 'Platinum' ? 4 : 2,
              benefits: Array.isArray(p.features) && p.features.length > 0
                ? p.features
                : ['Priority court reservation', 'Free turnstile QR pass', '10% Pro-shop discount', 'Locker access'],
              isPopular: p.tier === 'Gold',
            };
          });
          updates.membershipPlans = livePlans;
          if (!state.selectedPlanId && livePlans.length > 0) {
            updates.selectedPlanId = livePlans[0].id;
          }
        }

        if (bksRes.status === 'fulfilled' && bksRes.value.success && Array.isArray(bksRes.value.data) && bksRes.value.data.length > 0) {
          const liveBks = bksRes.value.data.map((b: any) => ({
            id: b.id,
            userId: state.currentUser.id,
            bookingNumber: b.id,
            userName: b.memberName,
            userEmail: state.currentUser.email,
            userPhone: state.currentUser.phone,
            clubId: b.clubId,
            clubName: b.clubName,
            clubCity: b.clubLocation || 'Local',
            facilityId: b.facilityId,
            facilityName: b.courtName || 'Court',
            facilityCategory: b.sport || 'Court',
            facilityImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
            date: b.bookingDate,
            timeSlot: `${b.startTime} - ${b.endTime}`,
            duration: '1 Hour',
            amount: Number(b.totalPrice) || 500,
            tax: Math.round((Number(b.totalPrice) || 500) * 0.18),
            totalPaid: Number(b.totalPrice) || 500,
            status: b.status === 'confirmed' ? ('Upcoming' as const) : b.status === 'cancelled' ? ('Cancelled' as const) : ('Completed' as const),
            paymentMethod: 'UPI' as const,
            paymentId: `PAY-${b.id}`,
            createdAt: b.createdAt,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PLX-${b.id}`,
          }));
          updates.bookings = liveBks;
        }

        if (memsRes.status === 'fulfilled' && memsRes.value.success && Array.isArray(memsRes.value.data) && memsRes.value.data.length > 0) {
          const liveMems = memsRes.value.data.map((m: any) => ({
            id: m.id,
            membershipNumber: m.id,
            userId: m.userId,
            clubId: m.clubId,
            clubName: m.clubName,
            clubCity: m.clubLocation || 'Local',
            planId: m.planId || 'plan-1',
            planName: m.planName,
            tier: (['Silver', 'Gold', 'Platinum', 'Family'].includes(m.tier) ? m.tier : 'Gold') as any,
            status: 'Active' as const,
            startDate: m.startDate,
            endDate: m.endDate,
            durationMonths: 12,
            amountPaid: Number(m.amount) || 0,
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=MEM-${m.id}`,
            linkedFamilyMembers: [],
          }));
          updates.userMemberships = liveMems;
        }

        if (famRes.status === 'fulfilled' && famRes.value.success && Array.isArray(famRes.value.data) && famRes.value.data.length > 0) {
          const liveFam = famRes.value.data.map((f: any) => ({
            id: f.id,
            userId: f.userId,
            name: f.name,
            relation: (['Spouse', 'Child', 'Parent', 'Sibling'].includes(f.relation) ? f.relation : 'Child') as any,
            age: Number(f.age) || 25,
            gender: 'Male' as const,
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            sportsInterests: ['Tennis'],
          }));
          updates.familyMembers = liveFam;
        }

        //new
                if (
          reviewsRes.status === 'fulfilled' &&
          reviewsRes.value.success &&
          Array.isArray(reviewsRes.value.data)
        ) {
          const liveReviews = reviewsRes.value.data.map((r: any) => ({
            id: r.id,
            userId: r.userId || state.currentUser.id,
            userName: r.userName || state.currentUser.name,
            userAvatar:
              r.userAvatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            date: r.createdAt
              ? new Date(r.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recently',
            targetType: 'club' as const,
            targetId: r.clubId,
            targetName: r.clubName || 'Club',
            rating: Number(r.rating) || 5,
            comment: r.comment || '',
            images: [],
          }));
          updates.reviews = liveReviews;
        }

        if (!state.selectedClubId && updates.clubs && updates.clubs.length > 0) {
          updates.selectedClubId = updates.clubs[0].id;
        }
        if (!state.selectedFacilityId && updates.facilities && updates.facilities.length > 0) {
          updates.selectedFacilityId = updates.facilities[0].id;
        }

        return updates;
      });
    } catch (err) {
      console.warn('Could not load live user portal data:', err);
    }
  },

  updateProfile: (profileUpdates) => {
    set((state) => ({
      currentUser: { ...state.currentUser, ...profileUpdates },
    }));
  },
}));
