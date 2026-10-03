import React, { useState } from 'react';
import { Percent, Award, Sparkles, Plus, Gift, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { mockMemberDiscounts } from '../../mock/BarKitchenMockData';

export const BarKitchenDiscounts: React.FC = () => {
  const [discounts, setDiscounts] = useState(mockMemberDiscounts);
  const [coupons, setCoupons] = useState([
    { code: 'CHAMPIONS20', desc: 'Tournament Winners 20% Off F&B', validTill: '2026-10-31', uses: 45, maxUses: 100, active: true },
    { code: 'SUNDAYBRUNCH', desc: 'Poolside Sunday Buffet Buy 1 Get 1', validTill: '2026-10-26', uses: 28, maxUses: 50, active: true },
    { code: 'PRESIDENT100', desc: '100% Patron Courtesy Tab Discretionary', validTill: '2026-12-31', uses: 8, maxUses: 20, active: true },
  ]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Member Discounts & Privilege Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automatic membership tier discounts, loyalty reward point accrual, coupon vouchers, and happy hour schemes.
          </p>
        </div>

        <button
          onClick={() => alert('New Promotional Coupon Builder opened.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Promo Voucher</span>
        </button>
      </div>

      {/* Membership Tiers Discount Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plan Rules</span>
            <h3 className="text-base font-black text-slate-900">Configured Membership Tier Benefits</h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
            Auto-applied at POS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discounts.map((tier) => (
            <div
              key={tier.tier}
              className={`p-5 rounded-2xl border transition-all ${
                tier.tier === 'Platinum'
                  ? 'border-purple-300 bg-gradient-to-br from-purple-50/70 to-indigo-50/50'
                  : tier.tier === 'Gold'
                  ? 'border-amber-300 bg-gradient-to-br from-amber-50/70 to-yellow-50/50'
                  : tier.tier === 'Corporate'
                  ? 'border-blue-300 bg-gradient-to-br from-blue-50/70 to-sky-50/50'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-white shadow-2xs text-slate-900 border border-slate-200">
                  {tier.tier} Tier
                </span>
                <span className="text-xl font-black text-slate-900">
                  {tier.discountPercent}% OFF
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Food & Soft Beverages:</span>
                  <strong className="text-slate-900">{tier.discountPercent}% Discount</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Liquor & Cocktails:</span>
                  <strong className="text-slate-900">{tier.alcoholDiscountPercent}% Discount</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Loyalty Points:</span>
                  <strong className="text-blue-600">{tier.loyaltyPointsPer100} pts / ₹100 spent</strong>
                </div>
              </div>

              <p className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 font-medium">
                ★ {tier.specialPerk}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Vouchers & Happy Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Promotional Coupons */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              Active Promo Coupons
            </h4>
            <span className="text-xs text-slate-400">{coupons.length} Active</span>
          </div>

          <div className="space-y-2.5">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="text-emerald-700 font-bold">Valid till {c.validTill}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">{c.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-slate-800 block">{c.uses} / {c.maxUses} used</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Happy Hour Schedules */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Happy Hour Windows
            </h4>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Live Now
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/70">
              <div className="flex justify-between font-black text-amber-900">
                <span>The 19th Hole Lounge Sundowner</span>
                <span>4:00 PM - 8:00 PM Daily</span>
              </div>
              <p className="text-amber-800 text-[11px] mt-1">
                20% off all draft beers, house spirits, and classic cocktails. Bonus 5% on Platinum cards.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Poolside Weekend Sunset Sips</span>
                <span>Friday & Saturday 5 PM - 9 PM</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                Buy 2 get 1 complimentary on craft mocktails and artisanal pizzas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
