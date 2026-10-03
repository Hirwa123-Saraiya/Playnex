"use client";

import { Check, Minus } from "lucide-react";
import { MEMBERSHIP_PLANS } from "@/data/membershipData";

export default function ComparisonTable() {
  return (
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">Compare Plan Features</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Find the exact membership tier tailored to your playing frequency and lifestyle.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur">
          <table className="w-full text-left text-sm text-slate-300 min-w-[640px]">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 sm:p-5 font-bold text-white">Features</th>
                {MEMBERSHIP_PLANS.map((plan) => (
                  <th key={plan.id} className="p-4 sm:p-5 text-center font-bold text-white">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-200">Monthly Price</td>
                {MEMBERSHIP_PLANS.map((plan) => (
                  <td key={plan.id} className="p-4 sm:p-5 text-center">
                    {plan.monthlyPrice ? `₹${plan.monthlyPrice}` : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-200">Annual Price</td>
                {MEMBERSHIP_PLANS.map((plan) => (
                  <td key={plan.id} className="p-4 sm:p-5 text-center font-semibold text-emerald-400">
                    ₹{plan.annualPrice.toLocaleString("en-IN")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-200">Member Discount</td>
                {MEMBERSHIP_PLANS.map((plan) => (
                  <td key={plan.id} className="p-4 sm:p-5 text-center">
                    {plan.discount}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-200">Tournament Access</td>
                {MEMBERSHIP_PLANS.map((plan) => (
                  <td key={plan.id} className="p-4 sm:p-5 text-center">
                    {plan.tournamentAccess ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <Minus className="w-5 h-5 text-slate-600 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}