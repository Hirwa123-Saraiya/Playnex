'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { UserCheck, Search, CheckCircle2, XCircle, Loader2, Clock3 } from 'lucide-react';
import { frontDeskService, type FrontDeskBooking } from '@/services/frontDesk.service';

const TODAY = new Date().toISOString().slice(0, 10);

const STATUS_BADGE: Record<string, string> = {
  confirmed:  'bg-blue-100 text-blue-700',
  checked_in: 'bg-emerald-100 text-emerald-700',
  completed:  'bg-slate-100 text-slate-600',
  cancelled:  'bg-rose-100 text-rose-700',
};

export default function FrontDeskCheckinView() {
  const [bookings, setBookings] = useState<FrontDeskBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await frontDeskService.getTimeline(TODAY);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = bookings.filter(b => {
    const q = query.toLowerCase();
    return !q ||
      (b.memberName || b.guestName || b.customer || '').toLowerCase().includes(q) ||
      (b.courtName || '').toLowerCase().includes(q);
  });

  const confirmed = filtered.filter(b => b.status === 'confirmed');
  const checkedIn = filtered.filter(b => b.status === 'checked_in');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Player Check-In</h2>
          <p className="text-xs text-slate-500">Today's bookings — mark arrivals in real time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search member or court…"
              className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 w-56" />
          </div>
          <button onClick={load} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition">
            <Loader2 size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Awaiting',   count: confirmed.length,                          color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
          { label: 'Checked In', count: checkedIn.length,                          color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Completed',  count: bookings.filter(b=>b.status==='completed').length, color: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200' },
          { label: 'Cancelled',  count: bookings.filter(b=>b.status==='cancelled').length, color: 'text-rose-700',    bg: 'bg-rose-50 border-rose-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Awaiting check-in */}
      <div>
        <h3 className="text-sm font-black text-slate-700 mb-3">Awaiting Arrival</h3>
        {loading ? (
          <div className="h-32 flex items-center justify-center"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div>
        ) : confirmed.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 text-slate-400 gap-2">
            <UserCheck size={32} className="opacity-30" />
            <p className="text-sm">No pending arrivals</p>
          </div>
        ) : (
          <div className="space-y-2">
            {confirmed.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {(b.memberName || b.guestName || b.customer || 'G')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{b.memberName || b.guestName || b.customer}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock3 size={11} />{b.startTime?.slice(0,5)} – {b.endTime?.slice(0,5)} · {b.courtName || b.courtId}
                      {b.type === 'GUEST' && <span className="ml-1 px-1 py-px rounded bg-amber-100 text-amber-700 text-[9px] font-bold">WALK-IN</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_BADGE[b.status]}`}>
                    {b.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition">
                    <CheckCircle2 size={13} /> Check In
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Already checked in */}
      {checkedIn.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-slate-700 mb-3">Currently On Court</h3>
          <div className="space-y-2">
            {checkedIn.map(b => (
              <div key={b.id} className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {(b.memberName || b.guestName || b.customer || 'G')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{b.memberName || b.guestName || b.customer}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock3 size={11} />{b.startTime?.slice(0,5)} – {b.endTime?.slice(0,5)} · {b.courtName || b.courtId}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                  <CheckCircle2 size={11} /> CHECKED IN
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
