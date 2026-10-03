import { apiMethod } from './api';

export interface PlatformPlan {
  id: string;
  planId: string;
  name: string;
  tagline?: string;
  monthlyPrice: number | string;
  annualPrice: number | string;
  currency?: string;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
  maxCourts?: number;
  maxMembers?: number;
  sortOrder?: number;
  createdAt?: string;
}

export interface CreatePlanPayload {
  name: string;
  tagline?: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isPopular?: boolean;
  maxCourts?: number;
  maxMembers?: number;
}

export interface CreateOrderPayload {
  planId: string;
  billingCycle: 'Monthly' | 'Annual';
  tenantId?: string;
}

export interface CheckoutPayload {
  tenantId: string;
  planId: string;
  billingCycle: 'Monthly' | 'Annual';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export const platformPlansService = {
  async getPlans() {
    return apiMethod<PlatformPlan[]>({
      method: 'GET',
      url: '/plans',
    });
  },

  async createPlan(data: CreatePlanPayload) {
    return apiMethod<PlatformPlan>({
      method: 'POST',
      url: '/plans',
      data,
    });
  },

  async updatePlan(id: string, data: Partial<CreatePlanPayload & { isActive: boolean }>) {
    return apiMethod<PlatformPlan>({
      method: 'PUT',
      url: `/plans/${id}`,
      data,
    });
  },

  async deletePlan(id: string) {
    return apiMethod<{ message: string }>({
      method: 'DELETE',
      url: `/plans/${id}`,
    });
  },

  async createOrder(data: CreateOrderPayload) {
    return apiMethod<{
      orderId: string;
      amount: number;
      amountInPaise: number;
      currency: string;
      keyId: string;
      planName: string;
      billingCycle: string;
      basePrice: number;
      gst: number;
    }>({
      method: 'POST',
      url: '/plans/create-order',
      data,
    });
  },

  async checkout(data: CheckoutPayload) {
    return apiMethod<{
      invoice: any;
      plan: string;
      tenantId: string;
      billingCycle: string;
      amount: number;
    }>({
      method: 'POST',
      url: '/plans/checkout',
      data,
    });
  },
};

export default platformPlansService;
