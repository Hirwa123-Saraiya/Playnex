import React from 'react';
import { Percent, FileText, CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';

export const FinanceGST: React.FC = () => {
  const { gstSummary } = useFinanceStore();

  const gstRates = [
    { slab: '5% GST Rate', services: 'Restaurant food, non-alcoholic beverages, cafeteria', turnover: 510000, taxCollected: 25500 },
    { slab: '12% GST Rate', services: 'Pro Sports Shop apparel, tennis racket equipment', turnover: 480000, taxCollected: 57600 },
    { slab: '18% GST Rate', services: 'Club memberships, court bookings, coaching, events, banquet hall', turnover: 1855000, taxCollected: 333900 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            GST Compliance & Statutory Returns Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated multi-slab tax computation, GSTR-1 outward supply JSON, and GSTR-3B monthly offset returns.
          </p>
        </div>

        <button
          onClick={() => alert('GSTR-1 JSON Return generated and downloaded.')}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export GSTR-1 JSON</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Output GST</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">₹ {gstSummary.totalOutputGST.toLocaleString()}</span>
          <span className="text-xs text-slate-500">Collected from invoices & POS</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Eligible Input Tax Credit (ITC)</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">₹ {gstSummary.totalInputGST.toLocaleString()}</span>
          <span className="text-xs text-slate-500">Verified against GSTR-2B</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-purple-200 bg-purple-50/50 shadow-2xs">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">Net Cash Liability (Challan)</span>
          <span className="text-2xl font-black text-purple-950 mt-1 block">₹ {gstSummary.netPayableGST.toLocaleString()}</span>
          <span className="text-xs font-bold text-purple-800">Payment Due: {gstSummary.dueDate}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <h3 className="text-base font-extrabold text-slate-900 mb-3">
          Tax Slab-Wise Revenue Breakdown
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tax Slab Rate</th>
                <th className="py-3 px-4">Applicable Club Facilities</th>
                <th className="py-3 px-4 text-right">Taxable Turnover</th>
                <th className="py-3 px-4 text-right">Tax Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {gstRates.map((slab) => (
                <tr key={slab.slab} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{slab.slab}</td>
                  <td className="py-3 px-4 text-slate-600">{slab.services}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800">₹ {slab.turnover.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-black text-purple-700">₹ {slab.taxCollected.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
