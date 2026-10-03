'use client';

import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';

export const ClubBookings: React.FC = () => {
  const { selectedBranch } = useClub();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockBookingsList = [
    {
      id: 'BK-1001',
      member: 'Rahul Mehta',
      memberTier: 'Gold',
      facility: 'Tennis Court 1',
      category: 'tennis',
      date: '14 Oct 2025',
      timeSlot: '06:00 PM - 07:00 PM',
      courtType: 'Clay / Floodlit',
      amount: '₹ 800',
      status: 'Confirmed',
    },
    {
      id: 'BK-1002',
      member: 'Ananya Sharma',
      memberTier: 'Silver',
      facility: 'Badminton Court 3',
      category: 'badminton',
      date: '14 Oct 2025',
      timeSlot: '07:00 PM - 08:00 PM',
      courtType: 'Wooden Synthetic',
      amount: '₹ 500',
      status: 'Confirmed',
    },
    {
      id: 'BK-1003',
      member: 'Dr. Sameer Desai',
      memberTier: 'Gold',
      facility: 'Restaurant (Table 12 - Terrace)',
      category: 'restaurant',
      date: '14 Oct 2025',
      timeSlot: '08:30 PM - 10:30 PM',
      courtType: 'Terrace View / 4 Pax',
      amount: '₹ 2,400',
      status: 'Confirmed',
    },
    {
      id: 'BK-1004',
      member: 'Vikram Joshi',
      memberTier: 'Silver',
      facility: 'Olympic Swimming Pool',
      category: 'pool',
      date: '14 Oct 2025',
      timeSlot: '06:30 AM - 07:30 AM',
      courtType: 'Lane 4 (Fast pace)',
      amount: '₹ 350',
      status: 'Completed',
    },
    {
      id: 'BK-1005',
      member: 'Pooja Bhatt',
      memberTier: 'Gold',
      facility: 'Gym Personal Training Slot',
      category: 'gym',
      date: '14 Oct 2025',
      timeSlot: '05:00 PM - 06:00 PM',
      courtType: 'Trainer: Coach Rakesh',
      amount: '₹ 1,200',
      status: 'Confirmed',
    },
    {
      id: 'BK-1006',
      member: 'Ketan Patel',
      memberTier: 'Silver',
      facility: 'Tennis Court 3',
      category: 'tennis',
      date: '14 Oct 2025',
      timeSlot: '07:00 PM - 08:00 PM',
      courtType: 'Hard Court',
      amount: '₹ 800',
      status: 'Cancelled',
    },
  ];

  const filtered = mockBookingsList.filter((b) => {
    if (filterType !== 'all' && b.category !== filterType) return false;
    if (
      searchTerm &&
      !b.member.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !b.facility.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Bookings & Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time court scheduling, table allotments, and session management for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New Reservation
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member, court or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'tennis', 'badminton', 'restaurant', 'pool', 'gym'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                filterType === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Bookings' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings TanStack-grade Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Facility & Court</th>
                <th className="px-4 py-3">Time Slot</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {item.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                        {item.member.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{item.member}</p>
                        <span className="text-[10px] text-blue-600 font-semibold">
                          {item.memberTier} Tier
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{item.facility}</p>
                    <span className="text-[10px] text-slate-400">{item.courtType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.timeSlot}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {item.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.status}
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
