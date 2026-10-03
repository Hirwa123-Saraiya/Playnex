'use client';

import React, { useEffect, useState } from 'react';
import { useClub } from '../context/ClubContext';
import {
  IndianRupee,
  CreditCard,
  Download,
  Receipt,
  TrendingUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  financeService,
  FinanceTransaction,
  FinanceSummary,
} from '../services/finance.service';

export const ClubFinance: React.FC = () => {
  const { selectedBranch } = useClub();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinanceSummary>({
    grossRevenue: 0,
    pendingSettlement: 0,
    gstLiability: 0,
  });
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);

  const fetchFinance = async () => {
    try {
      setLoading(true);
      const res = await financeService.getFinanceData(selectedBranch.id);
      if (res.success && res.data) {
        setSummary(res.data.summary);
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error('Failed to load finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, [selectedBranch.id]);

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
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Gross Revenue (Live)</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            ₹ {summary.grossRevenue.toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Real-time database settlement
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Pending Tab Settlement</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            ₹ {summary.pendingSettlement.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Open restaurant tabs & unpaid slots</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Estimated GST Liability</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            ₹ {summary.gstLiability.toLocaleString()}
          </h3>
          <p className="text-xs text-blue-600 font-semibold mt-2">Calculated at standard statutory slabs</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Transactions & Invoices</h3>
          <span className="text-xs text-slate-400">All modes: Cash, UPI, Cards, Tabs</span>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={28} />
          </div>
        ) : (
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
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(t.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{t.member}</td>
                    <td className="px-4 py-3 text-slate-700">{t.category}</td>
                    <td className="px-4 py-3 text-slate-600">{t.mode}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">₹ {t.amount}</td>
                    <td className="px-4 py-3 text-slate-500">₹ {t.gst}</td>
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
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <div className="font-semibold text-slate-700">No transactions recorded yet</div>
                      <div className="text-xs mt-1">Bookings and restaurant orders will generate financial logs here.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
