import { create } from 'zustand';
import {
  FinanceBranch,
  FinanceTransaction,
  FinanceInvoice,
  FinanceExpense,
  FinanceRefund,
  FinanceReceivable,
  FinancePayable,
  FinanceVendor,
  FinancePurchaseOrder,
  FinancePayrollEntry,
  FinanceGSTSummary,
  FinanceLedgerAccount,
  FinanceAsset,
  FinanceBudgetDepartment,
  FinanceBankAccount,
  FinanceApprovalRequest,
  FinanceAIInsight,
  FinanceDepartment,
  FinanceAuditLog,
} from '../types/FinanceTypes';
import {
  mockFinanceBranches,
  mockRecentTransactions,
  mockUpcomingInvoices,
  mockVendors,
  mockReceivables,
  mockPayables,
  mockGSTSummary,
  mockBankAccounts,
  mockApprovalRequests,
  mockAIInsights,
  mockGeneralLedger,
  mockAssets,
  mockBudgets,
  mockAuditLogs,
} from '../mock/FinanceMockData';

interface FinanceStoreState {
  // Navigation & Multi-Tenant
  activeNav: string;
  setActiveNav: (nav: string) => void;
  tenantId: string;
  clubId: string;
  branches: FinanceBranch[];
  selectedBranch: FinanceBranch;
  setSelectedBranch: (branch: FinanceBranch) => void;
  activeBranchId: string;
  setActiveBranchId: (branchId: string) => void;

  // Global Filters
  fiscalYear: string;
  setFiscalYear: (fy: string) => void;
  activeFiscalYear: string;
  setActiveFiscalYear: (fy: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Transactions & Invoices
  transactions: FinanceTransaction[];
  addTransaction: (tx: FinanceTransaction) => void;
  invoices: FinanceInvoice[];
  addInvoice: (inv: FinanceInvoice) => void;
  updateInvoiceStatus: (id: string, status: FinanceInvoice['status']) => void;

  // Expenses & Approvals
  expenses: FinanceExpense[];
  addExpense: (expense: FinanceExpense) => void;
  approvalRequests: FinanceApprovalRequest[];
  approveRequest: (id: string, approverName?: string) => void;
  rejectRequest: (id: string, rejectedBy?: string, reason?: string) => void;

  // Refunds
  refunds: FinanceRefund[];
  addRefund: (refund: FinanceRefund) => void;
  updateRefundStatus: (id: string, status: FinanceRefund['status']) => void;

  // Receivables & Payables
  receivables: FinanceReceivable[];
  payables: FinancePayable[];
  vendors: FinanceVendor[];

  // Banking & Reconciliation
  bankAccounts: FinanceBankAccount[];
  reconcileAccount: (id: string) => void;

  // General Ledger, Assets & Budget
  generalLedger: FinanceLedgerAccount[];
  assets: FinanceAsset[];
  budgets: FinanceBudgetDepartment[];
  aiInsights: FinanceAIInsight[];
  gstSummary: FinanceGSTSummary;
  auditLogs: FinanceAuditLog[];

  // UI Toast
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

export const useFinanceStore = create<FinanceStoreState>((set, get) => ({
  activeNav: 'Dashboard',
  setActiveNav: (nav) => set({ activeNav: nav }),

  tenantId: 'TENANT-PLAYNEX-GLOBAL',
  clubId: 'CLUB-ROYAL-SPORTS',
  branches: mockFinanceBranches,
  selectedBranch: mockFinanceBranches[0],
  setSelectedBranch: (branch) => {
    set({ selectedBranch: branch, activeBranchId: branch.id });
    get().setToastMessage(`Switched ledger context to ${branch.name}`);
  },
  activeBranchId: 'all',
  setActiveBranchId: (id) => {
    const found = get().branches.find(b => b.id === id);
    if (found) {
      set({ selectedBranch: found, activeBranchId: id });
    } else {
      set({ activeBranchId: id });
    }
  },

  fiscalYear: 'FY 2025-26',
  setFiscalYear: (fy) => set({ fiscalYear: fy, activeFiscalYear: fy }),
  activeFiscalYear: 'FY 2025-26',
  setActiveFiscalYear: (fy) => set({ activeFiscalYear: fy, fiscalYear: fy }),
  dateRange: 'Oct 2025',
  setDateRange: (range) => set({ dateRange: range }),
  selectedDepartment: 'All Departments',
  setSelectedDepartment: (dept) => set({ selectedDepartment: dept }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  transactions: mockRecentTransactions,
  addTransaction: (tx) =>
    set((state) => ({ transactions: [tx, ...state.transactions] })),

  invoices: mockUpcomingInvoices,
  addInvoice: (inv) => {
    set((state) => ({ invoices: [inv, ...state.invoices] }));
    get().setToastMessage(`Invoice ${inv.invoiceNumber} generated successfully!`);
  },
  updateInvoiceStatus: (id, status) => {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, status } : inv
      ),
    }));
    get().setToastMessage(`Invoice status updated to ${status}`);
  },

  expenses: [
    {
      id: 'EXP-01',
      expenseNumber: 'EXP-2025-01',
      category: 'Salaries',
      department: 'Membership',
      vendorName: 'Staff Payroll Master',
      amount: 450000,
      taxDeducted: 0,
      date: '01 Oct 2025',
      status: 'Approved',
      approvedBy: 'Club Treasurer',
      branchId: 'BR-01',
    },
    {
      id: 'EXP-02',
      expenseNumber: 'EXP-2025-02',
      category: 'Food Purchase',
      department: 'Restaurant',
      vendorName: 'Metro Cash & Carry',
      amount: 68000,
      taxDeducted: 3240,
      date: '02 Oct 2025',
      status: 'Pending Approval',
      branchId: 'BR-01',
    },
    {
      id: 'EXP-03',
      expenseNumber: 'EXP-2025-03',
      category: 'Utilities',
      department: 'Court Booking',
      vendorName: 'Tata Power DDL',
      amount: 54000,
      taxDeducted: 0,
      date: '28 Sep 2025',
      status: 'Approved',
      branchId: 'BR-01',
    },
  ],
  addExpense: (expense) => {
    set((state) => ({ expenses: [expense, ...state.expenses] }));
    get().setToastMessage(`Expense ${expense.expenseNumber} submitted for approval!`);
  },

  approvalRequests: mockApprovalRequests,
  approveRequest: (id, approverName = 'Admin Owner') => {
    set((state) => ({
      approvalRequests: state.approvalRequests.map((req) =>
        req.id === id ? { ...req, status: 'Approved', approvedBy: approverName } : req
      ),
    }));
    get().setToastMessage('Request approved successfully!');
  },
  rejectRequest: (id, rejectedBy = 'Admin Owner', reason = 'Budget Limit Exceeded') => {
    set((state) => ({
      approvalRequests: state.approvalRequests.map((req) =>
        req.id === id ? { ...req, status: 'Rejected', rejectionReason: reason } : req
      ),
    }));
    get().setToastMessage('Request rejected.');
  },

  refunds: [
    {
      id: 'REF-01',
      refundNumber: 'REF-2025-01',
      type: 'Booking Refund',
      customerName: 'Aditya Mehta',
      memberId: 'MEM-4091',
      department: 'Court Booking',
      amount: 2500,
      reason: 'Rain cancellation on synthetic outdoor courts',
      status: 'Requested',
      requestDate: '02 Oct 2025',
    },
    {
      id: 'REF-02',
      refundNumber: 'REF-2025-02',
      type: 'Membership Refund',
      customerName: 'Karan Singhal',
      memberId: 'MEM-8812',
      department: 'Membership',
      amount: 12000,
      reason: 'Relocated overseas within 30-day trial guarantee',
      status: 'Approved',
      requestDate: '29 Sep 2025',
    },
  ],
  addRefund: (refund) => {
    set((state) => ({ refunds: [refund, ...state.refunds] }));
    get().setToastMessage(`Refund request ${refund.refundNumber} registered!`);
  },
  updateRefundStatus: (id, status) => {
    set((state) => ({
      refunds: state.refunds.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  },

  receivables: mockReceivables,
  payables: mockPayables,
  vendors: mockVendors,

  bankAccounts: mockBankAccounts,
  reconcileAccount: (id) => {
    set((state) => ({
      bankAccounts: state.bankAccounts.map((b) =>
        b.id === id
          ? {
              ...b,
              unreconciledItemsCount: 0,
              lastReconciledDate: 'Today (Just now)',
            }
          : b
      ),
    }));
    get().setToastMessage('Bank account reconciled successfully with zero variances!');
  },

  generalLedger: mockGeneralLedger,
  assets: mockAssets,
  budgets: mockBudgets,
  aiInsights: mockAIInsights,
  gstSummary: mockGSTSummary,
  auditLogs: mockAuditLogs,

  toastMessage: null,
  setToastMessage: (msg) => {
    set({ toastMessage: msg });
    if (msg) {
      setTimeout(() => {
        if (get().toastMessage === msg) {
          set({ toastMessage: null });
        }
      }, 4000);
    }
  },
}));
