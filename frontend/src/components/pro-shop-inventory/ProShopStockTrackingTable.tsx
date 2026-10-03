import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useProShopStore } from '../../store/ProShopInventoryStore';
import { ProShopProduct, ProductStockStatus } from '../../types/ProShopInventoryTypes';

export const ProShopStockTrackingTable: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory } = useProShopStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProductStockStatus>('All');
  const [sortField, setSortField] = useState<keyof ProShopProduct>('availableStock');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase()) ||
                          p.vendorName.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc 
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: keyof ProShopProduct) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Product Name,SKU,Category,Brand,Cost Price,Selling Price,Available,Reserved,Sold Today,Reorder Level,Status,Vendor\n';
    const rows = products.map(p => 
      `"${p.name}","${p.sku}","${p.category}","${p.brand}",${p.costPrice},${p.sellingPrice},${p.availableStock},${p.reservedStock},${p.soldToday},${p.reorderLevel},"${p.status}","${p.vendorName}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Playnex_ProShop_Stock_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
            3
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Stock Tracking</h2>
            <p className="text-xs text-slate-500 font-medium">Track stock levels across all club storage locations in real-time</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Excel / CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by product, SKU or vendor..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['All', 'In Stock', 'Low Stock', 'Out Of Stock'] as const).map((status) => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Product <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3 text-right cursor-pointer select-none" onClick={() => handleSort('costPrice')}>
                  <div className="flex items-center justify-end gap-1">Cost <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3 text-right cursor-pointer select-none" onClick={() => handleSort('sellingPrice')}>
                  <div className="flex items-center justify-end gap-1">Price <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3">Vendor</th>
                <th className="py-3 px-3 text-center cursor-pointer select-none" onClick={() => handleSort('availableStock')}>
                  <div className="flex items-center justify-center gap-1">Available <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3 text-center">Reserved</th>
                <th className="py-3 px-3 text-center">Sold Today</th>
                <th className="py-3 px-3 text-center">Reorder Lvl</th>
                <th className="py-3 px-3">Last Restocked</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((p) => {
                // Color specs from user instruction: Green = In Stock, Orange = Low Stock, Red = Out Of Stock
                const statusBadge = 
                  p.status === 'In Stock'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : p.status === 'Low Stock'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-rose-100 text-rose-700 border border-rose-200';

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 truncate max-w-[200px]">{p.name}</div>
                        <span className="text-[10px] text-slate-400 font-medium">{p.category} • {p.brand}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 font-bold">{p.sku}</td>
                    <td className="py-3 px-3 text-right font-medium text-slate-600">₹{p.costPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">₹{p.sellingPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-slate-700 truncate max-w-[140px]">{p.vendorName}</td>
                    <td className="py-3 px-3 text-center font-black text-slate-900">
                      <span className={`px-2 py-0.5 rounded-lg ${p.availableStock <= p.reorderLevel ? 'bg-amber-50 text-amber-700' : ''}`}>
                        {p.availableStock}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-500">{p.reservedStock}</td>
                    <td className="py-3 px-3 text-center font-bold text-blue-600">+{p.soldToday}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">{p.reorderLevel}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{p.lastRestockedDate}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBadge}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sorted.length)} of {sorted.length} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
