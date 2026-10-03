import React from 'react';
import { Clock, ChefHat, CheckCircle2, Play, Flame, Utensils, Printer } from 'lucide-react';
import { BarKitchenKOT, KOTStatus } from '../../types/BarKitchenTypes';

interface BarKitchenKOTCardProps {
  kot: BarKitchenKOT;
  onStatusChange?: (kotId: string, newStatus: KOTStatus) => void;
  onPrint?: (kot: BarKitchenKOT) => void;
}

export const BarKitchenKOTCard: React.FC<BarKitchenKOTCardProps> = ({
  kot,
  onStatusChange,
  onPrint,
}) => {
  const getHeaderColor = () => {
    switch (kot.status) {
      case 'Preparing':
        return 'border-orange-300 bg-orange-50/40 text-orange-900';
      case 'Ready':
        return 'border-purple-300 bg-purple-50/40 text-purple-900';
      case 'Served':
        return 'border-emerald-300 bg-emerald-50/40 text-emerald-900';
      case 'New':
      default:
        return 'border-blue-300 bg-blue-50/40 text-blue-900';
    }
  };

  const getStatusBadge = () => {
    switch (kot.status) {
      case 'Preparing':
        return 'bg-orange-500 text-white';
      case 'Ready':
        return 'bg-purple-600 text-white';
      case 'Served':
        return 'bg-emerald-600 text-white';
      case 'New':
      default:
        return 'bg-blue-600 text-white';
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
      {/* Header bar matching reference image #101 Table T2 2 mins ago */}
      <div>
        <div className={`p-4 border-b flex items-center justify-between ${getHeaderColor()}`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-black text-rose-600 tracking-tight">
              {kot.kotNumber}
            </span>
            <div className="bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs font-extrabold text-sm text-slate-900">
              Table {kot.tableNumber}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {kot.createdAt}
            </span>
            {onPrint && (
              <button
                type="button"
                onClick={() => onPrint(kot)}
                title="Print KOT Slip"
                className="p-1 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Steward & Station */}
        <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Steward: <strong className="text-slate-700">{kot.stewardName}</strong></span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
            <ChefHat className="w-3 h-3 text-slate-400" />
            {kot.station}
          </span>
        </div>

        {/* Items List */}
        <div className="p-4 space-y-2.5">
          {kot.items.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between text-sm">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900">
                  {item.quantity} x {item.name}
                </span>
                {item.notes && (
                  <span className="block text-[11px] text-amber-700 font-medium italic">
                    ↳ Note: {item.notes}
                  </span>
                )}
              </div>
            </div>
          ))}

          {kot.notes && (
            <div className="mt-3 p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <strong>Order Note:</strong> {kot.notes}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${getStatusBadge()}`}>
            {kot.status}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Time: {kot.timestamp}
          </span>
        </div>

        {/* Big Touch Action Buttons based on KOT lifecycle */}
        {onStatusChange && (
          <div className="pt-2">
            {kot.status === 'New' && (
              <button
                type="button"
                onClick={() => onStatusChange(kot.id, 'Preparing')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Preparing
              </button>
            )}

            {kot.status === 'Preparing' && (
              <button
                type="button"
                onClick={() => onStatusChange(kot.id, 'Ready')}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                Mark Ready
              </button>
            )}

            {kot.status === 'Ready' && (
              <button
                type="button"
                onClick={() => onStatusChange(kot.id, 'Served')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Served
              </button>
            )}

            {kot.status === 'Served' && (
              <div className="w-full py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl text-center">
                ✓ Order Completed & Served
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
