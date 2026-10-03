import React from 'react';
import { 
  Layers, 
  ArrowDown, 
  ArrowRight, 
  ShoppingBag, 
  Smartphone, 
  Laptop, 
  Store, 
  Truck, 
  CheckCircle2, 
  Database,
  RefreshCw,
  TrendingDown
} from 'lucide-react';
import { useProShopStore } from '../../store/ProShopInventoryStore';

export const ProShopCentralInventoryFlow: React.FC = () => {
  const { products, updateProduct, addTransaction, setToastMessage } = useProShopStore();

  const totalAvailable = products.reduce((acc, curr) => acc + curr.availableStock, 0);
  const totalReserved = products.reduce((acc, curr) => acc + curr.reservedStock, 0);
  const totalSoldToday = products.reduce((acc, curr) => acc + curr.soldToday, 0);
  const totalInventoryValuation = products.reduce((acc, curr) => acc + (curr.availableStock * curr.costPrice), 0);

  // Quick simulation actions
  const simulateCounterSale = () => {
    const balls = products.find(p => p.sku === 'WB001');
    if (balls && balls.availableStock > 0) {
      updateProduct(balls.id, {
        availableStock: balls.availableStock - 1,
        soldToday: balls.soldToday + 1
      });
      addTransaction({
        productId: balls.id,
        productName: balls.name,
        sku: balls.sku,
        type: 'Stock Out',
        quantity: -1,
        performedBy: 'Counter POS Terminal 1',
        remarks: 'Simulation: Over-the-counter member purchase'
      });
      setToastMessage('Counter sale: 1x Tennis Balls deducted from Central Inventory!');
    }
  };

  const simulateOnlineOrder = () => {
    const shirt = products.find(p => p.sku === 'AT001');
    if (shirt && shirt.availableStock > 0) {
      updateProduct(shirt.id, {
        availableStock: shirt.availableStock - 1,
        reservedStock: shirt.reservedStock + 1
      });
      addTransaction({
        productId: shirt.id,
        productName: shirt.name,
        sku: shirt.sku,
        type: 'Stock Out',
        quantity: -1,
        performedBy: 'Mobile App Webhook',
        remarks: 'Simulation: Online App order reserved in Central Inventory'
      });
      setToastMessage('Online App order: 1x Club T-Shirt reserved in Central Inventory!');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
            2
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Same Inventory for Counter & Online</h2>
            <p className="text-xs text-slate-500 font-medium">All sales reduce from the same single unified inventory database</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={simulateCounterSale}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
            Simulate Counter Sale
          </button>
          <button
            onClick={simulateOnlineOrder}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            Simulate Online Order
          </button>
        </div>
      </div>

      {/* KPI Counters Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Available Quantity</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalAvailable} Units</div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> Live on POS & Web
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Reserved Quantity</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{totalReserved} Units</div>
          <span className="text-[10px] text-amber-600 font-medium mt-0.5">Awaiting club pickup / dispatch</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Sold Today</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{totalSoldToday} Units</div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5">Across counter & web store</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Inventory Value</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{(totalInventoryValuation / 100000).toFixed(2)}L</div>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">At warehouse landed cost</span>
        </div>
      </div>

      {/* Visual Architectural Diagram Faithful to Reference Image 2 */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50/50 via-slate-50 to-emerald-50/30 border border-slate-200 relative overflow-hidden">
        {/* Top: 2 Source Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Counter Sale Source */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                Channel 1: On-Premise
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Counter Sale</h3>
              <p className="text-xs text-slate-500 font-medium">(Pro Shop / Reception POS)</p>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Barcode Scanner & Cash Register
              </div>
            </div>
          </div>

          {/* Online Order Source */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Laptop className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                Channel 2: Digital Storefront
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Online Order</h3>
              <p className="text-xs text-slate-500 font-medium">(Website / Mobile App)</p>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                eCommerce Member Cart & Gateway
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Arrows Flowing Inward */}
        <div className="flex items-center justify-center my-4 relative">
          <div className="flex items-center gap-8 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              <ArrowDown className="w-4 h-4 text-blue-600 animate-bounce" /> Real-time Stock Deduction
            </span>
          </div>
        </div>

        {/* Center: Central Inventory Database Hub */}
        <div className="max-w-md mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg border border-blue-400/40 text-center relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/20 mx-auto flex items-center justify-center mb-2 shadow-inner">
            <Database className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-black tracking-tight">Central Inventory</h3>
          <p className="text-xs text-blue-100 mt-0.5">Unified Real-Time Sports Club Stock Ledger</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-3 border-t border-white/20">
            <div className="bg-white/10 rounded-xl p-2">
              <span className="text-[10px] text-blue-200 block">Total Catalog Items</span>
              <strong className="text-sm font-black">{products.length} Products</strong>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <span className="text-[10px] text-blue-200 block">Stock Buffer Sync</span>
              <strong className="text-sm font-black text-emerald-300">0 ms Latency</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Downward Fulfillment Arrows */}
        <div className="flex items-center justify-center my-4">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
            <ArrowDown className="w-4 h-4 text-emerald-600 animate-bounce" /> Instant Dispatch & Allocation
          </span>
        </div>

        {/* Bottom: 2 Fulfillment Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Club Pickup */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                Fulfillment Option A (Free)
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Club Pickup</h3>
              <p className="text-xs text-slate-500 font-medium">Member collects from club reception / pro shop counter</p>
            </div>
          </div>

          {/* Home Delivery */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                Fulfillment Option B (Courier)
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Home Delivery</h3>
              <p className="text-xs text-slate-500 font-medium">Product dispatched to member's residential address</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
