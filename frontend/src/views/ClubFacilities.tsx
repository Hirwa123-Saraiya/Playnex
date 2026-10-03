'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import {
  Building2,
  Plus,
  Wrench,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ClubFacilities: React.FC = () => {
  const { selectedBranch, setActiveModal } = useClub();

  const facilities = [
    {
      id: 'FAC-01',
      name: 'Tennis Courts (1-6)',
      type: 'Clay & Hard Courts',
      capacity: '24 Players',
      status: '5 Active / 1 Maintenance',
      operationalPct: 83,
      hourlyRate: '₹ 800 / hr',
      rules: 'Clay court tennis shoes mandatory',
    },
    {
      id: 'FAC-02',
      name: 'Badminton Arena (Courts 1-4)',
      type: 'Wooden Synthetic Floors',
      capacity: '16 Players',
      status: '4 Active / 0 Maintenance',
      operationalPct: 100,
      hourlyRate: '₹ 500 / hr',
      rules: 'Non-marking gum sole shoes only',
    },
    {
      id: 'FAC-03',
      name: 'Olympic Swimming Pool',
      type: 'Heated & Temperature Controlled',
      capacity: '60 Swimmers (10 Lanes)',
      status: 'Open (Lane 2 reserved for coaching)',
      operationalPct: 90,
      hourlyRate: 'Included in Gold/Silver',
      rules: 'Swimming cap mandatory',
    },
    {
      id: 'FAC-04',
      name: 'Equinox Gym & Cardio Lounge',
      type: 'Technogym & Free Weights',
      capacity: '75 Members',
      status: 'HVAC scheduled 11 PM',
      operationalPct: 100,
      hourlyRate: 'Membership Tier',
      rules: 'Gym towel & trainers mandatory',
    },
    {
      id: 'FAC-05',
      name: 'The Terrace Bistro & Dining',
      type: 'Indoor & Alfresco Seating',
      capacity: '40 Tables (160 Seats)',
      status: 'Open (Lunch & Dinner)',
      operationalPct: 100,
      hourlyRate: 'A La Carte / Table billing',
      rules: 'Smart casual dress code',
    },
    {
      id: 'FAC-06',
      name: 'The Royal Banquet & Lawns',
      type: 'Multi-purpose Convention Hall',
      capacity: '450 Guests',
      status: 'Booked for Diwali Gala (25 Oct)',
      operationalPct: 100,
      hourlyRate: '₹ 1,50,000 / day',
      rules: 'Sound limit 10:00 PM per city bylaws',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Facilities & Infrastructure
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage sports arenas, maintenance windows, and operating capacities at{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <button
          onClick={() => setActiveModal('add-facility')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Facility
        </button>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{fac.name}</h3>
                  <p className="text-xs text-slate-500">{fac.type}</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  {fac.id}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Max Capacity:</span>
                  <span className="font-semibold text-slate-800">{fac.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pricing / Rate:</span>
                  <span className="font-semibold text-slate-800">{fac.hourlyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-semibold text-emerald-600">{fac.status}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Operational Health</span>
                  <span className="font-bold text-slate-700">{fac.operationalPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${fac.operationalPct}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 line-clamp-1">{fac.rules}</span>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap ml-2">
                Manage Slots →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
