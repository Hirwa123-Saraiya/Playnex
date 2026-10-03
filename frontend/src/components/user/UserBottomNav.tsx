import React from 'react';
import { Home, Compass, Calendar, ShieldCheck, User } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserBottomNav: React.FC = () => {
  const { activeView, setActiveView, isGuest, openGuestModal } = useUserStore();

  const navItems = [
    { label: 'Home', view: 'home' as const, icon: Home },
    { label: 'Clubs', view: 'clubs' as const, icon: Compass },
    { label: 'Bookings', view: 'bookings' as const, icon: Calendar, requiresAuth: true },
    { label: 'Memberships', view: 'memberships' as const, icon: ShieldCheck },
    { label: 'Profile', view: 'profile' as const, icon: User, requiresAuth: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeView === item.view ||
            (item.view === 'clubs' && activeView === 'club-details') ||
            (item.view === 'bookings' && (activeView === 'booking-create' || activeView === 'booking-confirmation'));

          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.requiresAuth && isGuest) {
                  openGuestModal(() => setActiveView(item.view));
                } else {
                  setActiveView(item.view);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
