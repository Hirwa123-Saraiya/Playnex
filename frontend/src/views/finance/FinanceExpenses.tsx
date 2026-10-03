import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Paperclip,
  XCircle,
  Download,
} from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';
import { FinanceExpense, FinanceDepartment } from '../../types/FinanceTypes';

export const FinanceExpenses: React.FC = () => {
  const { expenses, addExpense } = useFinanceStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New expense form
  const [newExp, setNewExp] = useState<Partial<FinanceExpense>>({
    category: 'Utilities',
    department: 'Court Booking',
    vendorName: '',
    amount: 15000,
    taxDeducted: 0,
    notes: '',
  });

  const categories = [
    'All',
    'Salaries',
    'Utilities',
    'Food Purchase',
    'Beverage Purchase',
    'Inventory Purchase',
    'Marketing',
    'Maintenance',
    'Events',
    'Coaching',
  ];

  const filteredExpenses = expenses.filter((e) => {
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesSearch =
      e.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      e.expenseNumber.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.vendorName || !newExp.amount) return;

    const created: FinanceExpense = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      expenseNumber: `EXP-2025-${Math.floor(100 + Math.random() * 900)}`,
      category: (newExp.category as any) || 'Utilities',
      department: (newExp.department as any) || 'Maintenance',
      vendorName: newExp.vendorName,
      amount: Number(newExp.amount),
      taxDeducted: Number(newExp.taxDeducted || 0),
      date: 'Today',
      status: 'Pending Approval',
      notes: newExp.notes,
      branchId: 'BR-01',
    };

    addExpense(created);
    setShowAddModal(false);
    setNewExp({ category: 'Utilities', department: 'Court Booking', vendorName: '', amount: 15000, taxDeducted: 0, notes: '' });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Expense Management & Discretionary Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational expenditure vouchers, utility settlements, supplier invoices, and audit attachments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Record New Expense</span>
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
            placeholder="Search vendor or voucher..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
          />
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Voucher No</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Vendor / Payee</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{exp.expenseNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{exp.category}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[11px]">
                      {exp.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{exp.vendorName}</td>
                  <td className="py-3 px-4 text-slate-500">{exp.date}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    ₹ {exp.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        exp.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : exp.status === 'Paid'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Record Expense Voucher</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vendor / Payee Name</label>
                <input
                  type="text"
                  required
                  value={newExp.vendorName}
                  onChange={(e) => setNewExp({ ...newExp, vendorName: e.target.value })}
                  placeholder="e.g. Tata Power / Fresh Farms"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newExp.category}
                    onChange={(e) => setNewExp({ ...newExp, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Salaries">Salaries</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Food Purchase">Food Purchase</option>
                    <option value="Beverage Purchase">Beverage Purchase</option>
                    <option value="Inventory Purchase">Inventory Purchase</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Events">Events</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newExp.department}
                    onChange={(e) => setNewExp({ ...newExp, department: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Court Booking">Court Booking</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Bar">Bar</option>
                    <option value="Shop">Shop</option>
                    <option value="Membership">Membership</option>
                    <option value="Coaching">Coaching</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gross Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newExp.amount}
                    onChange={(e) => setNewExp({ ...newExp, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">TDS / Tax Deducted (₹)</label>
                  <input
                    type="number"
                    value={newExp.taxDeducted}
                    onChange={(e) => setNewExp({ ...newExp, taxDeducted: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes & Justification</label>
                <textarea
                  rows={2}
                  value={newExp.notes}
                  onChange={(e) => setNewExp({ ...newExp, notes: e.target.value })}
                  placeholder="Purpose of expense..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
