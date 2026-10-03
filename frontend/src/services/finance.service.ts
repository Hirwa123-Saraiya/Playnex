import { apiMethod } from './api';

export interface FinanceTransaction {
  id: string;
  date?: string;
  member?: string;
  category?: string;
  mode?: string;
  amount: number | string;
  gst?: number | string;
  status?: string;
  description?: string;
  department?: string;
  subtotal?: number;
  total?: number;
  type?: string;
  created_at?: string;
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

export interface FinanceSummary {
  grossRevenue?: number;
  totalRevenue?: number;
  operatingExpenses?: number;
  netSurplus?: number;
  outstandingReceivables?: number;
  receivablesCount?: number;
  pendingSettlement?: number;
  gstLiability?: number;
  totalMonthlyRevenue?: number;
  arpu?: number;
  activeMembers?: number;
  gstReport?: {
    gstin: string;
    outputGst: number;
    inputCreditGst: number;
    netGstPayable: number;
    taxPeriod: string;
    cgstRate: string;
    sgstRate: string;
  };
  revenueByDepartment?: {
    memberships: number;
    proShop: number;
    courtBookings: number;
    restaurant: number;
  };
  recentTransactions?: any[];
}

export const financeService = {
  async getFinanceData(tenantId?: string) {
    return apiMethod<any>({
      method: 'GET',
      url: '/finance/overview',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async getInvoices(tenantId?: string) {
    return apiMethod<any[]>({
      method: 'GET',
      url: '/finance/invoices',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createInvoice(data: { description: string; amount: number; customerName?: string; paymentMethod?: string }) {
    return apiMethod<any>({
      method: 'POST',
      url: '/finance/invoices',
      data,
    });
  },

  async getGstReport(tenantId?: string) {
    return apiMethod<any>({
      method: 'GET',
      url: '/finance/gst-report',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async getExpenses(tenantId?: string) {
    return apiMethod<any[]>({
      method: 'GET',
      url: '/finance/expenses',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createExpense(data: { category: string; description: string; amount: number; vendorName?: string; paymentMethod?: string; receiptNumber?: string }) {
    return apiMethod<any>({
      method: 'POST',
      url: '/finance/expenses',
      data,
    });
  },
};

export default financeService;
