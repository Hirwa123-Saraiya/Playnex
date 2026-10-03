'use client';

import React from 'react';
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1720px] mx-auto p-4 sm:p-6 lg:p-7 space-y-6">
        {/* Module Header */}
        <ProShopHeader />

        {/* Dynamic View Content */}
        <main className="min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
