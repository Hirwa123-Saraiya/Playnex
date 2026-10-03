import React, { useState } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Table,
  Calendar,
  ShoppingBag,
  Flame,
  Wine,
  CreditCard,
  Package,
  BookOpen,
  Users,
  PartyPopper,
  Percent,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';

interface BarKitchenSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const BarKitchenSidebar: React.FC<BarKitchenSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const { activeNav, setActiveNav, kots, tables, inventory } = useBarKitchenStore();

  const activeKOTCount = kots.filter((k) => k.status !== 'Served').length;
  const occupiedTablesCount = tables.filter((t) => t.status === 'Occupied').length;
  const lowStockCount = inventory.filter((i) => i.status === 'Critical' || i.status === 'Low Stock').length;

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { label: 'Menu Management', icon: UtensilsCrossed, badge: null },
    { label: 'Table Management', icon: Table, badge: occupiedTablesCount > 0 ? `${occupiedTablesCount}` : null, badgeColor: 'bg-red-500' },
    { label: 'Reservations', icon: Calendar, badge: '4', badgeColor: 'bg-amber-500' },
    { label: 'Order Management', icon: ShoppingBag, badge: 'POS', badgeColor: 'bg-blue-600' },
    { label: 'Kitchen Operations', icon: Flame, badge: activeKOTCount > 0 ? `${activeKOTCount}` : null, badgeColor: 'bg-orange-500' },
    { label: 'Bar Operations', icon: Wine, badge: 'Live', badgeColor: 'bg-purple-600' },
    { label: 'Billing & Payments', icon: CreditCard, badge: null },
    { label: 'Inventory', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount}` : null, badgeColor: 'bg-rose-500' },
    { label: 'Recipes', icon: BookOpen, badge: null },
    { label: 'Stewards', icon: Users, badge: null },
    { label: 'Banquet & Catering', icon: PartyPopper, badge: null },
    { label: 'Member Discounts', icon: Percent, badge: null },
    { label: 'Audit Logs', icon: ShieldCheck, badge: null },
    { label: 'Reports & Analytics', icon: BarChart3, badge: null },
    { label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`bg-slate-950 text-slate-300 flex flex-col justify-between transition-all duration-300 ease-in-out z-30 shrink-0 border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Banner */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              P
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-xs font-black tracking-widest text-blue-400 uppercase block">
                  PLAYNEX
                </span>
                <span className="text-sm font-black text-white truncate block">
                  Bar & Kitchen
                </span>
              </div>
            )}
          </div>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
          {menuItems.map(({ label, icon: Icon, badge, badgeColor }) => {
            const isActive = activeNav === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveNav(label)}
                title={collapsed ? label : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </div>

                {!collapsed && badge && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full text-white ${
                      badgeColor || 'bg-slate-700'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              MICROS / POS Online
            </span>
            <span className="font-mono text-[10px] text-slate-500">v3.4.1</span>
          </div>
        </div>
      )}
    </aside>
  );
};
