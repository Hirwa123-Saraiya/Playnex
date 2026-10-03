import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sliders, 
  AlertOctagon, 
  RotateCcw,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useProShopStore } from '../../store/ProShopInventoryStore';
import { InventoryTransactionType } from '../../types/ProShopInventoryTypes';

export const ProShopInventoryTransactions: React.FC = () => {
  const { transactions } = useProShopStore();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  const types: ('All' | InventoryTransactionType)[] = [
    'All',
    'Stock In',
    'Stock Out',
    'Adjustments',
    'Damaged Products',
    'Product Returns'
  ];

  const filtered = transactions.filter(t => {
    const matchesType = selectedType === 'All' || t.type === selectedType;
    const matchesSearch = t.productName.toLowerCase().includes(search.toLowerCase()) ||
                          t.transactionId.toLowerCase().includes(search.toLowerCase()) ||
                          t.remarks.toLowerCase().includes(search.toLowerCase()) ||
                          t.performedBy.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = 'Transaction ID,Product,SKU,Type,Quantity,Date,Performed By,Remarks\n';
    const rows = filtered.map(t =>
      `"${t.transactionId}","${t.productName}","${t.sku}","${t.type}",${t.quantity},"${t.date}","${t.performedBy}","${t.remarks}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Playnex_Inventory_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-sm">
            12
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inventory Movement History</h2>
            <p className="text-xs text-slate-500 font-medium">Immutable audit trail of all receipts, counter sales, returns, and write-offs</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
        >
          <Download className="w-4 h-4" />
          Export Transaction Ledger
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, product, or cashier..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-lg transition ${
                selectedType === t
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Txn ID</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Movement Type</th>
                <th className="py-3 px-3 text-center">Qty Change</th>
                <th className="py-3 px-3">Performed By</th>
                <th className="py-3 px-3">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => {
                const typeBadge = 
                  t.type === 'Stock In' ? 'bg-emerald-100 text-emerald-700' :
                  t.type === 'Stock Out' ? 'bg-blue-100 text-blue-700' :
                  t.type === 'Product Returns' ? 'bg-purple-100 text-purple-700' :
                  t.type === 'Damaged Products' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700';

                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{t.transactionId}</td>
                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">{t.date}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      <div>{t.productName}</div>
                      <span className="text-[10px] text-slate-400 font-mono font-normal">SKU: {t.sku}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${typeBadge}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`py-3.5 px-3 text-center font-black text-sm ${
                      t.quantity > 0 ? 'text-emerald-600' : 'text-slate-800'
                    }`}>
                      {t.quantity > 0 ? `+${t.quantity}` : t.quantity}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">{t.performedBy}</td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate">{t.remarks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
