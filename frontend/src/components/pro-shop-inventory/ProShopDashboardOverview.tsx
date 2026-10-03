import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, IndianRupee, Package, ShoppingCart, Boxes } from 'lucide-react';
import { proShopService, type ProShopOverviewData } from '../../services/proShop.service';
import { useProShopStore } from '../../store/ProShopInventoryStore';

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const ProShopDashboardOverview: React.FC = () => {
  const { products, setActiveView } = useProShopStore();
  const [overview, setOverview] = useState<ProShopOverviewData | null>(null);

  useEffect(() => {
    void proShopService.getOverview()
      .then((response) => {
        if (response.success && response.data) setOverview(response.data);
      })
      .catch(() => undefined);
  }, []);

  const lowStockProducts = products.filter((product) => product.status !== 'In Stock').slice(0, 4);
  const metrics = [
    { label: 'Catalog items', value: overview?.totalItems ?? products.length, note: 'Active products', icon: Package, tone: 'text-blue-600 bg-blue-50' },
    { label: 'Stock on hand', value: `${overview?.totalStockUnits ?? products.reduce((total, product) => total + product.availableStock, 0)} units`, note: 'Available to sell', icon: Boxes, tone: 'text-emerald-600 bg-emerald-50' },
    { label: 'Sales today', value: formatCurrency(overview?.todaySales ?? 0), note: `${overview?.todayTransactions ?? 0} transactions`, icon: IndianRupee, tone: 'text-violet-600 bg-violet-50' },
    { label: 'Needs attention', value: overview?.lowStockCount ?? lowStockProducts.length, note: 'Low-stock products', icon: AlertTriangle, tone: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-6 pb-10">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Pro Shop</p>
          <h1 className="mt-1 text-xl font-black tracking-tight text-slate-900">Today at a glance</h1>
          <p className="mt-1 text-sm text-slate-500">Stock, sales, and the next action—without the clutter.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveView('catalog')} className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Manage catalog</button>
          <button onClick={() => setActiveView('pos-counter')} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"><ShoppingCart className="h-3.5 w-3.5" />Open POS</button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${metric.tone}`}><Icon className="h-4.5 w-4.5" /></div><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{metric.label}</p><p className="mt-1 text-xl font-black text-slate-900">{metric.value}</p><p className="mt-1 text-xs text-slate-500">{metric.note}</p></div>;
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-900">Inventory snapshot</h2><p className="mt-0.5 text-xs text-slate-500">Recently available catalog items</p></div><button onClick={() => setActiveView('catalog')} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">View catalog <ArrowRight className="h-3.5 w-3.5" /></button></div>
          {products.length ? <div className="divide-y divide-slate-100">{products.slice(0, 5).map((product) => <button key={product.id} onClick={() => setActiveView('catalog')} className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3 text-left hover:bg-slate-50"><span><span className="block text-sm font-bold text-slate-800">{product.name}</span><span className="text-xs text-slate-500">{product.sku} · {product.brand}</span></span><span className="text-sm font-bold text-slate-700">{product.availableStock} units</span><span className="text-sm font-black text-slate-900">{formatCurrency(product.sellingPrice)}</span></button>)}</div> : <div className="px-5 py-10 text-center text-sm text-slate-500">No products yet. Add your first product to start selling.</div>}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Low stock</h2><p className="mt-0.5 text-xs text-slate-500">Restock these first</p></div><AlertTriangle className="h-5 w-5 text-amber-500" /></div><div className="mt-4 space-y-3">{lowStockProducts.length ? lowStockProducts.map((product) => <div key={product.id} className="rounded-xl bg-amber-50 px-3 py-2.5"><p className="text-sm font-bold text-slate-800">{product.name}</p><p className="mt-0.5 text-xs text-amber-700">{product.availableStock} left · Reorder at {product.reorderLevel}</p></div>) : <p className="rounded-xl bg-emerald-50 px-3 py-4 text-center text-xs font-medium text-emerald-700">All stocked up.</p>}</div><button onClick={() => setActiveView('low-stock-alerts')} className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Review stock alerts</button></div>
      </section>
    </div>
  );
};
