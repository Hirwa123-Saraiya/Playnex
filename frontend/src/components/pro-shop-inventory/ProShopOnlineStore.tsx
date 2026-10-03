import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  CreditCard,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useProShopStore } from '../../store/ProShopInventoryStore';
import { ProShopCategory, ProShopProduct } from '../../types/ProShopInventoryTypes';
import { mockProShopMembers } from '../../mock/ProShopInventoryMockData';

export const ProShopOnlineStore: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    onlineCart, 
    addToOnlineCart, 
    updateOnlineCartQuantity, 
    removeFromOnlineCart,
    onlineMember,
    setOnlineMember,
    tierDiscounts,
    deliveryMethod,
    setDeliveryMethod,
    checkoutSuccess,
    setCheckoutSuccess,
    clearOnlineCart,
    setToastMessage
  } = useProShopStore();

  const [search, setSearch] = useState('');
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const categories: { name: ProShopCategory; iconText: string }[] = [
    { name: 'Rackets', iconText: '🎾' },
    { name: 'Balls', iconText: '🟢' },
    { name: 'Shoes', iconText: '👟' },
    { name: 'Apparel', iconText: '👕' },
    { name: 'Accessories', iconText: '🧢' },
    { name: 'Bags', iconText: '🎒' }
  ];

  // Current active tier discount %
  const activeDiscount = tierDiscounts.find(d => d.tier === onlineMember.tier && d.isEnabled);
  const discountPct = activeDiscount ? activeDiscount.discountPercentage : 0;

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculations
  const rawSubtotal = onlineCart.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0);
  const discountedSubtotal = onlineCart.reduce((acc, curr) => {
    const unitDisc = Math.round(curr.unitPrice * (1 - discountPct / 100));
    return acc + (unitDisc * curr.quantity);
  }, 0);
  const totalSavings = rawSubtotal - discountedSubtotal;
  const deliveryCharge = deliveryMethod === 'Home Delivery' ? 50 : 0;
  const finalTotal = discountedSubtotal + deliveryCharge;

  const handleProceedToPayment = () => {
    if (onlineCart.length === 0) return;
    setCheckoutSuccess(true);
    setToastMessage(`Order placed successfully! Delivery: ${deliveryMethod}. Saved ₹${totalSavings} with ${onlineMember.tier} tier.`);
    setTimeout(() => {
      clearOnlineCart();
      setCheckoutSuccess(false);
      setActiveStep(1);
    }, 3500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
            5
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Online Store (Member View)</h2>
            <p className="text-xs text-slate-500 font-medium">Browse club products, add to member cart and choose pickup or home delivery</p>
          </div>
        </div>

        {/* Member Tier Switcher (Interactive Demonstration) */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs">
          <span className="font-semibold text-slate-500 pl-2">Logged in as:</span>
          <select
            value={onlineMember.id}
            onChange={(e) => {
              const found = mockProShopMembers.find(m => m.id === e.target.value);
              if (found) setOnlineMember(found);
            }}
            className="font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-1 focus:outline-none"
          >
            {mockProShopMembers.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.tier} - {m.tier === 'Junior' ? '5%' : m.tier === 'Silver' ? '10%' : '15%'} OFF)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mock Playnex Online Storefront Navbar (Matching Reference Image 5 Top Bar) */}
      <div className="bg-[#0f172a] text-white rounded-2xl px-5 py-3 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="text-base font-black tracking-wider text-blue-400">PLAYNEX</span>
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-300">
            <span className="hover:text-white cursor-pointer">Home</span>
            <span className="hover:text-white cursor-pointer">Courts</span>
            <span className="text-white font-bold border-b-2 border-blue-500 pb-0.5">Pro Shop</span>
            <span className="hover:text-white cursor-pointer">Bookings</span>
            <span className="hover:text-white cursor-pointer">Events</span>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gear..."
              className="pl-8 pr-3 py-1 bg-slate-800/80 rounded-xl text-xs text-white border border-slate-700 focus:outline-none focus:border-blue-400 w-44"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer">
              <ShoppingCart className="w-5 h-5 text-slate-200 hover:text-white" />
              {onlineCart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-blue-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {onlineCart.length}
                </span>
              )}
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border border-white/20">
              {onlineMember.name[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Main Storefront Area: Categories Sidebar + Products Row + Checkout Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Category Sidebar matching Reference Image 5 */}
        <div className="lg:col-span-2 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 block px-2">
            Categories
          </span>
          <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                selectedCategory === 'All' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>⚡</span> All Equipment
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  selectedCategory === c.name ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{c.iconText}</span> {c.name}
              </button>
            ))}
          </div>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-xs hidden lg:block">
            <span className="font-bold text-blue-900 block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Member Tier Perk
            </span>
            <p className="text-blue-700 text-[11px] mt-1">
              Logged in as <strong className="font-bold">{onlineMember.tier}</strong>. You enjoy an automatic <strong className="font-bold">{discountPct}% OFF</strong> all store purchases!
            </p>
          </div>
        </div>

        {/* Center: Products Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.slice(0, 4).map((p) => {
            const memberPrice = Math.round(p.sellingPrice * (1 - discountPct / 100));
            const hasDiscount = discountPct > 0;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl bg-slate-100 overflow-hidden mb-3 border border-slate-100">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
                      {p.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h4>
                  
                  {/* Pricing Display */}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-base font-black text-slate-900">
                      ₹{memberPrice.toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{p.sellingPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${p.status === 'In Stock' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    ● {p.status}
                  </span>
                  <button
                    onClick={() => addToOnlineCart(p)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Checkout Experience Box (Faithful to Reference Image 5 & 6) */}
        <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Checkout</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className={activeStep === 1 ? 'text-blue-600' : ''}>① Cart</span>
                <span>→</span>
                <span className={activeStep === 2 ? 'text-blue-600' : ''}>② Delivery</span>
                <span>→</span>
                <span className={activeStep === 3 ? 'text-blue-600' : ''}>③ Payment</span>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="mt-3 space-y-2 max-h-[160px] overflow-y-auto text-xs">
              {onlineCart.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-1 opacity-40" />
                  Your club cart is currently empty
                </div>
              ) : (
                onlineCart.map((item) => (
                  <div key={item.product.id} className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={item.product.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-slate-900 truncate">{item.product.name}</div>
                        <div className="text-[11px] text-slate-500 font-semibold">₹{item.discountedPrice.toLocaleString('en-IN')} each</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => updateOnlineCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-800 text-xs w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateOnlineCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromOnlineCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Delivery Option Selector (Faithful to Reference Image 5) */}
            <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Delivery Option</span>
              
              {/* Pickup from Club */}
              <label 
                onClick={() => setDeliveryMethod('Club Pickup')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                  deliveryMethod === 'Club Pickup' ? 'bg-white border-blue-500 ring-2 ring-blue-200' : 'bg-white/60 border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'Club Pickup'}
                  onChange={() => setDeliveryMethod('Club Pickup')}
                  className="text-blue-600"
                />
                <Store className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Pickup from Club</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Free • Collect from Reception</div>
                </div>
              </label>

              {/* Home Delivery */}
              <label 
                onClick={() => setDeliveryMethod('Home Delivery')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                  deliveryMethod === 'Home Delivery' ? 'bg-white border-blue-500 ring-2 ring-blue-200' : 'bg-white/60 border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'Home Delivery'}
                  onChange={() => setDeliveryMethod('Home Delivery')}
                  className="text-blue-600"
                />
                <Truck className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Home Delivery</div>
                  <div className="text-[11px] text-slate-500 font-medium">₹50 delivery charge to address</div>
                </div>
              </label>
            </div>

            {/* Financial Summary */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({onlineCart.reduce((a, c) => a + c.quantity, 0)} items):</span>
                <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>{onlineMember.tier} Discount ({discountPct}%):</span>
                <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Charge:</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-base text-blue-600">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-5 space-y-2">
            <button
              onClick={handleProceedToPayment}
              disabled={onlineCart.length === 0}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {checkoutSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Order Placed Successfully!
                </>
              ) : (
                <>
                  Proceed to Payment
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Tax invoice & club points will be linked to Membership ID {onlineMember.membershipId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
