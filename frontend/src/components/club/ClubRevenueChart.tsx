'use client';

import React, { useState } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useClub } from '../../context/ClubContext';

// Custom tooltip for Recharts to match Playnex enterprise design
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);
    return (
      <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-800 z-50 min-w-[170px]">
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2">
          {label} • Total: ₹ {total.toLocaleString('en-IN')}
        </p>
        <div className="space-y-1 text-[11px]">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex justify-between items-center gap-3">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-semibold text-slate-100">
                ₹ {Number(entry.value).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ClubRevenueChart: React.FC = () => {
  const {
    revenueDepartments,
    revenueTrend,
    timeframe,
    setTimeframe,
    selectedBranch,
  } = useClub();

  const totalRevenue = revenueDepartments.reduce((acc, curr) => acc + curr.amount, 0);

  // Format tick numbers on Y-Axis
  const formatYAxis = (val: number) => {
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(0)}L`;
    if (val >= 1000) return `₹ ${(val / 1000).toFixed(0)}k`;
    return `₹ ${val}`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[500px] h-full overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Revenue Overview
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <TrendingUp className="w-3 h-3 flex-shrink-0" />
              +15% Growth
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 break-words">
            Real-time financial performance at{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>

        {/* Timeframe Filter Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="appearance-none text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 pl-3 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="30days">Last 30 Days</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">Financial Year</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid: Chart on Left (60-65%), Breakdown on Right (35-40%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pt-5 flex-1 min-w-0">
        {/* Left: Recharts Responsive Stacked Bar Chart */}
        <div className="xl:col-span-7 flex flex-col justify-between min-w-0">
          <div className="w-full h-64 sm:h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueTrend}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                barSize={18}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.7} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* Stacked bars matching design palette */}
                <Bar dataKey="restaurant" name="Restaurant" stackId="rev" fill="#F97316" radius={[0, 0, 0, 0]} />
                <Bar dataKey="bar" name="Bar" stackId="rev" fill="#8B5CF6" />
                <Bar dataKey="courts" name="Courts" stackId="rev" fill="#0284C7" />
                <Bar dataKey="membership" name="Membership" stackId="rev" fill="#10B981" />
                <Bar dataKey="events" name="Events" stackId="rev" fill="#EC4899" />
                <Bar dataKey="others" name="Others" stackId="rev" fill="#64748B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600 min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#F97316] flex-shrink-0" /> Restaurant
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#8B5CF6] flex-shrink-0" /> Bar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0284C7] flex-shrink-0" /> Courts
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981] flex-shrink-0" /> Membership
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#EC4899] flex-shrink-0" /> Events
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#64748B] flex-shrink-0" /> Others
            </span>
          </div>
        </div>

        {/* Right: Revenue by Department Breakdown */}
        <div className="xl:col-span-5 bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100 flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 min-w-0">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider truncate">
                Revenue by Department
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 ml-2 whitespace-nowrap">
                ₹ {totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-3 pt-1 min-w-0">
              {revenueDepartments.map((dept) => (
                <div key={dept.department} className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between text-xs min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="font-semibold text-slate-700 truncate">
                        {dept.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="font-bold text-slate-900">
                        {dept.formattedAmount}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 w-7 text-right">
                        {dept.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Progress Indicator */}
                  <div className="h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${dept.percentage}%`,
                        backgroundColor: dept.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 min-w-0">
            <span className="truncate mr-2">POS & Online Gateways</span>
            <span className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap flex-shrink-0">
              Download GST Audit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
