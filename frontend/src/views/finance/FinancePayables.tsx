import React from 'react';
import { ArrowUpRight, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';

export const FinancePayables: React.FC = () => {
  const { payables } = useFinanceStore();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Accounts Payable (AP) & Vendor Liabilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Commercial trade payables, purchase order 3-way matching, due schedules, and supplier ledgers.
          </p>
        </div>

        <button
          onClick={() => alert('Batch payment NEFT instructions generated for bank authorization.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Pay Due Vendor Bills</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <h3 className="text-base font-extrabold text-slate-900 mb-3">
          Vendor Due Payment Register
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Bill No</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Bill Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Amount Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {payables.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.billNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{item.vendorName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">{item.category}</td>
                  <td className="py-3 px-4 text-slate-500">{item.billDate}</td>
                  <td className="py-3 px-4 text-slate-500">{item.dueDate}</td>
                  <td className="py-3 px-4 text-right font-black text-rose-600">
                    ₹ {item.amountDue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : item.status === 'Due Today'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Initiating direct NEFT payout of ₹${item.amountDue} to ${item.vendorName}`)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs"
                    >
                      Pay Bill
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
