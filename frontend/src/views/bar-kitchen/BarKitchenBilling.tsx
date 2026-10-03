import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  Printer,
  Send,
  Split,
  Merge,
  Search,
  CheckCircle,
  FileText,
  UserCheck,
  Building,
  RotateCcw,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenBillSummary } from '../../components/bar-kitchen/BarKitchenBillSummary';
import { PaymentMode, BarKitchenBill } from '../../types/BarKitchenTypes';

export const BarKitchenBilling: React.FC = () => {
  const {
    tables,
    selectedTable,
    setSelectedTable,
    activeBill,
    generateBillForTable,
    settleBill,
    bills,
    memberTier,
  } = useBarKitchenStore();

  const [activeTableNum, setActiveTableNum] = useState<string>('T2');
  const [splitCount, setSplitCount] = useState<number>(1);
  const [showInvoiceModal, setShowInvoiceModal] = useState<BarKitchenBill | null>(null);

  // Initialize or fetch current active bill for table
  const discountRate = memberTier === 'Gold' ? 0.2 : 0.15;
  const discountLabel = `Member Discount (${memberTier === 'Gold' ? '20%' : '15%'})`;
  const subtotal = activeBill && activeBill.tableNumber === activeTableNum ? activeBill.subtotal : 480;

  const handleSettle = (mode: PaymentMode) => {
    // Generate bill if not exists
    const bill = generateBillForTable(activeTableNum);
    settleBill(bill.id, mode);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Billing & POS Payment Settlement
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            GST compliant invoices, automated member plan discounts, split-billing, and house accounts.
          </p>
        </div>

        {/* Quick Table Switcher Bar */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto self-start sm:self-auto">
          {['T2', 'T5', 'T6', 'O1', 'P1', 'B1'].map((tNum) => (
            <button
              key={tNum}
              onClick={() => setActiveTableNum(tNum)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTableNum === tNum
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Table {tNum}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left (Bill Checkout Panel matching Reference Image Panel 6) | Right (Recent Settlements & Split Tools) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Bill Summary Card matching Reference Image (5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-5">
          <BarKitchenBillSummary
            tableNumber={activeTableNum}
            subtotal={subtotal}
            discountRate={discountRate}
            discountLabel={discountLabel}
            gstRate={0.05}
            onCompletePayment={handleSettle}
            onPrintBill={() => {
              const b = generateBillForTable(activeTableNum);
              setShowInvoiceModal(b);
            }}
            onSendReceipt={() => alert(`Digital receipt SMS & WhatsApp sent to registered phone.`)}
          />

          {/* Split Bill Calculator Tool */}
          <div className="mt-4 bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Split className="w-3.5 h-3.5 text-blue-600" />
                Split Bill Tool
              </span>
              <span className="text-slate-500 font-medium">Equal Guest Share</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[1, 2, 3, 4, 6].map((count) => (
                  <button
                    key={count}
                    onClick={() => setSplitCount(count)}
                    className={`w-8 h-7 rounded-lg text-xs font-black transition-all ${
                      splitCount === count
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {count}x
                  </button>
                ))}
              </div>

              <div className="text-right flex-1">
                <span className="text-[10px] text-slate-400 block">Each Pays</span>
                <span className="text-base font-black text-slate-900">
                  ₹{Math.round((403.2 / splitCount) * 10) / 10}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Settled Invoices & Daily Cashier Reconciliation (7 Cols) */}
        <div className="lg:col-span-7 xl:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Cashier Settlement Register
              </span>
              <h3 className="text-base font-black text-slate-900">
                Today's Paid & Settled Invoices
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              Shift Float: ₹10,000 Verified
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Table</th>
                  <th className="py-2.5 px-3">Member / Guest</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {/* Mock historical bills */}
                {[
                  {
                    id: 'INV-2026-901',
                    table: 'T2',
                    guest: 'Dr. Sameer Desai (Gold)',
                    mode: 'Member Account',
                    amount: '₹403.2',
                    time: '15:20',
                  },
                  {
                    id: 'INV-2026-902',
                    table: 'T6',
                    guest: 'Aditya Birla Group (Corp)',
                    mode: 'Corporate Account',
                    amount: '₹8,920.0',
                    time: '14:55',
                  },
                  {
                    id: 'INV-2026-903',
                    table: 'O1',
                    guest: 'Priya Shah (Platinum)',
                    mode: 'UPI',
                    amount: '₹1,240.0',
                    time: '14:10',
                  },
                  {
                    id: 'INV-2026-904',
                    table: 'B1',
                    guest: 'Vikram Joshi (Silver)',
                    mode: 'Card',
                    amount: '₹2,680.0',
                    time: '13:40',
                  },
                ].map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{b.id}</td>
                    <td className="py-2.5 px-3 font-extrabold text-blue-600">{b.table}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{b.guest}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-100 font-bold px-2 py-0.5 rounded text-[11px] text-slate-700">
                        {b.mode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">
                      {b.amount}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() =>
                          alert(`Printing invoice ${b.id} for table ${b.table}`)
                        }
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800"
                        title="Print Copy"
                      >
                        <Printer className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice Modal Simulation */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 font-mono text-xs">
            <div className="text-center pb-2 border-b-2 border-dashed border-slate-300">
              <h3 className="font-black text-sm uppercase">PLAYNEX SPORTS CLUB</h3>
              <p className="text-[10px] text-slate-500">TAX INVOICE / GUEST CHECK</p>
              <div className="text-xs font-bold text-slate-800 mt-1">
                {showInvoiceModal.billNumber}
              </div>
              <p className="text-[10px] text-slate-400">
                Table: {showInvoiceModal.tableNumber} • Cashier: {showInvoiceModal.cashierName}
              </p>
            </div>

            <div className="space-y-1 py-2 border-b-2 border-dashed border-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{showInvoiceModal.subtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>{showInvoiceModal.discountDesc}</span>
                <span>-₹{showInvoiceModal.discountAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (2.5%)</span>
                <span>₹{(showInvoiceModal.gstAmount / 2).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (2.5%)</span>
                <span>₹{(showInvoiceModal.gstAmount / 2).toFixed(1)}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-200">
                <span>NET PAYABLE</span>
                <span>₹{showInvoiceModal.totalPayable}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400">
              GSTIN: 27AABCS1429B1Z2 • Thank you for dining with us!
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-sans font-bold text-slate-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
