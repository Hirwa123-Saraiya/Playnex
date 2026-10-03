'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import {
  Layers,
  Users,
  IndianRupee,
  ShieldCheck,
  Plus,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

export const ClubDepartments: React.FC = () => {
  const { selectedBranch } = useClub();

  const departments = [
    {
      id: 'DEP-01',
      name: 'Racquet Sports & Courts',
      head: 'Coach Anand Iyer',
      staffCount: 12,
      todayRevenue: '₹ 1,85,000',
      activeShift: 'Morning & Evening shifts',
      facilitiesCovered: 'Tennis, Badminton, Squash',
    },
    {
      id: 'DEP-02',
      name: 'Food & Beverage (Restaurant & Bar)',
      head: 'Chef Manish Joshi',
      staffCount: 24,
      todayRevenue: '₹ 6,30,000',
      activeShift: 'Lunch & Dinner Services',
      facilitiesCovered: 'The Terrace Bistro, Lounge Bar, Cafe',
    },
    {
      id: 'DEP-03',
      name: 'Front Desk & Member Relations',
      head: 'Sneha Vyas',
      staffCount: 8,
      todayRevenue: '₹ 3,50,000 (Memberships)',
      activeShift: '24/7 Concierge & Front Counter',
      facilitiesCovered: 'Reception, RFID issuance, Guest passes',
    },
    {
      id: 'DEP-04',
      name: 'Facilities & Aquatic Engineering',
      head: 'Rajesh Parmar',
      staffCount: 14,
      todayRevenue: 'Maintenance Budget',
      activeShift: 'Continuous cleaning & chlorination',
      facilitiesCovered: 'Pool pumps, Clay courts, HVAC systems',
    },
    {
      id: 'DEP-05',
      name: 'Finance, Audit & Compliance',
      head: 'Nirav Shah (CA)',
      staffCount: 4,
      todayRevenue: '₹ 28,40,000 (Monthly)',
      activeShift: 'General Shift (9 AM - 6 PM)',
      facilitiesCovered: 'GST filings, Vendor payouts, Member ledgers',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Club Departments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational divisions, department heads and budget allocations for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {dept.id}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-3">{dept.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Head: <span className="font-semibold text-slate-800">{dept.head}</span></p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Staff Assigned:</span>
                  <span className="font-bold text-slate-800">{dept.staffCount} Team Members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Revenue / Volume:</span>
                  <span className="font-bold text-emerald-600">{dept.todayRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coverage:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[160px]">{dept.facilitiesCovered}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">{dept.activeShift}</span>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Department Roster →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
