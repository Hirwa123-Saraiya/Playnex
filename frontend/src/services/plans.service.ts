import { apiMethod } from './api';

export interface MembershipPlanItem {
  id: string;
  name: string;
  price: number | string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  tier: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CreatePlanPayload {
  name: string;
  price: number;
  billingCycle?: string;
  tier?: string;
  features?: string[];
}

export const plansService = {
  async getPlans(tenantId?: string) {
    return apiMethod<MembershipPlanItem[]>({
      method: 'GET',
      url: '/club/plans',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createPlan(data: CreatePlanPayload) {
    return apiMethod<MembershipPlanItem>({
      method: 'POST',
      url: '/club/plans',
      data,
    });
  },

  async updatePlan(id: string, data: Partial<CreatePlanPayload> & { isActive?: boolean }) {
    return apiMethod<MembershipPlanItem>({
      method: 'PUT',
      url: `/club/plans/${id}`,
      data,
    });
  },

  async deletePlan(id: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/club/plans/${id}`,
    });
  },
};

export default plansService;
