'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, ExternalLink, Flame, IndianRupee, Loader2, ReceiptText, Table2, UtensilsCrossed } from 'lucide-react';
import { useClub } from '../context/ClubContext';
import { restaurantService } from '../services/restaurant.service';

type RestaurantOverview = {
  todaySales: number;
  todayOrders: number;
  avgOrderValue: number;
  activeKots: number;
  activeTables: number;
  totalTables: number;
  liveKots: Array<{ order_id: string; table_number: string; member_name: string; items: Array<{ name: string; quantity: number }>; total_amount: number; status: string; created_at: string }>;
  recentOrders: Array<{ order_id: string; table_number: string; member_name: string; subtotal: number; gstAmount: number; grandTotal: number; status: string; created_at: string }>;
};

const money = (value: number) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const ClubRestaurant: React.FC = () => {
  const { club } = useClub();
  const [data, setData] = useState<RestaurantOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void restaurantService.getOverview(club.tenantId)
      .then((response) => { if (response.success && response.data) setData(response.data as RestaurantOverview); })
      .finally(() => setLoading(false));
  }, [club.tenantId]);

  if (loading && !data) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#1565D8]" /></div>;

  const metrics = [
    { label: 'Sales today', value: money(data?.todaySales || 0), detail: 'Restaurant orders', icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Orders today', value: data?.todayOrders || 0, detail: 'Orders saved today', icon: ReceiptText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Tables in service', value: `${data?.activeTables || 0}/${data?.totalTables || 24}`, detail: 'Live occupancy', icon: Table2, color: 'text-violet-600 bg-violet-50' },
    { label: 'Kitchen queue', value: data?.activeKots || 0, detail: 'Orders in progress', icon: Flame, color: 'text-amber-600 bg-amber-50' },
  ];

  return <div className="space-y-6 pb-12 font-sans">
    <div className="flex flex-col gap-4 rounded-2xl border border-[#D9E6F5] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-wider text-[#1565D8]">F&B department overview</p><h1 className="mt-1 text-xl font-extrabold text-[#0B1F4D]">Restaurant & Bar Operations</h1><p className="mt-1 text-sm text-[#64748B]">Live sales, occupancy, and kitchen activity for {club.name}.</p></div>
      <a href="/bar-kitchen" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 self-start rounded-xl bg-[#1565D8] px-4 py-2 text-xs font-bold text-white hover:bg-[#0E5BD8]"><UtensilsCrossed className="h-4 w-4" />Open Bar & Kitchen<ExternalLink className="h-3.5 w-3.5" /></a>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{metrics.map(({ label, value, detail, icon: Icon, color }) => <div key={label} className="rounded-xl border border-[#D9E6F5] bg-white p-4 shadow-sm"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></span><p className="mt-3 text-xl font-extrabold text-[#0B1F4D]">{value}</p><p className="text-[11px] font-bold text-[#64748B]">{label}</p><p className="mt-1 text-[10px] text-slate-400">{detail}</p></div>)}</div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2 overflow-hidden rounded-2xl border border-[#D9E6F5] bg-white shadow-sm"><div className="border-b border-[#D9E6F5] p-4"><h2 className="text-sm font-bold text-[#0B1F4D]">Recent dining orders</h2><p className="mt-0.5 text-xs text-[#64748B]">All figures are calculated from saved restaurant orders.</p></div><div className="divide-y divide-[#D9E6F5]/60">{data?.recentOrders?.length ? data.recentOrders.map((order) => <div key={order.order_id} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 text-xs"><div><p className="font-bold text-[#0B1F4D]">{order.member_name || 'Walk-in customer'}</p><p className="mt-0.5 text-[#64748B]">{order.table_number || 'Counter'} · {order.status}</p></div><div className="text-right"><p className="font-extrabold text-[#0B1F4D]">{money(order.grandTotal)}</p><p className="mt-0.5 text-[10px] text-emerald-600">GST {money(order.gstAmount)}</p></div></div>) : <p className="p-8 text-center text-sm text-slate-400">No restaurant orders have been recorded yet.</p>}</div></section>
      <section className="rounded-2xl border border-[#D9E6F5] bg-white p-4 shadow-sm"><div className="flex items-center justify-between border-b border-[#D9E6F5] pb-3"><h2 className="text-sm font-bold text-[#0B1F4D]">Live kitchen queue</h2><span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">{data?.activeKots || 0} active</span></div><div className="mt-3 space-y-2">{data?.liveKots?.length ? data.liveKots.slice(0, 5).map((order) => <div key={order.order_id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"><div className="flex justify-between gap-2"><span className="font-bold text-[#0B1F4D]">{order.table_number || 'Counter'}</span><span className="capitalize text-[#64748B]">{order.status}</span></div><p className="mt-1 line-clamp-2 text-[11px] text-[#64748B]">{(order.items || []).map((item) => `${item.name} ×${item.quantity}`).join(', ')}</p></div>) : <p className="py-8 text-center text-xs text-slate-400">Kitchen queue is clear.</p>}</div><a href="/bar-kitchen" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#D9E6F5] py-2.5 text-xs font-bold text-[#0B1F4D] hover:bg-slate-50">Open POS <ArrowRight className="h-3.5 w-3.5" /></a></section>
    </div>
  </div>;
};
