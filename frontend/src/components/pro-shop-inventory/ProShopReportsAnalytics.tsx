import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  ArrowUpRight,
  PieChart as PieIcon,
  Download,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { mockMonthlySalesTrend, mockCategoryRevenue } from '../../mock/ProShopInventoryMockData';
import { useProShopStore } from '../../store/ProShopInventoryStore';

export const ProShopReportsAnalytics: React.FC = () => {
  const { products, alerts } = useProShopStore();

  const totalSalesMTD = 437000;
  const inventoryValuation = products.reduce((acc, curr) => acc + (curr.availableStock * curr.costPrice), 0);
  const productsSoldToday = products.reduce((acc, curr) => acc + curr.soldToday, 0);
  const lowStockCount = alerts.length;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
            10
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Reports & Analytics</h2>
            <p className="text-xs text-slate-500 font-medium">Executive analytics on sports equipment turnover, profit margins and channel velocity</p>
          </div>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
          <Download className="w-3.5 h-3.5" />
          Export Executive MIS
        </button>
      </div>

      {/* 4 KPI Cards (Faithful to Reference Image Card 10) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total Sales (MTD)</span>
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white"><DollarSign className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{(totalSalesMTD / 100000).toFixed(2)}L</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +15.2% vs previous month
          </p>
        </div>

        {/* Inventory Value */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Inventory Valuation</span>
            <span className="p-1.5 rounded-lg bg-blue-600 text-white"><Package className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{(inventoryValuation / 100000).toFixed(2)}L</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">268 units at landed cost</p>
        </div>

        {/* Products Sold Today */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Sold Today</span>
            <span className="p-1.5 rounded-lg bg-amber-600 text-white"><BarChart3 className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{productsSoldToday} Units</div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Across 18 member transactions</p>
        </div>

        {/* Low Stock Products */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Low Stock Warnings</span>
            <span className="p-1.5 rounded-lg bg-rose-600 text-white"><AlertTriangle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">{lowStockCount} Items</div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">Below minimum threshold</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Sales Breakdown (POS vs Online) */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Sales Trend (Counter vs Online)</h3>
              <p className="text-xs text-slate-500">Historical performance in ₹ INR</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              6-Month Growth: +105%
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlySalesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="inStore" name="Counter POS" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="online" name="Online Store" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Revenue Distribution Donut */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Category Revenue Share</h3>
            <p className="text-xs text-slate-500">Merchandise distribution %</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryRevenue}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {mockCategoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
            {mockCategoryRevenue.map(c => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.fill }} />
                <span className="text-slate-600 font-medium">{c.name}</span>
                <span className="font-bold text-slate-900 ml-auto">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fast Moving vs Slow Moving Products Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fast Moving */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Fast Moving Products (Top Velocity)
          </span>
          <div className="space-y-2 text-xs">
            {[
              { name: 'Wilson Championship Tennis Balls (3-Pack Can)', sold: '142 units/mo', turn: '4.8x' },
              { name: 'Playnex Official Club Performance T-Shirt', sold: '85 units/mo', turn: '3.6x' },
              { name: 'Tourna Grip Original Dry Feel (10-Pack)', sold: '64 units/mo', turn: '3.2x' },
            ].map((i, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">{i.name}</span>
                <div className="text-right">
                  <span className="font-bold text-emerald-600">{i.sold}</span>
                  <span className="text-[10px] text-slate-400 block">Turnover: {i.turn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slow Moving */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
          <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Slow Moving Products (Action Needed)
          </span>
          <div className="space-y-2 text-xs">
            {[
              { name: 'Stainless Steel Insulated Club Bottle', stock: '0 units', days: '42 days idle' },
              { name: 'Wilson Super Tour 9-Racket Thermal Bag', stock: '9 units', days: '35 days idle' },
              { name: 'Nike Court Air Zoom Vapor Pro 2 Shoes', stock: '5 units', days: '28 days idle' },
            ].map((i, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">{i.name}</span>
                <div className="text-right">
                  <span className="font-bold text-amber-600">{i.stock}</span>
                  <span className="text-[10px] text-slate-400 block">{i.days}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
