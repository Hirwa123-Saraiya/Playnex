import { apiMethod } from './api';

export interface PurchaseMembershipPayload {
  clubId: string;
  planId?: string;
  planName: string;
  tier?: string;
  durationMonths?: number;
  paymentMethod?: string;
  amount?: number;
  userId?: string;
}

export interface UserMembershipRecord {
  id: string;
  userId: string;
  clubId: string;
  planId?: string;
  planName: string;
  tier: string;
  startDate: string;
  endDate: string;
  status: string;
  paymentMethod: string;
  amount: number;
  clubName: string;
  clubLocation: string;
  createdAt: string;
}

export const userMembershipsService = {
  async getMyMemberships(userId?: string) {
    return apiMethod<UserMembershipRecord[]>({
      method: 'GET',
      url: '/user/memberships',
      params: userId ? { userId } : undefined,
    });
  },

  async getMembershipPlans(clubId?: string) {
    return apiMethod<any[]>({
      method: 'GET',
      url: '/user/memberships/plans',
      params: clubId ? { clubId } : undefined,
    });
  },

  async purchaseMembership(data: PurchaseMembershipPayload) {
    return apiMethod<UserMembershipRecord>({
      method: 'POST',
      url: '/user/memberships/purchase',
      data,
    });
  },
};

export default userMembershipsService;
