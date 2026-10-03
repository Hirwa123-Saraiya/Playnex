'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Layers,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const FacilityOpsDashboard: React.FC<{ activeTab?: string }> = ({ activeTab = 'COURTS' }) => {
  const { user } = useAuth();

  const [courts, setCourts] = useState([
    { id: 'C1', name: 'Badminton Court 01', sport: 'Badminton', surface: 'Teakwood Cushioned', lux: 580, netTension: 'Optimal (10.2 kg)', status: 'OPERATIONAL' },
    { id: 'C2', name: 'Badminton Court 02', sport: 'Badminton', surface: 'Synthetic BWF Mat', lux: 590, netTension: 'Optimal (10.1 kg)', status: 'OPERATIONAL' },
    { id: 'C3', name: 'Tennis Court 01', sport: 'Tennis', surface: 'DecoTurf Hard Court', lux: 720, netTension: 'Optimal (21 kg)', status: 'OPERATIONAL' },
    { id: 'C4', name: 'Squash Court 01', sport: 'Squash', surface: 'Maple Wood Glassback', lux: 510, netTension: 'N/A', status: 'MAINTENANCE_DUE' },
  ]);

  const toggleCourtStatus = (id: string) => {
    setCourts((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'OPERATIONAL' ? 'LOCKED_FOR_MAINTENANCE' : 'OPERATIONAL' }
          : c
      )
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xs font-black tracking-widest text-teal-400 uppercase">
              FACILITY & GROUNDS WORKSTATION · {user?.tenantName || 'Court Ops'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Court Surface Health & Maintenance Matrix</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Instant lock/unlock court availability, net tension checks, lighting lux audits, and surface recoating logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Duty Operator</span>
            <span className="text-xs font-bold text-white">{user?.name || 'Lead Groundskeeper'}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Operational Courts</span>
            <Layers size={18} className="text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {courts.filter((c) => c.status === 'OPERATIONAL').length} / {courts.length}
          </div>
          <span className="text-xs text-teal-400 font-semibold mt-1 block">Live Court Matrix</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Surface Health</span>
            <Activity size={18} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">98.5%</div>
          <span className="text-xs text-emerald-400 font-semibold mt-1 block">BWF & ITF Certified</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Avg Floodlight Lux</span>
            <Zap size={18} className="text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">650 Lux</div>
          <span className="text-xs text-amber-400 font-semibold mt-1 block">Tournament Standard</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Pending Repairs</span>
            <Sliders size={18} className="text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">1 Ticket</div>
          <span className="text-xs text-purple-400 font-semibold mt-1 block">Squash Glassback Check</span>
        </div>
      </div>

      {/* Courts Matrix Grid */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Court Availability & Lock Controls</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Toggle lock status to prevent booking during maintenance</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {courts.map((court) => (
            <div key={court.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">{court.sport}</span>
                  <h3 className="text-base font-black text-white mt-0.5">{court.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">Surface: {court.surface}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                  court.status === 'OPERATIONAL'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {court.status === 'OPERATIONAL' ? 'Available for Play' : 'Maintenance Lock'}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Lighting: <strong className="text-white">{court.lux} Lux</strong></span>
                <span>Net: <strong className="text-white">{court.netTension}</strong></span>
                <button
                  onClick={() => toggleCourtStatus(court.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    court.status === 'OPERATIONAL'
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {court.status === 'OPERATIONAL' ? (
                    <>
                      <Lock size={13} />
                      <span>Lock Court</span>
                    </>
                  ) : (
                    <>
                      <Unlock size={13} />
                      <span>Unlock Court</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
