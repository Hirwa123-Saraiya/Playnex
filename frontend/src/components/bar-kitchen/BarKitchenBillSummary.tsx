import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  Building,
  UserCheck,
  Printer,
  Send,
  CheckCircle,
  Receipt,
  Percent,
} from 'lucide-react';
import { PaymentMode } from '../../types/BarKitchenTypes';

interface BarKitchenBillSummaryProps {
  tableNumber: string;
  subtotal: number;
  discountRate: number; // e.g. 0.20 for 20%
  discountLabel?: string;
  gstRate?: number; // e.g. 0.05 for 5%
  serviceChargeRate?: number; // e.g. 0.05
  onCompletePayment?: (mode: PaymentMode, details: any) => void;
  onPrintBill?: () => void;
  onSendReceipt?: () => void;
  isPaid?: boolean;
}

export const BarKitchenBillSummary: React.FC<BarKitchenBillSummaryProps> = ({
  tableNumber,
  subtotal,
  discountRate = 0.2,
  discountLabel = 'Member Discount (20%)',
  gstRate = 0.05,
  serviceChargeRate = 0,
  onCompletePayment,
  onPrintBill,
  onSendReceipt,
  isPaid = false,
}) => {
  const [selectedMode, setSelectedMode] = useState<PaymentMode>('Cash');

  const discountAmount = Math.round(subtotal * discountRate * 10) / 10;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = Math.round(taxableAmount * gstRate * 10) / 10;
  const serviceCharge = Math.round(taxableAmount * serviceChargeRate * 10) / 10;
  const total = Math.round((taxableAmount + gstAmount + serviceCharge) * 10) / 10;

  const paymentModes: { mode: PaymentMode; icon: any; label: string }[] = [
    { mode: 'Cash', icon: Banknote, label: 'Cash' },
    { mode: 'Card', icon: CreditCard, label: 'Card' },
    { mode: 'UPI', icon: Smartphone, label: 'UPI' },
    { mode: 'Member Account', icon: UserCheck, label: 'Member' },
    { mode: 'Wallet', icon: Wallet, label: 'Wallet' },
    { mode: 'Corporate Account', icon: Building, label: 'Corporate' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Billing & POS Checkout
          </span>
          <h3 className="text-lg font-black text-slate-900">
            Bill - Table {tableNumber}
          </h3>
        </div>
        {isPaid ? (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            PAID
          </span>
        ) : (
          <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-1 rounded-full">
            UNPAID
          </span>
        )}
      </div>

      {/* Payment Modes Grid (Matching Reference Image) */}
      <div>
        <label className="text-xs font-bold text-slate-500 block mb-2">
          Select Payment Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {paymentModes.map(({ mode, icon: Icon, label }) => {
            const isSelected = selectedMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedMode(mode)}
                disabled={isPaid}
                className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                } ${isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Breakdown List */}
      <div className="space-y-2 py-3 border-y border-slate-100 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800">₹{subtotal.toFixed(1)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" />
              {discountLabel}
            </span>
            <span className="font-bold">- ₹{discountAmount.toFixed(1)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>GST (5%)</span>
          <span className="font-semibold text-slate-800">₹{gstAmount.toFixed(1)}</span>
        </div>

        {serviceCharge > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Service Charge</span>
            <span className="font-semibold text-slate-800">₹{serviceCharge.toFixed(1)}</span>
          </div>
        )}

        <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
          <span>Total</span>
          <span className="text-xl text-slate-900">₹{total.toFixed(1)}</span>
        </div>
      </div>

      {/* Auxiliary Actions: Print Bill & Send Receipt */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onPrintBill}
          className="py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          Print Bill
        </button>
        <button
          type="button"
          onClick={onSendReceipt}
          className="py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <Send className="w-3.5 h-3.5 text-slate-500" />
          Send Receipt
        </button>
      </div>

      {/* Big Touch CTA: Complete Payment (Green button matching image) */}
      {!isPaid && onCompletePayment && (
        <button
          type="button"
          onClick={() =>
            onCompletePayment(selectedMode, {
              subtotal,
              discountAmount,
              gstAmount,
              total,
              mode: selectedMode,
            })
          }
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-black rounded-2xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Receipt className="w-4 h-4" />
          Complete Payment (₹{total.toFixed(1)})
        </button>
      )}
    </div>
  );
};
