import React from 'react';
import { 
  LayoutGrid, 
  Package, 
  SlidersHorizontal, 
  AlertTriangle, 
  Calculator, 
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Database,
  X
} from 'lucide-react';
import { useProShopStore, ProShopActiveView } from '../../store/ProShopInventoryStore';

interface ProShopSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const ProShopSidebar: React.FC<ProShopSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  const { activeView, setActiveView, alerts, posCart, products } = useProShopStore();
  const totalStockCount = products.reduce((acc, curr) => acc + curr.availableStock, 0);

  const navItems: {
    id: ProShopActiveView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number | null;
    badgeColor?: string;
  }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutGrid },
    { id: 'catalog', label: 'Product Catalog', icon: Package, badge: products.length, badgeColor: 'bg-slate-700 text-slate-200' },
    { id: 'stock-tracking', label: 'Stock Tracking', icon: SlidersHorizontal },
    { id: 'low-stock-alerts', label: 'Low Stock Alerts', icon: AlertTriangle, badge: alerts.length > 0 ? alerts.length : null, badgeColor: 'bg-rose-500 text-white animate-pulse' },
    { id: 'pos-counter', label: 'POS (Counter Sales)', icon: Calculator, badge: posCart.length > 0 ? `${posCart.length}` : null, badgeColor: 'bg-emerald-600 text-white' },
  ];

  const handleNavClick = (viewId: ProShopActiveView) => {
    setActiveView(viewId);
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0B1528] text-slate-300 flex flex-col border-r border-slate-800/80 transition-all duration-300 shadow-2xl lg:static lg:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                  PLAYNEX
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-blue-500/20 text-blue-400 font-extrabold uppercase border border-blue-400/30">
                    Pro Shop
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 block truncate font-medium">
                  Inventory & POS Suite
                </span>
              </div>
            )}
          </div>

          {/* Close mobile button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Item List */}
        <div className="flex-1 overflow-hidden p-3 space-y-1">
          {!collapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
              Management Modules
            </div>
          )}

          {navItems.map((item, index) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}>
                  <Icon className="w-4 h-4" />
                </span>

                {!collapsed && (
                  <span className="truncate flex-1 text-left">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge !== undefined && item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor || 'bg-slate-700 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}

                {/* Floating tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-slate-700">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Real-Time Central Stock Status */}
        <div className="p-3 border-t border-slate-800/80">
          {!collapsed && (
            <div className="mb-3 rounded-2xl bg-slate-900/90 border border-slate-800 p-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Database className="w-3.5 h-3.5 text-blue-400" /> Central Stock
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>
            <div className="mt-2 flex justify-between items-baseline">
              <span className="text-slate-400 text-[11px]">Total Available:</span>
              <span className="font-black text-white text-sm">{totalStockCount} Units</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Synchronized with Counter POS & Web App
            </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
