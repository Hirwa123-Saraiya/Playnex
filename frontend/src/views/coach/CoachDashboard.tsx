'use client';

import React, { useState } from 'react';
import {
  Trophy,
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  Award,
  ChevronRight,
  Plus,
  Play,
  Star,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const CoachDashboard: React.FC<{ activeTab?: string }> = ({ activeTab = 'CALENDAR' }) => {
  const { user } = useAuth();

  const [sessions, setSessions] = useState([
    { id: 'S1', title: 'Advanced Badminton Footwork & Smashes', time: '09:00 AM - 10:30 AM', court: 'Court 1 (Indoor Arena)', trainees: 6, max: 8, status: 'In Progress', tier: 'Junior Elite' },
    { id: 'S2', title: 'Tennis Serve & Volley Intensive', time: '11:00 AM - 12:30 PM', court: 'Tennis Court 2', trainees: 4, max: 6, status: 'Upcoming', tier: 'Senior Amateur' },
    { id: 'S3', title: 'Private 1-on-1 Stroke Correction', time: '03:00 PM - 04:00 PM', court: 'Squash Court 1', trainees: 1, max: 1, status: 'Confirmed', tier: 'Pro Player' },
    { id: 'S4', title: 'Evening Junior Academy Batch B', time: '05:00 PM - 06:30 PM', court: 'Court 3 & 4', trainees: 12, max: 12, status: 'Fully Booked', tier: 'U-16 Academy' },
  ]);

  const [trainees] = useState([
    { id: 'TR-1', name: 'Aarav Sharma', age: 14, sport: 'Badminton', rating: '8.4 / 10', attendance: '96%', level: 'State U-15 Candidate' },
    { id: 'TR-2', name: 'Riya Patel', age: 16, sport: 'Tennis', rating: '9.1 / 10', attendance: '100%', level: 'District Seed #2' },
    { id: 'TR-3', name: 'Dev Joshi', age: 12, sport: 'Badminton', rating: '7.8 / 10', attendance: '92%', level: 'Academy Foundation' },
    { id: 'TR-4', name: 'Ananya Roy', age: 15, sport: 'Squash', rating: '8.9 / 10', attendance: '95%', level: 'National Junior Circuit' },
  ]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Workstation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
              COACHING WORKSTATION · {user?.tenantName || 'Sports Academy'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Head Coach Command & Session Roster</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time batch allocations, court schedules, skill assessments, and trainee attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Coach</span>
            <span className="text-xs font-bold text-white">{user?.name || 'Head Coach'}</span>
          </div>
          <button className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer">
            <Plus size={16} />
            <span>Create Batch Slot</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Today's Sessions</span>
            <CalendarDays size={18} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">4 Slots</div>
          <span className="text-xs text-emerald-400 font-semibold mt-1 block">5.5 Hours On Court</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Enrolled Trainees</span>
            <Users size={18} className="text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">28 Players</div>
          <span className="text-xs text-blue-400 font-semibold mt-1 block">4 Active Batches</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Avg Attendance</span>
            <TrendingUp size={18} className="text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">95.8%</div>
          <span className="text-xs text-amber-400 font-semibold mt-1 block">Monthly Academy High</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Tournament Podiums</span>
            <Award size={18} className="text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">6 Medals</div>
          <span className="text-xs text-purple-400 font-semibold mt-1 block">Season 2026</span>
        </div>
      </div>

      {/* Main Sessions Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Today's Court Training Schedule</span>
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Live Timeline
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">{s.time}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                          {s.tier}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">{s.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <MapPin size={13} className="text-slate-400" />
                        {s.court} · {s.trainees}/{s.max} Players
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        s.status === 'In Progress' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.status}
                      </span>
                      <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition">
                        View Drills
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Trainees Roster */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Featured Trainees</span>
              </h2>
              <span className="text-xs text-slate-400">Junior Squad</span>
            </div>

            <div className="mt-4 space-y-3">
              {trainees.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.name}</h4>
                      <p className="text-[11px] text-slate-500">{t.level} · Age {t.age}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400 block">{t.rating}</span>
                      <span className="text-[10px] text-slate-400">{t.attendance} Att.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
