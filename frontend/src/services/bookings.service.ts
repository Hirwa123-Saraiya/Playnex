import { apiMethod } from './api';

export interface BookingItem {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: string;
  userId: string;
  memberName: string;
  memberEmail: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'unpaid' | 'tab';
  totalAmount: number | string;
  createdAt: string;
}

export interface CreateBookingPayload {
  facilityId: string;
  userId?: string;
  memberName?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount?: number;
  status?: string;
  paymentStatus?: string;
}

export const bookingsService = {
  async getBookings(tenantId?: string) {
    return apiMethod<BookingItem[]>({
      method: 'GET',
      url: '/club/bookings',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createBooking(data: CreateBookingPayload) {
    return apiMethod<BookingItem>({
      method: 'POST',
      url: '/club/bookings',
      data,
    });
  },

  async updateBooking(id: string, data: Partial<CreateBookingPayload>) {
    return apiMethod<BookingItem>({
      method: 'PUT',
      url: `/club/bookings/${id}`,
      data,
    });
  },

  async cancelBooking(id: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/club/bookings/${id}`,
    });
  },
};

export default bookingsService;
