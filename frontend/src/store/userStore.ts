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
import {
  initialUserProfile,
  mockClubs,
  mockFacilities,
  mockBookings,
  mockMembershipPlans,
  mockUserMemberships,
  mockEvents,
  mockFamilyMembers,
  mockPaymentTransactions,
  mockNotifications,
  mockReviews,
  mockTimeSlots,
} from '../mock/userMockData';

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

  // Profile update
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  portalMode: 'user',
  activeView: 'home',
  isGuest: false,
  currentUser: initialUserProfile,
  guestAuthModalOpen: false,

  selectedClubId: 'club-sunrise',
  selectedFacilityId: 'fac-sunrise-tennis',
  selectedEventId: 'evt-001',
  selectedPlanId: 'plan-sunrise-gold',
  selectedBookingId: '#BK20251014001',
  selectedFamilyMemberId: 'fam-01',
  lastConfirmedBooking: mockBookings[0],

  searchQuery: '',
  selectedCity: 'All',
  selectedSport: 'All',
  selectedAmenity: 'All',
  filterMembershipOnly: false,

  clubs: mockClubs,
  facilities: mockFacilities,
  timeSlots: mockTimeSlots,
  bookings: mockBookings,
  membershipPlans: mockMembershipPlans,
  userMemberships: mockUserMemberships,
  events: mockEvents,
  familyMembers: mockFamilyMembers,
  payments: mockPaymentTransactions,
  notifications: mockNotifications,
  reviews: mockReviews,

  favoriteClubIds: ['club-sunrise', 'club-greenvalley'],
  favoriteFacilityIds: ['fac-sunrise-tennis', 'fac-riverside-pool'],
  favoriteEventIds: ['evt-001'],

  isNotificationPanelOpen: false,

  bookingWizard: {
    clubId: 'club-sunrise',
    facilityId: 'fac-sunrise-tennis',
    date: '14 Oct 2025',
    slot: mockTimeSlots[1],
    paymentMethod: 'Credit / Debit Card',
    step: 1,
  },

  membershipWizard: {
    clubId: 'club-sunrise',
    planId: 'plan-sunrise-gold',
    durationMonths: 12,
    linkedFamilyNames: ['Sarah Doe (Spouse)'],
    paymentMethod: 'Credit / Debit Card',
    step: 1,
  },

  setPortalMode: (mode) => set({ portalMode: mode }),
  setActiveView: (view) => set({ activeView: view }),
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
    set({
      isGuest: true,
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

  addReview: (reviewData) => {
    const { currentUser } = get();
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
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

  updateProfile: (profileUpdates) => {
    set((state) => ({
      currentUser: { ...state.currentUser, ...profileUpdates },
    }));
  },
}));
