import React, { useState } from 'react';
import { CreditCard, Banknote, Smartphone, Wallet, Building, CheckCircle2, Search, Filter, Printer } from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';

export const FinancePayments: React.FC = () => {
  const { transactions } = useFinanceStore();
  const [filterMode, setFilterMode] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((t) => {
    const matchesMode = filterMode === 'All' || t.paymentMode === filterMode;
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.referenceNo.toLowerCase().includes(search.toLowerCase());
    return matchesMode && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Payment Processing & Multi-Gateway Reconciliation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cash desk floats, POS card batch settlements, UPI auto-credits, and member wallet transactions.
          </p>
        </div>

        <button
          onClick={() => alert('Generating Daily Payment Reconciliation Batch report...')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <CreditCard className="w-4 h-4" />
          <span>Batch Settle Gateway</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['All', 'UPI', 'Card', 'Cash', 'Wallet', 'Net Banking'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                filterMode === mode
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference or payee..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Gateway Ref</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-medium">{tx.date}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{tx.referenceNo}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-[11px] text-slate-700">
                      {tx.paymentMode}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{tx.category}</td>
                  <td className="py-3 px-4 text-slate-800">{tx.description}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    ₹ {tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full text-[10px]">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => alert(`Receipt generated for transaction ${tx.transactionNumber}`)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
                    >
                      <Printer className="w-3.5 h-3.5 mx-auto" />
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
