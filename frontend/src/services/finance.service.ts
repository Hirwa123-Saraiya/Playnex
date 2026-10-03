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
  totalMonthlyRevenue?: number;
  arpu?: number;
  activeMembers?: number;
}

export interface RevenueSourceItem {
  source: string;
  amount: number;
  growth: number;
  share: number;
  dept: string;
}

export interface MembershipTypeItem {
  type: string;
  count: number;
  revenue: number;
  color: string;
}

export interface MonthlyTrendItem {
  month: string;
  revenue: number;
  target: number;
}

export interface FinanceDataResponse {
  summary: FinanceSummary;
  revenueSources?: RevenueSourceItem[];
  membershipTypes?: MembershipTypeItem[];
  monthlyTrend?: MonthlyTrendItem[];
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
