import React, { useState } from 'react';
import { 
  Percent, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Info,
  Medal,
  Award,
  Sparkles,
  Calculator
} from 'lucide-react';
import { useProShopStore } from '../../store/ProShopInventoryStore';
import { MembershipTier } from '../../types/ProShopInventoryTypes';

export const ProShopDiscountManagement: React.FC = () => {
  const { tierDiscounts, updateTierDiscount } = useProShopStore();
  const [samplePrice, setSamplePrice] = useState<number>(10000);
  const [editingTier, setEditingTier] = useState<MembershipTier | null>(null);
  const [tempPct, setTempPct] = useState<number>(10);

  const getTierIcon = (tier: MembershipTier) => {
    switch (tier) {
      case 'Junior':
        return <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-lg">👦</span>;
      case 'Silver':
        return <span className="p-2.5 rounded-xl bg-slate-200 text-slate-700 text-lg">🥈</span>;
      case 'Gold':
        return <span className="p-2.5 rounded-xl bg-amber-100 text-amber-800 text-lg">🥇</span>;
    }
  };

  const handleEditClick = (tier: MembershipTier, currentPct: number) => {
    setEditingTier(tier);
    setTempPct(currentPct);
  };

  const handleSaveDiscount = (tier: MembershipTier, isEnabled: boolean) => {
    updateTierDiscount(tier, tempPct, isEnabled);
    setEditingTier(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
            6
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Member Discounts (Based on Tier)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Automated club pricing matrix applied across online member checkout and counter POS
            </p>
          </div>
        </div>

        {/* Live Simulator Input */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <Calculator className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-600">Simulate Base Price:</span>
          <span className="font-bold text-slate-900">₹</span>
          <input
            type="number"
            value={samplePrice}
            onChange={(e) => setSamplePrice(Number(e.target.value) || 0)}
            className="w-24 px-2 py-0.5 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Tier Table matching Reference Image Card 6 */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Membership Tier</th>
              <th className="py-3 px-4">Age / Criteria</th>
              <th className="py-3 px-4 text-center">Discount %</th>
              <th className="py-3 px-4 text-right">Example Price (Base ₹{samplePrice.toLocaleString('en-IN')})</th>
              <th className="py-3 px-4 text-center">Auto-Applied In</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tierDiscounts.map((t) => {
              const discountedAmount = Math.round(samplePrice * (1 - t.discountPercentage / 100));
              const isEditing = editingTier === t.tier;

              return (
                <tr key={t.tier} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-3">
                    {getTierIcon(t.tier)}
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">{t.tier} Member</div>
                      <div className="text-[11px] text-slate-400 font-medium">{t.label}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {t.ageCriteria}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={tempPct}
                          onChange={(e) => setTempPct(Number(e.target.value))}
                          className="w-16 p-1 text-center border border-blue-400 rounded-lg text-xs font-black"
                          min={0}
                          max={100}
                        />
                        <span className="font-bold">%</span>
                      </div>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-black text-sm rounded-xl border border-indigo-100">
                        {t.discountPercentage}%
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="text-base font-black text-slate-900">
                      ₹{discountedAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      Saves ₹{(samplePrice - discountedAmount).toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      POS & Web Store
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => updateTierDiscount(t.tier, t.discountPercentage, !t.isEnabled)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                        t.isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {t.isEnabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {t.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveDiscount(t.tier, t.isEnabled)}
                        className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 shadow-xs"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(t.tier, t.discountPercentage)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Edit %
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Domain Rule Confirmation Note */}
      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Sports Club Pricing Policy</span>
          Discounts are strictly calibrated for <strong>Junior (5%)</strong>, <strong>Silver (10%)</strong>, and <strong>Gold (15%)</strong> club tiers.
          When a member presents their membership RFID card, barcode, or logs in via mobile app, the inventory billing engine validates their active standing and deducts the discount prior to state GST calculation.
        </div>
      </div>
    </div>
  );
};
