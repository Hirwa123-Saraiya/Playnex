import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, Play, Flame, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BarKitchenKOT, KOTStatus } from '../../types/BarKitchenTypes';

interface BarKitchenKDSCardProps {
  kot: BarKitchenKOT;
  onStatusChange?: (kotId: string, newStatus: KOTStatus) => void;
}

export const BarKitchenKDSCard: React.FC<BarKitchenKDSCardProps> = ({
  kot,
  onStatusChange,
}) => {
  // Simulating live ticking preparation timer
  const [seconds, setSeconds] = useState(
    kot.status === 'Preparing' ? 322 : kot.status === 'Ready' ? 75 : 130
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isDelayWarning = seconds > 600; // > 10 mins

  return (
    <div
      className={`bg-white rounded-3xl border-2 shadow-sm flex flex-col justify-between overflow-hidden transition-all duration-200 ${
        isDelayWarning ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200'
      }`}
    >
      <div>
        {/* Header matching image #101 Table T2 2 mins ago */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-rose-600 tracking-tight">
              {kot.kotNumber}
            </span>
            <span className="font-extrabold text-sm text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
              Table {kot.tableNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{kot.createdAt}</span>
          </div>
        </div>

        {/* Priority & Station */}
        <div className="px-3.5 py-1.5 bg-slate-100/60 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <ChefHat className="w-3 h-3 text-slate-500" />
            {kot.station}
          </span>
          {kot.priority === 'VIP' ? (
            <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-1.5 py-0.5 rounded">
              VIP PRIORITY
            </span>
          ) : kot.priority === 'Rush' ? (
            <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-1.5 py-0.5 rounded animate-pulse">
              RUSH
            </span>
          ) : (
            <span className="text-slate-400 text-[10px] font-medium">Standard</span>
          )}
        </div>

        {/* Items List */}
        <div className="p-3.5 space-y-2">
          {kot.items.map((item, idx) => (
            <div key={idx} className="text-xs">
              <div className="flex items-baseline justify-between font-bold text-slate-900 text-sm">
                <span>
                  {item.quantity} x {item.name}
                </span>
              </div>
              {item.notes && (
                <span className="text-[11px] text-amber-700 font-semibold italic block pl-2">
                  • {item.notes}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer with Live Timer & Action */}
      <div className="p-3.5 bg-slate-50/90 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-mono font-black px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                isDelayWarning
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'bg-slate-800 text-emerald-400'
              }`}
            >
              <Clock className="w-3 h-3" />
              {formatTimer(seconds)}
            </span>
            {isDelayWarning && (
              <span title="Order overdue!">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </span>
            )}
          </div>

          <span
            className={`text-xs font-black px-2 py-0.5 rounded-md uppercase ${
              kot.status === 'Preparing'
                ? 'bg-orange-500 text-white'
                : kot.status === 'Ready'
                ? 'bg-purple-600 text-white'
                : kot.status === 'Served'
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {kot.status}
          </span>
        </div>

        {/* Action Button */}
        {onStatusChange && (
          <div>
            {kot.status === 'New' && (
              <button
                type="button"
                onClick={() => onStatusChange(kot.id, 'Preparing')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Preparing
              </button>
            )}

            {kot.status === 'Preparing' && (
              <button
                type="button"
                onClick={() => onStatusChange(kot.id, 'Ready')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                Mark Ready
              </button>
            )}

            {kot.status === 'Ready' && (
              <button
                type="button"
                onClick={() => onStatusChange(kot.id, 'Served')}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Served
              </button>
            )}

            {kot.status === 'Served' && (
              <div className="py-1.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg">
                Delivered to Steward
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
