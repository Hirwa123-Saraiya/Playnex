import React from 'react';
import { Plus, Clock, ChefHat, Sparkles } from 'lucide-react';
import { BarKitchenMenuItem } from '../../types/BarKitchenTypes';

interface BarKitchenMenuCardProps {
  item: BarKitchenMenuItem;
  onAdd?: (item: BarKitchenMenuItem) => void;
  showCostMargin?: boolean;
}

export const BarKitchenMenuCard: React.FC<BarKitchenMenuCardProps> = ({
  item,
  onAdd,
  showCostMargin = false,
}) => {
  return (
    <div
      onClick={() => onAdd && onAdd(item)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 p-3 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer select-none active:scale-[0.98]"
    >
      <div>
        {/* Top media & badges */}
        <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 mb-2.5">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Veg / Non-Veg Indicator */}
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </div>

          {/* Prep time badge */}
          <div className="absolute top-2 right-2 bg-slate-950/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {item.preparationTimeMins}m
          </div>

          {/* Happy hour or special tag */}
          {item.isHappyHourEligible && (
            <div className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              HAPPY HOUR
            </div>
          )}
        </div>

        {/* Item details */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-1">
            <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {item.name}
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <ChefHat className="w-3 h-3 text-slate-400" />
            <span>{item.station}</span>
          </div>
        </div>
      </div>

      {/* Footer / Price & Add */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold block leading-none">Price</span>
          <span className="text-base font-extrabold text-slate-900">₹{item.price}</span>
          {showCostMargin && (
            <span className="ml-1 text-[10px] font-bold text-emerald-600">
              +{item.marginPercent}%
            </span>
          )}
        </div>

        {onAdd && (
          <button
            type="button"
            className="h-8 px-3 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all duration-150 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Add
          </button>
        )}
      </div>
    </div>
  );
};
