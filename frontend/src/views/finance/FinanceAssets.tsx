import React from 'react';
import { Building, Plus, TrendingDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '../../store/FinanceStore';

export const FinanceAssets: React.FC = () => {
  const { assets } = useFinanceStore();

  const totalAssetValue = assets.reduce((sum, a) => sum + a.currentBookValue, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Fixed Asset Register & Depreciation Schedules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Club infrastructure capitalization, tennis court resurfacing schedules, kitchen plant, and equipment depreciation.
          </p>
        </div>

        <button
          onClick={() => alert('New Asset Capitalization Form opened.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Capitalize Asset</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-extrabold text-slate-900">
            Fixed Asset Master Ledger
          </h3>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl">
            Total Net Book Value: ₹{(totalAssetValue / 10000000).toFixed(2)} Crores
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Asset Code</th>
                <th className="py-3 px-4">Asset Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Purchase Date</th>
                <th className="py-3 px-4 text-right">Original Cost</th>
                <th className="py-3 px-4 text-right">Acc. Depreciation</th>
                <th className="py-3 px-4 text-right">Net Book Value</th>
                <th className="py-3 px-4 text-center">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{asset.assetCode}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{asset.name}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                      {asset.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{asset.purchaseDate}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-700">
                    ₹ {asset.purchaseCost.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-600 font-medium">
                    -₹ {asset.accumulatedDepreciation.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    ₹ {asset.currentBookValue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {asset.condition}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
