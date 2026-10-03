import React from 'react';
import {
  TrendingUp,
  Receipt,
  Coins,
  ArrowDownLeft,
  FileText,
  BarChart3,
  CreditCard,
  Percent,
  Users,
  Building,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';
import { FinanceKpiCard } from '../../components/finance/FinanceKpiCard';
import { FinanceRevenueChart } from '../../components/finance/FinanceRevenueChart';
import { FinanceProfitWidget } from '../../components/finance/FinanceProfitWidget';
import { FinanceRecentTransactions } from '../../components/finance/FinanceRecentTransactions';
import { FinanceInvoiceTable } from '../../components/finance/FinanceInvoiceTable';
import { FinanceTopRevenueWidget } from '../../components/finance/FinanceTopRevenueWidget';
import { FinanceExpenseChart } from '../../components/finance/FinanceExpenseChart';
import { FinanceCashFlowWidget } from '../../components/finance/FinanceCashFlowWidget';
import { mockDashboardMetrics } from '../../mock/FinanceMockData';

export const FinanceDashboard: React.FC = () => {
  const {
    transactions,
    invoices,
    setActiveNav,
    dateRange,
    selectedBranch,
  } = useFinanceStore();

  const topTabs = [
    { label: 'Overview', icon: BarChart3, target: 'Dashboard' },
    { label: 'Revenue', icon: TrendingUp, target: 'Revenue' },
    { label: 'Expenses', icon: Receipt, target: 'Expenses' },
    { label: 'Invoices', icon: FileText, target: 'Invoices' },
    { label: 'Payments', icon: CreditCard, target: 'Payments' },
    { label: 'Accounts Receivable', icon: ArrowDownLeft, target: 'Accounts Receivable' },
    { label: 'Accounts Payable', icon: ArrowUpRight, target: 'Accounts Payable' },
    { label: 'Payroll', icon: Users, target: 'Payroll' },
    { label: 'GST & Tax', icon: Percent, target: 'GST & Tax' },
    { label: 'Reports', icon: FileText, target: 'Reports & Analytics' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner & Subtitle matching Reference Image */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Finance Module
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Complete financial management for your club – From revenue to reports at{' '}
          <strong className="text-slate-800">{selectedBranch.name}</strong>
        </p>
      </div>

      {/* Top Tab Pills matching Reference Image */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {topTabs.map(({ label, icon: Icon, target }) => {
          const isActive = target === 'Dashboard';
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveNav(target)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* 5 Top KPI Cards matching Reference Image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Revenue */}
        <FinanceKpiCard
          title="Total Revenue"
          value="₹ 28,45,000"
          growthPercent={12}
          growthLabel="vs last month"
          icon={TrendingUp}
          variant="green"
        />

        {/* 2. Total Expenses */}
        <FinanceKpiCard
          title="Total Expenses"
          value="₹ 18,32,000"
          growthPercent={8}
          growthLabel="vs last month"
          icon={Wallet}
          variant="red"
        />

        {/* 3. Net Profit */}
        <FinanceKpiCard
          title="Net Profit"
          value="₹ 10,13,000"
          growthPercent={18}
          growthLabel="vs last month"
          icon={Coins}
          variant="blue"
        />

        {/* 4. Outstanding Receivables */}
        <FinanceKpiCard
          title="Outstanding Receivables"
          value="₹ 4,25,000"
          growthPercent={-10}
          growthLabel="vs last month"
          icon={ArrowDownLeft}
          variant="amber"
        />

        {/* 5. GST Liability */}
        <FinanceKpiCard
          title="GST Liability (Oct 2025)"
          value="₹ 1,22,300"
          icon={FileText}
          variant="purple"
          subtitle="Due on 20 Nov 2025"
        />
      </div>

      {/* Middle Row (3 widgets): Revenue by Department | Revenue Distribution | Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <FinanceRevenueChart title="Revenue by Department" />
        <FinanceProfitWidget />
        <FinanceRecentTransactions
          transactions={transactions}
          onViewAll={() => setActiveNav('Payments')}
        />
      </div>

      {/* Third Row (4 widgets): Upcoming Invoices | Top Selling Items | Expense Breakdown | Cash Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <FinanceInvoiceTable
          invoices={invoices}
          title="Upcoming Invoices"
          onViewAll={() => setActiveNav('Invoices')}
        />
        <FinanceTopRevenueWidget />
        <FinanceExpenseChart />
        <FinanceCashFlowWidget />
      </div>

      {/* Bottom Section: Finance Module Highlights & End-to-End Workflow matching Reference Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Finance Module Features Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black">
              <Building className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Finance Module Features
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 flex items-start gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Revenue Management:</strong>
                <p className="text-slate-500 text-[11px]">Track real-time income from all 12 club facilities.</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 flex items-start gap-2">
              <Receipt className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Expense Management:</strong>
                <p className="text-slate-500 text-[11px]">Manage and categorize operational expenditures.</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 flex items-start gap-2">
              <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Tax Invoicing:</strong>
                <p className="text-slate-500 text-[11px]">GST compliant bills for corporate & individual members.</p>
              </div>
            </div>
          </div>
        </div>

        {/* GST & Tax Management Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-black">
              <Percent className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              GST & Tax Management
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-purple-50/50 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-900">Automatic GST Calculation:</strong>
                <p className="text-slate-500 text-[11px]">Multi-slab tax engine (5%, 12%, 18%) applied automatically.</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-purple-50/50 flex items-start gap-2">
              <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-900">Tax Returns (GSTR-1 & 3B):</strong>
                <p className="text-slate-500 text-[11px]">Pre-computed JSON for seamless portal upload.</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-purple-50/50 flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-900">Input Tax Credit (ITC):</strong>
                <p className="text-slate-500 text-[11px]">Vendor GSTR-2B auto-reconciliation enabled.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll Management Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Payroll Management
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-xl bg-emerald-50/50 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900">Attendance-Based Salary:</strong>
                <p className="text-slate-500 text-[11px]">Integrated biometric shift attendance calculations.</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50/50 flex items-start gap-2">
              <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900">Overtime & Tournaments:</strong>
                <p className="text-slate-500 text-[11px]">Automated coach & referee bonus compensations.</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50/50 flex items-start gap-2">
              <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900">Statutory Deductions (PF / ESI):</strong>
                <p className="text-slate-500 text-[11px]">Electronic challan cum return (ECR) generation ready.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End-to-End Finance Workflow matching reference image */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">
          End-to-End Enterprise Finance Workflow
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-xs">
          {[
            { step: '1', title: 'Transaction Occurs', desc: 'Booking / Shop / Bar', icon: '👤' },
            { step: '2', title: 'Invoice Generated', desc: 'GST Compliant Bill', icon: '📄' },
            { step: '3', title: 'Payment Received', desc: 'Cash / UPI / Card', icon: '💳' },
            { step: '4', title: 'GST Calculated', desc: 'ITC Reconciled', icon: '🏷️' },
            { step: '5', title: 'Revenue Recorded', desc: 'Ledger Posting', icon: '📈' },
            { step: '6', title: 'Dashboard Updated', desc: 'Executive Analytics', icon: '📊' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 relative">
              <span className="text-2xl select-none block mb-1">{item.icon}</span>
              <strong className="text-slate-900 block text-xs">{item.title}</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
