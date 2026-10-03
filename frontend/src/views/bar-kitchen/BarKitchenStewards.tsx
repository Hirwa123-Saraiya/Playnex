import React from 'react';
import { Users, Award, Clock, DollarSign, Star, Plus } from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenStewardCard } from '../../components/bar-kitchen/BarKitchenStewardCard';

export const BarKitchenStewards: React.FC = () => {
  const { stewards, updateStewardStatus } = useBarKitchenStore();

  const totalRevenue = stewards.reduce((sum, s) => sum + s.revenueGeneratedToday, 0);
  const totalOrders = stewards.reduce((sum, s) => sum + s.ordersServedToday, 0);
  const totalTips = stewards.reduce((sum, s) => sum + s.tipsEarnedToday, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Steward & Floor Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Zone allocation, table coverage rosters, service speed tracking, and tip pool distribution.
          </p>
        </div>

        <button
          onClick={() => alert('Steward Roster Builder opened.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Steward to Shift</span>
        </button>
      </div>

      {/* Staff KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Total Handled</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">₹{totalRevenue.toLocaleString()}</span>
          <span className="text-xs text-emerald-600 font-bold">Generated across 5 floor zones</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Service Orders</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{totalOrders} Tables Served</span>
          <span className="text-xs text-slate-500 font-medium">Avg speed: 12.6 mins / round</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tip Pool Today</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">₹{totalTips.toLocaleString()}</span>
          <span className="text-xs text-slate-500 font-medium">Fair distribution model active</span>
        </div>
      </div>

      {/* Stewards Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stewards.map((steward) => (
          <BarKitchenStewardCard
            key={steward.id}
            steward={steward}
            onToggleStatus={updateStewardStatus}
          />
        ))}
      </div>
    </div>
  );
};
