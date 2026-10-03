import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { mockExpenseBreakdown } from '../../mock/FinanceMockData';
import { ChevronDown } from 'lucide-react';

export const FinanceExpenseChart: React.FC = () => {
  const [filter, setFilter] = useState<'This Month' | 'Last Month'>('This Month');

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header matching image */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          Expense Breakdown
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

      {/* Donut & Legend Grid */}
      <div className="flex flex-col sm:flex-row items-center gap-4 my-4">
        {/* Donut Chart with center value */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockExpenseBreakdown}
                innerRadius={48}
                outerRadius={68}
                paddingAngle={3}
                dataKey="amount"
              >
                {mockExpenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => [`₹${(val / 100000).toFixed(2)}L`, 'Expense']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm font-black text-slate-900">₹18.32L</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend list matching image */}
        <div className="space-y-2 flex-1 w-full text-xs">
          {mockExpenseBreakdown.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-slate-700">{item.name}</span>
              </div>
              <span className="font-black text-slate-900">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Major cost: <strong className="text-slate-800">Salaries (45%)</strong></span>
        <span>Burn rate: <strong className="text-rose-600">On Target</strong></span>
      </div>
    </div>
  );
};
