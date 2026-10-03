'use client';

import React, { useState } from 'react';
import { ProShopSidebar } from '../components/pro-shop-inventory/ProShopSidebar';
import { ProShopHeader } from '../components/pro-shop-inventory/ProShopHeader';
import { ProShopDashboardOverview } from '../components/pro-shop-inventory/ProShopDashboardOverview';
import { ProShopProductCatalog } from '../components/pro-shop-inventory/ProShopProductCatalog';
import { ProShopCentralInventoryFlow } from '../components/pro-shop-inventory/ProShopCentralInventoryFlow';
import { ProShopStockTrackingTable } from '../components/pro-shop-inventory/ProShopStockTrackingTable';
import { ProShopLowStockAlerts } from '../components/pro-shop-inventory/ProShopLowStockAlerts';
import { ProShopOnlineStore } from '../components/pro-shop-inventory/ProShopOnlineStore';
import { ProShopDiscountManagement } from '../components/pro-shop-inventory/ProShopDiscountManagement';
import { ProShopPOSTerminal } from '../components/pro-shop-inventory/ProShopPOSTerminal';
import { ProShopPurchaseManagement } from '../components/pro-shop-inventory/ProShopPurchaseManagement';
import { ProShopReturnsManagement } from '../components/pro-shop-inventory/ProShopReturnsManagement';
import { ProShopReportsAnalytics } from '../components/pro-shop-inventory/ProShopReportsAnalytics';
import { ProShopUserRoles } from '../components/pro-shop-inventory/ProShopUserRoles';
import { ProShopInventoryTransactions } from '../components/pro-shop-inventory/ProShopInventoryTransactions';
import { useProShopStore } from '../store/ProShopInventoryStore';
import { CheckCircle2 } from 'lucide-react';

export const ProShopInventoryLayout: React.FC = () => {
  const { activeView, toastMessage } = useProShopStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <ProShopDashboardOverview />;
      case 'catalog':
        return <ProShopProductCatalog />;
      case 'central-inventory':
        return <ProShopCentralInventoryFlow />;
      case 'stock-tracking':
        return <ProShopStockTrackingTable />;
      case 'low-stock-alerts':
        return <ProShopLowStockAlerts />;
      case 'online-store':
        return <ProShopOnlineStore />;
      case 'member-discounts':
        return <ProShopDiscountManagement />;
      case 'pos-counter':
        return <ProShopPOSTerminal />;
      case 'purchases':
        return <ProShopPurchaseManagement />;
      case 'returns-refunds':
        return <ProShopReturnsManagement />;
      case 'reports-analytics':
        return <ProShopReportsAnalytics />;
      case 'user-roles':
        return <ProShopUserRoles />;
      case 'inventory-transactions':
        return <ProShopInventoryTransactions />;
      default:
        return <ProShopDashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex w-full min-w-0 overflow-x-hidden font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation Menu */}
      <ProShopSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-y-auto">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 lg:p-7 pb-0 max-w-[1720px] w-full mx-auto min-w-0">
          <ProShopHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1720px] w-full mx-auto min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
