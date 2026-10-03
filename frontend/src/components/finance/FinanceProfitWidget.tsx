import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { mockRevenueDistribution } from '../../mock/FinanceMockData';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export const FinanceProfitWidget: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header matching image */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          Revenue Distribution
        </h3>

        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-black">
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+12% MoM</span>
        </div>
      </div>

      {/* Donut and Legend matching reference image */}
      <div className="flex flex-col sm:flex-row items-center gap-4 my-4">
        {/* Donut Chart with center value ₹28.45L Total */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockRevenueDistribution}
                innerRadius={48}
                outerRadius={68}
                paddingAngle={3}
                dataKey="amount"
              >
                {mockRevenueDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => [`₹${(val / 100000).toFixed(2)}L`, 'Revenue']}
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
            <span className="text-sm font-black text-slate-900">₹28.45L</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend list matching reference image */}
        <div className="space-y-2 flex-1 w-full text-xs">
          {mockRevenueDistribution.map((item) => (
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
        <span>Operating Margin: <strong className="text-emerald-700 font-extrabold">35.6%</strong></span>
        <span>Net Surplus: <strong className="text-slate-900">₹10.13 Lakhs</strong></span>
      </div>
    </div>
  );
};
