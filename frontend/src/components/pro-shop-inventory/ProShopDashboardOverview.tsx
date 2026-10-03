import React from 'react';
import { ProShopProductCatalog } from './ProShopProductCatalog';
import { ProShopCentralInventoryFlow } from './ProShopCentralInventoryFlow';
import { ProShopStockTrackingTable } from './ProShopStockTrackingTable';
import { ProShopLowStockAlerts } from './ProShopLowStockAlerts';
import { ProShopOnlineStore } from './ProShopOnlineStore';
import { ProShopDiscountManagement } from './ProShopDiscountManagement';
import { ProShopPOSTerminal } from './ProShopPOSTerminal';
import { ProShopPurchaseManagement } from './ProShopPurchaseManagement';
import { ProShopReturnsManagement } from './ProShopReturnsManagement';
import { ProShopReportsAnalytics } from './ProShopReportsAnalytics';
import { ProShopUserRoles } from './ProShopUserRoles';
import { ProShopInventoryTransactions } from './ProShopInventoryTransactions';

export const ProShopDashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* 
        ROW 1 & 2: Top Core Architecture matching Reference Image
        - 1. Product Catalog
        - 2. Same Inventory for Counter & Online
        - 3. Stock Tracking
        - 4. Low Stock Alerts
      */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProShopProductCatalog />
        <ProShopCentralInventoryFlow />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProShopStockTrackingTable />
        <ProShopLowStockAlerts />
      </div>

      {/* 
        ROW 3 & 4: Commercial Channels
        - 5. Online Store (Member View) + Checkout Experience
        - 6. Member Discounts (Junior 5%, Silver 10%, Gold 15%)
        - 7. POS (Counter Sales) Terminal
      */}
      <div className="space-y-6">
        <ProShopOnlineStore />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProShopDiscountManagement />
        <ProShopPOSTerminal />
      </div>

      {/* 
        ROW 5: Procurement & After-Sales Operations
        - 8. Purchase Management
        - 9. Returns & Refunds
      */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProShopPurchaseManagement />
        <ProShopReturnsManagement />
      </div>

      {/* 
        ROW 6: Executive Analytics, Governance & Audit
        - 10. Reports & Analytics
        - 11. User Roles & Permissions
        - 12. Inventory Transactions History
      */}
      <div className="space-y-6">
        <ProShopReportsAnalytics />
        <ProShopUserRoles />
        <ProShopInventoryTransactions />
      </div>
    </div>
  );
};
