import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { mockCashFlowData } from '../../mock/FinanceMockData';
import { ChevronDown, Wallet } from 'lucide-react';

export const FinanceCashFlowWidget: React.FC = () => {
  const [filter, setFilter] = useState<'This Month' | 'Last Month'>('This Month');

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header matching image */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          Cash Flow
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

      {/* Cash Flow Balance Table matching reference image */}
      <div className="my-3 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span>Opening Balance</span>
          <span className="font-extrabold text-slate-900">
            ₹ {mockCashFlowData.openingBalance.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Total Inflow</span>
          <span className="font-extrabold text-emerald-600">
            ₹ {mockCashFlowData.totalInflow.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Total Outflow</span>
          <span className="font-extrabold text-rose-600">
            ₹ {mockCashFlowData.totalOutflow.toLocaleString()}
          </span>
        </div>

        {/* Highlighted Closing Balance Row matching reference image */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-900 font-black">
          <span>Closing Balance</span>
          <span className="text-sm">
            ₹ {mockCashFlowData.closingBalance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Legend & Mini Weekly Inflow vs Outflow Bar Chart matching image */}
      <div>
        <div className="flex items-center justify-end gap-3 text-[11px] font-bold mb-2">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Inflow
          </span>
          <span className="flex items-center gap-1.5 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Outflow
          </span>
        </div>

        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockCashFlowData.weeklyTrend}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            >
              <XAxis
                dataKey="week"
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v / 100000}L`}
              />
              <Tooltip
                formatter={(val: number) => [`₹${(val / 100000).toFixed(1)}L`, '']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="inflow" fill="#10B981" radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="outflow" fill="#F43F5E" radius={[4, 4, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
