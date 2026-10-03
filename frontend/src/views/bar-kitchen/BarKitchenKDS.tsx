import React, { useState } from 'react';
import {
  Flame,
  Clock,
  ChefHat,
  Filter,
  CheckCircle2,
  Volume2,
  Sparkles,
  Maximize2,
  SlidersHorizontal,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenKDSCard } from '../../components/bar-kitchen/BarKitchenKDSCard';
import { KitchenStation, KOTStatus } from '../../types/BarKitchenTypes';

export const BarKitchenKDS: React.FC = () => {
  const { kots, updateKOTStatus, kdsFilterStation, setKdsFilterStation } =
    useBarKitchenStore();

  const stations: (KitchenStation | 'All Stations')[] = [
    'All Stations',
    'Grill Station',
    'Pizza Station',
    'Main Course Station',
    'Snacks Station',
    'Beverage Station',
    'Dessert Station',
    'Bar Station',
  ];

  const filteredKOTs = kots.filter((k) => {
    if (kdsFilterStation === 'All Stations') return true;
    return k.station === kdsFilterStation;
  });

  const columns: { status: KOTStatus; title: string; headerColor: string }[] = [
    { status: 'New', title: 'New Orders', headerColor: 'border-blue-500 text-blue-700 bg-blue-50/70' },
    { status: 'Preparing', title: 'Preparing', headerColor: 'border-orange-500 text-orange-700 bg-orange-50/70' },
    { status: 'Ready', title: 'Ready for Pickup', headerColor: 'border-purple-500 text-purple-700 bg-purple-50/70' },
    { status: 'Served', title: 'Served / Dispatched', headerColor: 'border-emerald-500 text-emerald-700 bg-emerald-50/70' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* KDS Header matching Panel 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
              KDS Station Monitor
            </span>
            <span className="text-xs text-slate-400">• High Performance Touch Display</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Kitchen Display System (KDS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time multi-column order routing with live elapsed time counters, rush badges, and station dispatch.
          </p>
        </div>

        {/* Station Filter Dropdown & Sound Alert */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-2xl shadow-2xs">
            <ChefHat className="w-4 h-4 text-slate-500" />
            <select
              value={kdsFilterStation}
              onChange={(e) => setKdsFilterStation(e.target.value as any)}
              className="text-xs font-extrabold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {stations.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div
            className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center cursor-pointer shadow-2xs"
            title="Audio notification enabled for new tickets"
          >
            <Volume2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 4 Kanban Columns matching Reference Image Panel 5:
          New (2) | Preparing (1) | Ready (1) | Served (0) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map(({ status, title, headerColor }) => {
          const colItems = filteredKOTs.filter((k) => k.status === status);
          return (
            <div
              key={status}
              className="bg-slate-100/70 rounded-3xl border border-slate-200/80 p-3.5 space-y-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div
                className={`p-3 rounded-2xl border-l-4 font-black text-xs flex items-center justify-between shadow-2xs ${headerColor}`}
              >
                <span>{title}</span>
                <span className="w-6 h-6 rounded-full bg-white/90 text-slate-900 flex items-center justify-center text-xs font-black shadow-2xs">
                  {colItems.length}
                </span>
              </div>

              {/* Cards in column */}
              <div className="space-y-3">
                {colItems.map((kot) => (
                  <BarKitchenKDSCard
                    key={kot.id}
                    kot={kot}
                    onStatusChange={updateKOTStatus}
                  />
                ))}

                {colItems.length === 0 && (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-xs font-semibold">No orders {status.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
