import React, { useState } from 'react';
import { 
  Calculator, 
  ScanLine, 
  Search, 
  UserCheck, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  CreditCard, 
  Banknote, 
  QrCode, 
  CheckCircle2, 
  X,
  Receipt,
  User,
  ShoppingBag
} from 'lucide-react';
import { useProShopStore } from '../../store/ProShopInventoryStore';
import { mockProShopMembers } from '../../mock/ProShopInventoryMockData';
import { PaymentMethod, ProShopMember, ProShopProduct } from '../../types/ProShopInventoryTypes';

export const ProShopPOSTerminal: React.FC = () => {
  const { 
    products, 
    posCart, 
    addToPosCart, 
    updatePosCartQuantity, 
    removeFromPosCart, 
    clearPosCart,
    posMember, 
    setPosMember, 
    posPaymentMethod, 
    setPosPaymentMethod, 
    completePosSale,
    posLastSaleReceipt,
    tierDiscounts
  } = useProShopStore();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showMemberLookup, setShowMemberLookup] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Active Member discount %
  const activeDiscount = posMember ? tierDiscounts.find(d => d.tier === posMember.tier && d.isEnabled) : null;
  const discountPct = activeDiscount ? activeDiscount.discountPercentage : 0;

  // Calculate Subtotal & Totals
  const subtotal = posCart.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0);
  const totalDiscount = posCart.reduce((acc, curr) => {
    const raw = curr.unitPrice * curr.quantity;
    const discounted = curr.discountedPrice * curr.quantity;
    return acc + (raw - discounted);
  }, 0);
  const total = subtotal - totalDiscount;

  // Barcode / Search Handler
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const found = products.find(p => 
      p.sku.toLowerCase() === barcodeInput.toLowerCase() || 
      p.name.toLowerCase().includes(barcodeInput.toLowerCase())
    );
    if (found) {
      addToPosCart(found);
      setBarcodeInput('');
    }
  };

  // Member search
  const filteredMembers = mockProShopMembers.filter(m => 
    m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    m.membershipId.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    m.mobile.includes(memberSearchQuery) ||
    m.email.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  const handleSelectMember = (m: ProShopMember) => {
    setPosMember(m);
    setShowMemberLookup(false);
    setMemberSearchQuery('');
  };

  const handleCompleteSaleAction = () => {
    completePosSale();
    setShowReceiptModal(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
            7
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">POS (Counter Sales)</h2>
            <p className="text-xs text-slate-500 font-medium">Easy and fast billing at the pro shop and reception counter</p>
          </div>
        </div>
        
        {/* Member Selector Button */}
        <div className="flex items-center gap-2">
          {posMember ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-600" />
                {posMember.name} ({posMember.tier} - {discountPct}% OFF)
              </span>
              <button
                onClick={() => setPosMember(null)}
                className="text-amber-700 hover:text-rose-600 ml-1 font-bold"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowMemberLookup(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              <User className="w-3.5 h-3.5" />
              Member Lookup
            </button>
          )}
        </div>
      </div>

      {/* POS Terminal Screen Layout (Faithful to Reference Image 7) */}
      <div className="bg-[#1e293b] text-white rounded-2xl p-5 shadow-xl border border-slate-700 flex flex-col justify-between max-w-4xl mx-auto">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-black text-sm tracking-wider uppercase text-slate-200">
              PLAYNEX - Pro Shop POS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Terminal #01 (Front Desk)</span>
        </div>

        {/* Barcode Search Bar */}
        <form onSubmit={handleBarcodeSubmit} className="mt-4 relative">
          <ScanLine className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="Scan barcode or search product (e.g. WR001, WB001, AT001)..."
            className="w-full pl-10 pr-20 py-2.5 bg-slate-800 border border-slate-600 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold"
          >
            Add Item
          </button>
        </form>

        {/* Quick Click Item Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
          <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">Fast Tap:</span>
          {products.slice(0, 5).map(p => (
            <button
              key={p.id}
              onClick={() => addToPosCart(p)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-[11px] text-slate-200 whitespace-nowrap font-medium transition"
            >
              + {p.name.split(' ')[0]} ({p.sku})
            </button>
          ))}
        </div>

        {/* Cart Item Rows matching Reference Image 7 */}
        <div className="mt-3 bg-slate-900/90 rounded-xl p-3 border border-slate-700/80 divide-y divide-slate-800 max-h-[220px] overflow-y-auto">
          {posCart.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <ShoppingBag className="w-8 h-8 mx-auto mb-1 opacity-30" />
              Terminal idle. Scan barcode or tap fast add buttons.
            </div>
          ) : (
            posCart.map((item) => (
              <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1 rounded bg-slate-800 text-base">
                    {item.product.category === 'Rackets' ? '🎾' : item.product.category === 'Balls' ? '🟢' : item.product.category === 'Apparel' ? '👕' : '👟'}
                  </span>
                  <div className="truncate">
                    <div className="font-bold text-white truncate">{item.product.name}</div>
                    <div className="text-[11px] text-slate-400">₹{item.unitPrice.toLocaleString('en-IN')} base</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-mono font-bold text-white text-sm">
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </span>

                  <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                    <button
                      onClick={() => updatePosCartQuantity(item.product.id, -1)}
                      className="text-slate-400 hover:text-white px-1 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updatePosCartQuantity(item.product.id, +1)}
                      className="text-slate-400 hover:text-white px-1 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromPosCart(item.product.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Member Status Banner */}
        <div className="mt-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Member:</span>
            {posMember ? (
              <span className="font-bold text-amber-400 flex items-center gap-1">
                🥇 {posMember.name} ({posMember.tier} Member - {discountPct}% Discount)
              </span>
            ) : (
              <span className="text-slate-400 italic">Non-Member / Guest (0% Discount)</span>
            )}
          </div>
          <button
            onClick={() => setShowMemberLookup(true)}
            className="text-blue-400 hover:text-blue-300 font-bold underline"
          >
            {posMember ? 'Change Member' : '+ Link Member'}
          </button>
        </div>

        {/* Billing Summary Box */}
        <div className="mt-4 pt-3 border-t border-slate-700/80 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-emerald-400 font-semibold">
            <span>Discount ({discountPct}%)</span>
            <span className="font-mono">-₹{totalDiscount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-700">
            <span>Total</span>
            <span className="text-xl text-emerald-400 font-mono font-black">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Payment Buttons (Faithful to Reference Image 7) */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setPosPaymentMethod('Cash')}
            className={`py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              posPaymentMethod === 'Cash'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                : 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
            }`}
          >
            <Banknote className="w-4 h-4" />
            Cash
          </button>

          <button
            onClick={() => setPosPaymentMethod('Card')}
            className={`py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              posPaymentMethod === 'Card'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                : 'bg-blue-950/70 hover:bg-blue-900 text-blue-300 border border-blue-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Card
          </button>

          <button
            onClick={() => setPosPaymentMethod('UPI')}
            className={`py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              posPaymentMethod === 'UPI'
                ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400'
                : 'bg-purple-950/70 hover:bg-purple-900 text-purple-300 border border-purple-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            UPI
          </button>

          <button
            onClick={handleCompleteSaleAction}
            disabled={posCart.length === 0}
            className="py-2.5 rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-slate-900 shadow-md transition disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-800" />
            Print Receipt
          </button>
        </div>
      </div>

      {/* Member Lookup Modal */}
      {showMemberLookup && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Member Quick Lookup</h3>
              <button onClick={() => setShowMemberLookup(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                placeholder="Search by name, ID (e.g. PN-GLD-8821), or phone..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-3 divide-y divide-slate-100 max-h-[220px] overflow-y-auto text-xs">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleSelectMember(m)}
                  className="p-3 hover:bg-blue-50 cursor-pointer rounded-xl transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{m.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{m.membershipId} • {m.mobile}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    m.tier === 'Gold' ? 'bg-amber-100 text-amber-800' :
                    m.tier === 'Silver' ? 'bg-slate-200 text-slate-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {m.tier} ({m.tier === 'Junior' ? '5%' : m.tier === 'Silver' ? '10%' : '15%'})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* POS Receipt Modal */}
      {showReceiptModal && posLastSaleReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 font-mono text-xs text-slate-800">
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <h2 className="text-base font-black text-slate-900 font-sans tracking-wide">PLAYNEX SPORTS CLUB</h2>
              <p className="text-[11px] text-slate-500 font-sans">Pro Shop & Sports Merchandise</p>
              <p className="text-[10px] text-slate-400 mt-1">Receipt #{posLastSaleReceipt.receiptNumber}</p>
              <p className="text-[10px] text-slate-400">{posLastSaleReceipt.date}</p>
            </div>

            <div className="py-2 border-b border-dashed border-slate-300 text-[11px]">
              <div>Member: <strong>{posLastSaleReceipt.member ? `${posLastSaleReceipt.member.name} (${posLastSaleReceipt.member.tier})` : 'Guest'}</strong></div>
              <div>Payment Mode: <strong>{posLastSaleReceipt.paymentMethod}</strong></div>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5">
              {posLastSaleReceipt.items.map((i: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span className="truncate max-w-[180px]">{i.product.name} x{i.quantity}</span>
                  <span>₹{i.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="py-2.5 space-y-1 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{posLastSaleReceipt.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Tier Discount:</span>
                <span>-₹{posLastSaleReceipt.discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-200">
                <span>Grand Total:</span>
                <span>₹{posLastSaleReceipt.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-slate-300 text-center font-sans space-y-2">
              <p className="text-[10px] text-slate-400">Thank you for playing at Playnex Sports Club!</p>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Close & Print Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
