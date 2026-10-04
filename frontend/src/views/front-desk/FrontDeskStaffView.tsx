'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Users, Loader2, RefreshCw, Circle } from 'lucide-react';
import { frontDeskService, type FrontDeskStaff } from '@/services/frontDesk.service';

const TODAY = new Date().toISOString().slice(0, 10);
const ROLE_COLOR: Record<string, string> = {
  'FRONT DESK': 'bg-blue-100 text-blue-700',
  'COACH':      'bg-purple-100 text-purple-700',
  'CLEANER':    'bg-amber-100 text-amber-700',
};

export default function FrontDeskStaffView() {
  const [staff, setStaff] = useState<FrontDeskStaff[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await frontDeskService.getStaff(TODAY);
      setStaff(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const active = staff.filter(s => s.active);
  const inactive = staff.filter(s => !s.active);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Duty Staff Roster</h2>
          <p className="text-xs text-slate-500">Today's on-duty and scheduled personnel</p>
        </div>
        <button onClick={load} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-xs text-emerald-600 font-semibold">On Duty</p>
          <p className="text-3xl font-black text-emerald-700 mt-1">{active.length}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <p className="text-xs text-slate-500 font-semibold">Off Shift</p>
          <p className="text-3xl font-black text-slate-600 mt-1">{inactive.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div>
      ) : staff.length === 0 ? (
        <div className="h-40 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 text-slate-400 gap-2">
          <Users size={36} className="opacity-30" />
          <p className="text-sm">No staff roster for today</p>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-sm font-black text-slate-700 mb-3">On Duty Now</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {active.map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {s.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-sm truncate">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.start} – {s.end}</p>
                    <span className={`text-[10px] font-bold px-2 py-px rounded-full mt-1 inline-block ${ROLE_COLOR[s.role] || 'bg-slate-100 text-slate-600'}`}>{s.role}</span>
                  </div>
                  <Circle size={10} className="fill-emerald-500 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {inactive.length > 0 && (
            <div>
              <h3 className="text-sm font-black text-slate-500 mb-3">Off Shift</h3>
              <div className="grid gap-3 sm:grid-cols-2 opacity-60">
                {inactive.map(s => (
                  <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {s.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-600 text-sm truncate">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.start} – {s.end}</p>
                      <span className="text-[10px] font-bold px-2 py-px rounded-full mt-1 inline-block bg-slate-100 text-slate-500">{s.role}</span>
                    </div>
                    <Circle size={10} className="fill-slate-300 text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
