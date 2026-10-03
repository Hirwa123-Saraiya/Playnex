import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  FileText,
  CreditCard,
  RotateCcw,
  ArrowDownLeft,
  ArrowUpRight,
  Truck,
  ShoppingBag,
  Users,
  Percent,
  BookOpen,
  Building,
  Target,
  Landmark,
  CheckCircle,
  FileSpreadsheet,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';

interface FinanceSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const FinanceSidebar: React.FC<FinanceSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const { activeNav, setActiveNav, approvalRequests } = useFinanceStore();

  const pendingApprovalsCount = approvalRequests.filter((r) => r.status === 'Pending').length;

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { label: 'Revenue', icon: TrendingUp, badge: '+12%', badgeColor: 'bg-emerald-600' },
    { label: 'Expenses', icon: Receipt, badge: null },
    { label: 'Invoices', icon: FileText, badge: '4 Due', badgeColor: 'bg-amber-500' },
    { label: 'Payments', icon: CreditCard, badge: null },
    { label: 'Refunds', icon: RotateCcw, badge: null },
    { label: 'Accounts Receivable', icon: ArrowDownLeft, badge: '4.2L', badgeColor: 'bg-blue-600' },
    { label: 'Accounts Payable', icon: ArrowUpRight, badge: null },
    { label: 'Vendors', icon: Truck, badge: null },
    { label: 'Purchases', icon: ShoppingBag, badge: null },
    { label: 'Payroll', icon: Users, badge: null },
    { label: 'GST & Tax', icon: Percent, badge: 'Due 20 Nov', badgeColor: 'bg-purple-600' },
    { label: 'General Ledger', icon: BookOpen, badge: null },
    { label: 'Assets', icon: Building, badge: null },
    { label: 'Budget', icon: Target, badge: null },
    { label: 'Bank Accounts', icon: Landmark, badge: '3 A/c', badgeColor: 'bg-slate-700' },
    { label: 'Approvals', icon: CheckCircle, badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : null, badgeColor: 'bg-rose-500' },
    { label: 'Financial Statements', icon: FileSpreadsheet, badge: null },
    { label: 'AI Insights', icon: Sparkles, badge: 'AI', badgeColor: 'bg-indigo-600' },
    { label: 'Reports & Analytics', icon: BarChart3, badge: null },
    { label: 'Audit Logs', icon: ShieldCheck, badge: null },
    { label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`bg-slate-950 text-slate-300 flex flex-col justify-between transition-all duration-300 ease-in-out z-30 shrink-0 border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header matching Reference Image: Playnex Sports Club Management */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-lime-400 to-emerald-500 text-slate-950 flex items-center justify-center font-black text-base shadow-md shrink-0">
              ⚡
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-sm font-black text-white tracking-tight block">
                  Playnex
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                  Finance Management
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

        {/* Menu list */}
        <nav className="p-3 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
          {menuItems.map(({ label, icon: Icon, badge, badgeColor }) => {
            const isActive = activeNav === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveNav(label)}
                title={collapsed ? label : undefined}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all group ${
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
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-full text-white ${
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
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              General Ledger Live
            </span>
            <span className="font-mono text-[10px] text-slate-500">v4.2.0</span>
          </div>
        </div>
      )}
    </aside>
  );
};
