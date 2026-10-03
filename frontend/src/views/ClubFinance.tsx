'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClub } from '../context/ClubContext';
import {
  IndianRupee,
  ExternalLink,
  TrendingUp,
  Receipt,
  FileText,
  Landmark,
  ShieldCheck,
  Check,
  Copy,
  ArrowRight,
  PieChart,
  Calendar,
  CreditCard,
} from 'lucide-react';

const SAMPLE_TRANSACTIONS = [
  { id: 'TXN-1092', desc: 'Yonex Astrox 99 Pro Sale', department: 'Pro Shop', amount: 18500, gst: 3330, total: 21830, type: 'Income', time: 'Today' },
  { id: 'TXN-1091', desc: 'Court 3 Peak Booking (2 hrs)', department: 'Bookings', amount: 1600, gst: 288, total: 1888, type: 'Income', time: 'Today' },
  { id: 'TXN-1090', desc: 'Gold Membership Annual Plan', department: 'Memberships', amount: 25000, gst: 4500, total: 29500, type: 'Income', time: 'Yesterday' },
  { id: 'TXN-1089', desc: 'Beverage & Draft Keg Restock', department: 'Restaurant & Bar', amount: 14200, gst: 2556, total: 16756, type: 'Expense', time: '2 days ago' },
];

export const ClubFinance: React.FC = () => {
  const router = useRouter();
  const { club } = useClub();
  const [copied, setCopied] = useState(false);

  const clubClean = (club.name || 'club').toLowerCase().replace(/[^a-z0-9]/g, '');
  const staffEmail = `accountant.${clubClean}@playnex.com`;

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
              Finance & Accounting Executive Summary
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
              ERP Overview
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Aggregated revenue streams, 18% GST liabilities, and financial ledger summary for {club.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <a
            href="/finance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1565D8] hover:bg-[#0E5BD8] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-900/20 transition-all"
          >
            <span>Launch Standalone Finance ERP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Staff Account & Multi-Tenant Credentials Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071A3D] via-[#0B1F4D] to-[#1565D8] text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-900/40">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-purple-300 border border-white/10 shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Standalone Finance ERP Account Active</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                Statutory GST Compliant
              </span>
            </div>
            <p className="text-xs text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
              Financial auditing, corporate invoicing, and tax filings run in the dedicated Finance Suite outside the
              club owner dashboard. Auditors log in with these credentials to audit accounts isolated to {club.name}.
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">₹61,400</div>
            <div className="text-[11px] text-[#64748B] font-medium">Total Revenue (+12%)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">₹27,630</div>
            <div className="text-[11px] text-[#64748B] font-medium">Operating Expenses</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1565D8] flex items-center justify-center font-bold">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">₹33,770</div>
            <div className="text-[11px] text-[#64748B] font-medium">Net Operating Surplus</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">₹4,912</div>
            <div className="text-[11px] text-[#64748B] font-medium">Receivables (4 Due)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#0B1F4D]">₹1,207</div>
            <div className="text-[11px] text-[#64748B] font-medium">18% GST Statutory</div>
          </div>
        </div>
      </div>

      {/* Revenue Distribution & Tax Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Distribution by Department (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D9E6F5] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F4D]">Revenue Breakdown by Department</h3>
              <p className="text-xs text-[#64748B]">Real-time revenue split across club operations</p>
            </div>
            <span className="text-xs text-[#1565D8] font-bold">Monthly Target: ₹1.00L</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B1F4D]">Membership Plans & Subscriptions (48%)</span>
                <span className="font-extrabold text-[#1565D8]">₹29,500</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B1F4D]">Pro Shop & Equipment Sales (35%)</span>
                <span className="font-extrabold text-cyan-600">₹21,830</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B1F4D]">Court Slot Bookings & Walk-ins (12%)</span>
                <span className="font-extrabold text-emerald-600">₹7,450</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B1F4D]">Food & Beverage (Restaurant / Bar) (5%)</span>
                <span className="font-extrabold text-amber-600">₹2,620</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* GST & Statutory Tax Summary (1 Col) */}
        <div className="bg-white rounded-2xl border border-[#D9E6F5] p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-[#0B1F4D]">GST Statutory Summary</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                GSTIN Active
              </span>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Club Registered GSTIN</div>
                <div className="font-mono font-bold text-[#0B1F4D] text-sm">24AAACP1234M1Z5</div>
                <div className="text-[10px] text-slate-500">State / Central GST: 9% CGST + 9% SGST</div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                <span className="font-medium text-xs">Output Tax Collected:</span>
                <span className="font-bold">₹10,250</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-900">
                <span className="font-medium text-xs">Input Tax Credit (ITC):</span>
                <span className="font-bold">₹9,043</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/70 border border-purple-200 text-purple-900">
                <span className="font-medium text-xs">Net GST Payable:</span>
                <span className="font-bold text-sm">₹1,207</span>
              </div>
            </div>
          </div>

          <a
            href="/finance"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl border border-[#D9E6F5] bg-slate-50 hover:bg-slate-100 text-center text-xs font-bold text-[#0B1F4D] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Full Finance ERP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Recent Ledger Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#D9E6F5] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#D9E6F5] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B1F4D]">Recent General Ledger Transactions</h3>
            <p className="text-xs text-[#64748B]">Audited revenue and expense vouchers under {club.name}</p>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Reconciled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E293B]">
            <thead className="bg-[#F7FAFC] border-b border-[#D9E6F5] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Voucher #</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Subtotal</th>
                <th className="px-4 py-3">18% GST</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-5 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E6F5]/60">
              {SAMPLE_TRANSACTIONS.map((txn) => (
                <tr key={txn.id} className="hover:bg-[#F7FAFC]/80 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-[#1565D8]">{txn.id}</td>
                  <td className="px-4 py-3 font-medium text-[#0B1F4D]">{txn.desc}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {txn.department}
                    </span>
                  </td>
                  <td className="px-4 py-3">₹{txn.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">₹{txn.gst.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-extrabold text-[#0B1F4D]">₹{txn.total.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-right text-slate-500">{txn.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
