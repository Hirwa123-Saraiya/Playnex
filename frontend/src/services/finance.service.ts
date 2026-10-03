import { apiMethod } from './api';

export interface FinanceTransaction {
  id: string;
  date: string;
  member: string;
  category: string;
  mode: string;
  amount: number | string;
  gst: number | string;
  status: 'Settled' | 'Pending' | 'Refunded';
}

export interface FinanceSummary {
  grossRevenue: number;
  pendingSettlement: number;
  gstLiability: number;
}

export interface FinanceDataResponse {
  summary: FinanceSummary;
  transactions: FinanceTransaction[];
}

export const financeService = {
  async getFinanceData(tenantId?: string) {
    return apiMethod<FinanceDataResponse>({
      method: 'GET',
      url: '/club/finance',
      params: tenantId ? { tenantId } : undefined,
    });
  },
};

export default financeService;
