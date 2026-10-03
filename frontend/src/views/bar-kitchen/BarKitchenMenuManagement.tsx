import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Sparkles,
  ChefHat,
  SlidersHorizontal,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenCategories } from '../../components/bar-kitchen/BarKitchenCategories';
import { BarKitchenMenuItem, MenuCategoryType } from '../../types/BarKitchenTypes';

export const BarKitchenMenuManagement: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    toggleMenuItemAvailability,
    deleteMenuItem,
    addMenuItem,
  } = useBarKitchenStore();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState<Partial<BarKitchenMenuItem>>({
    name: '',
    category: 'Food',
    subCategory: 'Main Course',
    price: 180,
    costPrice: 60,
    isVeg: true,
    preparationTimeMins: 12,
    station: 'Main Course Station',
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
  });

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.subCategory.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    const price = Number(newItem.price);
    const costPrice = Number(newItem.costPrice || 50);
    const margin = Math.round(((price - costPrice) / price) * 100);

    const created: BarKitchenMenuItem = {
      id: `MI-${Date.now().toString().slice(-4)}`,
      name: newItem.name,
      category: (newItem.category as MenuCategoryType) || 'Food',
      subCategory: newItem.subCategory || 'General',
      price,
      costPrice,
      marginPercent: margin,
      image:
        newItem.image ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
      isAvailable: true,
      isVeg: !!newItem.isVeg,
      preparationTimeMins: Number(newItem.preparationTimeMins) || 10,
      station: (newItem.station as any) || 'Grill Station',
      description: newItem.description || 'Prepared fresh by club chefs.',
    };

    addMenuItem(created);
    setShowAddModal(false);
    setNewItem({
      name: '',
      category: 'Food',
      subCategory: 'Main Course',
      price: 180,
      costPrice: 60,
      isVeg: true,
      preparationTimeMins: 12,
      station: 'Main Course Station',
      description: '',
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Menu Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage food, beverage, combos, seasonal offerings, recipes & pricing margins.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Categories & Search Filter Bar (Matching Reference Image Panel 1) */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <BarKitchenCategories
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        {/* Menu Items Table matching Reference Image Panel 1:
            Image | Item Name | Category | Price (₹) | Cost | Margin | Status | Actions */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Station</th>
                <th className="py-3 px-4">Price (₹)</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Margin</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Image */}
                  <td className="py-2.5 px-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                    />
                  </td>

                  {/* Name with veg/non-veg dot */}
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                      {item.subCategory} • {item.preparationTimeMins} mins
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-2.5 px-4 font-semibold text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                      {item.category}
                    </span>
                  </td>

                  {/* Station */}
                  <td className="py-2.5 px-4 text-slate-600 font-medium">
                    <span className="flex items-center gap-1">
                      <ChefHat className="w-3.5 h-3.5 text-slate-400" />
                      {item.station}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-2.5 px-4 font-black text-slate-900 text-sm">
                    ₹{item.price}
                  </td>

                  {/* Cost Price */}
                  <td className="py-2.5 px-4 text-slate-500 font-medium">
                    ₹{item.costPrice}
                  </td>

                  {/* Margin */}
                  <td className="py-2.5 px-4 font-bold text-emerald-600">
                    +{item.marginPercent}%
                  </td>

                  {/* Status Pill matching image */}
                  <td className="py-2.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleMenuItemAvailability(item.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        item.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {item.isAvailable ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => deleteMenuItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Add Menu Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Truffle Mushroom Risotto"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Food">Food</option>
                    <option value="Beverage">Beverages</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Combos">Combos</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Alcohol">Alcohol</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kitchen Station</label>
                  <select
                    value={newItem.station}
                    onChange={(e) => setNewItem({ ...newItem, station: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Grill Station">Grill Station</option>
                    <option value="Pizza Station">Pizza Station</option>
                    <option value="Main Course Station">Main Course Station</option>
                    <option value="Snacks Station">Snacks Station</option>
                    <option value="Beverage Station">Beverage Station</option>
                    <option value="Dessert Station">Dessert Station</option>
                    <option value="Bar Station">Bar Station</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={newItem.costPrice}
                    onChange={(e) => setNewItem({ ...newItem, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={newItem.preparationTimeMins}
                    onChange={(e) =>
                      setNewItem({ ...newItem, preparationTimeMins: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isVeg}
                    onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-bold text-slate-700">Vegetarian Dish</span>
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
