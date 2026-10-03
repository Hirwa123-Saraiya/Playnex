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
} from '../types/FinanceTypes';

export const mockFinanceBranches: FinanceBranch[] = [
  { id: 'BR-01', name: 'Royal Grand Pavilions (Main)', code: 'RGP-MAIN', city: 'Mumbai', isMain: true },
  { id: 'BR-02', name: 'Downtown Sports Gymkhana', code: 'DSG-DWNT', city: 'Mumbai', isMain: false },
  { id: 'BR-03', name: 'Waterfront Tennis & Golf Resort', code: 'WTG-WTRF', city: 'Goa', isMain: false },
  { id: 'BR-04', name: 'Olympic Championship Arena', code: 'OCA-OLYM', city: 'Pune', isMain: false },
];

export const mockDashboardMetrics = {
  totalRevenue: 2845000,
  revenueGrowthPercent: 12,
  totalExpenses: 1832000,
  expenseGrowthPercent: 8,
  netProfit: 1013000,
  profitGrowthPercent: 18,
  outstandingReceivables: 425000,
  receivablesTrendPercent: -10,
  gstLiability: 122300,
  gstDueDate: '20 Nov 2025',
  cashBalance: 1040000,
  pendingApprovalsCount: 5,
};

// Department Revenue Chart Data matching reference image exactly
export const mockRevenueByDepartment = [
  { department: 'Memberships', revenue: 820000, label: '8.2L', fill: '#3B82F6' },
  { department: 'Court Bookings', revenue: 650000, label: '6.5L', fill: '#10B981' },
  { department: 'Shop Sales', revenue: 480000, label: '4.8L', fill: '#F59E0B' },
  { department: 'Bar & Kitchen', revenue: 510000, label: '5.1L', fill: '#8B5CF6' },
  { department: 'Events', revenue: 230000, label: '2.3L', fill: '#EC4899' },
  { department: 'Coaching', revenue: 150000, label: '1.5L', fill: '#06B6D4' },
];

// Revenue Distribution Donut matching reference image (28.45L total)
export const mockRevenueDistribution = [
  { name: 'Memberships', percentage: 29, amount: 820000, color: '#3B82F6' },
  { name: 'Court Bookings', percentage: 23, amount: 650000, color: '#10B981' },
  { name: 'Shop Sales', percentage: 17, amount: 480000, color: '#F59E0B' },
  { name: 'Bar & Kitchen', percentage: 18, amount: 510000, color: '#8B5CF6' },
  { name: 'Events', percentage: 8, amount: 230000, color: '#EC4899' },
  { name: 'Coaching', percentage: 5, amount: 150000, color: '#06B6D4' },
];

// Expense Breakdown Donut matching reference image (18.32L total)
export const mockExpenseBreakdown = [
  { name: 'Salaries', percentage: 45, amount: 824400, color: '#3B82F6' },
  { name: 'Food & Beverages', percentage: 20, amount: 366400, color: '#10B981' },
  { name: 'Inventory Purchase', percentage: 15, amount: 274800, color: '#8B5CF6' },
  { name: 'Utilities', percentage: 8, amount: 146560, color: '#06B6D4' },
  { name: 'Maintenance', percentage: 7, amount: 128240, color: '#EC4899' },
  { name: 'Others', percentage: 5, amount: 91600, color: '#64748B' },
];

// Cash Flow Analysis matching reference image
export const mockCashFlowData = {
  openingBalance: 520000,
  totalInflow: 3210000,
  totalOutflow: 2690000,
  closingBalance: 1040000,
  weeklyTrend: [
    { week: 'Week 1', inflow: 780000, outflow: 620000 },
    { week: 'Week 2', inflow: 890000, outflow: 690000 },
    { week: 'Week 3', inflow: 710000, outflow: 640000 },
    { week: 'Week 4', inflow: 830000, outflow: 740000 },
  ],
};

// Recent Transactions matching reference image
export const mockRecentTransactions: FinanceTransaction[] = [
  {
    id: 'TXN-101',
    transactionNumber: 'TXN-2025-101',
    date: '03 Oct 2025',
    type: 'Received',
    category: 'Membership',
    department: 'Membership',
    description: 'Membership Fee - Rahul Sharma',
    amount: 15000,
    status: 'Paid',
    referenceNo: 'UPI-982104921',
    paymentMode: 'UPI',
    branchId: 'BR-01',
    branchName: 'Main Pavilion',
    customerOrVendor: 'Rahul Sharma',
    gstAmount: 2288,
  },
  {
    id: 'TXN-102',
    transactionNumber: 'TXN-2025-102',
    date: '03 Oct 2025',
    type: 'Received',
    category: 'Court Booking',
    department: 'Court Booking',
    description: 'Court Booking - Tennis Court 1',
    amount: 2500,
    status: 'Paid',
    referenceNo: 'CRD-882190',
    paymentMode: 'Card',
    branchId: 'BR-01',
    branchName: 'Main Pavilion',
    customerOrVendor: 'Aditya Birla Group',
    gstAmount: 381,
  },
  {
    id: 'TXN-103',
    transactionNumber: 'TXN-2025-103',
    date: '02 Oct 2025',
    type: 'Received',
    category: 'Pro Shop',
    department: 'Shop',
    description: 'Shop Sale - Tennis Racket',
    amount: 8500,
    status: 'Paid',
    referenceNo: 'CSH-1049',
    paymentMode: 'Cash',
    branchId: 'BR-01',
    branchName: 'Main Pavilion',
    customerOrVendor: 'Kavita Singhania',
    gstAmount: 1296,
  },
  {
    id: 'TXN-104',
    transactionNumber: 'TXN-2025-104',
    date: '02 Oct 2025',
    type: 'Received',
    category: 'Restaurant & Bar',
    department: 'Restaurant',
    description: 'Cafeteria - Food & Beverages',
    amount: 3200,
    status: 'Paid',
    referenceNo: 'WLT-5512',
    paymentMode: 'Wallet',
    branchId: 'BR-01',
    branchName: 'Main Pavilion',
    customerOrVendor: 'Table T-04',
    gstAmount: 152,
  },
  {
    id: 'TXN-105',
    transactionNumber: 'TXN-2025-105',
    date: '02 Oct 2025',
    type: 'Expense',
    category: 'Inventory',
    department: 'Restaurant',
    description: 'Food Ingredients Purchase',
    amount: 6800,
    status: 'Paid',
    referenceNo: 'NET-99120',
    paymentMode: 'Net Banking',
    branchId: 'BR-01',
    branchName: 'Main Pavilion',
    customerOrVendor: 'Metro Cash & Carry',
    gstAmount: 324,
  },
  {
    id: 'TXN-106',
    transactionNumber: 'TXN-2025-106',
    date: '01 Oct 2025',
    type: 'Expense',
    category: 'Payroll',
    department: 'Membership',
    description: 'Staff Salary - September 2025',
    amount: 450000,
    status: 'Paid',
    referenceNo: 'NEFT-88391002',
    paymentMode: 'Net Banking',
    branchId: 'BR-01',
    branchName: 'Main Pavilion',
    customerOrVendor: 'Club Employees Payroll Pool',
  },
];

// Upcoming Invoices matching reference image
export const mockUpcomingInvoices: FinanceInvoice[] = [
  {
    id: 'INV-101',
    invoiceNumber: 'INV-2025-101',
    customerName: 'ABC Corp',
    department: 'Sponsorship',
    issueDate: '25 Sep 2025',
    dueDate: '10 Oct 2025',
    status: 'Draft',
    subtotal: 42372,
    taxAmount: 7628,
    totalAmount: 50000,
    paidAmount: 0,
    branchId: 'BR-01',
    items: [{ id: '1', description: 'Corporate Squash League Title Sponsorship', quantity: 1, unitPrice: 42372, taxRate: 18, amount: 50000 }],
  },
  {
    id: 'INV-102',
    invoiceNumber: 'INV-2025-102',
    customerName: 'XYZ Ltd',
    department: 'Banquet',
    issueDate: '28 Sep 2025',
    dueDate: '15 Oct 2025',
    status: 'Sent',
    subtotal: 63559,
    taxAmount: 11441,
    totalAmount: 75000,
    paidAmount: 0,
    branchId: 'BR-01',
    items: [{ id: '2', description: 'Annual Corporate Banquet Dinner & Lawn Booking', quantity: 1, unitPrice: 63559, taxRate: 18, amount: 75000 }],
  },
  {
    id: 'INV-103',
    invoiceNumber: 'INV-2025-103',
    customerName: 'Rahul Sharma',
    memberId: 'MEM-9402',
    department: 'Membership',
    issueDate: '01 Sep 2025',
    dueDate: '05 Oct 2025',
    status: 'Overdue',
    subtotal: 8474,
    taxAmount: 1526,
    totalAmount: 10000,
    paidAmount: 0,
    branchId: 'BR-01',
    items: [{ id: '3', description: 'Annual Membership Renewal Charge (Tier: Gold)', quantity: 1, unitPrice: 8474, taxRate: 18, amount: 10000 }],
  },
  {
    id: 'INV-104',
    invoiceNumber: 'INV-2025-104',
    customerName: 'Event Booking',
    department: 'Events',
    issueDate: '01 Oct 2025',
    dueDate: '20 Oct 2025',
    status: 'Sent',
    subtotal: 101694,
    taxAmount: 18306,
    totalAmount: 120000,
    paidAmount: 0,
    branchId: 'BR-01',
    items: [{ id: '4', description: 'Inter-Club Badminton Open Championship Facility Fees', quantity: 1, unitPrice: 101694, taxRate: 18, amount: 120000 }],
  },
];

// Top Selling Items matching reference image
export const mockTopSellingItems = [
  { rank: 1, name: 'Coffee', icon: '☕', quantity: 320, revenue: 25600, category: 'Beverage' },
  { rank: 2, name: 'Burger', icon: '🍔', quantity: 280, revenue: 42000, category: 'Food' },
  { rank: 3, name: 'Sandwich', icon: '🥪', quantity: 210, revenue: 25200, category: 'Snacks' },
  { rank: 4, name: 'French Fries', icon: '🍟', quantity: 180, revenue: 18000, category: 'Snacks' },
  { rank: 5, name: 'Pizza', icon: '🍕', quantity: 150, revenue: 45000, category: 'Food' },
];

export const mockVendors: FinanceVendor[] = [
  { id: 'VND-01', name: 'Metro Cash & Carry India', code: 'VND-MTR', category: 'Food & Beverage', gstin: '27AABCM8821B1Z4', phone: '+91 98200 11928', email: 'orders@metro.in', totalBilled: 485000, outstandingDue: 68000, rating: 4.8, paymentTerms: 'Net 30' },
  { id: 'VND-02', name: 'Wilson Sporting Goods Ltd', code: 'VND-WLS', category: 'Pro Shop Inventory', gstin: '27AABCW4920K1Z9', phone: '+91 98450 77120', email: 'b2b@wilson.com', totalBilled: 320000, outstandingDue: 45000, rating: 4.9, paymentTerms: 'Net 45' },
  { id: 'VND-03', name: 'Tata Power DDL Utilities', code: 'VND-TPW', category: 'Utilities', gstin: '27AABCT9901M1Z1', phone: '+91 22 6611 9900', email: 'accounts@tatapower.com', totalBilled: 590000, outstandingDue: 54000, rating: 4.7, paymentTerms: 'Due on Receipt' },
  { id: 'VND-04', name: 'Apex Brewery Works & Spirits', code: 'VND-APX', category: 'Bar Inventory', gstin: '27AABCA3319L1Z5', phone: '+91 98990 44210', email: 'sales@apexbrew.in', totalBilled: 280000, outstandingDue: 38000, rating: 4.6, paymentTerms: 'Net 15' },
  { id: 'VND-05', name: 'FacilityCare Facility & HVAC', code: 'VND-FCF', category: 'Maintenance', gstin: '27AABCF1120N1Z2', phone: '+91 97110 55432', email: 'service@facilitycare.com', totalBilled: 195000, outstandingDue: 22000, rating: 4.5, paymentTerms: 'Net 30' },
];

export const mockReceivables: FinanceReceivable[] = [
  { id: 'REC-01', customerName: 'ABC Corp Sponsorship', invoiceNumber: 'INV-2025-101', department: 'Sponsorship', invoiceDate: '25 Sep 2025', dueDate: '10 Oct 2025', totalAmount: 50000, outstandingBalance: 50000, agingBucket: '0-30 days', contactNumber: '+91 98200 44102' },
  { id: 'REC-02', customerName: 'XYZ Ltd Banquet Booking', invoiceNumber: 'INV-2025-102', department: 'Banquet', invoiceDate: '28 Sep 2025', dueDate: '15 Oct 2025', totalAmount: 75000, outstandingBalance: 75000, agingBucket: '0-30 days', contactNumber: '+91 98111 88234' },
  { id: 'REC-03', customerName: 'Dr. Sameer Desai (Gold)', memberId: 'MEM-9402', invoiceNumber: 'INV-2025-088', department: 'Membership', invoiceDate: '15 Aug 2025', dueDate: '15 Sep 2025', totalAmount: 25000, outstandingBalance: 25000, agingBucket: '31-60 days', lastFollowupDate: '28 Sep 2025', contactNumber: '+91 98201 44321' },
  { id: 'REC-04', customerName: 'Apex Tennis Academy Coaching', invoiceNumber: 'INV-2025-062', department: 'Coaching', invoiceDate: '01 Jul 2025', dueDate: '31 Jul 2025', totalAmount: 65000, outstandingBalance: 65000, agingBucket: '61-90 days', lastFollowupDate: '20 Sep 2025', contactNumber: '+91 99001 77341' },
  { id: 'REC-05', customerName: 'Vintage Car Club Rally', invoiceNumber: 'INV-2025-021', department: 'Events', invoiceDate: '10 May 2025', dueDate: '10 Jun 2025', totalAmount: 110000, outstandingBalance: 110000, agingBucket: '90+ days', lastFollowupDate: '15 Sep 2025', contactNumber: '+91 98100 22390' },
];

export const mockPayables: FinancePayable[] = [
  { id: 'PAY-01', vendorName: 'Metro Cash & Carry India', vendorCode: 'VND-MTR', billNumber: 'BILL-8821', category: 'Food & Beverage', billDate: '20 Sep 2025', dueDate: '10 Oct 2025', totalAmount: 68000, amountDue: 68000, agingBucket: '0-30 days', status: 'Pending' },
  { id: 'PAY-02', vendorName: 'Tata Power DDL Utilities', vendorCode: 'VND-TPW', billNumber: 'ELEC-SEP25', category: 'Utilities', billDate: '28 Sep 2025', dueDate: '08 Oct 2025', totalAmount: 54000, amountDue: 54000, agingBucket: '0-30 days', status: 'Due Today' },
  { id: 'PAY-03', vendorName: 'Wilson Sporting Goods Ltd', vendorCode: 'VND-WLS', billNumber: 'INV-WL-409', category: 'Pro Shop', billDate: '10 Aug 2025', dueDate: '25 Sep 2025', totalAmount: 45000, amountDue: 45000, agingBucket: '31-60 days', status: 'Overdue' },
];

export const mockGSTSummary: FinanceGSTSummary = {
  period: 'October 2025',
  turnover5Percent: 510000,
  turnover12Percent: 480000,
  turnover18Percent: 1855000,
  totalTurnover: 2845000,
  outputCGST: 112450,
  outputSGST: 112450,
  totalOutputGST: 224900,
  inputCGST: 51300,
  inputSGST: 51300,
  totalInputGST: 102600,
  netPayableGST: 122300,
  gstr1Status: 'Ready to File',
  gstr3bStatus: 'Due Soon',
  dueDate: '20 Nov 2025',
};

export const mockBankAccounts: FinanceBankAccount[] = [
  { id: 'BNK-01', bankName: 'HDFC Bank - Club Operations Current A/c', accountNumber: '50200049210984', accountType: 'Current Account', currentBalance: 685000, unreconciledItemsCount: 2, lastReconciledDate: '02 Oct 2025', ifscCode: 'HDFC0000128', branch: 'Fort, Mumbai' },
  { id: 'BNK-02', bankName: 'ICICI Bank - Member Deposit Escrow', accountNumber: '001105029381', accountType: 'Escrow Account', currentBalance: 2450000, unreconciledItemsCount: 0, lastReconciledDate: '01 Oct 2025', ifscCode: 'ICIC0000011', branch: 'Nariman Point, Mumbai' },
  { id: 'BNK-03', bankName: 'State Bank of India - Treasury Sweep FD', accountNumber: '30492019482', accountType: 'Sweep FD Account', currentBalance: 4500000, unreconciledItemsCount: 0, lastReconciledDate: '30 Sep 2025', ifscCode: 'SBIN0000300', branch: 'Main Branch' },
];

export const mockApprovalRequests: FinanceApprovalRequest[] = [
  { id: 'APP-01', type: 'Expense', title: 'Commercial Kitchen Deep Fryer Replacement', amount: 48500, requestedBy: 'Chef Sanjeev (Head Chef)', department: 'Restaurant', requestDate: '03 Oct 2025', status: 'Pending', priority: 'High', justification: 'Burner coil failed during Friday service rush, urgent replacement required.' },
  { id: 'APP-02', type: 'Refund', title: 'Tennis Court Floodlight Failure Rainout Refund', amount: 3500, requestedBy: 'Rohan Patil (Front Desk)', department: 'Court Booking', requestDate: '02 Oct 2025', status: 'Pending', priority: 'Normal', justification: 'Sudden squall halted play on Court 2, member booked 2 hours slot.' },
  { id: 'APP-03', type: 'Vendor Payment', title: 'Monthly Chemical Pool Chlorination Supply', amount: 28000, requestedBy: 'Sunil Nair (Facilities Mgr)', department: 'Court Booking', requestDate: '01 Oct 2025', status: 'Pending', priority: 'Normal', justification: 'Routine monthly certified sanitization chemicals delivery for Olympic pool.' },
  { id: 'APP-04', type: 'Payroll', title: 'Squash Coaches Tournament Overtime Allowance', amount: 14500, requestedBy: 'HR & Operations', department: 'Coaching', requestDate: '01 Oct 2025', status: 'Pending', priority: 'Normal', justification: 'Officiating and extended evening clinic during National Junior Trials.' },
];

export const mockAIInsights: FinanceAIInsight[] = [
  { id: 'AI-01', title: 'Q4 Membership Revenue Surge Forecast', category: 'Revenue Forecast', description: 'Predictive model forecasts a 16.4% jump in renewal collections during November due to festive early-bird privileges.', metric: '+₹4,20,000 Expected', impact: 'Positive', confidenceScore: 94 },
  { id: 'AI-02', title: 'Unusual Utility Spike in Court 3 & 4 Lighting', category: 'Anomaly Detection', description: 'Energy consumption on floodlight circuit #4 exceeded historical norms by 38% between 11 PM - 3 AM.', metric: '₹14,200 Cost Anomaly', impact: 'Warning', confidenceScore: 91 },
  { id: 'AI-03', title: 'Liquor Purchasing Bulk Discount Opportunity', category: 'Expense Optimization', description: 'Consolidating single malt scotch reorders across Main Branch and Waterfront Resort unlocks 12% distributor volume rebate.', metric: '₹34,500 Annual Savings', impact: 'Positive', confidenceScore: 88 },
  { id: 'AI-04', title: 'Overdue Receivables Concentration Risk', category: 'Cash Flow Alert', description: 'Three event booking invoices older than 60 days represent 42% of total overdue collections.', metric: '₹1,75,000 at Risk', impact: 'Action Required', confidenceScore: 96 },
];

export const mockAuditLogs = [
  { id: 'LOG-01', timestamp: '03 Oct 2025, 05:42 PM', userName: 'Admin Owner', userId: 'USR-001', action: 'APPROVE', entity: 'Invoice', entityId: 'INV-2025-104', details: 'Authorized event advance discount voucher of ₹5,000', ipAddress: '192.168.1.102' },
  { id: 'LOG-02', timestamp: '03 Oct 2025, 04:15 PM', userName: 'Kavita Cashier', userId: 'USR-042', action: 'CREATE', entity: 'Payment', entityId: 'TXN-9982', details: 'Collected ₹15,000 for Rahul Sharma annual membership renewal via UPI', ipAddress: '192.168.1.118' },
  { id: 'LOG-03', timestamp: '02 Oct 2025, 02:30 PM', userName: 'Admin Owner', userId: 'USR-001', action: 'UPDATE', entity: 'Expense', entityId: 'EXP-2025-08', details: 'Approved commercial kitchen fryer voucher under Restaurant cap', ipAddress: '192.168.1.102' },
  { id: 'LOG-04', timestamp: '01 Oct 2025, 11:10 AM', userName: 'HR Lead', userId: 'USR-019', action: 'CREATE', entity: 'Payroll', entityId: 'PAY-OCT-01', details: 'Generated September 2025 net staff salary schedule of ₹4,50,000', ipAddress: '192.168.1.144' },
];

export const mockGeneralLedger: FinanceLedgerAccount[] = [
  { accountCode: '1010', accountName: 'Cash on Hand & Petty Cash', category: 'Asset', debit: 45000, credit: 0, balance: 45000 },
  { accountCode: '1020', accountName: 'HDFC Bank Operations Operating A/c', category: 'Asset', debit: 685000, credit: 0, balance: 685000 },
  { accountCode: '1050', accountName: 'Accounts Receivable (Member Ledger)', category: 'Asset', debit: 425000, credit: 0, balance: 425000 },
  { accountCode: '1200', accountName: 'Club Property, Plant & Equipment', category: 'Asset', debit: 28500000, credit: 0, balance: 28500000 },
  { accountCode: '2010', accountName: 'Accounts Payable (Trade Vendors)', category: 'Liability', debit: 0, credit: 382000, balance: -382000 },
  { accountCode: '2050', accountName: 'GST Output Tax Payable', category: 'Liability', debit: 0, credit: 122300, balance: -122300 },
  { accountCode: '3010', accountName: 'Club General Retained Reserve Fund', category: 'Equity', debit: 0, credit: 26000000, balance: -26000000 },
  { accountCode: '4010', accountName: 'Membership Subscription Income', category: 'Revenue', debit: 0, credit: 820000, balance: -820000 },
  { accountCode: '4020', accountName: 'Court Booking & Facility Fees', category: 'Revenue', debit: 0, credit: 650000, balance: -650000 },
  { accountCode: '5010', accountName: 'Staff Salaries, Wages & PF', category: 'Expense', debit: 824400, credit: 0, balance: 824400 },
];

export const mockAssets: FinanceAsset[] = [
  { id: 'AST-01', assetCode: 'AST-BLD-01', name: 'Main Heritage Clubhouse & Pavilion', category: 'Buildings', purchaseDate: '2015-04-01', purchaseCost: 18000000, depreciationRate: 2.5, accumulatedDepreciation: 4500000, currentBookValue: 13500000, location: 'Central Grounds', condition: 'Excellent' },
  { id: 'AST-02', assetCode: 'AST-CRT-02', name: 'Synthentic Acrylic Hard Tennis Courts (4 Courts)', category: 'Tennis Courts', purchaseDate: '2021-11-15', purchaseCost: 3200000, depreciationRate: 10, accumulatedDepreciation: 1280000, currentBookValue: 1920000, location: 'North Sports Wing', condition: 'Good' },
  { id: 'AST-03', assetCode: 'AST-GYM-03', name: 'Matrix Fitness Commercial Cardio & Strength Rig', category: 'Gym Equipment', purchaseDate: '2023-01-10', purchaseCost: 1850000, depreciationRate: 15, accumulatedDepreciation: 555000, currentBookValue: 1295000, location: 'Fitness Hub Level 1', condition: 'Excellent' },
  { id: 'AST-04', assetCode: 'AST-KIT-04', name: 'Rational Combi Steamers & Walk-in Chiller', category: 'Kitchen Equipment', purchaseDate: '2022-06-20', purchaseCost: 1200000, depreciationRate: 12, accumulatedDepreciation: 432000, currentBookValue: 768000, location: 'Main Banquet Kitchen', condition: 'Good' },
];

export const mockBudgets: FinanceBudgetDepartment[] = [
  { id: 'BDG-01', department: 'Membership', allocatedBudget: 250000, actualSpent: 180000, varianceAmount: 70000, variancePercentage: 28, status: 'Under Budget' },
  { id: 'BDG-02', department: 'Court Booking', allocatedBudget: 150000, actualSpent: 142000, varianceAmount: 8000, variancePercentage: 5.3, status: 'On Track' },
  { id: 'BDG-03', department: 'Restaurant', allocatedBudget: 450000, actualSpent: 485000, varianceAmount: -35000, variancePercentage: -7.7, status: 'Over Budget' },
  { id: 'BDG-04', department: 'Bar', allocatedBudget: 220000, actualSpent: 195000, varianceAmount: 25000, variancePercentage: 11.3, status: 'Under Budget' },
  { id: 'BDG-05', department: 'Events', allocatedBudget: 300000, actualSpent: 290000, varianceAmount: 10000, variancePercentage: 3.3, status: 'On Track' },
  { id: 'BDG-06', department: 'Coaching', allocatedBudget: 180000, actualSpent: 175000, varianceAmount: 5000, variancePercentage: 2.7, status: 'On Track' },
];
