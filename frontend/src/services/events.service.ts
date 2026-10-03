import { apiMethod } from './api';

export interface ClubEventItem {
  id: string;
  title: string;
  description: string;
  sport: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  entryFee: number | string;
  maxParticipants: number;
  registeredCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  club?: string;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  sport?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  entryFee?: number;
  maxParticipants?: number;
}

export const eventsService = {
  async getAllEvents() {
    return apiMethod<ClubEventItem[]>({
      method: 'GET',
      url: '/club/events/all',
    });
  },

  async getEvents(tenantId?: string) {
    return apiMethod<ClubEventItem[]>({
      method: 'GET',
      url: '/club/events',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createEvent(data: CreateEventPayload) {
    return apiMethod<ClubEventItem>({
      method: 'POST',
      url: '/club/events',
      data,
    });
  },

  async updateEvent(id: string, data: Partial<CreateEventPayload> & { status?: string }) {
    return apiMethod<ClubEventItem>({
      method: 'PUT',
      url: `/club/events/${id}`,
      data,
    });
  },

  async deleteEvent(id: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/club/events/${id}`,
    });
  },
};

export default eventsService;
