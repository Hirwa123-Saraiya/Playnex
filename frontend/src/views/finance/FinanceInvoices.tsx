import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Printer,
  Send,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';
import { FinanceInvoice } from '../../types/FinanceTypes';

export const FinanceInvoices: React.FC = () => {
  const { invoices, addInvoice, updateInvoiceStatus } = useFinanceStore();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [previewInvoice, setPreviewInvoice] = useState<FinanceInvoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Invoice form
  const [newInv, setNewInv] = useState({
    customerName: '',
    department: 'Membership',
    amount: 10000,
    dueDate: '2025-10-25',
    itemDesc: 'Annual Subscription Renewal Charge',
  });

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      selectedStatus === 'All' || inv.status === selectedStatus;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInv.customerName || !newInv.amount) return;

    const baseAmount = Number(newInv.amount);
    const taxAmount = Math.round(baseAmount * 0.18);
    const totalAmount = baseAmount + taxAmount;

    const invoice: FinanceInvoice = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV-2025-${Math.floor(100 + Math.random() * 900)}`,
      customerName: newInv.customerName,
      department: newInv.department as any,
      issueDate: 'Today',
      dueDate: newInv.dueDate,
      status: 'Sent',
      subtotal: baseAmount,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      branchId: 'BR-01',
      items: [
        {
          id: '1',
          description: newInv.itemDesc,
          quantity: 1,
          unitPrice: baseAmount,
          taxRate: 18,
          amount: baseAmount,
        },
      ],
    };

    addInvoice(invoice);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Tax Invoicing & Accounts Receivable Billing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            GST compliant member checks, pro shop invoices, banquet master bills, and debit/credit notes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Generate Tax Invoice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['All', 'Sent', 'Paid', 'Overdue', 'Draft'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice # or customer..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer / Member</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Taxable</th>
                <th className="py-3 px-4 text-right">GST (18%)</th>
                <th className="py-3 px-4 text-right">Total Payable</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{inv.customerName}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[11px]">
                      {inv.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">{inv.dueDate}</td>
                  <td className="py-3 px-4 text-right text-slate-600">₹ {inv.subtotal.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-slate-600 font-medium">₹ {inv.taxAmount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    ₹ {inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewInvoice(inv)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                        title="View & Print"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded font-bold text-[10px] transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Invoice Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 font-mono text-xs">
            <div className="text-center pb-3 border-b-2 border-dashed border-slate-300">
              <h2 className="text-base font-black uppercase tracking-wider font-sans">
                PLAYNEX SPORTS CLUB LTD
              </h2>
              <p className="text-[10px] text-slate-500">GST TAX INVOICE • B2B / B2C</p>
              <div className="mt-2 text-xs font-bold text-slate-900">
                Invoice No: {previewInvoice.invoiceNumber} • Date: {previewInvoice.issueDate}
              </div>
              <p className="text-[10px] text-slate-400">GSTIN: 27AABCP8841M1Z5</p>
            </div>

            <div className="space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Billed To:</span>
                <strong className="text-slate-900">{previewInvoice.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Department:</span>
                <span>{previewInvoice.department}</span>
              </div>
              <div className="flex justify-between">
                <span>Due Date:</span>
                <span>{previewInvoice.dueDate}</span>
              </div>
            </div>

            <div className="space-y-2 py-2 border-y-2 border-dashed border-slate-300">
              {previewInvoice.items.map((it) => (
                <div key={it.id} className="flex justify-between">
                  <span>{it.quantity} x {it.description}</span>
                  <span className="font-bold">₹{it.amount}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal (Taxable):</span>
                <span>₹{previewInvoice.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>CGST (9%):</span>
                <span>₹{(previewInvoice.taxAmount / 2).toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>SGST (9%):</span>
                <span>₹{(previewInvoice.taxAmount / 2).toFixed(1)}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-200 text-slate-900">
                <span>NET TOTAL DUE:</span>
                <span>₹{previewInvoice.totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewInvoice(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-sans font-bold text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Invoice ${previewInvoice.invoiceNumber} sent to thermal/laser printer.`);
                  setPreviewInvoice(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-sans font-bold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-black text-slate-900">Generate New Invoice</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer / Member Name</label>
                <input
                  type="text"
                  required
                  value={newInv.customerName}
                  onChange={(e) => setNewInv({ ...newInv, customerName: e.target.value })}
                  placeholder="e.g. ABC Corp"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <select
                  value={newInv.department}
                  onChange={(e) => setNewInv({ ...newInv, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Membership">Membership</option>
                  <option value="Court Booking">Court Booking</option>
                  <option value="Events">Events</option>
                  <option value="Shop">Shop</option>
                  <option value="Banquet">Banquet</option>
                  <option value="Sponsorship">Sponsorship</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Taxable Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newInv.amount}
                    onChange={(e) => setNewInv({ ...newInv, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newInv.dueDate}
                    onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Line Description</label>
                <input
                  type="text"
                  value={newInv.itemDesc}
                  onChange={(e) => setNewInv({ ...newInv, itemDesc: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Create & Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
