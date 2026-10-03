import React from 'react';
import { FinanceTransaction } from '../../types/FinanceTypes';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';

interface FinanceRecentTransactionsProps {
  transactions: FinanceTransaction[];
  onViewAll?: () => void;
}

export const FinanceRecentTransactions: React.FC<FinanceRecentTransactionsProps> = ({
  transactions,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header matching reference image */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          Recent Transactions
        </h3>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table matching reference image */}
      <div className="overflow-x-auto my-3">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.slice(0, 6).map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap font-medium">
                  {tx.date}
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-extrabold ${
                      tx.type === 'Received'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-800 max-w-[200px] truncate">
                  {tx.description}
                </td>
                <td className="py-2.5 px-3 text-right font-black text-slate-900 whitespace-nowrap">
                  ₹ {tx.amount.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Payment Gateway: <strong className="text-emerald-700">UPI / Razorpay Verified</strong></span>
        <span>Audit Status: <strong className="text-blue-600">Reconciled</strong></span>
      </div>
    </div>
  );
};
