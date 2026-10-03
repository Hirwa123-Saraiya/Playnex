import { apiMethod } from './api';

export interface FamilyMemberRecord {
  id: string;
  userId: string;
  name: string;
  relation: string;
  age?: number;
  createdAt: string;
}

export interface ClubReviewRecord {
  id: string;
  clubId: string;
  userId?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const userProfileService = {
  async getFamilyMembers(userId?: string) {
    return apiMethod<FamilyMemberRecord[]>({
      method: 'GET',
      url: '/user/profile/family',
      params: userId ? { userId } : undefined,
    });
  },

  async addFamilyMember(data: { name: string; relation: string; age?: number; userId?: string }) {
    return apiMethod<FamilyMemberRecord>({
      method: 'POST',
      url: '/user/profile/family',
      data,
    });
  },

  async deleteFamilyMember(id: string, userId?: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/user/profile/family/${id}`,
      params: userId ? { userId } : undefined,
    });
  },

  async submitReview(data: { clubId: string; userName: string; rating: number; comment: string; userId?: string }) {
    return apiMethod<ClubReviewRecord>({
      method: 'POST',
      url: '/user/profile/reviews',
      data,
    });
  },
};

export default userProfileService;
