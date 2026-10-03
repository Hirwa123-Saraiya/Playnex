'use client';

import React, { useState, useEffect } from 'react';
import { useClub } from '../context/ClubContext';
import {
  restaurantService,
  MenuItem,
  RestaurantOrder,
} from '../services/restaurant.service';
import {
  UtensilsCrossed,
  Plus,
  Loader2,
  Trash2,
  Receipt,
  X,
  Info,
} from 'lucide-react';

export const ClubRestaurant: React.FC = () => {
  const { selectedBranch } = useClub();
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Menu Form
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('Food');
  const [itemPrice, setItemPrice] = useState('350');

  // Order Form
  const [memberName, setMemberName] = useState('');
  const [tableNumber, setTableNumber] = useState('T-01 (Terrace)');
  const [orderItemsText, setOrderItemsText] = useState('Tandoori Platter, Fresh Lime Soda');
  const [orderTotal, setOrderTotal] = useState('650');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, ordersRes] = await Promise.all([
        restaurantService.getMenu(),
        restaurantService.getOrders(),
      ]);
      if (menuRes.success && Array.isArray(menuRes.data)) {
        setMenu(menuRes.data);
      }
      if (ordersRes.success && Array.isArray(ordersRes.data)) {
        setOrders(ordersRes.data);
      }
    } catch (err) {
      console.error('Failed to load restaurant data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setError('Item name is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await restaurantService.createMenuItem({
        name: itemName.trim(),
        category: itemCategory,
        price: Number(itemPrice) || 0,
      });
      if (res.success) {
        setIsMenuModalOpen(false);
        setItemName('');
        await fetchData();
      } else {
        setError(res.message || 'Failed to add menu item');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await restaurantService.deleteMenuItem(id);
      await fetchData();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) {
      setError('Member name is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const items = orderItemsText.split(',').map((name) => ({
        name: name.trim(),
        quantity: 1,
        price: Math.round(Number(orderTotal) / (orderItemsText.split(',').length || 1)),
      }));

      const res = await restaurantService.createOrder({
        memberName: memberName.trim(),
        tableNumber,
        items,
        totalAmount: Number(orderTotal) || 0,
      });

      if (res.success) {
        setIsOrderModalOpen(false);
        setMemberName('');
        await fetchData();
      } else {
        setError(res.message || 'Failed to place order');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Restaurant &amp; Bar POS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Menu catalog, KOT orders and table billing for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setError(null);
              setIsMenuModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
          <button
            onClick={() => {
              setError(null);
              setIsOrderModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Order / Tab
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'menu'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Menu Catalog ({menu.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Orders &amp; Member Tabs ({orders.length})
        </button>
      </div>

      {/* Tab 1: Menu Items */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-500 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Loading menu items...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {menu.map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {m.category}
                      </span>
                    </div>
                    <div className="mt-3 text-lg font-black text-slate-900">
                      ₹ {Number(m.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-600 font-semibold text-[11px]">Available</span>
                    <button
                      onClick={() => handleDeleteMenuItem(m.id)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {menu.length === 0 && (
                <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
                  <UtensilsCrossed className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700 text-sm">No Menu Items Found</p>
                  <p className="text-xs text-slate-400">
                    Add food, beverages, and appetizers to the club bistro menu.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Table / Area</th>
                  <th className="py-3 px-4">Items Ordered</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">{o.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{o.memberName}</td>
                    <td className="py-3 px-4 text-slate-600">{o.tableNumber}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {Array.isArray(o.items)
                        ? o.items.map((i: any) => i.name).join(', ')
                        : 'Food & Drinks'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹ {Number(o.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold text-slate-700">No Orders Placed Today</p>
                      <p className="text-xs text-slate-400">
                        Create orders and member tabs using the "New Order" button.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Menu Item</h3>
              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateMenuItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Item Name</label>
                <input
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Grilled Chicken Salad"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  >
                    <option>Food</option>
                    <option>Beverages</option>
                    <option>Alcohol</option>
                    <option>Snacks</option>
                    <option>Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">New Restaurant Order</h3>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Member Name</label>
                <input
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Rahul Mehta"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Table / Location</label>
                <input
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. Table 4, Bar Lounge"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Ordered Items (comma-separated)
                </label>
                <input
                  value={orderItemsText}
                  onChange={(e) => setOrderItemsText(e.target.value)}
                  placeholder="e.g. 2x Lime Soda, 1x Pasta"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Bill Amount (₹)</label>
                <input
                  type="number"
                  value={orderTotal}
                  onChange={(e) => setOrderTotal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Submit Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
