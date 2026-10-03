import React from 'react';
import { AlertTriangle, Package, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { BarKitchenInventoryItem } from '../../types/BarKitchenTypes';

interface BarKitchenInventoryWidgetProps {
  items: BarKitchenInventoryItem[];
  onRestockClick?: (item: BarKitchenInventoryItem) => void;
  onViewAll?: () => void;
}

export const BarKitchenInventoryWidget: React.FC<BarKitchenInventoryWidgetProps> = ({
  items,
  onRestockClick,
  onViewAll,
}) => {
  const criticalItems = items.filter((i) => i.status === 'Critical' || i.status === 'Low Stock');

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Stock & Supply Chain
          </span>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Inventory Alerts</span>
            {criticalItems.length > 0 && (
              <span className="bg-rose-100 text-rose-700 text-xs font-black px-2 py-0.5 rounded-full">
                {criticalItems.length} Urgent
              </span>
            )}
          </h3>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Full Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {criticalItems.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  item.status === 'Critical'
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                <span className="text-[11px] text-slate-500 block">
                  Category: {item.category} • Supplier: {item.supplier}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0 flex items-center gap-3">
              <div>
                <span className="text-xs font-black text-rose-600 block">
                  {item.currentStock} {item.unit}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Min: {item.minStockLevel} {item.unit}
                </span>
              </div>

              {onRestockClick && (
                <button
                  type="button"
                  onClick={() => onRestockClick(item)}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
