import React, { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Building2, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface UserPaymentSummaryProps {
  amount: number;
  selectedMethod: 'Credit / Debit Card' | 'UPI' | 'Wallet' | 'Net Banking';
  onSelectMethod: (method: 'Credit / Debit Card' | 'UPI' | 'Wallet' | 'Net Banking') => void;
  onPay: () => void;
  isProcessing?: boolean;
}

export const UserPaymentSummary: React.FC<UserPaymentSummaryProps> = ({
  amount,
  selectedMethod,
  onSelectMethod,
  onPay,
  isProcessing = false,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const discount = promoApplied ? Math.round(amount * 0.1) : 0;
  const tax = Math.round((amount - discount) * 0.09); // 9% GST
  const total = amount - discount + tax;

  const paymentMethods: {
    id: 'Credit / Debit Card' | 'UPI' | 'Wallet' | 'Net Banking';
    label: string;
    sublabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'Credit / Debit Card',
      label: 'Credit / Debit Card',
      sublabel: 'Visa, Mastercard, RuPay',
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'UPI',
      label: 'UPI (Instant)',
      sublabel: 'Google Pay, PhonePe, Paytm, BHIM',
      icon: <Smartphone className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'Wallet',
      label: 'Playnex Wallet',
      sublabel: 'Available Balance: ₹1,500',
      icon: <Wallet className="w-5 h-5 text-purple-600" />,
    },
    {
      id: 'Net Banking',
      label: 'Net Banking',
      sublabel: 'All major Indian banks supported',
      icon: <Building2 className="w-5 h-5 text-amber-600" />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div>
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Select Payment Method
        </h4>

        {/* Payment Methods Radio list matching step 5 in reference image */}
        <div className="space-y-2">
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <label
                key={method.id}
                onClick={() => onSelectMethod(method.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={isSelected}
                    onChange={() => onSelectMethod(method.id)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2.5">
                    {method.icon}
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {method.label}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {method.sublabel}
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Promo Code Input */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Promo / Member Code (e.g. PLAY10)"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none uppercase font-mono"
          />
          <button
            type="button"
            onClick={() => {
              if (promoCode.trim().length > 0) {
                setPromoApplied(true);
              }
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1.5">
            <Sparkles className="w-3 h-3" /> Member 10% discount applied!
          </span>
        )}
      </div>

      {/* Bill Breakdown */}
      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">₹{amount}</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-emerald-600">
            <span>Special Discount (10%)</span>
            <span className="font-semibold">-₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>GST & Sports Infrastructure Cess (9%)</span>
          <span className="font-semibold text-slate-900">₹{tax}</span>
        </div>

        <div className="flex justify-between pt-2 border-t border-slate-100 text-sm">
          <span className="font-bold text-slate-900">Total Payable</span>
          <span className="font-black text-blue-600 text-base">₹{total}</span>
        </div>
      </div>

      {/* Pay CTA Button matching step 5 in reference image */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={onPay}
        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <span className="animate-pulse">Authorizing Payment...</span>
        ) : (
          <span>Pay ₹{total}</span>
        )}
      </button>

      <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
        <ShieldAlert className="w-3 h-3 text-slate-400" />
        256-bit SSL Encrypted • Instant Refund on Slot Cancellation
      </p>
    </div>
  );
};
