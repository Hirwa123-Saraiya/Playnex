import { apiMethod } from './api';

export interface UserEventRecord {
  id: string;
  title: string;
  description: string;
  sport: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  entryFee: number;
  maxParticipants: number;
  registeredCount: number;
  status: string;
  club: string;
  createdAt: string;
}

export const userEventsService = {
  async getEvents() {
    return apiMethod<UserEventRecord[]>({
      method: 'GET',
      url: '/user/events',
    });
  },

  async registerForEvent(eventId: string) {
    return apiMethod<UserEventRecord>({
      method: 'POST',
      url: `/user/events/${eventId}/register`,
    });
  },
};

export default userEventsService;
