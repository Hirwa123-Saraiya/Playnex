import React, { useState } from 'react';
import { CreditCard, Download, ShieldCheck, CheckCircle2, Search, ArrowUpRight } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserPayments: React.FC = () => {
  const { payments } = useUserStore();
  const [filterType, setFilterType] = useState<string>('All');

  const filtered = payments.filter((p) => filterType === 'All' || p.type === filterType);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <CreditCard className="w-4 h-4" />
          <span>Billing & Transactions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Payment History & Invoices
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          All court booking payments, membership fees, and tournament passes across your linked clubs.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['All', 'Booking', 'Membership', 'Event'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              filterType === type ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Transaction / Invoice</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Club</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 block">{item.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.invoiceNumber}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{item.description}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.clubName}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.date}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.method}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{item.amount}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Invoice ${item.invoiceNumber} downloaded.`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center gap-1 font-bold text-xs"
                      title="Download PDF Invoice"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
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
