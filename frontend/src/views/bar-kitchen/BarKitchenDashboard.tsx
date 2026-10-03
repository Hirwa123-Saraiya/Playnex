import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Table,
  Clock,
  Flame,
  AlertTriangle,
  Calendar,
  Users,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
  ChefHat,
  UtensilsCrossed,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenSalesWidget } from '../../components/bar-kitchen/BarKitchenSalesWidget';
import { BarKitchenInventoryWidget } from '../../components/bar-kitchen/BarKitchenInventoryWidget';
import { BarKitchenTableCard } from '../../components/bar-kitchen/BarKitchenTableCard';
import { BarKitchenKOTCard } from '../../components/bar-kitchen/BarKitchenKOTCard';
import { mockDashboardMetrics } from '../../mock/BarKitchenMockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const BarKitchenDashboard: React.FC = () => {
  const {
    currentFacility,
    tables,
    kots,
    inventory,
    reservations,
    stewards,
    setActiveNav,
    setSelectedTable,
    updateKOTStatus,
  } = useBarKitchenStore();

  const occupiedTables = tables.filter((t) => t.status === 'Occupied');
  const activeKOTs = kots.filter((k) => k.status !== 'Served');
  const criticalInventory = inventory.filter(
    (i) => i.status === 'Critical' || i.status === 'Low Stock'
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner / Welcome & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
              {currentFacility.name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-slate-300">Live Service Operational</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
            Bar & Kitchen Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Integrated high-speed POS terminal, multi-station Kitchen Display System (KDS), table floor plan, and member billing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveNav('Order Management')}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Launch POS Terminal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('Kitchen Operations')}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-white text-xs font-black rounded-2xl transition-all flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Live KDS ({activeKOTs.length})</span>
          </button>
        </div>
      </div>

      {/* 8 KPI Cards as explicitly required by prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Today's Sales */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Today's Sales</span>
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">₹48,950</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +14.8%
          </span>
        </div>

        {/* 2. Orders */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">168</div>
          <span className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +9.2%
          </span>
        </div>

        {/* 3. Average Order Value */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Order Value</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">₹291</div>
          <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +5.4%
          </span>
        </div>

        {/* 4. Active Tables */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Tables</span>
            <Table className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">
            {occupiedTables.length} / {tables.length}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            {Math.round((occupiedTables.length / tables.length) * 100)}% Occupancy
          </span>
        </div>

        {/* 5. Pending Orders */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-black text-amber-600 mt-1">4</div>
          <span className="text-[10px] text-amber-700 font-medium mt-0.5 block">Avg 9 mins prep</span>
        </div>

        {/* 6. Kitchen Queue */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Kitchen Queue</span>
            <Flame className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className="text-lg font-black text-orange-600 mt-1">{activeKOTs.length} KOTs</div>
          <span className="text-[10px] text-orange-700 font-medium mt-0.5 block">3 Stations busy</span>
        </div>

        {/* 7. Inventory Alerts */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Inventory Alerts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-lg font-black text-rose-600 mt-1">
            {criticalInventory.length}
          </div>
          <span className="text-[10px] text-rose-700 font-bold mt-0.5 block">Reorders needed</span>
        </div>

        {/* 8. Reservation Count */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Reservations</span>
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-lg font-black text-purple-600 mt-1">12 Booked</div>
          <span className="text-[10px] text-purple-700 font-medium mt-0.5 block">2 VIP Banquets</span>
        </div>
      </div>

      {/* Main Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales Dashboard Widget & Revenue Trend */}
        <div className="lg:col-span-2 space-y-6">
          <BarKitchenSalesWidget />

          {/* Hourly Revenue Trend Area Chart */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Intraday Throughput
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Revenue Velocity Trend
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                Peak: 7 PM - 10 PM
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockDashboardMetrics.revenueTrend}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Live Kitchen Queue & Inventory Alerts */}
        <div className="space-y-6">
          {/* Live Kitchen Status Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Kitchen Operations
                </span>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Live Kitchen KOTs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveNav('Kitchen Operations')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                <span>KDS Fullscreen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {kots.slice(0, 2).map((kot) => (
                <BarKitchenKOTCard
                  key={kot.id}
                  kot={kot}
                  onStatusChange={updateKOTStatus}
                />
              ))}
            </div>
          </div>

          {/* Inventory Alerts Widget */}
          <BarKitchenInventoryWidget
            items={inventory}
            onViewAll={() => setActiveNav('Inventory')}
          />
        </div>
      </div>

      {/* Bottom Section: Live Floor Table Occupancy Preview & Steward Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Occupancy Preview (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Floor Plan
              </span>
              <h3 className="text-base font-black text-slate-900">
                Live Table Status ({tables.length} Tables)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
              </span>
              <span className="flex items-center gap-1 font-semibold text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Occupied
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Reserved
              </span>
              <button
                type="button"
                onClick={() => setActiveNav('Table Management')}
                className="text-blue-600 font-bold hover:underline ml-2"
              >
                View Full Map →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {tables.slice(0, 12).map((tbl) => (
              <BarKitchenTableCard
                key={tbl.id}
                table={tbl}
                onClick={() => {
                  setSelectedTable(tbl);
                  setActiveNav('Order Management');
                }}
              />
            ))}
          </div>
        </div>

        {/* Steward Performance summary (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Staff Coverage
              </span>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                Steward Performance
              </h3>
            </div>
            <button
              onClick={() => setActiveNav('Stewards')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              All Stewards →
            </button>
          </div>

          <div className="space-y-3">
            {stewards.slice(0, 4).map((steward) => (
              <div
                key={steward.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between text-xs"
              >
                <div>
                  <h5 className="font-extrabold text-slate-900">{steward.name}</h5>
                  <span className="text-slate-500 text-[11px]">
                    Zone: {steward.assignedArea} • {steward.assignedTables.length} Tables
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-700 block">
                    ₹{steward.revenueGeneratedToday.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {steward.ordersServedToday} Orders
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
