'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClub } from '../context/ClubContext';
import { proShopService, ProShopOverviewData } from '../services/proShop.service';
import {
  ShoppingBag,
  ExternalLink,
  Package,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  Key,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  RefreshCw,
  Plus,
  Landmark,
  ShieldCheck,
} from 'lucide-react';

export const ClubProShop: React.FC = () => {
  const router = useRouter();
  const { club } = useClub();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProShopOverviewData | null>(null);
  const [copied, setCopied] = useState(false);
  const [restockingId, setRestockingId] = useState<string | null>(null);

  const clubClean = (club.name || 'club').toLowerCase().replace(/[^a-z0-9]/g, '');
  const staffEmail = `shop.${clubClean}@playnex.com`;

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await proShopService.getOverview(club.tenantId);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching pro shop overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [club.tenantId]);

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Email: ${staffEmail}\nPassword: Playnex@2026`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleQuickRestock = async (itemId: string) => {
    setRestockingId(itemId);
    try {
      await proShopService.updateStock(itemId, { deltaQuantity: 10 });
      await fetchOverview();
    } catch (err) {
      console.error('Failed to restock item:', err);
    } finally {
      setRestockingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#1565D8] selection:text-white">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4D] tracking-tight">
              Pro Shop & Central Inventory Summary
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200">
              Department Overview
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Executive stock valuation, inventory health, and counter revenue summary for {club.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchOverview}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#0B1F4D] transition-colors"
            title="Refresh live metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#1565D8]' : ''}`} />
          </button>

          <a
            href="/pro-shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1565D8] hover:bg-[#0E5BD8] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-900/20 transition-all"
          >
            <span>Launch Standalone Pro Shop Suite</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Staff Account & Multi-Tenant Credentials Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071A3D] via-[#0B1F4D] to-[#1565D8] text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-900/40">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-cyan-300 border border-white/10 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Standalone Workstation Account Active</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                18% GST Compliant
              </span>
            </div>
            <p className="text-xs text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
              The Pro Shop operates as an independent workstation outside the club portal. Shop Cashiers log in directly
              using their assigned credentials and have access exclusively to {club.name}&apos;s inventory and POS billing.
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-slate-300 font-mono">
                Staff Email: <strong className="text-white">{staffEmail}</strong>
              </span>
              <span className="text-slate-300 font-mono">
                Pass: <strong className="text-emerald-300">Playnex@2026</strong>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyCredentials}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap self-end md:self-auto ${
            copied ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Credentials Copied!' : 'Copy Staff Login'}</span>
        </button>
      </div>

      {loading && !data ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-[#1565D8]" size={32} />
        </div>
      ) : (
        <>
          {/* Executive KPI Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0B1F4D]">
                  ₹{(data?.inventoryRetailValue || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#64748B] font-medium">Total Inventory Value (Retail)</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1565D8] flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0B1F4D]">{data?.totalStockUnits || 0} Units</div>
                <div className="text-[11px] text-[#64748B] font-medium">Across {data?.totalItems || 0} Active SKUs</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  (data?.lowStockCount || 0) > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0B1F4D]">{data?.lowStockCount || 0} Alerts</div>
                <div className="text-[11px] text-[#64748B] font-medium">Low Stock Reorders Needed</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0B1F4D]">
                  ₹{(data?.todaySales || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#64748B] font-medium">
                  Today&apos;s Sales ({data?.todayTransactions || 0} bills)
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution & Low Stock Alerts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Breakdown (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D9E6F5] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0B1F4D]">Category Stock Distribution</h3>
                  <p className="text-xs text-[#64748B]">Real-time inventory levels categorized by sport equipment</p>
                </div>
                <span className="text-xs text-[#1565D8] font-bold">
                  Cost Basis: ₹{(data?.inventoryCostValue || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="space-y-3">
                {data?.categoryDistribution?.map((cat) => {
                  const maxVal = Math.max(
                    ...(data?.categoryDistribution?.map((c) => c.categoryValue) || [100000]),
                    1
                  );
                  const pct = Math.round((cat.categoryValue / maxVal) * 100);

                  return (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#0B1F4D]">
                          {cat.category} <span className="text-[#64748B] font-normal">({cat.totalUnits} units)</span>
                        </span>
                        <span className="font-extrabold text-[#1565D8]">
                          ₹{cat.categoryValue.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#1565D8] to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low Stock Alerts Action Center */}
            <div className="bg-white rounded-2xl border border-[#D9E6F5] p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-[#0B1F4D]">Restock Alerts</h3>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Threshold &lt;= 5
                  </span>
                </div>

                <div className="space-y-2.5 mt-3">
                  {data?.lowStockItems && data.lowStockItems.length > 0 ? (
                    data.lowStockItems.map((item) => (
                      <div
                        key={item.item_id}
                        className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-xs text-[#0B1F4D] line-clamp-1">{item.name}</div>
                          <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
                            Stock: {item.stock_quantity} remaining (Min: {item.reorder_threshold})
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuickRestock(item.item_id)}
                          disabled={restockingId === item.item_id}
                          className="px-2.5 py-1 rounded-lg bg-[#1565D8] hover:bg-[#0E5BD8] text-white text-[11px] font-bold shrink-0 transition-colors"
                        >
                          {restockingId === item.item_id ? 'Updating...' : '+ Restock 10'}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                      <p className="font-semibold text-slate-700">All inventory healthy</p>
                      <p className="text-[11px] text-slate-400">No SKUs below reorder threshold</p>
                    </div>
                  )}
                </div>
              </div>

              <a
                href="/pro-shop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl border border-[#D9E6F5] bg-slate-50 hover:bg-slate-100 text-center text-xs font-bold text-[#0B1F4D] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Full Inventory Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Recent Sales & Tax Invoices Table */}
          <div className="bg-white rounded-2xl border border-[#D9E6F5] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#D9E6F5] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0B1F4D]">Recent Counter Sales & Tax Invoices</h3>
                <p className="text-xs text-[#64748B]">Audited sales recorded under {club.name} with 18% GST</p>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                18% GST Compliant
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1E293B]">
                <thead className="bg-[#F7FAFC] border-b border-[#D9E6F5] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Invoice #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Staff Operator</th>
                    <th className="px-4 py-3">Payment Method</th>
                    <th className="px-4 py-3">Subtotal</th>
                    <th className="px-4 py-3">18% GST</th>
                    <th className="px-5 py-3 text-right">Grand Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E6F5]/60">
                  {data?.recentSales && data.recentSales.length > 0 ? (
                    data.recentSales.map((sale) => (
                      <tr key={sale.sale_id} className="hover:bg-[#F7FAFC]/80 transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-[#1565D8]">{sale.sale_number}</td>
                        <td className="px-4 py-3 font-medium text-[#0B1F4D]">{sale.customer_name}</td>
                        <td className="px-4 py-3 text-[#64748B]">{sale.operator_name}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {sale.payment_method}
                          </span>
                        </td>
                        <td className="px-4 py-3">₹{parseFloat(String(sale.subtotal)).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-emerald-600 font-semibold">
                          ₹{parseFloat(String(sale.gst_amount)).toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3 text-right font-extrabold text-[#0B1F4D]">
                          ₹{parseFloat(String(sale.grand_total)).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No transactions recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
