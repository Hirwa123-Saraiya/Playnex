import { apiMethod } from './api';

export interface ClubSettingsData {
  id: string;
  name: string;
  sport: string;
  location: string;
  address?: string;
  phone?: string;
}

export interface UpdateClubSettingsPayload {
  clubName?: string;
  sport?: string;
  location?: string;
  address?: string;
  phone?: string;
}

export const clubSettingsService = {
  async getSettings(tenantId?: string) {
    return apiMethod<ClubSettingsData>({
      method: 'GET',
      url: '/club/settings',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async updateSettings(data: UpdateClubSettingsPayload) {
    return apiMethod<ClubSettingsData>({
      method: 'PUT',
      url: '/club/settings',
      data,
    });
  },
};

export default clubSettingsService;
