'use client';

import React, { useState } from 'react';
import { FinanceHeader } from '../components/finance/FinanceHeader';
import { FinanceSidebar } from '../components/finance/FinanceSidebar';
import { useFinanceStore } from '../store/FinanceStore';

// All 22 Domain Views
import { FinanceDashboard } from '../views/finance/FinanceDashboard';
import { FinanceRevenue } from '../views/finance/FinanceRevenue';
import { FinanceExpenses } from '../views/finance/FinanceExpenses';
import { FinanceInvoices } from '../views/finance/FinanceInvoices';
import { FinancePayments } from '../views/finance/FinancePayments';
import { FinanceRefunds } from '../views/finance/FinanceRefunds';
import { FinanceReceivables } from '../views/finance/FinanceReceivables';
import { FinancePayables } from '../views/finance/FinancePayables';
import { FinanceVendors } from '../views/finance/FinanceVendors';
import { FinancePurchases } from '../views/finance/FinancePurchases';
import { FinancePayroll } from '../views/finance/FinancePayroll';
import { FinanceGST } from '../views/finance/FinanceGST';
import { FinanceGeneralLedger } from '../views/finance/FinanceGeneralLedger';
import { FinanceAssets } from '../views/finance/FinanceAssets';
import { FinanceBudget } from '../views/finance/FinanceBudget';
import { FinanceBankAccounts } from '../views/finance/FinanceBankAccounts';
import { FinanceApprovals } from '../views/finance/FinanceApprovals';
import { FinanceStatements } from '../views/finance/FinanceStatements';
import { FinanceAIInsights } from '../views/finance/FinanceAIInsights';
import { FinanceReports } from '../views/finance/FinanceReports';
import { FinanceAuditLogs } from '../views/finance/FinanceAuditLogs';
import { FinanceSettings } from '../views/finance/FinanceSettings';
import { CheckCircle2 } from 'lucide-react';

export const FinanceLayout: React.FC = () => {
  const { activeNav, toastMessage } = useFinanceStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveView = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <FinanceDashboard />;
      case 'Revenue':
        return <FinanceRevenue />;
      case 'Expenses':
        return <FinanceExpenses />;
      case 'Invoices':
        return <FinanceInvoices />;
      case 'Payments':
        return <FinancePayments />;
      case 'Refunds':
        return <FinanceRefunds />;
      case 'Accounts Receivable':
        return <FinanceReceivables />;
      case 'Accounts Payable':
        return <FinancePayables />;
      case 'Vendors':
        return <FinanceVendors />;
      case 'Purchases':
        return <FinancePurchases />;
      case 'Payroll':
        return <FinancePayroll />;
      case 'GST & Tax':
        return <FinanceGST />;
      case 'General Ledger':
        return <FinanceGeneralLedger />;
      case 'Assets':
        return <FinanceAssets />;
      case 'Budget':
        return <FinanceBudget />;
      case 'Bank Accounts':
        return <FinanceBankAccounts />;
      case 'Approvals':
        return <FinanceApprovals />;
      case 'Financial Statements':
        return <FinanceStatements />;
      case 'AI Insights':
        return <FinanceAIInsights />;
      case 'Reports & Analytics':
        return <FinanceReports />;
      case 'Audit Logs':
        return <FinanceAuditLogs />;
      case 'Settings':
        return <FinanceSettings />;
      default:
        return <FinanceDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex w-full min-w-0 overflow-x-hidden font-sans">
      {/* Toast Notification if active */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <FinanceSidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-y-auto">
        {/* Header */}
        <FinanceHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1720px] w-full mx-auto min-w-0">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
