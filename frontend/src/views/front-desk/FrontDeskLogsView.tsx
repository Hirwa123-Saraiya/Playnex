'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FileSpreadsheet, Loader2, RefreshCw, Clock3, User, MapPin } from 'lucide-react';
import { frontDeskService, type FrontDeskBooking } from '@/services/frontDesk.service';

const TODAY = new Date().toISOString().slice(0, 10);
const STATUS_COLOR: Record<string, string> = {
  confirmed:  'bg-blue-100 text-blue-700',
  checked_in: 'bg-emerald-100 text-emerald-700',
  completed:  'bg-slate-100 text-slate-600',
  cancelled:  'bg-rose-100 text-rose-700',
};

export default function FrontDeskLogsView() {
  const [logs, setLogs] = useState<FrontDeskBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(TODAY);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await frontDeskService.getTimeline(date);
      setLogs(data);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const revenue = logs.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Daily Shift Audit</h2>
          <p className="text-xs text-slate-500">Full booking log for the selected date</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
          <button onClick={load} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Bookings', value: logs.length, color: 'text-slate-800' },
          { label: 'Completed',      value: logs.filter(b => b.status === 'completed').length, color: 'text-emerald-700' },
          { label: 'Walk-Ins',       value: logs.filter(b => b.type === 'GUEST').length, color: 'text-amber-700' },
          { label: 'Revenue',        value: `₹${revenue.toLocaleString('en-IN')}`, color: 'text-blue-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Log table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <FileSpreadsheet size={16} className="text-slate-400" />
          <p className="text-sm font-bold text-slate-700">Booking Log</p>
          <span className="ml-auto text-xs text-slate-400">{logs.length} entries</span>
        </div>

        {loading ? (
          <div className="h-40 flex items-center justify-center"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div>
        ) : logs.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-slate-400 gap-2">
            <FileSpreadsheet size={32} className="opacity-30" />
            <p className="text-sm">No bookings for {date}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Time', 'Customer', 'Court', 'Type', 'Status', 'Amount'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">
                      <span className="flex items-center gap-1"><Clock3 size={11} className="text-slate-400" />{b.startTime?.slice(0,5)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800 flex items-center gap-1"><User size={11} className="text-slate-400" />{b.memberName || b.guestName || b.customer}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-slate-600"><MapPin size={11} className="text-slate-400" />{b.courtName || b.courtId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${b.type === 'GUEST' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {b.type === 'GUEST' ? 'WALK-IN' : 'MEMBER'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${STATUS_COLOR[b.status]}`}>
                        {b.status.replace('_',' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {b.amount ? `₹${b.amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
