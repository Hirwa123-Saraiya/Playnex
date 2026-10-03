import React, { useState } from 'react';
import { CreditCard, Banknote, Smartphone, Wallet, Building, RotateCcw, Search, CheckCircle2 } from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';

export const BarKitchenPayments: React.FC = () => {
  const { bills } = useBarKitchenStore();
  const [filterMode, setFilterMode] = useState<string>('All');

  const paymentTransactions = [
    { id: 'TXN-8801', invoice: 'INV-2026-901', table: 'T2', mode: 'Member Account', amount: 403.2, status: 'Success', time: '15:20', cashier: 'Arun Dave' },
    { id: 'TXN-8802', invoice: 'INV-2026-902', table: 'T6', mode: 'Corporate Account', amount: 8920.0, status: 'Success', time: '14:55', cashier: 'Arun Dave' },
    { id: 'TXN-8803', invoice: 'INV-2026-903', table: 'O1', mode: 'UPI', amount: 1240.0, status: 'Success', time: '14:10', cashier: 'Deepak M' },
    { id: 'TXN-8804', invoice: 'INV-2026-904', table: 'B1', mode: 'Card', amount: 2680.0, status: 'Success', time: '13:40', cashier: 'Deepak M' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Payments & Cash Drawer Reconciliation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time digital payment logs, card terminal batches, UPI QR collections, and house account postings.
          </p>
        </div>

        <button
          onClick={() => alert('Daily Cash Drawer Z-Report Printed.')}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-md"
        >
          Print Daily Z-Report
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Cash in Drawer</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">₹14,500</span>
          <span className="text-[10px] text-slate-500">Opening float: ₹10,000</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Card EDC Settlements</span>
          <span className="text-xl font-black text-blue-600 mt-1 block">₹22,180</span>
          <span className="text-[10px] text-emerald-600 font-bold">Batch settled</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">UPI QR Payments</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">₹18,450</span>
          <span className="text-[10px] text-slate-500">Zero MDR fee</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Member Ledger Charges</span>
          <span className="text-xl font-black text-purple-600 mt-1 block">₹34,820</span>
          <span className="text-[10px] text-slate-500">Posted to member folio</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
          Today's Transaction Journal
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Txn Ref</th>
                <th className="py-2.5 px-3">Invoice</th>
                <th className="py-2.5 px-3">Table</th>
                <th className="py-2.5 px-3">Payment Mode</th>
                <th className="py-2.5 px-3">Cashier</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paymentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{tx.id}</td>
                  <td className="py-2.5 px-3 text-blue-600 font-semibold">{tx.invoice}</td>
                  <td className="py-2.5 px-3 font-black text-slate-900">{tx.table}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-[11px] text-slate-700">
                      {tx.mode}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium">{tx.cashier}</td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900">₹{tx.amount}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {tx.status}
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
