import React from 'react';
import { FinanceInvoice } from '../../types/FinanceTypes';
import { ArrowRight, Eye, Send, CheckCircle } from 'lucide-react';

interface FinanceInvoiceTableProps {
  invoices: FinanceInvoice[];
  title?: string;
  onViewAll?: () => void;
  onSelectInvoice?: (invoice: FinanceInvoice) => void;
}

export const FinanceInvoiceTable: React.FC<FinanceInvoiceTableProps> = ({
  invoices,
  title = 'Upcoming Invoices',
  onViewAll,
  onSelectInvoice,
}) => {
  const getStatusBadge = (status: FinanceInvoice['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-100 text-emerald-800';
      case 'Overdue':
        return 'bg-rose-100 text-rose-800';
      case 'Sent':
      case 'Draft':
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header matching reference image */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          {title}
        </h3>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table matching reference image */}
      <div className="overflow-x-auto my-3">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Invoice No</th>
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3">Due Date</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.slice(0, 5).map((inv) => (
              <tr
                key={inv.id}
                onClick={() => onSelectInvoice && onSelectInvoice(inv)}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                  {inv.invoiceNumber}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-800">
                  {inv.customerName}
                </td>
                <td className="py-2.5 px-3 text-right font-black text-slate-900 whitespace-nowrap">
                  ₹ {inv.totalAmount.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap font-medium">
                  {inv.dueDate}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full ${getStatusBadge(
                      inv.status
                    )}`}
                  >
                    {inv.status === 'Sent' || inv.status === 'Draft' ? 'Pending' : inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Total Pending: <strong className="text-slate-800">₹2,55,000</strong></span>
        <span>Overdue: <strong className="text-rose-600">1 Critical</strong></span>
      </div>
    </div>
  );
};
