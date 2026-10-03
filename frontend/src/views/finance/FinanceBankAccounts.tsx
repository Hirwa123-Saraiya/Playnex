import React, { useState } from 'react';
import { useFinanceStore } from '../../store/FinanceStore';
import { 
  Building, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Plus, 
  UploadCloud, 
  FileText, 
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { FinanceBankAccount } from '../../types/FinanceTypes';

export const FinanceBankAccounts: React.FC = () => {
  const { bankAccounts } = useFinanceStore();
  const [selectedAccount, setSelectedAccount] = useState<FinanceBankAccount>(bankAccounts[0]);
  const [activeTab, setActiveTab] = useState<'transactions' | 'reconciliation' | 'transfers'>('reconciliation');
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  const totalBankBalance = bankAccounts.reduce((acc, curr) => acc + curr.currentBalance, 0);

  // Mock reconciliation feed
  const reconItems = [
    { id: 'REC-01', date: '03 Oct 2025', desc: 'NEFT / Razorpay Settlement - Oct 02', bankAmount: 185400, bookAmount: 185400, status: 'Matched', diff: 0 },
    { id: 'REC-02', date: '02 Oct 2025', desc: 'Cheque Deposit - Apex Sports Equipment', bankAmount: 45000, bookAmount: 45000, status: 'Matched', diff: 0 },
    { id: 'REC-03', date: '02 Oct 2025', desc: 'Bank Charges / GST - ICICI Q2', bankAmount: 1450, bookAmount: 0, status: 'Unmatched', diff: 1450 },
    { id: 'REC-04', date: '01 Oct 2025', desc: 'IMPS Outward - Fresh Farm Produce Bill', bankAmount: -28400, bookAmount: -28400, status: 'Matched', diff: 0 },
    { id: 'REC-05', date: '30 Sep 2025', desc: 'UPI Aggregator - Bar & Cafe Daily Batch', bankAmount: 62450, bookAmount: 62450, status: 'Matched', diff: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Building className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Treasury & Bank Account Management</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-account tracking, automated bank reconciliation statement (BRS), and fund transfers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition">
            <UploadCloud className="w-4 h-4" />
            Import OFX / CSV
          </button>
          <button 
            onClick={() => setShowAddAccountModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Connect Account
          </button>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bankAccounts.map((acc) => {
          const isSelected = selectedAccount?.id === acc.id;
          return (
            <div 
              key={acc.id}
              onClick={() => setSelectedAccount(acc)}
              className={`p-5 rounded-2xl cursor-pointer transition border relative ${
                isSelected 
                  ? 'bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-transparent shadow-lg shadow-indigo-950/20' 
                  : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {(acc.accountType || acc.type || 'Bank A/c').toUpperCase()}
                </span>
                <span className={`text-[11px] flex items-center gap-1 ${
                  isSelected ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
                </span>
              </div>

              <div className="mt-4">
                <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                  {acc.bankName}
                </h4>
                <div className={`text-2xl font-bold tracking-tight mt-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  ₹{acc.currentBalance.toLocaleString('en-IN')}
                </div>
                <div className={`text-xs mt-2 font-mono ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                  A/c: {acc.accountNumber}
                </div>
              </div>

              <div className={`mt-4 pt-3 border-t text-[11px] flex justify-between items-center ${
                isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-400'
              }`}>
                <span>IFSC: {acc.ifscCode}</span>
                <span>Branch: {acc.branch}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail / Reconciliation Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Sub-header navigation */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">
              Workspace: {selectedAccount.bankName} ({selectedAccount.accountNumber})
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button 
              onClick={() => setActiveTab('reconciliation')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'reconciliation' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reconciliation (BRS)
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'transactions' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bank Statement Feed
            </button>
            <button 
              onClick={() => setActiveTab('transfers')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'transfers' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inter-Account Transfer
            </button>
          </div>
        </div>

        {/* BRS Comparison Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-indigo-50/40 border-b border-indigo-100/60">
          <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Bank Statement Balance</div>
            <div className="text-xl font-bold text-slate-900 mt-1">₹{selectedAccount.currentBalance.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Live feed connected
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">General Ledger Book Balance</div>
            <div className="text-xl font-bold text-slate-900 mt-1">₹{(selectedAccount.currentBalance - 1450).toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 mt-1">GL Account #1010</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Unreconciled Difference</div>
            <div className="text-xl font-bold text-amber-600 mt-1">₹1,450.00</div>
            <div className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> 1 unposted bank charge
            </div>
          </div>
        </div>

        {/* BRS Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/70">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4 text-right">Bank Statement</th>
                <th className="py-3 px-4 text-right">ERP Ledger</th>
                <th className="py-3 px-4 text-right">Difference</th>
                <th className="py-3 px-4 text-center">Match Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reconItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-600">{item.date}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{item.desc}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                    {item.bankAmount >= 0 ? `₹${item.bankAmount.toLocaleString('en-IN')}` : `-₹${Math.abs(item.bankAmount).toLocaleString('en-IN')}`}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                    {item.bookAmount !== 0 ? (item.bookAmount >= 0 ? `₹${item.bookAmount.toLocaleString('en-IN')}` : `-₹${Math.abs(item.bookAmount).toLocaleString('en-IN')}`) : '—'}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-bold ${item.diff === 0 ? 'text-slate-400' : 'text-amber-600'}`}>
                    {item.diff === 0 ? '₹0.00' : `₹${item.diff.toLocaleString('en-IN')}`}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Matched' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.status === 'Unmatched' ? (
                      <button className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-semibold transition">
                        Post to GL
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs">Locked</span>
                    )}
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
