import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Tag,
  CircleDollarSign,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { useProShopStore } from '../../store/ProShopInventoryStore';
import { ProShopCategory, ProShopProduct, ProductStockStatus } from '../../types/ProShopInventoryTypes';

export const ProShopProductCatalog: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, addProduct, updateProduct, deleteProduct } = useProShopStore();
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<ProShopProduct>(products[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Rackets' as ProShopCategory,
    brand: '',
    description: '',
    sellingPrice: 1000,
    costPrice: 700,
    taxPercentage: 18,
    availableStock: 20,
    reservedStock: 0,
    soldToday: 0,
    reorderLevel: 5,
    status: 'In Stock' as ProductStockStatus,
    imageUrl: 'https://images.unsplash.com/photo-1617083934555-563d76e4c760?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Wilson Sports India Ltd',
    lastRestockedDate: 'Today'
  });

  const categories: { name: ProShopCategory; iconText: string; color: string; count: number }[] = [
    { name: 'Rackets', iconText: '🎾', color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-700', count: products.filter(p => p.category === 'Rackets').length },
    { name: 'Balls', iconText: '🟢', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700', count: products.filter(p => p.category === 'Balls').length },
    { name: 'Shoes', iconText: '👟', color: 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-700', count: products.filter(p => p.category === 'Shoes').length },
    { name: 'Apparel', iconText: '👕', color: 'from-purple-500/10 to-pink-500/10 border-purple-200 text-purple-700', count: products.filter(p => p.category === 'Apparel').length },
    { name: 'Accessories', iconText: '🧢', color: 'from-cyan-500/10 to-sky-500/10 border-cyan-200 text-cyan-700', count: products.filter(p => p.category === 'Accessories').length },
    { name: 'Bags', iconText: '🎒', color: 'from-rose-500/10 to-red-500/10 border-rose-200 text-rose-700', count: products.filter(p => p.category === 'Bags').length },
  ];

  const brands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Rackets',
      brand: 'Playnex Club',
      description: '',
      sellingPrice: 2500,
      costPrice: 1600,
      taxPercentage: 18,
      availableStock: 25,
      reservedStock: 0,
      soldToday: 0,
      reorderLevel: 5,
      status: 'In Stock',
      imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
      vendorName: 'Apex Rackets & Strings Co',
      lastRestockedDate: 'Today'
    });
    setShowAddModal(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(formData);
    setShowAddModal(false);
  };

  const handleOpenEdit = (p: ProShopProduct) => {
    setSelectedProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      brand: p.brand,
      description: p.description,
      sellingPrice: p.sellingPrice,
      costPrice: p.costPrice,
      taxPercentage: p.taxPercentage,
      availableStock: p.availableStock,
      reservedStock: p.reservedStock,
      soldToday: p.soldToday,
      reorderLevel: p.reorderLevel,
      status: p.status,
      imageUrl: p.imageUrl,
      vendorName: p.vendorName,
      lastRestockedDate: p.lastRestockedDate
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      updateProduct(selectedProduct.id, formData);
      setSelectedProduct({ ...selectedProduct, ...formData });
    }
    setShowEditModal(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
            1
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Product Catalog</h2>
            <p className="text-xs text-slate-500 font-medium">Manage all sports products with SKU, pricing, tax and reorder points</p>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* 6 Category Cards matching the reference image visual */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
              className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                  : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-2xl">{cat.iconText}</span>
              <span className="text-xs font-bold">{cat.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>
                {cat.count} items
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Details Card (from reference image) + Catalog List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Details Card (Faithful to Reference Image 1) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-5 border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-blue-100/70">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900">
                Selected Product Details
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(selectedProduct)}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                  title="Edit Product"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProduct(selectedProduct.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-28 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs flex-shrink-0 flex items-center justify-center p-2">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  {selectedProduct.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedProduct.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {selectedProduct.sku}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    selectedProduct.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                    selectedProduct.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {selectedProduct.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Brand: {selectedProduct.brand}</span>
                </div>
              </div>
            </div>

            {/* Spec Sheet List (matching the bullet points in reference image card 1) */}
            <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Selling Price:</span>
                <span className="font-bold text-slate-900">₹{selectedProduct.sellingPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Cost Price:</span>
                <span className="font-semibold text-slate-700">₹{selectedProduct.costPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Available Stock:</span>
                <span className="font-bold text-emerald-600">{selectedProduct.availableStock} Units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Reorder Threshold:</span>
                <span className="font-medium text-amber-600">{selectedProduct.reorderLevel} Units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">GST / Tax Rate:</span>
                <span className="font-medium text-slate-700">{selectedProduct.taxPercentage}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Authorized Vendor:</span>
                <span className="font-semibold text-slate-800">{selectedProduct.vendorName}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-slate-500">
            <span>Last Restocked: {selectedProduct.lastRestockedDate}</span>
            <span className="text-blue-600 font-bold">Margin: {Math.round(((selectedProduct.sellingPrice - selectedProduct.costPrice) / selectedProduct.sellingPrice) * 100)}%</span>
          </div>
        </div>

        {/* Right: Searchable Table / List of Products */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name or SKU..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
            >
              {brands.map(b => (
                <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
              ))}
            </select>
          </div>

          {/* Table Container */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-[340px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-center">Stock</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isCur = selectedProduct.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className={`cursor-pointer transition ${
                        isCur ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        <img src={p.imageUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.sku}</div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{p.category}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        ₹{p.sellingPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                        {p.availableStock}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' :
                          p.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Showing {filteredProducts.length} of {products.length} products</span>
            <span>Click any item row to preview detailed specs</span>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              {showAddModal ? 'Create New Pro Shop Product' : 'Edit Product Specifications'}
            </h3>
            <form onSubmit={showAddModal ? handleSaveAdd : handleSaveEdit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProShopCategory })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {['Rackets', 'Balls', 'Shoes', 'Apparel', 'Accessories', 'Bags'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Brand</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Cost Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={formData.availableStock}
                    onChange={(e) => setFormData({ ...formData, availableStock: Number(e.target.value) })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Reorder Level Threshold</label>
                  <input
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">GST %</label>
                  <select
                    value={formData.taxPercentage}
                    onChange={(e) => setFormData({ ...formData, taxPercentage: Number(e.target.value) })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value={5}>5% (Apparel below ₹1k)</option>
                    <option value={12}>12% (Sporting Balls & Grips)</option>
                    <option value={18}>18% (Standard Rackets & Shoes)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  {showAddModal ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
