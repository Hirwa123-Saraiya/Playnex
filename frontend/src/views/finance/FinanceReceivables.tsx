import React, { useState } from 'react';
import { ArrowDownLeft, Clock, Search, Phone, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';

export const FinanceReceivables: React.FC = () => {
  const { receivables } = useFinanceStore();
  const [selectedBucket, setSelectedBucket] = useState<string>('All');

  const agingStats = [
    { bucket: '0-30 days', amount: 125000, count: 2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { bucket: '31-60 days', amount: 25000, count: 1, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { bucket: '61-90 days', amount: 65000, count: 1, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { bucket: '90+ days', amount: 110000, count: 1, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  ];

  const filtered = receivables.filter((r) =>
    selectedBucket === 'All' ? true : r.agingBucket === selectedBucket
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Accounts Receivable (AR) & Aging Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Member dues collection aging buckets, DSO tracking, customer statements, and automated payment reminders.
          </p>
        </div>

        <button
          onClick={() => alert('Sending automated WhatsApp/SMS payment reminders to all overdue accounts...')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>Send Bulk Dues Reminders</span>
        </button>
      </div>

      {/* Aging Bucket KPIs matching reference image ₹4.25L total */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {agingStats.map((st) => (
          <div
            key={st.bucket}
            onClick={() => setSelectedBucket(selectedBucket === st.bucket ? 'All' : st.bucket)}
            className={`p-5 rounded-3xl border cursor-pointer transition-all ${st.color} ${
              selectedBucket === st.bucket ? 'ring-2 ring-blue-500 shadow-md' : 'shadow-2xs hover:shadow-xs'
            }`}
          >
            <span className="text-[10px] uppercase font-black tracking-wider block">{st.bucket}</span>
            <span className="text-2xl font-black mt-1 block">₹ {st.amount.toLocaleString()}</span>
            <span className="text-xs font-bold mt-1 block">{st.count} Invoices Due</span>
          </div>
        ))}
      </div>

      {/* Receivables Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <h3 className="text-base font-extrabold text-slate-900 mb-3">
          Outstanding Customer Ledger
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Aging Bracket</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.invoiceNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{item.customerName}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[11px]">
                      {item.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{item.dueDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        item.agingBucket === '90+ days'
                          ? 'bg-rose-100 text-rose-800'
                          : item.agingBucket === '61-90 days'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.agingBucket}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    ₹ {item.outstandingBalance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Calling ${item.customerName} on ${item.contactNumber}...`)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                    >
                      Follow Up
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
