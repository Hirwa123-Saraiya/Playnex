import { apiMethod } from './api';

export interface UserClubItem {
  id: string;
  name: string;
  sport: string;
  location: string;
  address: string;
  phone: string;
  subscriptionPlan: string;
  status: string;
  facilitiesCount: number;
  startingPrice: number;
  rating: number;
  reviewCount: number;
}

export interface UserClubDetailItem extends UserClubItem {
  facilities: any[];
  plans: any[];
  events: any[];
  reviews: any[];
}

export const userClubsService = {
  async getClubs(params?: { city?: string; sport?: string; search?: string }) {
    return apiMethod<UserClubItem[]>({
      method: 'GET',
      url: '/user/clubs',
      params,
    });
  },

  async getClubDetails(clubId: string) {
    return apiMethod<UserClubDetailItem>({
      method: 'GET',
      url: `/user/clubs/${clubId}`,
    });
  },

  async getFacilities(params?: { clubId?: string; sport?: string }) {
    return apiMethod<any[]>({
      method: 'GET',
      url: '/user/facilities',
      params,
    });
  },
};

export default userClubsService;
