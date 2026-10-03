import React from 'react';
import { 
  ShoppingCart, 
  Layers, 
  Package, 
  AlertTriangle, 
  Store, 
  Percent, 
  Calculator, 
  Truck, 
  RotateCcw, 
  BarChart3, 
  ShieldCheck, 
  History,
  LayoutGrid
} from 'lucide-react';
import { useProShopStore, ProShopActiveView } from '../../store/ProShopInventoryStore';

export const ProShopHeader: React.FC = () => {
  const { activeView, setActiveView, onlineCart, posCart, alerts } = useProShopStore();

  const navItems: { id: ProShopActiveView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'catalog', label: 'Product Catalog', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'central-inventory', label: 'Central Inventory Flow', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'stock-tracking', label: 'Stock Tracking', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'low-stock-alerts', label: 'Low Stock Alerts', icon: <AlertTriangle className="w-3.5 h-3.5" />, badge: alerts.length },
    { id: 'online-store', label: 'Online Store (Member)', icon: <Store className="w-3.5 h-3.5" />, badge: onlineCart.length },
    { id: 'member-discounts', label: 'Member Discounts', icon: <Percent className="w-3.5 h-3.5" /> },
    { id: 'pos-counter', label: 'POS (Counter Sales)', icon: <Calculator className="w-3.5 h-3.5" />, badge: posCart.length },
    { id: 'purchases', label: 'Purchase Management', icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'returns-refunds', label: 'Returns & Refunds', icon: <RotateCcw className="w-3.5 h-3.5" /> },
    { id: 'reports-analytics', label: 'Reports & Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'user-roles', label: 'User Roles & Access', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'inventory-transactions', label: 'Inventory History', icon: <History className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner matching reference image */}
      <div className="bg-[#0f3460] text-white rounded-2xl p-5 shadow-lg border border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-white shadow-inner">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight">Pro Shop / Inventory Module</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Live Omni-Channel
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-200/90 font-medium mt-0.5">
              Sell sports equipment and apparel to members (Counter + Online) with real-time central stock sync
            </p>
          </div>
        </div>

        {/* Quick Mode Indicators */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveView('pos-counter')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition"
          >
            <Calculator className="w-3.5 h-3.5" />
            Launch POS
          </button>
          <button
            onClick={() => setActiveView('online-store')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition"
          >
            <Store className="w-3.5 h-3.5" />
            Member Store
          </button>
        </div>
      </div>

      {/* Horizontal Nav Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white text-blue-600' : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
