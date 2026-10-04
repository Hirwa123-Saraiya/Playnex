import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, IndianRupee, LayoutList, ReceiptText, Table2, UtensilsCrossed } from 'lucide-react';
import { restaurantService } from '../../services/restaurant.service';
import { useBarKitchenStore } from '../../store/BarKitchenStore';

type Overview = {
  todaySales: number; todayOrders: number; avgOrderValue: number; activeKots: number; activeTables: number; totalTables: number;
  recentOrders: Array<{ order_id: string; member_name: string; table_number: string; grandTotal: number; status: string; created_at: string }>;
};

const money = (value: number) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const BarKitchenDashboard: React.FC = () => {
  const { setActiveNav } = useBarKitchenStore();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void restaurantService.getOverview()
      .then((response) => { if (response.success && response.data) setOverview(response.data); })
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    { label: 'Sales today', value: money(overview?.todaySales || 0), note: 'Paid restaurant orders', icon: IndianRupee, tone: 'text-emerald-600 bg-emerald-50' },
    { label: 'Orders today', value: overview?.todayOrders || 0, note: 'Orders created today', icon: ReceiptText, tone: 'text-blue-600 bg-blue-50' },
    { label: 'Active tables', value: `${overview?.activeTables || 0}/${overview?.totalTables || 24}`, note: 'Currently in service', icon: Table2, tone: 'text-violet-600 bg-violet-50' },
    { label: 'Kitchen queue', value: overview?.activeKots || 0, note: 'Orders being prepared', icon: LayoutList, tone: 'text-amber-600 bg-amber-50' },
  ];

  return <div className="space-y-6 pb-10">
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Food & beverage</p><h1 className="mt-1 text-xl font-extrabold text-slate-900">Restaurant overview</h1><p className="mt-1 text-sm text-slate-500">Live orders, tables, and service performance.</p></div>
      <div className="flex gap-2"><button onClick={() => setActiveNav('Menu Management')} className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Manage menu</button><button onClick={() => setActiveNav('Order Management')} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700"><UtensilsCrossed className="h-3.5 w-3.5" />New order</button></div>
    </section>
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map((metric) => { const Icon = metric.icon; return <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${metric.tone}`}><Icon className="h-4 w-4" /></span><p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">{metric.label}</p><p className="mt-1 text-xl font-extrabold text-slate-900">{loading ? '—' : metric.value}</p><p className="mt-1 text-xs text-slate-500">{metric.note}</p></div>; })}</section>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-900">Recent orders</h2><p className="mt-0.5 text-xs text-slate-500">Latest orders saved in the database</p></div><button onClick={() => setActiveNav('Order Management')} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">Open POS <ArrowRight className="h-3.5 w-3.5" /></button></div>{overview?.recentOrders?.length ? <div className="divide-y divide-slate-100">{overview.recentOrders.slice(0, 6).map((order) => <div key={order.order_id} className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3"><div><p className="text-sm font-bold text-slate-800">{order.member_name || 'Walk-in customer'}</p><p className="text-xs text-slate-500">{order.table_number || 'Take away'} · {order.status}</p></div><span className="text-xs font-medium text-slate-500">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><span className="text-sm font-extrabold text-slate-900">{money(order.grandTotal)}</span></div>)}</div> : <div className="px-5 py-10 text-center text-sm text-slate-500"><AlertTriangle className="mx-auto mb-2 h-5 w-5 text-slate-300" />No orders have been saved yet.</div>}</section>
  </div>;
};
