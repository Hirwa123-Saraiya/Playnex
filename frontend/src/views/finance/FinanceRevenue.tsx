'use client';

import React, { useState, useEffect } from 'react';
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
  Loader2,
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
import {
  financeService,
  RevenueSourceItem,
  MembershipTypeItem,
  MonthlyTrendItem,
} from '@/services/finance.service';

export const FinanceRevenue: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  const [loading, setLoading] = useState(true);

  // Live Database States
  const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState<number>(0);
  const [arpu, setArpu] = useState<number>(0);
  const [activeMembers, setActiveMembers] = useState<number>(0);
  const [revenueSources, setRevenueSources] = useState<RevenueSourceItem[]>([]);
  const [membershipTypes, setMembershipTypes] = useState<MembershipTypeItem[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadFinanceData() {
      try {
        setLoading(true);
        const res = await financeService.getFinanceData();
        if (isMounted && res.success && res.data) {
          const { summary, revenueSources: sources, membershipTypes: types, monthlyTrend: trend } = res.data;
          setTotalMonthlyRevenue(summary.totalMonthlyRevenue || summary.grossRevenue || 0);
          setArpu(summary.arpu || 0);
          setActiveMembers(summary.activeMembers || 0);
          if (sources) setRevenueSources(sources);
          if (types) setMembershipTypes(types);
          if (trend) setMonthlyTrend(trend);
        }
      } catch (err) {
        console.error('Failed to load database finance revenue data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFinanceData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExportCsv = () => {
    const headers = ['Revenue Stream', 'Department', 'Turnover (INR)', 'Share (%)', 'Growth (%)'];
    const rows = revenueSources.map((r) => [r.source, r.dept, r.amount, `${r.share}%`, `+${r.growth}%`]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Club_Revenue_Breakdown_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue" size={32} />
      </div>
    );
  }

  const membershipTotal = membershipTypes.reduce((s, t) => s + t.revenue, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Revenue Intelligence &amp; Income Streams
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Live database revenue tracking across club operations, bookings, member subscriptions and facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-2xl shadow-2xs flex items-center gap-1.5 transition-colors"
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
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            ₹ {totalMonthlyRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Live PostgreSQL database sync
          </span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Membership Enrolled</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            {activeMembers} Active Members
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {membershipTypes.length} active membership categories
          </span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average Revenue Per User (ARPU)</span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">
            ₹ {arpu.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">
            Calculated from active member ledger
          </span>
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
              Live Database Aggregation
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
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
              ₹ {membershipTotal.toLocaleString('en-IN')} Total
            </span>
          </div>

          <div className="space-y-3">
            {membershipTypes.map((tier) => {
              const pct = membershipTotal > 0 ? Math.round((tier.revenue / membershipTotal) * 100) : 0;
              return (
                <div key={tier.type} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-800">{tier.type}</span>
                    <span className="font-black text-slate-900">₹ {tier.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>{tier.count} Enrolled Members</span>
                    <span>{pct}% of membership pool</span>
                  </div>
                </div>
              );
            })}
            {membershipTypes.length === 0 && (
              <div className="py-8 text-center text-xs text-muted">
                No active membership plans found in database.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Facility & Stream Revenue Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs overflow-hidden">
        <h3 className="text-base font-extrabold text-slate-900 mb-3">
          Facility &amp; Stream Revenue Breakdown
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
                    ₹ {item.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-4 text-center font-bold text-slate-600">
                    {item.share}%
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-emerald-600">
                    +{item.growth}%
                  </td>
                </tr>
              ))}
              {revenueSources.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No revenue records available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
