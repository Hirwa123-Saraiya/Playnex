import React from 'react';
import { ShoppingBag, Plus, Truck, CheckCircle2, Clock } from 'lucide-react';

export const FinancePurchases: React.FC = () => {
  const purchaseOrders = [
    { id: 'PO-2025-01', vendor: 'Metro Cash & Carry India', department: 'Restaurant', items: 12, amount: 68000, status: 'Ordered', date: '28 Sep 2025' },
    { id: 'PO-2025-02', vendor: 'Wilson Sporting Goods Ltd', department: 'Shop', items: 45, amount: 145000, status: 'Received', date: '25 Sep 2025' },
    { id: 'PO-2025-03', vendor: 'FacilityCare Facility HVAC', department: 'Court Booking', items: 4, amount: 28500, status: 'Pending Approval', date: '02 Oct 2025' },
    { id: 'PO-2025-04', vendor: 'Apex Brewery Works & Spirits', department: 'Bar', items: 18, amount: 54000, status: 'Billed', date: '20 Sep 2025' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Procurement & Purchase Order (PO) Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            End-to-end procurement: Requisition → Purchase Order → Goods Receipt Note (GRN) → 3-Way Invoice Match.
          </p>
        </div>

        <button
          onClick={() => alert('New Purchase Order Creator opened.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Raise Purchase Order</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Line Items</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4 text-right">Total Value</th>
                <th className="py-3 px-4 text-center">GRN Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{po.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{po.vendor}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[11px]">
                      {po.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{po.items} Items</td>
                  <td className="py-3 px-4 text-slate-500">{po.date}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    ₹ {po.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        po.status === 'Received' || po.status === 'Billed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : po.status === 'Ordered'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {po.status}
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
