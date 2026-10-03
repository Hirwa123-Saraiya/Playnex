import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  UtensilsCrossed,
  Trophy,
  CreditCard,
  Briefcase,
  IndianRupee,
  BarChart3,
  MessageSquare,
  CheckSquare,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  ShoppingBag,
  Inbox,
  UserPlus,
} from 'lucide-react';
import { useClub } from '../../context/ClubContext';

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  id: string;
  href: string;
}

const navItems: SidebarItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'Dashboard', href: '/club/dashboard' },
  { name: 'Bookings', icon: CalendarDays, id: 'Bookings', href: '/club/bookings' },
  { name: 'Walk-in Front Desk', icon: UserPlus, id: 'Walk-in Front Desk', href: '/club/walk-in' },
  { name: 'Members', icon: Users, id: 'Members', href: '/club/members' },
  { name: 'Facilities & Courts', icon: Building2, id: 'Facilities', href: '/club/facilities' },
  { name: 'Pro Shop & Inventory', icon: ShoppingBag, id: 'Pro Shop & Inventory', href: '/club/pro-shop' },
  { name: 'Restaurant & Bar', icon: UtensilsCrossed, id: 'Restaurant & Bar', href: '/club/restaurant' },
  { name: 'Events & Tournaments', icon: Trophy, id: 'Events & Tournaments', href: '/club/events' },
  { name: 'Membership Plans', icon: CreditCard, id: 'Membership Plans', href: '/club/membership-plans' },
  { name: 'Enquiries & Leads', icon: Inbox, id: 'Enquiries & Leads', href: '/club/enquiries' },
  { name: 'Staff Management', icon: Briefcase, id: 'Staff Management', href: '/club/staff' },
  { name: 'Finance & Payments', icon: IndianRupee, id: 'Finance & Payments', href: '/club/finance' },
  { name: 'Reports & Analytics', icon: BarChart3, id: 'Reports & Analytics', href: '/club/reports' },
  { name: 'Communications', icon: MessageSquare, id: 'Communications', href: '/club/communications' },
  { name: 'Approvals', icon: CheckSquare, id: 'Approvals', href: '/club/approvals' },
  { name: 'Platform Subscription', icon: ShieldCheck, id: 'Platform Subscription', href: '/club/subscription' },
  { name: 'Settings', icon: Settings, id: 'Settings', href: '/club/settings' },
];

export const ClubSidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    club,
    activeNav,
    setActiveNav,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    approvals,
  } = useClub();

  // Dynamic approval count
  const pendingApprovalTotal = approvals.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#071A3D] text-slate-300 border-r border-[#0B1F4D] transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Club Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#0B1F4D] bg-[#071A3D]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1565D8] via-[#2F80ED] to-amber-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-blue-900/30">
              <div className="w-full h-full bg-[#071A3D] rounded-[10px] flex items-center justify-center">
                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-blue-300">
                  ⚡
                </span>
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white text-sm tracking-tight truncate">
                    {club.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </div>
                <span className="text-[11px] text-slate-400 font-normal">
                  {club.tagline || 'Club Owner Dashboard'}
                </span>
              </div>
            )}
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isPathActive = pathname === item.href || (item.href !== '/club/dashboard' && pathname.startsWith(item.href));
            const isActive = isPathActive || activeNav === item.id;
            const badgeValue = item.id === 'Approvals' ? pendingApprovalTotal : item.badge;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileSidebarOpen(false);
                }}
                title={sidebarCollapsed ? item.name : undefined}
                className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#1565D8] text-white shadow-md shadow-[#0E5BD8]/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#0E5BD8]/25'
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!sidebarCollapsed && (
                  <>
                    <span className="truncate flex-1 text-left">{item.name}</span>
                    {badgeValue && (
                      <span
                        className={`ml-auto px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                          item.badgeColor || 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {badgeValue}
                      </span>
                    )}
                  </>
                )}

                {/* Collapsed Tooltip / Dot Badge */}
                {sidebarCollapsed && badgeValue && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#071A3D]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Multi-Tenant Footnote & Collapse Toggle */}
        <div className="p-3 border-t border-[#0B1F4D] bg-[#05132d]">
          {!sidebarCollapsed && (
            <div className="mb-3 px-2 py-2 rounded-lg bg-[#071A3D]/90 border border-[#0B1F4D] flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="truncate">
                <p className="text-slate-300 font-medium text-[11px]">Tenant Verified</p>
                <p className="text-[10px] text-slate-500 truncate">{club.tenantId}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-2 px-3 text-xs text-slate-400 hover:text-white hover:bg-[#0E5BD8]/25 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
