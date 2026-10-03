import React from 'react';
import { ArrowLeft, Printer, Send, CheckCircle2, Clock, Download } from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';

export const FinanceInvoiceDetails: React.FC = () => {
  const { invoices, setActiveNav } = useFinanceStore();
  const invoice = invoices[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveNav('Invoices')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Sending PDF invoice via Email...')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            onClick={() => alert('Printing Invoice...')}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
          <div>
            <span className="text-xl font-black text-slate-900">PLAYNEX SPORTS CLUB</span>
            <p className="text-xs text-slate-500 mt-1">Main Pavilion Grounds, Fort, Mumbai - 400001</p>
            <p className="text-xs text-slate-400">GSTIN: 27AABCP8841M1Z5</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-black uppercase text-blue-600 block">TAX INVOICE</span>
            <span className="text-lg font-mono font-black text-slate-900">{invoice.invoiceNumber}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Due: {invoice.dueDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-bold text-[10px] uppercase">Billed To</span>
            <strong className="text-slate-900 text-sm">{invoice.customerName}</strong>
            <p className="text-slate-500 mt-1">Department: {invoice.department}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-bold text-[10px] uppercase">Payment Status</span>
            <strong className="text-emerald-700 text-sm">{invoice.status}</strong>
            <p className="text-slate-500 mt-1">Issue Date: {invoice.issueDate}</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Item & Description</th>
                <th className="py-2.5 px-4 text-center">Qty</th>
                <th className="py-2.5 px-4 text-right">Rate</th>
                <th className="py-2.5 px-4 text-right">Taxable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((it) => (
                <tr key={it.id}>
                  <td className="py-3 px-4 font-bold text-slate-800">{it.description}</td>
                  <td className="py-3 px-4 text-center">{it.quantity}</td>
                  <td className="py-3 px-4 text-right">₹{it.unitPrice}</td>
                  <td className="py-3 px-4 text-right font-black">₹{it.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end text-xs">
          <div className="w-64 space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{invoice.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>CGST (9%):</span>
              <span>₹{invoice.taxAmount / 2}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>SGST (9%):</span>
              <span>₹{invoice.taxAmount / 2}</span>
            </div>
            <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-200 text-slate-900">
              <span>TOTAL DUE:</span>
              <span>₹{invoice.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
