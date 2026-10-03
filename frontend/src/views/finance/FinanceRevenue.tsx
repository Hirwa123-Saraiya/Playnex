import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Building,
  Users,
  Trophy,
  Filter,
  Download,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const FinanceRevenue: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');

  const revenueSources = [
    { source: 'Membership Subscription', amount: 820000, growth: 14.2, share: 28.8, dept: 'Membership' },
    { source: 'Court & Pitch Bookings', amount: 650000, growth: 9.8, share: 22.8, dept: 'Court Booking' },
    { source: 'Restaurant & Dining', amount: 320000, growth: 12.0, share: 11.2, dept: 'Restaurant' },
    { source: 'The 19th Hole Bar', amount: 190000, growth: 18.5, share: 6.7, dept: 'Bar' },
    { source: 'Pro Sports Shop Sales', amount: 480000, growth: 7.4, share: 16.9, dept: 'Shop' },
    { source: 'Banquets & Private Galas', amount: 180000, growth: 15.0, share: 6.3, dept: 'Banquet' },
    { source: 'Coaching Clinics & Academy', amount: 150000, growth: 8.2, share: 5.3, dept: 'Coaching' },
    { source: 'Events & Tournament Entry', amount: 230000, growth: 22.4, share: 8.1, dept: 'Events' },
    { source: 'Corporate Sponsorships', amount: 120000, growth: 5.0, share: 4.2, dept: 'Sponsorship' },
    { source: 'Guest Passes & Day Pool', amount: 45000, growth: 11.2, share: 1.6, dept: 'Guest Pass' },
    { source: 'Display Advertising Panels', amount: 35000, growth: 4.0, share: 1.2, dept: 'Advertising' },
  ];

  const membershipTypes = [
    { type: 'Individual Member', count: 1420, revenue: 426000, color: '#3B82F6' },
    { type: 'Family Royal Plan', count: 680, revenue: 272000, color: '#10B981' },
    { type: 'Corporate Patron', count: 48, revenue: 96000, color: '#8B5CF6' },
    { type: 'Student / Junior Athlete', count: 310, revenue: 26000, color: '#F59E0B' },
  ];

  const monthlyTrend = [
    { month: 'May', revenue: 2180000, target: 2000000 },
    { month: 'Jun', revenue: 2340000, target: 2100000 },
    { month: 'Jul', revenue: 2490000, target: 2250000 },
    { month: 'Aug', revenue: 2620000, target: 2400000 },
    { month: 'Sep', revenue: 2710000, target: 2550000 },
    { month: 'Oct', revenue: 2845000, target: 2700000 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Revenue Intelligence & Income Streams
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Multi-facility revenue tracking across 12 club departments, membership renewals, and sponsorships.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting full Revenue Breakdown CSV...')}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-2xl shadow-2xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 3 High-Level Revenue Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Monthly Revenue</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">₹ 28,45,000</span>
          <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12.0% above budget target
          </span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Membership Renewals Rate</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">94.2%</span>
          <span className="text-xs text-slate-500 mt-1 block">2,458 active members enrolled</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average Revenue Per User (ARPU)</span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">₹ 1,157</span>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">+8.4% YoY enhancement</span>
        </div>
      </div>

      {/* Charts Row: Revenue Growth Trend & Membership Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend line (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Monthly Revenue vs Budget Target
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Last 6 Months
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip formatter={(v: number) => [`₹${(v / 100000).toFixed(2)} Lakhs`, '']} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} name="Actual Revenue" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" stroke="#94A3B8" strokeDasharray="5 5" strokeWidth={2} name="Budget Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Membership Tier Analytics (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Membership Category Revenue
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ₹8.20L Total
            </span>
          </div>

          <div className="space-y-3">
            {membershipTypes.map((tier) => (
              <div key={tier.type} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">{tier.type}</span>
                  <span className="font-black text-slate-900">₹{tier.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>{tier.count} Enrolled Members</span>
                  <span>{Math.round((tier.revenue / 820000) * 100)}% of membership pool</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 12-Department Revenue Sources Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs overflow-hidden">
        <h3 className="text-base font-extrabold text-slate-900 mb-3">
          Facility & Stream Revenue Breakdown
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Revenue Stream</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Turnover</th>
                <th className="py-3 px-4 text-center">Share of Total</th>
                <th className="py-3 px-4 text-right">Growth MoM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {revenueSources.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{item.source}</td>
                  <td className="py-2.5 px-4">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                      {item.dept}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-black text-slate-900">
                    ₹ {item.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-center font-bold text-slate-600">
                    {item.share}%
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-emerald-600">
                    +{item.growth}%
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
