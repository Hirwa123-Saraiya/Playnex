import React from 'react';
import { Users, Clock, Receipt, UserCheck } from 'lucide-react';
import { BarKitchenTable, TableStatus } from '../../types/BarKitchenTypes';

interface BarKitchenTableCardProps {
  table: BarKitchenTable;
  isSelected?: boolean;
  onClick?: () => void;
  onStatusChange?: (status: TableStatus) => void;
}

export const BarKitchenTableCard: React.FC<BarKitchenTableCardProps> = ({
  table,
  isSelected = false,
  onClick,
}) => {
  // Color configuration strictly matching prompt specifications:
  // Green = Available, Red = Occupied, Yellow = Reserved, etc.
  const getStatusStyles = (status: TableStatus) => {
    switch (status) {
      case 'Available':
        return {
          badgeBg: 'bg-emerald-500 text-white',
          border: 'border-emerald-200 hover:border-emerald-400',
          indicator: 'bg-emerald-500 ring-emerald-200',
          glow: 'hover:shadow-emerald-100',
        };
      case 'Occupied':
        return {
          badgeBg: 'bg-red-500 text-white',
          border: 'border-red-200 hover:border-red-400',
          indicator: 'bg-red-500 ring-red-200',
          glow: 'hover:shadow-red-100',
        };
      case 'Reserved':
        return {
          badgeBg: 'bg-amber-400 text-slate-900 font-bold',
          border: 'border-amber-300 hover:border-amber-400',
          indicator: 'bg-amber-400 ring-amber-200',
          glow: 'hover:shadow-amber-100',
        };
      case 'Cleaning':
        return {
          badgeBg: 'bg-sky-500 text-white',
          border: 'border-sky-200 hover:border-sky-400',
          indicator: 'bg-sky-500 ring-sky-200',
          glow: 'hover:shadow-sky-100',
        };
      case 'Out Of Service':
      default:
        return {
          badgeBg: 'bg-slate-400 text-white',
          border: 'border-slate-200 hover:border-slate-400',
          indicator: 'bg-slate-400 ring-slate-200',
          glow: 'hover:shadow-slate-100',
        };
    }
  };

  const style = getStatusStyles(table.status);

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl border-2 p-3.5 shadow-xs transition-all duration-200 cursor-pointer select-none flex flex-col justify-between min-h-[145px] ${
        style.border
      } ${style.glow} ${
        isSelected ? 'ring-2 ring-blue-600 ring-offset-2 scale-[1.02] shadow-md' : ''
      }`}
    >
      {/* Top row: Table No & Seats */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ring-4 ${style.indicator}`}
            />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {table.tableNumber}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
            <Users className="w-3 h-3 text-slate-500" />
            <span>{table.seats} Seats</span>
          </div>
        </div>

        {/* Area tag & Status pill */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${style.badgeBg}`}>
            {table.status}
          </span>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">
            {table.area}
          </span>
        </div>
      </div>

      {/* Middle/Bottom contextual metadata */}
      <div className="mt-3 pt-2 border-t border-slate-100 text-xs space-y-1">
        {table.status === 'Occupied' && (
          <>
            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-slate-400" />
                {table.occupiedSince || 'Active'}
              </span>
              <span className="flex items-center gap-0.5 text-xs font-bold text-red-600">
                <Receipt className="w-3 h-3" />
                ₹{table.activeBillAmount || 0}
              </span>
            </div>
            {table.stewardName && (
              <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                <UserCheck className="w-3 h-3 text-blue-500" />
                <span>{table.stewardName}</span>
              </div>
            )}
          </>
        )}

        {table.status === 'Reserved' && (
          <div className="text-[11px] text-amber-900 font-medium truncate">
            <span className="font-bold">{table.reservedFor || 'Reserved'}</span>
            {table.reservationTime && (
              <span className="block text-[10px] text-amber-700">@ {table.reservationTime}</span>
            )}
          </div>
        )}

        {table.status === 'Available' && (
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-between">
            <span>Ready for guest</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
              Tap to POS
            </span>
          </div>
        )}

        {table.status === 'Cleaning' && (
          <div className="text-[11px] text-sky-700 font-medium">
            <span>Table sanitization in progress</span>
          </div>
        )}
      </div>
    </div>
  );
};
