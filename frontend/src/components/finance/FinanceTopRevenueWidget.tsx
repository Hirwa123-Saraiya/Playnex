import React, { useState } from 'react';
import { mockTopSellingItems } from '../../mock/FinanceMockData';
import { ChevronDown, Sparkles } from 'lucide-react';

export const FinanceTopRevenueWidget: React.FC = () => {
  const [filter, setFilter] = useState<'This Month' | 'Last Month'>('This Month');

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header matching image */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          Top Selling Items (Bar & Kitchen)
        </h3>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-1.5 pl-3 pr-7 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Table matching reference image */}
      <div className="overflow-x-auto my-3">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Item</th>
              <th className="py-2.5 px-3 text-center">Quantity</th>
              <th className="py-2.5 px-3 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockTopSellingItems.map((item) => (
              <tr key={item.rank} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 font-black text-slate-400">
                  {item.rank}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none">{item.icon}</span>
                    <span className="font-extrabold text-slate-900">{item.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                  {item.quantity}
                </td>
                <td className="py-2.5 px-3 text-right font-black text-slate-900 whitespace-nowrap">
                  ₹ {item.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Total F&B Volume: <strong className="text-slate-800">1,140 Units</strong></span>
        <span>Gross F&B Sales: <strong className="text-emerald-700 font-extrabold">₹1.55 Lakhs</strong></span>
      </div>
    </div>
  );
};
