import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, Printer, Trash2, CheckCircle2, UserCheck, Clock, Split } from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';

export const BarKitchenOrderDetails: React.FC = () => {
  const { cartItems, targetTableNumber, memberName, memberTier, setActiveNav } = useBarKitchenStore();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveNav('Order Management')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Order Inspector: Table {targetTableNumber}
          </h1>
          <p className="text-xs text-slate-500">
            Guest: {memberName} • Tier: {memberTier}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900">Active Order Line Items</h3>
        <div className="divide-y divide-slate-100">
          {cartItems.map((ci) => (
            <div key={ci.menuItem.id} className="py-3 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900">{ci.quantity} x {ci.menuItem.name}</span>
                <span className="text-[10px] text-slate-400 block">{ci.menuItem.station}</span>
              </div>
              <span className="font-black text-slate-900 text-sm">₹{ci.menuItem.price * ci.quantity}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={() => setActiveNav('Billing & Payments')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Proceed to Settle Bill →
          </button>
        </div>
      </div>
    </div>
  );
};
