'use client';

import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Utensils,
  Wine,
  Dumbbell,
  Waves,
  CalendarCheck,
} from 'lucide-react';
import { useClub } from '../../context/ClubContext';
import { TodayBookingItem } from '../../types/club.types';

const bookingIcons: Record<string, React.ReactNode> = {
  restaurant: <Utensils className="w-4 h-4 text-orange-600" />,
  bar: <Wine className="w-4 h-4 text-rose-600" />,
  tennis: (
    <span className="text-sm select-none" role="img" aria-label="tennis">
      🎾
    </span>
  ),
  badminton: (
    <span className="text-sm select-none" role="img" aria-label="badminton">
      🏸
    </span>
  ),
  gym: <Dumbbell className="w-4 h-4 text-emerald-600" />,
  pool: <Waves className="w-4 h-4 text-sky-600" />,
  events: <CalendarCheck className="w-4 h-4 text-purple-600" />,
};

export const ClubBookingTable: React.FC = () => {
  const { bookings, setActiveNav } = useClub();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[400px] h-full overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 min-w-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
            Today's Bookings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Confirmed court slots, tables and entries
          </p>
        </div>
        <button
          onClick={() => setActiveNav('Bookings')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors flex-shrink-0 ml-2"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bookings Table List */}
      <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[300px] pr-1 py-1">
        {bookings.map((booking: TodayBookingItem) => {
          const isUp = booking.growthDirection === 'up';
          return (
            <div
              key={booking.id}
              className="py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50/70 px-1 rounded-xl transition-colors min-w-0"
            >
              {/* Facility & Icon */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {bookingIcons[booking.category] || (
                    <CalendarCheck className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                  {booking.facility}
                </span>
              </div>

              {/* Booking Count */}
              <div className="w-10 text-right flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {booking.bookingCount}
                </span>
              </div>

              {/* Growth */}
              <div className="w-12 sm:w-14 flex items-center justify-end flex-shrink-0">
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] sm:text-xs font-bold ${
                    isUp ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isUp ? (
                    <ArrowUp className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <ArrowDown className="w-3 h-3 flex-shrink-0" />
                  )}
                  {booking.growth}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 min-w-0">
        <span className="truncate mr-2">No double-bookings detected</span>
        <button
          onClick={() => setActiveNav('Bookings')}
          className="font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex-shrink-0"
        >
          Calendar View →
        </button>
      </div>
    </div>
  );
};
