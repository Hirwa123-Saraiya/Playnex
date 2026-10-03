import { apiMethod } from './api';

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  createdAt: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  message: string;
  targetAudience?: string;
}

export const communicationsService = {
  async getAnnouncements(tenantId?: string) {
    return apiMethod<AnnouncementItem[]>({
      method: 'GET',
      url: '/club/communications',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createAnnouncement(data: CreateAnnouncementPayload) {
    return apiMethod<AnnouncementItem>({
      method: 'POST',
      url: '/club/communications',
      data,
    });
  },

  async deleteAnnouncement(id: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/club/communications/${id}`,
    });
  },
};

export default communicationsService;
