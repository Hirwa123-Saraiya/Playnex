import React from 'react';
import { Calendar, Clock, MapPin, Trophy, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { ClubEvent } from '../../types/user.types';
import { useUserStore } from '../../store/userStore';

interface UserEventCardProps {
  event: ClubEvent;
}

export const UserEventCard: React.FC<UserEventCardProps> = ({ event }) => {
  const { navigateToEventDetails, registerForEvent } = useUserStore();

  const getCategoryColor = () => {
    switch (event.category) {
      case 'Tournament':
        return 'bg-amber-500/90 text-white';
      case 'Fitness':
        return 'bg-emerald-600/90 text-white';
      case 'Social':
        return 'bg-purple-600/90 text-white';
      default:
        return 'bg-blue-600/90 text-white';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
      {/* Event Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />

        {/* Category Badge */}
        <div className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-md ${getCategoryColor()}`}>
          {event.category}
        </div>

        {/* Registration Status */}
        {event.isRegistered && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
            <CheckCircle2 className="w-3 h-3" />
            <span>Registered</span>
          </div>
        )}

        {/* Club & City overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-xs text-blue-200 font-semibold drop-shadow">
            <MapPin className="w-3.5 h-3.5" />
            <span>{event.clubName} • {event.clubCity}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h4
            onClick={() => navigateToEventDetails(event.id)}
            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
          >
            {event.title}
          </h4>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800">{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
          </div>

          {/* Spots Indicator */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Availability</span>
              <span className="font-bold text-amber-600">{event.spotsLeft} spots left</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${Math.round(((event.spotsTotal - event.spotsLeft) / event.spotsTotal) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer: Price & Register CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Entry Fee</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-extrabold text-slate-900">
                {event.price === 0 ? 'Free' : `₹${event.price}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigateToEventDetails(event.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Schedule
            </button>
            <button
              onClick={() => registerForEvent(event.id)}
              disabled={event.isRegistered || event.spotsLeft === 0}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 ${
                event.isRegistered
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              <span>{event.isRegistered ? 'Confirmed' : 'Register'}</span>
              {!event.isRegistered && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
