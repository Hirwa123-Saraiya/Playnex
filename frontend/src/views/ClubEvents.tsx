'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Plus,
  Tag,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const ClubEvents: React.FC = () => {
  const { selectedBranch, upcomingEvents, setActiveModal } = useClub();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Events & Tournaments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Championships, weekend social mixers and banquets at{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <button
          onClick={() => setActiveModal('create-event')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                <img
                  src={evt.imageUrl}
                  alt={evt.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-900 shadow-sm">
                    {evt.status}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {evt.name}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.formattedDate}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {evt.registeredCount} / {evt.capacity} Participants Registered
                    </span>
                  </p>
                </div>

                {/* Registration saturation bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{
                      width: `${(evt.registeredCount / evt.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">Draws & Brackets Ready</span>
              <button
                onClick={() => setActiveModal(`event-detail-${evt.id}`)}
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Manage Registrations →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
