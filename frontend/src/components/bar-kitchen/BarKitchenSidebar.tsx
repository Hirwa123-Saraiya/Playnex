import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Table2,
  ShoppingBag,
  ClipboardList,
  Monitor,
  Receipt,
  CreditCard,
  Package,
  BookOpen,
  CalendarDays,
  Wine,
  Tag,
  Users,
  PartyPopper,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { useAuth } from '../../context/AuthContext';

interface BarKitchenSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const BarKitchenSidebar: React.FC<BarKitchenSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const { activeNav, setActiveNav, tables } = useBarKitchenStore();
  const { user, logout } = useAuth();

  const occupiedTables = tables.filter((t) => t.status === 'Occupied').length;

  const menuGroups = [
    {
      label: 'Operations',
      items: [
        { label: 'Dashboard',           icon: LayoutDashboard,  badge: null },
        { label: 'Order Management',    icon: ShoppingBag,      badge: 'POS', badgeColor: 'bg-blue-600' },
        { label: 'Table Management',    icon: Table2,           badge: occupiedTables > 0 ? `${occupiedTables} occ` : null, badgeColor: 'bg-rose-500' },
        { label: 'KOT – Kitchen Orders', icon: ClipboardList,  badge: null },
        { label: 'KDS – Display Screen', icon: Monitor,        badge: 'Live', badgeColor: 'bg-emerald-600' },
        { label: 'Billing & POS',       icon: Receipt,          badge: null },
        { label: 'Payments & Tabs',     icon: CreditCard,       badge: null },
      ],
    },
    {
      label: 'Menu & Inventory',
      items: [
        { label: 'Menu Management',     icon: UtensilsCrossed,  badge: null },
        { label: 'Bar Operations',      icon: Wine,             badge: null },
        { label: 'Recipes & Costing',   icon: BookOpen,         badge: null },
        { label: 'Inventory',           icon: Package,          badge: null },
        { label: 'Discounts & Offers',  icon: Tag,              badge: null },
      ],
    },
    {
      label: 'Events & Staff',
      items: [
        { label: 'Reservations',        icon: CalendarDays,     badge: null },
        { label: 'Banquet & Events',    icon: PartyPopper,      badge: null },
        { label: 'Stewards & Staff',    icon: Users,            badge: null },
      ],
    },
    {
      label: 'Analytics',
      items: [
        { label: 'Reports & Analytics', icon: BarChart3,        badge: null },
        { label: 'Audit Logs',          icon: ShieldCheck,      badge: null },
        { label: 'Settings',            icon: Settings,         badge: null },
      ],
    },
  ];

  const allItems = menuGroups.flatMap(g => g.items);

  return (
    <aside
      className={`h-screen overflow-hidden bg-slate-950 text-slate-300 flex flex-col justify-between transition-all duration-300 ease-in-out z-30 shrink-0 border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col min-h-0">
        {/* Brand Banner */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              🍽️
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-[10px] font-black tracking-widest text-orange-400 uppercase block">
                  PLAYNEX
                </span>
                <span className="text-sm font-black text-white truncate block">
                  Bar & Kitchen POS
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

        {/* Live indicator */}
        {!collapsed && (
          <div className="px-4 py-2 shrink-0">
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-orange-300 uppercase tracking-wider truncate">
                  {user?.tenantName || 'Sports Club'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user?.name || 'F&B Staff'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 pb-3 space-y-0.5 overflow-y-auto no-scrollbar">
          {collapsed
            ? allItems.map(({ label, icon: Icon, badge, badgeColor }) => {
                const isActive = activeNav === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveNav(label)}
                    title={label}
                    className={`w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/90'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                  </button>
                );
              })
            : menuGroups.map(({ label: groupLabel, items }) => (
                <div key={groupLabel} className="pt-3">
                  <p className="px-3 pb-1 text-[9px] font-black uppercase tracking-widest text-slate-600">
                    {groupLabel}
                  </p>
                  {items.map(({ label, icon: Icon, badge, badgeColor }) => {
                    const isActive = activeNav === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setActiveNav(label)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all group ${
                          isActive
                            ? 'bg-orange-600 text-white font-extrabold shadow-md shadow-orange-600/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/90'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-400'
                            }`}
                          />
                          <span className="truncate">{label}</span>
                        </div>
                        {badge && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded-full text-white shrink-0 ${
                              badgeColor || 'bg-slate-700'
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/80 shrink-0">
        {!collapsed && (
          <div className="mb-2 px-2">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Workstation</p>
            <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-bold transition border border-slate-800"
        >
          <LogOut size={15} />
          {!collapsed && <span>Exit Station</span>}
        </button>
      </div>
    </aside>
  );
};
