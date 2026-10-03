import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { mockRevenueByDepartment } from '../../mock/FinanceMockData';
import { ChevronDown } from 'lucide-react';

interface FinanceRevenueChartProps {
  title?: string;
  data?: typeof mockRevenueByDepartment;
}

export const FinanceRevenueChart: React.FC<FinanceRevenueChartProps> = ({
  title = 'Revenue by Department',
  data = mockRevenueByDepartment,
}) => {
  const [filter, setFilter] = useState<'This Month' | 'Last Month' | 'Quarter'>('This Month');

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header matching image */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          {title}
        </h3>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-1.5 pl-3 pr-7 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="Quarter">This Quarter</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: -15, bottom: 5 }}>
            <XAxis
              dataKey="department"
              stroke="#94A3B8"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tickFormatter={(v) => `${v / 100000}L`}
              domain={[0, 1000000]}
              ticks={[0, 200000, 400000, 600000, 800000, 1000000]}
            />
            <Tooltip
              formatter={(val: number) => [`₹${(val / 100000).toFixed(2)} Lakhs`, 'Revenue']}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]} barSize={36}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Summary */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Highest: <strong className="text-slate-800">Memberships (8.2L)</strong></span>
        <span>Total Depts: <strong className="text-slate-800">6 Active</strong></span>
      </div>
    </div>
  );
};
