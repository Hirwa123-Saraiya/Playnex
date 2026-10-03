'use client';

import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';

export const ClubMembers: React.FC = () => {
  const { selectedBranch, setActiveModal } = useClub();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const memberRoster = [
    {
      id: 'MB-8921',
      name: 'Priya Shah',
      email: 'priya.shah@gmail.com',
      phone: '+91 98250 11234',
      tier: 'Gold Tier',
      tierColor: 'bg-amber-50 text-amber-800 border-amber-200',
      joinDate: '12 Jan 2023',
      expiryDate: '12 Jan 2026',
      status: 'Active',
      spent: '₹ 1,45,000',
      rfidCard: 'RFID-9942-A',
    },
    {
      id: 'MB-8922',
      name: 'Rahul Mehta',
      email: 'rahul.mehta@yahoo.co.in',
      phone: '+91 94260 88912',
      tier: 'Gold Tier',
      tierColor: 'bg-amber-50 text-amber-800 border-amber-200',
      joinDate: '15 Mar 2022',
      expiryDate: '15 Mar 2026',
      status: 'Active',
      spent: '₹ 2,12,000',
      rfidCard: 'RFID-8812-C',
    },
    {
      id: 'MB-8923',
      name: 'Aditya Mehta',
      email: 'aditya.m@fintech.io',
      phone: '+91 97129 44321',
      tier: 'Silver Tier',
      tierColor: 'bg-slate-100 text-slate-800 border-slate-300',
      joinDate: '01 Aug 2024',
      expiryDate: '01 Aug 2025',
      status: 'Active',
      spent: '₹ 45,000',
      rfidCard: 'RFID-1209-X',
    },
    {
      id: 'MB-8924',
      name: 'Aryav Patel',
      email: 'parent.patel@rediffmail.com',
      phone: '+91 99090 33411',
      tier: 'Junior Tier',
      tierColor: 'bg-blue-50 text-blue-800 border-blue-200',
      joinDate: '10 Sep 2024',
      expiryDate: '10 Sep 2025',
      status: 'Active',
      spent: '₹ 28,000',
      rfidCard: 'RFID-3341-J',
    },
    {
      id: 'MB-8925',
      name: 'Ketan Patel',
      email: 'ketan.patel@chem.com',
      phone: '+91 98980 55432',
      tier: 'Silver Tier',
      tierColor: 'bg-slate-100 text-slate-800 border-slate-300',
      joinDate: '14 Oct 2023',
      expiryDate: '14 Oct 2025',
      status: 'Expiring Today',
      spent: '₹ 52,000',
      rfidCard: 'RFID-7711-K',
    },
  ];

  const filteredMembers = memberRoster.filter((m) => {
    if (tierFilter !== 'all' && !m.tier.toLowerCase().includes(tierFilter)) return false;
    if (
      searchTerm &&
      !m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !m.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !m.phone.includes(searchTerm)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Member Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Registered club members, RFID cards, tiers and subscription lifecycles at{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => setActiveModal('add-member')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member name, email, phone or RFID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {['all', 'gold', 'silver', 'junior'].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                tierFilter === tier
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tier === 'all' ? 'All Tiers' : `${tier} Tier`}
            </button>
          ))}
        </div>
      </div>

      {/* Member Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Member ID</th>
                <th className="px-4 py-3">Name & Contact</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">RFID Badge</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Valid Until</th>
                <th className="px-4 py-3">Lifetime Spend</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{m.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{m.name}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{m.email}</span>
                      <span>•</span>
                      <span>{m.phone}</span>
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${m.tierColor}`}
                    >
                      {m.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                    {m.rfidCard}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{m.joinDate}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium">
                    {m.expiryDate}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">{m.spent}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {m.status}
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
