'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import {
  IndianRupee,
  CreditCard,
  QrCode,
  Download,
  Calendar,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';

export const ClubFinance: React.FC = () => {
  const { selectedBranch } = useClub();

  const transactions = [
    {
      id: 'TXN-9901',
      date: '14 Oct 2025, 11:20 AM',
      member: 'Rahul Mehta',
      category: 'Court Booking',
      mode: 'UPI (GPay)',
      amount: '₹ 800',
      gst: '₹ 144 (18%)',
      status: 'Settled',
    },
    {
      id: 'TXN-9902',
      date: '14 Oct 2025, 11:45 AM',
      member: 'Priya Shah',
      category: 'Gold Annual Membership',
      mode: 'Credit Card (HDFC Visa)',
      amount: '₹ 85,000',
      gst: '₹ 15,300 (18%)',
      status: 'Settled',
    },
    {
      id: 'TXN-9903',
      date: '14 Oct 2025, 01:15 PM',
      member: 'Dr. Sameer Desai',
      category: 'The Terrace Bistro Dining',
      mode: 'Member Tab Settlement',
      amount: '₹ 2,400',
      gst: '₹ 120 (5%)',
      status: 'Settled',
    },
    {
      id: 'TXN-9904',
      date: '14 Oct 2025, 02:30 PM',
      member: 'Ketan Patel',
      category: 'Court 3 Rain Cancellation Refund',
      mode: 'Original Payment Method',
      amount: '- ₹ 800',
      gst: '- ₹ 144',
      status: 'Pending Signoff',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Finance & Payment Settlements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Aggregated court fees, dining bills, memberships and GST reporting for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors">
            <Download className="w-3.5 h-3.5" />
            GST B2B Report
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors">
            <Receipt className="w-3.5 h-3.5" />
            Daily Cash Reconciliation
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Gross Revenue (MTD)</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">₹ 28,40,000</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% compared to last month
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Pending Gateway Settlement</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">₹ 1,42,800</h3>
          <p className="text-xs text-slate-500 mt-2">Scheduled batch deposit at 11:59 PM</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">GST Output Liability (Month)</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">₹ 3,92,400</h3>
          <p className="text-xs text-blue-600 font-semibold mt-2">Reconciled with GSTR-1 draft</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Transactions & Invoices</h3>
          <span className="text-xs text-slate-400">All modes: Cash, UPI, Cards, Tabs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Txn ID</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Payment Mode</th>
                <th className="px-4 py-3">Net Amount</th>
                <th className="px-4 py-3">GST Component</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{t.id}</td>
                  <td className="px-4 py-3 text-slate-500">{t.date}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{t.member}</td>
                  <td className="px-4 py-3 text-slate-700">{t.category}</td>
                  <td className="px-4 py-3 text-slate-600">{t.mode}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{t.amount}</td>
                  <td className="px-4 py-3 text-slate-500">{t.gst}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Settled'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {t.status}
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
