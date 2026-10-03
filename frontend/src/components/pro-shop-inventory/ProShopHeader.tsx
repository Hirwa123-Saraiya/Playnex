import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Calculator, 
  Store, 
  User, 
  Building2,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';
import { useProShopStore, ProShopActiveView } from '../../store/ProShopInventoryStore';

interface ProShopHeaderProps {
  onOpenMobileMenu?: () => void;
}

export const ProShopHeader: React.FC<ProShopHeaderProps> = ({ onOpenMobileMenu }) => {
  const { activeView, setActiveView, alerts, onlineCart, posCart, searchQuery, setSearchQuery } = useProShopStore();

  const getBreadcrumbTitle = () => {
    switch (activeView) {
      case 'overview':
        return 'Dashboard Overview (All 12 Modules)';
      case 'catalog':
        return 'Product Catalog & SKUs';
      case 'central-inventory':
        return 'Same Inventory for Counter & Online';
      case 'stock-tracking':
        return 'Real-Time Stock Tracking';
      case 'low-stock-alerts':
        return 'Low Stock Automated Alerts';
      case 'online-store':
        return 'Online Store (Member View)';
      case 'member-discounts':
        return 'Member Discounts (Junior 5%, Silver 10%, Gold 15%)';
      case 'pos-counter':
        return 'POS Terminal (Counter Sales)';
      case 'purchases':
        return 'Purchase Orders & Supplier Restock';
      case 'returns-refunds':
        return 'Returns & Member Refunds';
      case 'reports-analytics':
        return 'Executive Reports & Sales Analytics';
      case 'user-roles':
        return 'User Roles & RBAC Permissions';
      case 'inventory-transactions':
        return 'Inventory Movement Audit Log';
      default:
        return 'Dashboard Overview';
    }
  };

  return (
    <header className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
            <span>Playnex Sports Club</span>
            <span>/</span>
            <span className="text-blue-600 font-bold">Pro Shop & Inventory</span>
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
            {getBreadcrumbTitle()}
          </h1>
        </div>
      </div>

      {/* Right Controls: Global Search, Quick Modes, Alerts, and Staff Profile */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Global Search */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, SKUs, members..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Quick Launch POS Button */}
        <button
          onClick={() => setActiveView('pos-counter')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
          title="Open Counter POS Terminal"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Launch POS</span>
          {posCart.length > 0 && (
            <span className="px-1.5 py-0.2 bg-white text-emerald-700 rounded-full text-[10px] font-black">
              {posCart.length}
            </span>
          )}
        </button>

        {/* Member Store Button */}
        <button
          onClick={() => setActiveView('online-store')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
          title="View Member Online Storefront"
        >
          <Store className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Member Store</span>
          {onlineCart.length > 0 && (
            <span className="px-1.5 py-0.2 bg-white text-blue-700 rounded-full text-[10px] font-black">
              {onlineCart.length}
            </span>
          )}
        </button>

        {/* Alert Bell Button */}
        <button
          onClick={() => setActiveView('low-stock-alerts')}
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          title="Stock Alerts"
        >
          <Bell className="w-4 h-4" />
          {alerts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-ping" />
          )}
        </button>

        {/* Staff / Club Operator Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 text-white font-black text-xs flex items-center justify-center shadow-xs">
            PS
          </div>
          <div className="hidden xl:block text-left">
            <span className="text-xs font-bold text-slate-900 block leading-tight">Pro Shop Cashier</span>
            <span className="text-[10px] text-slate-400 font-medium">Main Sports Complex</span>
          </div>
        </div>
      </div>
    </header>
  );
};
