import React from 'react';
import {
  X,
  Printer,
  Receipt,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  Share2,
  AlertCircle,
  Percent,
} from 'lucide-react';
import { BarKitchenOrder } from '../../types/BarKitchenTypes';

interface BarKitchenOrderDetailsModalProps {
  order: BarKitchenOrder | null;
  onClose: () => void;
  onPrint?: (order: BarKitchenOrder) => void;
}

export const BarKitchenOrderDetailsModal: React.FC<BarKitchenOrderDetailsModalProps> = ({
  order,
  onClose,
  onPrint,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 my-8 border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Order Receipt & Details
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">{order.orderNumber}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {order.orderType}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px]">Table / Area</span>
            <strong className="text-slate-900">
              {order.tableNumber ? `Table ${order.tableNumber}` : 'Direct Counter'}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Guest / Member</span>
            <strong className="text-slate-900">
              {order.memberName || 'Guest'} {order.memberTier && `(${order.memberTier})`}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Order Timestamp</span>
            <strong className="text-slate-900">{order.createdAt}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Status</span>
            <strong className="text-blue-600">{order.status}</strong>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Items Ordered
          </h4>
          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">
                    {item.quantity} x {item.name}
                  </span>
                  {item.notes && (
                    <span className="text-[11px] text-amber-700 italic block">
                      Note: {item.notes}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900">₹{item.totalPrice}</span>
                  <span className="text-[10px] text-slate-400 block">@ ₹{item.unitPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation summary */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-800">₹{order.subtotal}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Discount ({order.discountPercent}%)</span>
              <span className="font-bold">- ₹{order.discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>GST ({order.gstPercent}%)</span>
            <span className="font-bold text-slate-800">₹{order.gstAmount}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Net Payable</span>
            <span className="text-base text-slate-900">₹{order.total}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onPrint && onPrint(order)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
