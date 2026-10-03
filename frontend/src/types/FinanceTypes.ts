export type FinanceDepartment =
  | 'Membership'
  | 'Court Booking'
  | 'Coaching'
  | 'Events'
  | 'Tournament'
  | 'Bar'
  | 'Restaurant'
  | 'Shop'
  | 'Banquet'
  | 'Sponsorship'
  | 'Guest Pass'
  | 'Advertising';

export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Wallet' | 'Net Banking';

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export type ExpenseStatus = 'Pending Approval' | 'Approved' | 'Paid' | 'Rejected';

export type RefundStatus = 'Requested' | 'Approved' | 'Processed' | 'Completed';

export type AgingBucket = '0-30 days' | '31-60 days' | '61-90 days' | '90+ days';

export interface FinanceBranch {
  id: string;
  name: string;
  code: string;
  city: string;
  isMain: boolean;
}

export interface FinanceTransaction {
  id: string;
  transactionNumber: string;
  date: string;
  type: 'Received' | 'Expense';
  category: string;
  department: FinanceDepartment;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed' | 'Reconciled';
  referenceNo: string;
  paymentMode: PaymentMethod;
  branchId: string;
  branchName: string;
  gstAmount?: number;
  customerOrVendor?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 5, 12, 18
  amount: number;
}

export interface FinanceInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  memberId?: string;
  department: FinanceDepartment;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  branchId: string;
  items: InvoiceItem[];
}

export interface FinanceExpense {
  id: string;
  expenseNumber: string;
  category:
    | 'Salaries'
    | 'Utilities'
    | 'Food Purchase'
    | 'Beverage Purchase'
    | 'Inventory Purchase'
    | 'Marketing'
    | 'Maintenance'
    | 'Events'
    | 'Coaching'
    | 'Miscellaneous';
  department: FinanceDepartment;
  vendorName: string;
  vendorGstin?: string;
  amount: number;
  taxDeducted: number;
  date: string;
  status: ExpenseStatus;
  approvedBy?: string;
  notes?: string;
  attachmentName?: string;
  branchId: string;
}

export interface FinanceRefund {
  id: string;
  refundNumber: string;
  type: 'Membership Refund' | 'Booking Refund' | 'Event Refund' | 'Shop Refund';
  customerName: string;
  memberId?: string;
  department: FinanceDepartment;
  amount: number;
  reason: string;
  status: RefundStatus;
  requestDate: string;
  processedDate?: string;
  processedBy?: string;
}

export interface FinanceReceivable {
  id: string;
  customerName: string;
  memberId?: string;
  invoiceNumber: string;
  department: FinanceDepartment;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  outstandingBalance: number;
  agingBucket: AgingBucket;
  lastFollowupDate?: string;
  contactNumber: string;
}

export interface FinancePayable {
  id: string;
  vendorName: string;
  vendorCode: string;
  billNumber: string;
  category: string;
  billDate: string;
  dueDate: string;
  totalAmount: number;
  amountDue: number;
  agingBucket: AgingBucket;
  status: 'Pending' | 'Partially Paid' | 'Due Today' | 'Overdue';
}

export interface FinanceVendor {
  id: string;
  name: string;
  code: string;
  category: string;
  gstin: string;
  phone: string;
  email: string;
  totalBilled: number;
  outstandingDue: number;
  rating: number;
  paymentTerms: string; // e.g. "Net 30"
}

export interface FinancePurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  department: FinanceDepartment;
  itemsCount: number;
  totalAmount: number;
  status: 'Draft' | 'Pending Approval' | 'Ordered' | 'Received' | 'Billed';
  createdDate: string;
  expectedDelivery: string;
}

export interface FinancePayrollEntry {
  id: string;
  employeeName: string;
  employeeCode: string;
  department: FinanceDepartment;
  designation: string;
  basicSalary: number;
  allowances: number;
  overtimeBonus: number;
  leaveDeductions: number;
  pfDeduction: number;
  netSalary: number;
  month: string;
  status: 'Draft' | 'Calculated' | 'Approved' | 'Disbursed';
  paymentMode: 'Direct Bank Transfer' | 'Cheque';
}

export interface FinanceGSTSummary {
  period: string; // e.g. "Oct 2025"
  turnover5Percent: number;
  turnover12Percent: number;
  turnover18Percent: number;
  totalTurnover: number;
  outputCGST: number;
  outputSGST: number;
  totalOutputGST: number;
  inputCGST: number;
  inputSGST: number;
  totalInputGST: number;
  netPayableGST: number;
  gstr1Status: 'Filed' | 'Pending' | 'Ready to File';
  gstr3bStatus: 'Filed' | 'Pending' | 'Due Soon';
  dueDate: string;
}

export interface FinanceLedgerAccount {
  accountCode: string;
  accountName: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  debit: number;
  credit: number;
  balance: number;
}

export interface FinanceAsset {
  id: string;
  assetCode: string;
  name: string;
  category:
    | 'Buildings'
    | 'Tennis Courts'
    | 'Gym Equipment'
    | 'Swimming Pool Equipment'
    | 'Kitchen Equipment'
    | 'Furniture';
  purchaseDate: string;
  purchaseCost: number;
  depreciationRate: number; // e.g. 10%
  accumulatedDepreciation: number;
  currentBookValue: number;
  location: string;
  condition: 'Excellent' | 'Good' | 'Needs Maintenance' | 'Critical';
}

export interface FinanceBudgetDepartment {
  id: string;
  department: FinanceDepartment;
  allocatedBudget: number;
  actualSpent: number;
  varianceAmount: number;
  variancePercentage: number;
  status: 'Under Budget' | 'On Track' | 'Over Budget';
  allocatedAmount?: number;
  utilizedAmount?: number;
  variance?: number;
  name?: string;
  branchId?: string;
  fiscalYear?: string;
}

export interface FinanceBankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'Current Account' | 'Escrow Account' | 'Sweep FD Account';
  type?: string;
  currentBalance: number;
  unreconciledItemsCount: number;
  lastReconciledDate: string;
  ifscCode: string;
  branch: string;
}

export interface FinanceApprovalRequest {
  id: string;
  type: 'Expense' | 'Refund' | 'Vendor Payment' | 'Payroll';
  title: string;
  amount: number;
  requestedBy: string;
  department: FinanceDepartment;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  priority: 'High' | 'Normal' | 'Urgent';
  justification: string;
  description?: string;
  rejectionReason?: string;
  approvedBy?: string;
}

export interface FinanceAIInsight {
  id: string;
  title: string;
  category: 'Revenue Forecast' | 'Expense Optimization' | 'Cash Flow Alert' | 'Anomaly Detection';
  description: string;
  metric: string;
  impact: 'Positive' | 'Warning' | 'Action Required' | 'high' | 'medium' | 'low';
  confidenceScore: number; // e.g. 94%
  type?: 'forecast' | 'anomaly' | 'opportunity' | 'warning';
  recommendation?: string;
  confidence?: number;
}

export interface FinanceAuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
}

