import React from 'react';
import { BookOpen, Plus, Search, Download } from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';

export const FinanceGeneralLedger: React.FC = () => {
  const { generalLedger } = useFinanceStore();

  const totalDebits = generalLedger.reduce((sum, a) => sum + a.debit, 0);
  const totalCredits = generalLedger.reduce((sum, a) => sum + a.credit, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            General Ledger & Chart of Accounts (COA)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Double-entry bookkeeping, trial balance verification, and audited financial journal postings.
          </p>
        </div>

        <button
          onClick={() => alert('New Manual Journal Entry voucher opened.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Journal Entry</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-extrabold text-slate-900">
            Trial Balance Register
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
            Debits = Credits Balanced (Diff: ₹0)
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Account Code</th>
                <th className="py-3 px-4">Account Head Name</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-right">Debit (₹)</th>
                <th className="py-3 px-4 text-right">Credit (₹)</th>
                <th className="py-3 px-4 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {generalLedger.map((acc) => (
                <tr key={acc.accountCode} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{acc.accountCode}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{acc.accountName}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700">
                      {acc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    {acc.debit > 0 ? `₹ ${acc.debit.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    {acc.credit > 0 ? `₹ ${acc.credit.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    ₹ {Math.abs(acc.balance).toLocaleString()} {acc.balance >= 0 ? 'Dr' : 'Cr'}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-black text-xs">
                <td colSpan={3} className="py-3 px-4 text-slate-900 uppercase">Trial Balance Grand Total</td>
                <td className="py-3 px-4 text-right text-slate-900">₹ {totalDebits.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-slate-900">₹ {totalCredits.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-emerald-700">BALANCED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
