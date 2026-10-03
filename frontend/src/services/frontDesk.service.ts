import { apiMethod } from './api';

/* ============================================================
   Front-desk service — real API only
   ============================================================ */

export interface FrontDeskMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier?: string;
  membership?: string;
}

export interface FrontDeskBooking {
  id: string;
  courtId: string;
  courtName?: string;
  sport?: string;
  customer: string;
  type: 'MEMBER' | 'GUEST';
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
}

export interface FrontDeskStaff {
  id: string;
  name: string;
  role: 'FRONT DESK' | 'COACH' | 'CLEANER';
  start: string;
  end: string;
  active: boolean;
}

export interface FrontDeskCourt {
  id: string;
  name: string;
  sport: string;
  location?: string;
  hourlyRate?: number;
}

export interface CreateWalkInInput {
  courtId: string;
  date: string;
  startTime: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  memberId?: string;
  paymentMethod?: 'cash' | 'card' | 'upi';
}

export const frontDeskService = {
  /** Member lookup — pass a search term (name / email / phone / id). */
  async searchMembers(q: string): Promise<FrontDeskMember[]> {
    const res = await apiMethod<FrontDeskMember[]>({
      method: 'GET',
      url: '/front-desk/members',
      params: { q },
    });
    return res.success && Array.isArray(res.data) ? res.data : [];
  },

  /** Today's bookings for the timeline. */
  async getTimeline(date: string): Promise<FrontDeskBooking[]> {
    const res = await apiMethod<FrontDeskBooking[]>({
      method: 'GET',
      url: '/front-desk/bookings',
      params: { date },
    });
    return res.success && Array.isArray(res.data) ? res.data : [];
  },

  /** Staff on shift for a given day. */
  async getStaff(date: string): Promise<FrontDeskStaff[]> {
    const res = await apiMethod<FrontDeskStaff[]>({
      method: 'GET',
      url: '/front-desk/staff',
      params: { date },
    });
    return res.success && Array.isArray(res.data) ? res.data : [];
  },

  /** Courts available at the tenant. */
  async getCourts(): Promise<FrontDeskCourt[]> {
    const res = await apiMethod<FrontDeskCourt[]>({
      method: 'GET',
      url: '/user/courts',
    });
    return res.success && Array.isArray(res.data) ? res.data : [];
  },

  /** Create a walk-in (or phone) booking. */
  async createWalkIn(input: CreateWalkInInput) {
    return apiMethod({
      method: 'POST',
      url: '/front-desk/walk-in',
      data: input,
    });
  },

  /** Check a member in for their booked slot. */
  async checkIn(bookingId: string) {
    return apiMethod({
      method: 'PATCH',
      url: `/front-desk/bookings/${bookingId}/checkin`,
    });
  },
};

export default frontDeskService;