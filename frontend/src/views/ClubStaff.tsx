'use client';

import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  Phone,
  Mail,
  Clock,
  MoreVertical,
} from 'lucide-react';

export const ClubStaff: React.FC = () => {
  const { selectedBranch } = useClub();
  const [searchTerm, setSearchTerm] = useState('');

  const staffMembers = [
    {
      id: 'STF-01',
      name: 'Coach Anand Iyer',
      role: 'Head Tennis Coach & Academy Director',
      dept: 'Racquet Sports',
      shift: '06:00 AM - 12:00 PM / 04:00 PM - 08:00 PM',
      phone: '+91 98250 99881',
      email: 'anand.coach@playnex.club',
      status: 'On Duty',
    },
    {
      id: 'STF-02',
      name: 'Chef Manish Joshi',
      role: 'Executive Chef',
      dept: 'Food & Beverage',
      shift: '11:00 AM - 11:00 PM',
      phone: '+91 98250 66772',
      email: 'chef.manish@playnex.club',
      status: 'On Duty',
    },
    {
      id: 'STF-03',
      name: 'Sneha Vyas',
      role: 'Front Desk Lead Concierge',
      dept: 'Front Desk & Guest Services',
      shift: '08:00 AM - 04:00 PM',
      phone: '+91 97240 33441',
      email: 'sneha.v@playnex.club',
      status: 'On Duty',
    },
    {
      id: 'STF-04',
      name: 'Rajesh Parmar',
      role: 'Chief Facility Engineer & Court Curator',
      dept: 'Facilities & Maintenance',
      shift: '06:00 AM - 02:00 PM',
      phone: '+91 98240 22119',
      email: 'rajesh.p@playnex.club',
      status: 'On Break',
    },
    {
      id: 'STF-05',
      name: 'Vikram Singh',
      role: 'Senior Lifeguard (Red Cross Certified)',
      dept: 'Aquatics & Swimming Pool',
      shift: '06:00 AM - 02:00 PM',
      phone: '+91 99090 88221',
      email: 'vikram.pool@playnex.club',
      status: 'On Duty',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Staff & Workforce Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Shift scheduling, coach rosters and department personnel at{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto">
          <UserPlus className="w-4 h-4" />
          Onboard Staff Member
        </button>
      </div>

      {/* TanStack-like Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Staff ID</th>
                <th className="px-4 py-3">Staff Name</th>
                <th className="px-4 py-3">Designation & Dept</th>
                <th className="px-4 py-3">Shift Timing</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Duty Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {staffMembers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{s.id}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{s.role}</p>
                    <span className="text-[10px] text-slate-400">{s.dept}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.shift}</td>
                  <td className="px-4 py-3">
                    <p className="text-slate-800">{s.phone}</p>
                    <span className="text-[10px] text-slate-400">{s.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'On Duty'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
