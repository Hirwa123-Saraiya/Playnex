import React, { useState } from 'react';
import { BookOpen, ChefHat, Plus, Search, DollarSign, Percent, Clock, Layers } from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';

export const BarKitchenRecipes: React.FC = () => {
  const { recipes } = useBarKitchenStore();
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Recipe & Portion Control Engineering
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Standard Operating Procedures (SOP), ingredient BOM mapping, food cost percentage (FC%), and wastage control.
          </p>
        </div>

        <button
          onClick={() => alert('New Recipe Builder wizard opened.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Recipe</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recipe List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
            Configured Dish Master List
          </h3>
          <div className="space-y-2">
            {recipes.map((rec) => {
              const isSelected = selectedRecipe.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecipe(rec)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-sm text-slate-900">{rec.menuItemName}</h4>
                    <span className="text-xs font-black text-slate-900">₹{rec.sellingPrice}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>Portion: <strong>{rec.portionSize}</strong></span>
                    <span>Cost: <strong>₹{rec.costPrice}</strong></span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      FC: {rec.foodCostPercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Recipe Bill of Materials (BOM) & Instructions (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Standard Kitchen SOP
              </span>
              <h2 className="text-xl font-black text-slate-900">{selectedRecipe.menuItemName}</h2>
              <span className="text-xs text-slate-500">Portion Standard: {selectedRecipe.portionSize}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold">Food Cost %</span>
                <span className="text-lg font-black text-emerald-600">{selectedRecipe.foodCostPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Ingredient BOM Mapping Table */}
          <div>
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Ingredient Mapping & Unit Depletion
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Ingredient</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3 text-right">Cost Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{ing.ingredientName}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-600">{ing.quantity}</td>
                      <td className="py-2.5 px-3 text-slate-500">{ing.unit}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">₹{ing.cost}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-black text-xs">
                    <td colSpan={3} className="py-2 px-3 text-slate-700">Total Plate Cost Price</td>
                    <td className="py-2 px-3 text-right text-slate-900">₹{selectedRecipe.costPrice}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Chef Preparation Instructions */}
          <div>
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Cooking Method & Prep Steps
            </h4>
            <div className="space-y-2">
              {selectedRecipe.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
