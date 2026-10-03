'use client';

import React from 'react';
import { Calendar, MapPin, ChevronRight, Trophy } from 'lucide-react';
import { useClub } from '../../context/ClubContext';
import { UpcomingEventItem } from '../../types/club.types';

export const ClubEventsWidget: React.FC = () => {
  const { upcomingEvents, setActiveNav, setActiveModal } = useClub();

  const getStatusBadge = (status: UpcomingEventItem['status']) => {
    switch (status) {
      case 'Registrations Open':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Invites Sent':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Planning':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[420px] h-full overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 min-w-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 tracking-tight truncate">
            Upcoming Events
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Tournaments, galas & sessions
          </p>
        </div>
        <button
          onClick={() => setActiveNav('Events & Tournaments')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors flex-shrink-0 ml-2"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3 py-2 flex-1 flex flex-col justify-around min-w-0">
        {upcomingEvents.map((evt) => {
          return (
            <div
              key={evt.id}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all flex items-center justify-between gap-2.5 group min-w-0"
            >
              {/* Event Image Banner & Info */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800 relative">
                  <img
                    src={evt.imageUrl}
                    alt={evt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-1">
                    <Trophy className="w-3 h-3 text-white/80" />
                  </div>
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 break-words">
                    {evt.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-500 min-w-0">
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      {evt.formattedDate}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      {evt.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge & Action Button */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-lg border whitespace-nowrap hidden sm:inline-block ${getStatusBadge(
                    evt.status
                  )}`}
                >
                  {evt.status}
                </span>

                <button
                  onClick={() => setActiveModal(`event-detail-${evt.id}`)}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 flex-shrink-0"
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 min-w-0">
        <span className="truncate mr-2">3 events scheduled for Q4</span>
        <button
          onClick={() => setActiveModal('create-event')}
          className="font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex-shrink-0"
        >
          + Host Tournament
        </button>
      </div>
    </div>
  );
};
