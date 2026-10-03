import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserEventDetails: React.FC = () => {
  const { events, selectedEventId, registerForEvent, setActiveView } = useUserStore();

  const event = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <button
        onClick={() => setActiveView('events')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[320px] flex flex-col justify-end p-6 sm:p-8 shadow-2xl">
        <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-600 text-white uppercase tracking-wider">
            {event.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{event.title}</h1>
          <div className="flex items-center gap-2 text-xs text-blue-200">
            <MapPin className="w-3.5 h-3.5" />
            <span>{event.clubName} • {event.clubCity}</span>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Event Overview</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{event.description}</p>

            {/* Schedule Timeline */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Event Itinerary</h4>
              <div className="space-y-2">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 text-xs">
                    <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">{item.time}</span>
                      <p className="text-slate-600 mt-0.5">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prizes if any */}
            {event.prizes && event.prizes.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Prizes & Accolades</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {event.prizes.map((pz, idx) => (
                    <div key={idx} className="p-3 bg-amber-50 border border-amber-200 rounded-xl font-semibold text-amber-900">
                      {pz}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Registration Fee</span>
            <div className="text-3xl font-black text-slate-900">
              {event.price === 0 ? 'Free' : `₹${event.price}`}
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Date</span>
              <span className="font-bold text-slate-900">{event.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time</span>
              <span className="font-bold text-slate-900">{event.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Spots Remaining</span>
              <span className="font-bold text-amber-600">{event.spotsLeft} of {event.spotsTotal}</span>
            </div>
          </div>

          <button
            onClick={() => registerForEvent(event.id)}
            disabled={event.isRegistered || event.spotsLeft === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              event.isRegistered
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
            }`}
          >
            {event.isRegistered ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You are Registered</span>
              </>
            ) : (
              <>
                <span>Register & Confirm Spot</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
