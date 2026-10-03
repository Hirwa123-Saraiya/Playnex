'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClub } from '../context/ClubContext';
import {
  UtensilsCrossed,
  ExternalLink,
  IndianRupee,
  Clock,
  Users,
  Flame,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Wine,
  Coffee,
  ChefHat,
  Bell,
} from 'lucide-react';

const SAMPLE_KOTS = [
  { id: 'KOT-104', table: 'Table 4 (Poolside)', items: ['Cold Coffee x2', 'Chicken Club Sandwich x1'], time: '4 mins ago', status: 'Cooking' },
  { id: 'KOT-105', table: 'Table 8 (Lounge)', items: ['Kingfisher Draught Pitcher x1', 'Peri Peri Fries x2'], time: '7 mins ago', status: 'Ready' },
  { id: 'KOT-106', table: 'Table 12 (Dining)', items: ['Paneer Tikka Platter x1', 'Butter Naan x3', 'Dal Makhani x1'], time: '12 mins ago', status: 'Prepping' },
];

const SAMPLE_RECENT_BILLS = [
  { id: 'ORD-9821', table: 'Table 4', customer: 'Siddharth Patel', amount: 1450, gst: 261, total: 1711, status: 'Paid (UPI)', time: '10 mins ago' },
  { id: 'ORD-9820', table: 'Table 9', customer: 'Ananya Shah (Club Tab)', amount: 2200, gst: 396, total: 2596, status: 'Member Tab', time: '25 mins ago' },
  { id: 'ORD-9819', table: 'Bar Counter', customer: 'Rajesh Mehra', amount: 890, gst: 160, total: 1050, status: 'Paid (Card)', time: '40 mins ago' },
  { id: 'ORD-9818', table: 'Table 2', customer: 'Vikram Seth', amount: 3100, gst: 558, total: 3658, status: 'Paid (Cash)', time: '1 hour ago' },
];

export const ClubRestaurant: React.FC = () => {
  const router = useRouter();
  const { club } = useClub();
  const [copied, setCopied] = useState(false);

  const clubClean = (club.name || 'club').toLowerCase().replace(/[^a-z0-9]/g, '');
  const staffEmail = `bar.${clubClean}@playnex.com`;

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Email: ${staffEmail}\nPassword: Playnex@2026`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#1565D8] selection:text-white">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4D] tracking-tight">
              Restaurant & Bar Operations Summary
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              F&B Department Overview
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Executive dining revenue, table occupancy, and kitchen display queue summary for {club.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <a
            href="/bar-kitchen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1565D8] hover:bg-[#0E5BD8] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-900/20 transition-all"
          >
            <span>Launch Standalone Bar & Kitchen Suite</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Staff Account & Multi-Tenant Credentials Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071A3D] via-[#0B1F4D] to-[#1565D8] text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-900/40">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-amber-300 border border-white/10 shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Standalone F&B Workstation Account Active</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                18% GST Compliant
              </span>
            </div>
            <p className="text-xs text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
              Restaurant & Bar POS operates as a specialized touchscreen workstation outside the club portal. Captains
              and chefs log in directly to dispatch KOT tickets and settle member tabs for {club.name}.
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-slate-300 font-mono">
                Staff Email: <strong className="text-white">{staffEmail}</strong>
              </span>
              <span className="text-slate-300 font-mono">
                Pass: <strong className="text-emerald-300">Playnex@2026</strong>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyCredentials}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap self-end md:self-auto ${
            copied ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Credentials Copied!' : 'Copy Staff Login'}</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">₹48,950</div>
            <div className="text-[11px] text-[#64748B] font-medium">Today&apos;s F&B Sales (+14.8%)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1565D8] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">8 / 24 Tables</div>
            <div className="text-[11px] text-[#64748B] font-medium">Active Floor Occupancy (33%)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">3 Live KOTs</div>
            <div className="text-[11px] text-[#64748B] font-medium">Kitchen Display System Queue</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">₹291</div>
            <div className="text-[11px] text-[#64748B] font-medium">Average Order Value (168 bills)</div>
          </div>
        </div>
      </div>

      {/* Live Floor Plan Status & Live KOT Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Floor Summary (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D9E6F5] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F4D]">Dining Floor Plan & Table Status</h3>
              <p className="text-xs text-[#64748B]">Real-time status of 24 dining and bar tables</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Available (16)
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Occupied (8)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 pt-1">
            {Array.from({ length: 24 }).map((_, idx) => {
              const tableNum = idx + 1;
              const isOccupied = [2, 4, 8, 9, 12, 15, 18, 21].includes(tableNum);

              return (
                <div
                  key={tableNum}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isOccupied
                      ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-sm'
                      : 'bg-[#F7FAFC] border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="text-xs font-extrabold">T-{tableNum}</div>
                  <div className="text-[10px] font-semibold mt-0.5">
                    {isOccupied ? 'Active' : 'Free'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live KOT Queue (1 Col) */}
        <div className="bg-white rounded-2xl border border-[#D9E6F5] p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-[#0B1F4D]">Live Kitchen KOTs</h3>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Live Queue
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {SAMPLE_KOTS.map((kot) => (
                <div key={kot.id} className="p-3 rounded-xl border border-[#D9E6F5] bg-[#F7FAFC] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#0B1F4D]">{kot.table}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{kot.time}</span>
                  </div>
                  <div className="text-[11px] text-[#64748B]">{kot.items.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>

          <a
            href="/bar-kitchen"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl border border-[#D9E6F5] bg-slate-50 hover:bg-slate-100 text-center text-xs font-bold text-[#0B1F4D] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Full KDS & Table POS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Recent Dining Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#D9E6F5] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#D9E6F5] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B1F4D]">Recent Dining & Bar Invoices</h3>
            <p className="text-xs text-[#64748B]">Audited orders recorded under {club.name} with 18% GST</p>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            GST Audited
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E293B]">
            <thead className="bg-[#F7FAFC] border-b border-[#D9E6F5] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Order #</th>
                <th className="px-4 py-3">Table / Area</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Subtotal</th>
                <th className="px-4 py-3">18% GST</th>
                <th className="px-4 py-3">Grand Total</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E6F5]/60">
              {SAMPLE_RECENT_BILLS.map((bill) => (
                <tr key={bill.id} className="hover:bg-[#F7FAFC]/80 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-[#1565D8]">{bill.id}</td>
                  <td className="px-4 py-3 font-medium text-[#0B1F4D]">{bill.table}</td>
                  <td className="px-4 py-3 text-[#64748B]">{bill.customer}</td>
                  <td className="px-4 py-3">₹{bill.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">₹{bill.gst.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-extrabold text-[#0B1F4D]">₹{bill.total.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {bill.status}
                    </span>
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
