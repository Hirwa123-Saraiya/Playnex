import React from 'react';
import {
  Utensils,
  Coffee,
  Sandwich,
  Layers,
  Sparkles,
  Cake,
  Wine,
  Grid,
} from 'lucide-react';
import { MenuCategoryType } from '../../types/BarKitchenTypes';

interface BarKitchenCategoriesProps {
  selectedCategory: MenuCategoryType | 'All Items';
  onSelectCategory: (category: MenuCategoryType | 'All Items') => void;
  className?: string;
}

export const BarKitchenCategories: React.FC<BarKitchenCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  className = '',
}) => {
  const categories: { key: MenuCategoryType | 'All Items'; label: string; icon: any }[] = [
    { key: 'All Items', label: 'All Items', icon: Grid },
    { key: 'Food', label: 'Food', icon: Utensils },
    { key: 'Beverage', label: 'Beverages', icon: Coffee },
    { key: 'Snacks', label: 'Snacks', icon: Sandwich },
    { key: 'Combos', label: 'Combos', icon: Layers },
    { key: 'Seasonal', label: 'Seasonal', icon: Sparkles },
    { key: 'Dessert', label: 'Desserts', icon: Cake },
    { key: 'Alcohol', label: 'Bar & Alcohol', icon: Wine },
  ];

  return (
    <div className={`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 ${className}`}>
      {categories.map(({ key, label, icon: Icon }) => {
        const isSelected = selectedCategory === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectCategory(key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 shrink-0 ${
              isSelected
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30 ring-2 ring-blue-600/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
