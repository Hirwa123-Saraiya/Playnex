import React, { useState } from 'react';
import { Truck, Plus, Search, Star, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';

export const FinanceVendors: React.FC = () => {
  const { vendors } = useFinanceStore();
  const [search, setSearch] = useState('');

  const filtered = vendors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Vendor Master Directory & Supplier Relations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified supplier GSTINs, commercial terms, trade agreements, and payment performance history.
          </p>
        </div>

        <button
          onClick={() => alert('New Vendor Onboarding form opened.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Vendor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">{vendor.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400 font-bold block">{vendor.code} • {vendor.category}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{vendor.rating}</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">GSTIN:</span>
                  <span className="font-mono font-bold text-slate-800">{vendor.gstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Terms:</span>
                  <span className="font-bold text-blue-600">{vendor.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span>{vendor.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Total Invoiced</span>
                  <span className="font-black text-slate-900">₹{vendor.totalBilled.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Outstanding Due</span>
                  <span className="font-black text-rose-600">₹{vendor.outstandingDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => alert(`Viewing vendor ledger statement for ${vendor.name}`)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View Ledger →
              </button>
              <button
                onClick={() => alert(`Purchase Order created for ${vendor.name}`)}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                New PO
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
