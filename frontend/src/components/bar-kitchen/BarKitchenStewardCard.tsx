import React from 'react';
import { User, Phone, Table, Star, Clock, IndianRupee, Award } from 'lucide-react';
import { BarKitchenSteward } from '../../types/BarKitchenTypes';

interface BarKitchenStewardCardProps {
  steward: BarKitchenSteward;
  onToggleStatus?: (id: string, newStatus: BarKitchenSteward['status']) => void;
}

export const BarKitchenStewardCard: React.FC<BarKitchenStewardCardProps> = ({
  steward,
  onToggleStatus,
}) => {
  const getStatusColor = (status: BarKitchenSteward['status']) => {
    switch (status) {
      case 'On Duty':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'On Break':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Off Duty':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-base border border-blue-100 shadow-2xs">
              {steward.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">{steward.name}</h4>
              <span className="text-xs font-semibold text-slate-400 block">{steward.code}</span>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(
              steward.status
            )}`}
          >
            {steward.status}
          </span>
        </div>

        {/* Assigned Area & Tables */}
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Assigned Zone:</span>
            <span className="font-extrabold text-slate-800">{steward.assignedArea}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Active Tables:</span>
            <div className="flex items-center gap-1">
              {steward.assignedTables.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-slate-200 text-slate-700 font-black px-1.5 py-0.5 rounded text-[11px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100/60">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">Orders Served</span>
            <span className="text-base font-black text-slate-900">{steward.ordersServedToday}</span>
          </div>
          <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100/60">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Revenue</span>
            <span className="text-base font-black text-slate-900">₹{steward.revenueGeneratedToday.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-100/60">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Avg Service</span>
            <span className="text-base font-black text-slate-900">{steward.avgServiceTimeMins}m</span>
          </div>
          <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100/60">
            <span className="text-[10px] uppercase font-bold text-purple-700 block">Rating</span>
            <div className="flex items-center gap-1 text-base font-black text-slate-900">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{steward.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      {onToggleStatus && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Tips: ₹{steward.tipsEarnedToday}</span>
          <select
            value={steward.status}
            onChange={(e) => onToggleStatus(steward.id, e.target.value as any)}
            className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700"
          >
            <option value="On Duty">On Duty</option>
            <option value="On Break">On Break</option>
            <option value="Off Duty">Off Duty</option>
          </select>
        </div>
      )}
    </div>
  );
};
