'use client';

import React from 'react';
import {
  Activity,
  ChevronRight,
  Dumbbell,
  Waves,
  Utensils,
  Landmark,
  CircleDot,
} from 'lucide-react';
import { useClub } from '../../context/ClubContext';
import { FacilityOccupancyItem } from '../../types/club.types';

const facilityIcons: Record<string, React.ReactNode> = {
  tennis: (
    <span className="text-base select-none" role="img" aria-label="tennis">
      🎾
    </span>
  ),
  badminton: (
    <span className="text-base select-none" role="img" aria-label="badminton">
      🏸
    </span>
  ),
  pool: <Waves className="w-4 h-4 text-sky-600" />,
  gym: <Dumbbell className="w-4 h-4 text-emerald-600" />,
  restaurant: <Utensils className="w-4 h-4 text-orange-600" />,
  banquet: <Landmark className="w-4 h-4 text-indigo-600" />,
};

export const ClubOccupancyWidget: React.FC = () => {
  const { occupancies, setActiveNav } = useClub();

  const getProgressBarColor = (rate: number, category: string) => {
    if (category === 'banquet') return 'bg-amber-500';
    if (rate >= 90) return 'bg-emerald-500';
    if (rate >= 75) return 'bg-emerald-500';
    return 'bg-emerald-500';
  };

  const getPercentageColor = (rate: number, category: string) => {
    if (category === 'banquet') return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[500px] h-full overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 min-w-0">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
            Facility Occupancy (Today)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Real-time court, table and slot saturation
          </p>
        </div>
        <button
          onClick={() => setActiveNav('Facilities')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors flex-shrink-0 ml-2"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Facilities List */}
      <div className="divide-y divide-slate-100 py-1 flex-1 flex flex-col justify-around min-w-0">
        {occupancies.map((item: FacilityOccupancyItem) => {
          const icon = facilityIcons[item.category] || <Activity className="w-4 h-4 text-slate-600" />;
          const barColor = getProgressBarColor(item.occupancyRate, item.category);
          const percentColor = getPercentageColor(item.occupancyRate, item.category);

          return (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between gap-3 group hover:bg-slate-50/70 px-2 rounded-xl transition-colors min-w-0"
            >
              {/* Facility Name & Icon */}
              <div className="flex items-center gap-2.5 min-w-[130px] sm:min-w-[160px] flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-xs transition-all">
                  {icon}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">
                  {item.name}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 max-w-[100px] sm:max-w-[120px] mx-2 hidden sm:block">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${item.occupancyRate}%` }}
                  />
                </div>
              </div>

              {/* Occupancy % and Ratio */}
              <div className="flex items-center justify-end gap-2.5 sm:gap-3 flex-shrink-0">
                <span className={`text-xs sm:text-sm font-bold w-10 text-right ${percentColor}`}>
                  {item.occupancyRate}%
                </span>
                <span className="text-xs font-semibold text-slate-500 w-12 sm:w-14 text-right">
                  {item.currentOccupied}/{item.totalCapacity}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 min-w-0">
        <span className="flex items-center gap-1.5 truncate mr-2">
          <CircleDot className="w-3 h-3 text-emerald-500 animate-pulse flex-shrink-0" />
          Live occupancy updates
        </span>
        <button
          onClick={() => setActiveNav('Facilities')}
          className="font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex-shrink-0"
        >
          Manage Slots →
        </button>
      </div>
    </div>
  );
};
