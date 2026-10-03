import React from 'react';
import { ShoppingBag, Users, Clock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { BarKitchenOrder } from '../../types/BarKitchenTypes';

interface BarKitchenOrderCardProps {
  order: BarKitchenOrder;
  onSelect?: (order: BarKitchenOrder) => void;
  onModify?: (order: BarKitchenOrder) => void;
}

export const BarKitchenOrderCard: React.FC<BarKitchenOrderCardProps> = ({
  order,
  onSelect,
}) => {
  const getStatusColor = (status: BarKitchenOrder['status']) => {
    switch (status) {
      case 'Draft':
        return 'bg-slate-100 text-slate-700';
      case 'Sent to Kitchen':
        return 'bg-blue-100 text-blue-800';
      case 'Preparing':
        return 'bg-amber-100 text-amber-800';
      case 'Ready':
        return 'bg-purple-100 text-purple-800';
      case 'Served':
        return 'bg-emerald-100 text-emerald-800';
      case 'Billed':
        return 'bg-indigo-100 text-indigo-800';
      case 'Settled':
        return 'bg-emerald-600 text-white';
      case 'Cancelled':
      default:
        return 'bg-rose-100 text-rose-800';
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(order)}
      className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {order.orderType}
            </span>
            <h4 className="text-base font-extrabold text-slate-900">{order.orderNumber}</h4>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
          {order.tableNumber && (
            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
              Table {order.tableNumber}
            </span>
          )}
          {order.memberName && (
            <span className="text-blue-600 font-semibold truncate">
              {order.memberName} ({order.memberTier || 'Member'})
            </span>
          )}
        </div>

        {/* Items summary */}
        <div className="mt-3 space-y-1">
          {order.items.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs text-slate-600">
              <span className="truncate">
                {item.quantity}x {item.name}
              </span>
              <span className="font-semibold text-slate-900 shrink-0">₹{item.totalPrice}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <span className="text-[11px] text-slate-400 font-medium block">
              +{order.items.length - 3} more items...
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block leading-tight">Total Bill</span>
          <span className="text-base font-black text-slate-900">₹{order.total}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800">
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
