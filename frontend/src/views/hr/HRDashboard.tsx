'use client';

import React, { useState } from 'react';
import {
  UserCog,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Briefcase,
  Layers,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const HRDashboard: React.FC<{ activeTab?: string }> = ({ activeTab = 'ROSTER' }) => {
  const { user } = useAuth();

  const [workstationRoster] = useState([
    { id: 'WS-1', role: 'Shop Manager', station: 'Pro Shop & Inventory', staff: 'Vikram Mehta', shift: '08:00 AM - 04:00 PM', status: 'On Duty', gstin: '24AAACP1234M1Z5' },
    { id: 'WS-2', role: 'Bar Manager', station: 'Restaurant & Bar', staff: 'Manish Joshi', shift: '11:00 AM - 11:00 PM', status: 'On Duty', gstin: '24AAACP1234M1Z5' },
    { id: 'WS-3', role: 'Front Desk Lead', station: 'Walk-in & Court Reservations', staff: 'Sneha Vyas', shift: '07:00 AM - 03:00 PM', status: 'On Duty', gstin: '24AAACP1234M1Z5' },
    { id: 'WS-4', role: 'Accountant', station: 'Finance & Payments', staff: 'Pooja Agarwal', shift: '09:30 AM - 06:30 PM', status: 'On Duty', gstin: '24AAACP1234M1Z5' },
    { id: 'WS-5', role: 'Head Coach', station: 'Sports Academy & Coaching', staff: 'Coach Rajesh', shift: '06:00 AM - 12:00 PM', status: 'Break', gstin: '24AAACP1234M1Z5' },
    { id: 'WS-6', role: 'Lead Groundskeeper', station: 'Court Operations & Turf Maintenance', staff: 'Mohan Lal', shift: '06:00 AM - 02:00 PM', status: 'On Duty', gstin: '24AAACP1234M1Z5' },
  ]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Workstation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <UserCog className="w-5 h-5" />
            </div>
            <span className="text-xs font-black tracking-widest text-rose-400 uppercase">
              HR WORKSTATION · {user?.tenantName || 'Personnel Command'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Personnel & Workstation Operations Roster</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational shift rotations, workstation staff duty assignments, and statutory attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">HR Operator</span>
            <span className="text-xs font-bold text-white">{user?.name || 'HR Staff'}</span>
          </div>
          <button className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition flex items-center gap-2 shadow-lg shadow-rose-500/20 cursor-pointer">
            <Download size={16} />
            <span>Export Shift Roster</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Active Workstations</span>
            <Layers size={18} className="text-rose-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">6 Active</div>
          <span className="text-xs text-rose-400 font-semibold mt-1 block">100% Station Coverage</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>On-Duty Staff</span>
            <Users size={18} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">5 On Duty</div>
          <span className="text-xs text-emerald-400 font-semibold mt-1 block">1 on Scheduled Break</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Today's Shift Hours</span>
            <Clock size={18} className="text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">48 Hrs</div>
          <span className="text-xs text-blue-400 font-semibold mt-1 block">All Stations Staffed</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Statutory Compliance</span>
            <ShieldCheck size={18} className="text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">100%</div>
          <span className="text-xs text-purple-400 font-semibold mt-1 block">Biometric & GPS Synced</span>
        </div>
      </div>

      {/* Workstation Roster Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>Today's Live Station Deployment</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Staff assigned to physical terminal workstations</p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
            Shift A (Morning)
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
                <th className="py-3 px-4">Station Role</th>
                <th className="py-3 px-4">Assigned Personnel</th>
                <th className="py-3 px-4">Workstation Module</th>
                <th className="py-3 px-4">Current Shift</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Tax Audit Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {workstationRoster.map((r) => (
                <tr key={r.id} className="hover:bg-slate-950/40 transition">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    {r.role}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{r.staff}</td>
                  <td className="py-3.5 px-4 text-slate-400">{r.station}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{r.shift}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.status === 'On Duty' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500">{r.gstin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
