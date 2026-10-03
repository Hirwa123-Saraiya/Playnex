import { apiMethod } from './api';

export interface CreateBookingPayload {
  clubId: string;
  facilityId: string;
  userId?: string;
  memberName?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice?: number;
  paymentStatus?: string;
  courtName?: string;
}

export interface UserBookingRecord {
  id: string;
  clubId: string;
  facilityId: string;
  memberName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  courtName: string;
  clubName: string;
  clubLocation: string;
  sport?: string;
  createdAt: string;
}

export const userBookingsService = {
  async getMyBookings(userId?: string) {
    return apiMethod<UserBookingRecord[]>({
      method: 'GET',
      url: '/user/bookings',
      params: userId ? { userId } : undefined,
    });
  },

  async createBooking(data: CreateBookingPayload) {
    return apiMethod<UserBookingRecord>({
      method: 'POST',
      url: '/user/bookings',
      data,
    });
  },

  async cancelBooking(bookingId: string, userId?: string) {
    return apiMethod<{ id: string; status: string }>({
      method: 'PATCH',
      url: `/user/bookings/${bookingId}/cancel`,
      params: userId ? { userId } : undefined,
    });
  },
};

export default userBookingsService;
