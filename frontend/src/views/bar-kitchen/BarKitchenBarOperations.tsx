import React, { useState } from 'react';
import {
  Wine,
  Sparkles,
  Clock,
  Plus,
  Flame,
  CheckCircle2,
  DollarSign,
  Search,
  Filter,
  Layers,
  GlassWater,
  AlertTriangle,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';

export const BarKitchenBarOperations: React.FC = () => {
  const { menuItems, inventory, addToCart, setActiveNav } = useBarKitchenStore();
  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'Cocktails' | 'Spirits' | 'Beer'>('All');

  // Bar items
  const barDrinks = menuItems.filter((m) => m.category === 'Alcohol' || m.subCategory === 'Mocktails');

  // Open Bar Tabs simulation
  const [openTabs, setOpenTabs] = useState([
    { id: 'TAB-101', member: 'Rahul Mehta (Gold)', table: 'Bar Counter 03', itemsCount: 4, runningAmount: 1850, openedAt: '40 mins ago' },
    { id: 'TAB-102', member: 'Vikram Joshi (Silver)', table: 'Lounge Table B1', itemsCount: 3, runningAmount: 1420, openedAt: '25 mins ago' },
    { id: 'TAB-103', member: 'Corporate Tennis Team', table: 'High Top H2', itemsCount: 8, runningAmount: 4950, openedAt: '1 hr ago' },
  ]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Happy Hours Active (4 PM - 8 PM) • 20% Off Cocktails
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Bar Operations & Lounge Dispense
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Member bar tabs, liquor bottle inventory tracking, mixology recipes, and bartender dispense queue.
          </p>
        </div>

        <button
          onClick={() => setActiveNav('Order Management')}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Open New Bar Tab</span>
        </button>
      </div>

      {/* Bar KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Bar Revenue</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">₹24,800</span>
          <span className="text-[10px] text-emerald-600 font-bold">+18% vs last week</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Open Tabs</span>
          <span className="text-xl font-black text-purple-600 mt-1 block">{openTabs.length} Tabs</span>
          <span className="text-[10px] text-slate-500 font-medium">₹8,220 unbilled tab value</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Draft Beer Kegs</span>
          <span className="text-xl font-black text-amber-600 mt-1 block">68% Level</span>
          <span className="text-[10px] text-slate-500 font-medium">Belgian Wheat Ale on tap</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Spirits Stock Alert</span>
          <span className="text-xl font-black text-rose-600 mt-1 block">2 Critical</span>
          <span className="text-[10px] text-rose-700 font-bold">Bourbon reorder placed</span>
        </div>
      </div>

      {/* Main Grid: Left Open Tabs & Bartender Queue | Right Liquor Catalog & Recipe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Open Member Tabs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Running Tabs</span>
                <h3 className="text-base font-black text-slate-900">Active Member Bar Tabs</h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                Tap to settle
              </span>
            </div>

            <div className="space-y-2.5">
              {openTabs.map((tab) => (
                <div
                  key={tab.id}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{tab.member}</span>
                      <span className="text-[10px] bg-purple-100 text-purple-700 font-extrabold px-1.5 py-0.5 rounded">
                        {tab.table}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {tab.itemsCount} drinks poured • Started {tab.openedAt}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900 block">₹{tab.runningAmount}</span>
                    <button
                      onClick={() => setActiveNav('Billing & Payments')}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Checkout →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottle Tracking Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              High-Value Bottle Level Tracking
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Glenfiddich 12 Yrs Single Malt</span>
                  <span>1.4 / 3.0 Bottles (46%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '46%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Grey Goose Vodka (750ml)</span>
                  <span>2.2 / 4.0 Bottles (55%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '55%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Signature Cocktails & Spirits Catalog (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mixology Menu</span>
              <h3 className="text-base font-black text-slate-900">Bar & Cocktail Offerings</h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              {(['All', 'Cocktails', 'Spirits', 'Beer'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTabFilter(cat)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTabFilter === cat ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {barDrinks.map((drink) => (
              <div
                key={drink.id}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h5 className="font-extrabold text-sm text-slate-900">{drink.name}</h5>
                    <span className="font-black text-slate-900 text-sm">₹{drink.price}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{drink.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {drink.subCategory}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(drink, 1);
                      setActiveNav('Order Management');
                    }}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-2xs"
                  >
                    + Add to Tab
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
