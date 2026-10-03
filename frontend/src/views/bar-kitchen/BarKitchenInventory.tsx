import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  TrendingDown,
  Truck,
  CheckCircle2,
  Calendar,
  XCircle,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenInventoryItem } from '../../types/BarKitchenTypes';

export const BarKitchenInventory: React.FC = () => {
  const { inventory, updateStock } = useBarKitchenStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [restockModalItem, setRestockModalItem] = useState<BarKitchenInventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);

  const categories = ['All', 'Spirits', 'Wine & Beer', 'Dairy', 'Meat & Poultry', 'Produce', 'Dry Goods'];

  const filteredInventory = inventory.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.supplier.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleConfirmRestock = () => {
    if (!restockModalItem) return;
    updateStock(restockModalItem.id, restockQty);
    setRestockModalItem(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inventory & Supply Chain Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time ingredient tracking, automatic recipe depletion, purchase orders, and low stock triggers.
          </p>
        </div>

        <button
          onClick={() => alert('New Purchase Order (PO) draft opened.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Truck className="w-4 h-4 stroke-[2.5]" />
          <span>Create Purchase Order (PO)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ingredient or vendor..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Min Par Level</th>
                <th className="py-3 px-4">Cost / Unit</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-slate-900 block text-xs">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{item.id}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-sm text-slate-900">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">
                    {item.minStockLevel} {item.unit}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    ₹{item.costPerUnit}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {item.supplier}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : item.status === 'Low Stock'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setRestockModalItem(item);
                        setRestockQty(item.reorderQuantity || 10);
                      }}
                      className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      + Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Restock Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-black text-slate-900">
              Receive Stock: {restockModalItem.name}
            </h3>
            <p className="text-xs text-slate-500">
              Current Stock: {restockModalItem.currentStock} {restockModalItem.unit}. Supplier: {restockModalItem.supplier}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Quantity to Add ({restockModalItem.unit})
              </label>
              <input
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRestockModalItem(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestock}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirm Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
