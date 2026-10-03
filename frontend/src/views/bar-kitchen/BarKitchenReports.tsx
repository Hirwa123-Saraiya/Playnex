import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  IndianRupee,
  Layers,
  PieChart as PieIcon,
  ChefHat,
  Users,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const BarKitchenReports: React.FC = () => {
  const [reportType, setReportType] = useState<'sales' | 'gst' | 'kitchen' | 'profitability'>('sales');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const dailyWeeklyData = [
    { day: 'Mon', revenue: 38400, cost: 13200, profit: 25200 },
    { day: 'Tue', revenue: 42100, cost: 14500, profit: 27600 },
    { day: 'Wed', revenue: 39500, cost: 13800, profit: 25700 },
    { day: 'Thu', revenue: 46800, cost: 16100, profit: 30700 },
    { day: 'Fri', revenue: 64200, cost: 21800, profit: 42400 },
    { day: 'Sat', revenue: 89500, cost: 29500, profit: 60000 },
    { day: 'Sun', revenue: 94200, cost: 31200, profit: 63000 },
  ];

  const gstBreakdown = [
    { category: 'Food & Non-Alc (5% GST)', turnover: 248000, cgst: 6200, sgst: 6200, totalTax: 12400 },
    { category: 'Alcohol & Bar (State VAT 20%)', turnover: 112000, cgst: 0, sgst: 22400, totalTax: 22400 },
    { category: 'Banquet & Events (18% GST)', turnover: 180000, cgst: 16200, sgst: 16200, totalTax: 32400 },
  ];

  const kitchenSpeedData = [
    { station: 'Grill Station', avgPrepMins: 11.2, targetMins: 12, orders: 142 },
    { station: 'Pizza Station', avgPrepMins: 14.6, targetMins: 15, orders: 98 },
    { station: 'Main Course', avgPrepMins: 16.4, targetMins: 15, orders: 184 },
    { station: 'Snacks Station', avgPrepMins: 7.8, targetMins: 8, orders: 210 },
    { station: 'Beverage Station', avgPrepMins: 3.9, targetMins: 5, orders: 340 },
    { station: 'Bar Station', avgPrepMins: 4.2, targetMins: 5, orders: 195 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Hospitality Intelligence & Financial Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit-grade P&L profitability, GST tax filings, KDS speed benchmarks, and inventory depletion.
          </p>
        </div>

        <button
          onClick={() => alert('Generating XLSX and PDF export for accounting...')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Export Excel / PDF Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'sales', label: 'Sales & Revenue Analysis' },
            { id: 'gst', label: 'GST & Tax Filings' },
            { id: 'kitchen', label: 'Kitchen & KDS Speed' },
            { id: 'profitability', label: 'Food Cost & Margins' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          {(['daily', 'weekly', 'monthly'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                timeRange === r ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dynamic Report Views */}
      {reportType === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <h3 className="text-base font-black text-slate-900">
              Weekly Revenue vs Food Cost vs Net Gross Margin
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyWeeklyData}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip formatter={(value) => [`₹${value}`, '']} />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Total Revenue" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="cost" fill="#F43F5E" name="Ingredient Cost" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="profit" fill="#10B981" name="Gross Profit" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {reportType === 'gst' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">GST-B2C Tax Filing Schedule (GSTR-1 & GSTR-3B)</h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tax Head</th>
                  <th className="py-3 px-4">Taxable Turnover</th>
                  <th className="py-3 px-4">CGST</th>
                  <th className="py-3 px-4">SGST / State VAT</th>
                  <th className="py-3 px-4 text-right">Total Tax Liability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {gstBreakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.category}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">₹{item.turnover.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-600">₹{item.cgst.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-600">₹{item.sgst.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">₹{item.totalTax.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'kitchen' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">Kitchen Station Performance & KDS SLA Adherence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kitchenSpeedData.map((st) => (
              <div key={st.station} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <span className="font-extrabold text-sm text-slate-900 block">{st.station}</span>
                <span className="text-xs text-slate-500 block">{st.orders} Orders Fulfilled</span>
                <div className="mt-3 flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Average Prep Time:</span>
                  <span className={st.avgPrepMins <= st.targetMins ? 'text-emerald-700' : 'text-rose-600'}>
                    {st.avgPrepMins} mins (Target: {st.targetMins}m)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reportType === 'profitability' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
          <h3 className="text-base font-black text-slate-900">Category Profit Margin Contribution</h3>
          <p className="text-xs text-slate-500">
            Beverages and Snacks carry the highest gross profit margin (75-80%), while Main Course proteins maintain a healthy 66-70% margin.
          </p>
        </div>
      )}
    </div>
  );
};
