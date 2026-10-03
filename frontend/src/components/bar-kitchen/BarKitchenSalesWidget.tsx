import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Calendar,
  PieChart as PieIcon,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export const BarKitchenSalesWidget: React.FC = () => {
  const [period, setPeriod] = useState<'Today' | 'Week' | 'Month'>('Today');

  const categoryData = [
    { name: 'Food', value: 45, color: '#3B82F6', label: '45%' },
    { name: 'Beverages', value: 25, color: '#10B981', label: '25%' },
    { name: 'Snacks', value: 15, color: '#F59E0B', label: '15%' },
    { name: 'Combos', value: 10, color: '#8B5CF6', label: '10%' },
    { name: 'Others', value: 5, color: '#EC4899', label: '5%' },
  ];

  const topItems = [
    { name: 'Coffee', count: 120, width: '100%', color: 'bg-blue-500' },
    { name: 'Burger', count: 95, width: '79%', color: 'bg-indigo-500' },
    { name: 'French Fries', count: 80, width: '66%', color: 'bg-amber-500' },
    { name: 'Pizza', count: 60, width: '50%', color: 'bg-emerald-500' },
    { name: 'Sandwich', count: 50, width: '41%', color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-5">
      {/* Header with Title & Date Selector */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Executive Analytics
          </span>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Sales Dashboard</span>
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          {(['Today', 'Week', 'Month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                period === p ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row (Matching image: Total Sales ₹28,450, Orders 124, Avg Order Value ₹230) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-blue-100">Total Sales</span>
            <span className="text-[11px] font-extrabold bg-white/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              12%
            </span>
          </div>
          <div className="text-2xl font-black mt-2">₹28,450</div>
          <span className="text-[10px] text-blue-200 block mt-0.5">vs yesterday</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-emerald-100">Orders</span>
            <span className="text-[11px] font-extrabold bg-white/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              8%
            </span>
          </div>
          <div className="text-2xl font-black mt-2">124</div>
          <span className="text-[10px] text-emerald-200 block mt-0.5">Active kitchen throughput</span>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-amber-100">Avg Order Value</span>
            <span className="text-[11px] font-extrabold bg-white/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              5%
            </span>
          </div>
          <div className="text-2xl font-black mt-2">₹230</div>
          <span className="text-[10px] text-amber-200 block mt-0.5">₹34 per cover increase</span>
        </div>
      </div>

      {/* Two Column Visual Widgets (Sales by Category & Top Selling Items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Sales By Category Pie Chart & Legend */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
            Sales By Category
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Items Bar Progress */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
            Top Selling Items
          </h4>
          <div className="space-y-2.5">
            {topItems.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">{item.name}</span>
                  <span className="font-extrabold text-slate-900">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
