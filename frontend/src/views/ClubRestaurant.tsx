'use client';

import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import {
  UtensilsCrossed,
  Wine,
  Plus,
  Coffee,
  Receipt,
  User,
  Clock,
  CheckCircle,
} from 'lucide-react';

export const ClubRestaurant: React.FC = () => {
  const { selectedBranch } = useClub();
  const [activeTab, setActiveTab] = useState<'tables' | 'kot' | 'bartabs'>('tables');

  const tables = [
    { id: 1, name: 'T-01 (Terrace)', seats: 4, status: 'Occupied', member: 'Rahul Mehta', bill: '₹ 2,450', tierDiscount: '15% Gold' },
    { id: 2, name: 'T-02 (Terrace)', seats: 4, status: 'Available', member: '-', bill: '-', tierDiscount: '-' },
    { id: 3, name: 'T-03 (Terrace)', seats: 6, status: 'Reserved', member: 'Dr. Sameer Desai (8:30 PM)', bill: '-', tierDiscount: '15% Gold' },
    { id: 4, name: 'T-04 (Main Hall)', seats: 2, status: 'Occupied', member: 'Aditya Mehta', bill: '₹ 980', tierDiscount: '10% Silver' },
    { id: 5, name: 'T-05 (Main Hall)', seats: 4, status: 'Occupied', member: 'Priya Shah', bill: '₹ 3,120', tierDiscount: '15% Gold' },
    { id: 6, name: 'T-06 (Main Hall)', seats: 8, status: 'Occupied', member: 'Corporate Tennis Team', bill: '₹ 8,900', tierDiscount: 'Corporate' },
    { id: 7, name: 'B-01 (Bar Lounge)', seats: 2, status: 'Occupied', member: 'Vikram Joshi', bill: '₹ 1,800', tierDiscount: '10% Silver' },
    { id: 8, name: 'B-02 (Bar Lounge)', seats: 4, status: 'Available', member: '-', bill: '-', tierDiscount: '-' },
  ];

  const activeKots = [
    { kotId: 'KOT-409', table: 'T-01', items: '2x Tandoori Chicken, 1x Paneer Tikka, 2x Fresh Lime Soda', time: '8 mins ago', status: 'Cooking' },
    { kotId: 'KOT-410', table: 'T-05', items: '1x Mezze Platter, 1x Pasta Alfredo, 2x Virgin Mojito', time: '4 mins ago', status: 'Ready to Serve' },
    { kotId: 'KOT-411', table: 'B-01', items: '2x Single Malt Scotch (Glenfiddich 12), 1x Salted Cashews', time: '2 mins ago', status: 'Dispensed at Bar' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Restaurant & Bar POS Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Live table tracking, automated member tier discounts, KOT dispatch and bar tabs at{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            New KOT / Order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'tables'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Live Tables (40 Tables)
        </button>
        <button
          onClick={() => setActiveTab('kot')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'kot'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Kitchen Order Tickets (3 Active)
        </button>
      </div>

      {/* Tab 1: Live Tables Grid */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-2xl border transition-all ${
                t.status === 'Occupied'
                  ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                  : t.status === 'Reserved'
                  ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.status === 'Occupied'
                      ? 'bg-amber-100 text-amber-800'
                      : t.status === 'Reserved'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs">
                <p className="text-slate-500">
                  Member: <span className="font-semibold text-slate-800">{t.member}</span>
                </p>
                {t.bill !== '-' && (
                  <p className="text-slate-500">
                    Running Tab: <span className="font-bold text-slate-900">{t.bill}</span>
                  </p>
                )}
                {t.tierDiscount !== '-' && (
                  <p className="text-emerald-700 font-semibold text-[11px]">
                    Discount: {t.tierDiscount} Applied
                  </p>
                )}
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{t.seats} Seater</span>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  {t.status === 'Occupied' ? 'View Tab / Settle' : 'Reserve Table'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: KOT Grid */}
      {activeTab === 'kot' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeKots.map((k) => (
            <div key={k.kotId} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{k.kotId}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {k.table}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700">{k.items}</p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{k.time}</span>
                <span className="font-bold text-emerald-600">{k.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
