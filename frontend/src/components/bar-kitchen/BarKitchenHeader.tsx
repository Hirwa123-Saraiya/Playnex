import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Building2,
  ChevronDown,
  Volume2,
  Sparkles,
  Layers,
  LogOut,
  Coffee,
  Wine,
  Waves,
  BedDouble,
  PartyPopper,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenFacilityType } from '../../types/BarKitchenTypes';
import { useAuth } from '../../context/AuthContext';

export const BarKitchenHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    facilities,
    currentFacility,
    setFacility,
    toastMessage,
    activeNav,
    setActiveNav,
  } = useBarKitchenStore();

  const [facilityDropdownOpen, setFacilityDropdownOpen] = useState(false);

  const getFacilityIcon = (type: BarKitchenFacilityType) => {
    switch (type) {
      case 'Restaurant':
        return UtensilsCrossed;
      case 'Cafe':
        return Coffee;
      case 'Bar':
        return Wine;
      case 'Poolside':
        return Waves;
      case 'Room Service':
        return BedDouble;
      case 'Banquet':
        return PartyPopper;
      default:
        return Building2;
    }
  };

  const FacilityIcon = getFacilityIcon(currentFacility.type);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3 max-w-[1720px] mx-auto">
        {/* Left: Facility context & Switcher */}
        <div className="flex items-center gap-3">
          {/* Facility Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFacilityDropdownOpen(!facilityDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-slate-100 transition-all text-left shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FacilityIcon className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {currentFacility.type} • Royal Club
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h2 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {currentFacility.name}
                </h2>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </button>

            {facilityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Club Outlets & Kitchens
                </div>
                <div className="space-y-1 mt-1 max-h-80 overflow-y-auto">
                  {facilities.map((fac) => {
                    const Icon = getFacilityIcon(fac.type);
                    const isSelected = fac.id === currentFacility.id;
                    return (
                      <button
                        key={fac.id}
                        type="button"
                        onClick={() => {
                          setFacility(fac);
                          setFacilityDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-extrabold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate">{fac.name}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {fac.tablesCount} Tables • {fac.openingHours}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Notification Toast (if any) or Quick Workflow buttons */}
        {toastMessage ? (
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold animate-in fade-in slide-in-from-top-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setActiveNav('Order Management')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNav === 'Order Management'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>POS Terminal</span>
            </button>
            <button
              onClick={() => setActiveNav('Menu Management')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNav === 'Menu Management'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Manage Menu</span>
            </button>
            <button
              onClick={() => setActiveNav('Table Management')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNav === 'Table Management'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Floor Plan</span>
            </button>
          </div>
        )}

        {/* Right: authenticated staff profile */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:block rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            {user?.roleName || 'Bar & Kitchen Staff'}
          </div>

          {/* Quick Sound Alert Indicator */}
          <div
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            title="Kitchen Audio Alerts Active"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
          </div>

          {/* Staff avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              {(user?.name || 'BK').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden xl:block text-left">
              <span className="block text-xs font-bold text-slate-900">{user?.name || 'Bar & Kitchen Staff'}</span>
              <span className="block text-[10px] text-slate-400">{user?.tenantName || 'Sports Club'}</span>
            </div>
            <button onClick={() => void logout()} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" title="Log out" aria-label="Log out"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </header>
  );
};
