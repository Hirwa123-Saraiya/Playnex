'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Clock3, Loader2, RefreshCw } from 'lucide-react';
import { frontDeskService, type FrontDeskBooking, type FrontDeskCourt } from '@/services/frontDesk.service';

const TODAY = new Date().toISOString().slice(0, 10);
const TIME_SLOTS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

function toMins(t: string) { const [h, m] = t.slice(0,5).split(':').map(Number); return h * 60 + m; }
function isActive(b: FrontDeskBooking, slot: string) {
  return toMins(slot) >= toMins(b.startTime) && toMins(slot) < toMins(b.endTime);
}

const STATUS_COLORS: Record<string, string> = {
  booked:    'bg-blue-500/80 text-white',
  checked_in:'bg-emerald-500/80 text-white',
  completed: 'bg-slate-400/80 text-white',
  cancelled: 'bg-rose-400/50 text-white line-through',
};

export default function FrontDeskTimelineView() {
  const [courts, setCourts] = useState<FrontDeskCourt[]>([]);
  const [bookings, setBookings] = useState<FrontDeskBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(TODAY);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, b] = await Promise.all([
        frontDeskService.getCourts(),
        frontDeskService.getTimeline(selectedDate),
      ]);
      setCourts(c);
      setBookings(b);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Court Timeline</h2>
          <p className="text-xs text-slate-500">Real-time occupancy view for {selectedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          <button onClick={load} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : courts.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Clock3 size={40} className="opacity-30" />
          <p className="text-sm font-semibold">No courts configured yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="min-w-max w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="sticky left-0 bg-white px-4 py-3 text-left font-bold text-slate-700 min-w-[140px] border-r border-slate-100">Court</th>
                {TIME_SLOTS.map(s => (
                  <th key={s} className="px-3 py-3 text-center font-semibold text-slate-500 min-w-[80px]">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courts.map((court, i) => {
                const courtBookings = bookings.filter(b => b.courtId === court.id);
                return (
                  <tr key={court.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="sticky left-0 bg-inherit px-4 py-3 font-bold text-slate-800 border-r border-slate-100">
                      <p>{court.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{court.sport}</p>
                    </td>
                    {TIME_SLOTS.map(slot => {
                      const booking = courtBookings.find(b => isActive(b, slot));
                      return (
                        <td key={slot} className="px-1 py-1.5 text-center">
                          {booking ? (
                            <div className={`rounded-lg px-2 py-1.5 text-[10px] font-bold truncate max-w-[76px] mx-auto ${STATUS_COLORS[booking.status] || STATUS_COLORS.booked}`}>
                              {booking.memberName || booking.guestName || (booking.type === 'GUEST' ? 'Walk-In' : 'Booked')}
                            </div>
                          ) : (
                            <div className="h-7 rounded-lg border border-dashed border-slate-200 bg-emerald-50/30" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[11px] font-semibold">
        {[['bg-blue-500','Booked'],['bg-emerald-500','Checked In'],['bg-slate-400','Completed'],['bg-rose-400','Cancelled']].map(([color, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${color}`} />{label}
          </span>
        ))}
      </div>
    </div>
  );
}
