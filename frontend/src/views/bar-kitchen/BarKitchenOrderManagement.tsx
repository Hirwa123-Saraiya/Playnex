import React, { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  UtensilsCrossed,
  Send,
  Printer,
  Sparkles,
  ShoppingBag,
  Percent,
  CheckCircle,
  Clock,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenCategories } from '../../components/bar-kitchen/BarKitchenCategories';
import { BarKitchenMenuCard } from '../../components/bar-kitchen/BarKitchenMenuCard';
import { OrderType } from '../../types/BarKitchenTypes';

export const BarKitchenOrderManagement: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    cartItems,
    addToCart,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    sendCartToKitchen,
    orderType,
    setOrderType,
    targetTableNumber,
    setTargetTableNumber,
    memberTier,
    setMemberTier,
    memberName,
    setMemberName,
    tables,
    setActiveNav,
  } = useBarKitchenStore();

  const [search, setSearch] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [showTableSelect, setShowTableSelect] = useState(false);

  // Discount calculation based on member tier (Gold 20%, Silver 15%, Platinum 25%, Corporate 20%, Guest 0%)
  const discountRate =
    memberTier === 'Platinum'
      ? 0.25
      : memberTier === 'Gold'
      ? 0.2
      : memberTier === 'Silver'
      ? 0.15
      : memberTier === 'Corporate'
      ? 0.2
      : 0;

  const subtotal = cartItems.reduce(
    (sum, ci) => sum + ci.menuItem.price * ci.quantity,
    0
  );
  const discountAmount = Math.round(subtotal * discountRate * 10) / 10;
  const taxable = subtotal - discountAmount;
  const gstAmount = Math.round(taxable * 0.05 * 10) / 10;
  const total = Math.round((taxable + gstAmount) * 10) / 10;

  const orderTypes: OrderType[] = ['Dine In', 'Take Away', 'Delivery', 'Room Service'];

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.subCategory.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendToKitchen = () => {
    const kot = sendCartToKitchen();
    if (kot) {
      // Prompt user or switch view option
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top POS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Point of Sale (POS) Order Entry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ultra-fast touch terminal for dine-in tables, room delivery, and member tab orders.
          </p>
        </div>

        {/* Order Type Tabs matching reference image: Dine In | Take Away | Delivery */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-2xl self-start sm:self-auto shadow-2xs">
          {orderTypes.map((ot) => (
            <button
              key={ot}
              type="button"
              onClick={() => setOrderType(ot)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                orderType === ot
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {ot}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Left 7 cols (Menu catalog) | Right 5 cols (Current Order Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Menu Catalog Section (7 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Search bar & Category filters matching Reference Image Panel 3 */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu items (e.g. Burger, Pizza, Coffee, Fries)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <BarKitchenCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Items Grid matching reference image cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredMenuItems.map((item) => (
              <BarKitchenMenuCard
                key={item.id}
                item={item}
                onAdd={(it) => addToCart(it, 1)}
              />
            ))}
          </div>
        </div>

        {/* Right: Current Order Panel (5 Cols) - Strictly Matching Reference Image Panel 3 */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-lg p-5 space-y-4 sticky top-20">
          {/* Header matching image: Current Order - Table T2 [T2 Red Badge] [+] */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Order Session
              </span>
              <h3 className="text-base font-black text-slate-900">
                Current Order - Table {targetTableNumber}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-8 h-8 rounded-xl bg-red-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {targetTableNumber}
              </span>
              <button
                type="button"
                onClick={() => setShowTableSelect(!showTableSelect)}
                title="Change Table"
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Table Switcher popover if open */}
          {showTableSelect && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 animate-in fade-in">
              <span className="font-bold text-slate-700 block">Switch Target Table:</span>
              <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto">
                {tables.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTargetTableNumber(t.tableNumber);
                      setShowTableSelect(false);
                    }}
                    className={`p-1.5 rounded-lg font-black text-center ${
                      targetTableNumber === t.tableNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t.tableNumber}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Member Tier Selector */}
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-bold text-slate-700">{memberName}</span>
            </div>
            <select
              value={memberTier}
              onChange={(e) => setMemberTier(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-blue-600"
            >
              <option value="Platinum">Platinum (25% off)</option>
              <option value="Gold">Gold (20% off)</option>
              <option value="Silver">Silver (15% off)</option>
              <option value="Corporate">Corporate (20% off)</option>
              <option value="Guest">Guest (0% off)</option>
            </select>
          </div>

          {/* Items List Table matching reference image: Item | Qty | Price */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-bold">No items in ticket yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click any menu item to add.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cartItems.map(({ menuItem, quantity, notes }) => (
                  <div
                    key={menuItem.id}
                    className="py-2.5 flex items-center justify-between text-xs gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            menuItem.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span className="font-bold text-slate-900 truncate">
                          {menuItem.name}
                        </span>
                      </div>
                      {notes && (
                        <span className="text-[10px] text-amber-700 italic block pl-3.5">
                          Note: {notes}
                        </span>
                      )}
                    </div>

                    {/* Quantity Stepper matching image (2, 1, 1) */}
                    <div className="flex items-center gap-1 shrink-0 bg-slate-100 px-2 py-0.5 rounded-lg">
                      <button
                        onClick={() => updateCartItemQty(menuItem.id, -1)}
                        className="text-slate-500 hover:text-rose-600 font-black p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-slate-900 w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQty(menuItem.id, 1)}
                        className="text-slate-500 hover:text-blue-600 font-black p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price with Rupee symbol matching image */}
                    <span className="font-black text-slate-900 text-right w-14 shrink-0">
                      ₹{menuItem.price * quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bill Calculation matching Reference Image:
              Subtotal ₹480 | Member Discount (20%) -₹96 | GST (5%) ₹19.2 | Total ₹403.2 */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">₹{subtotal.toFixed(1)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Member Discount ({Math.round(discountRate * 100)}%)</span>
                <span className="font-bold">- ₹{discountAmount.toFixed(1)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-bold text-slate-800">₹{gstAmount.toFixed(1)}</span>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span className="text-xl text-slate-900">₹{total.toFixed(1)}</span>
            </div>
          </div>

          {/* Action Buttons matching Reference Image: Clear (Red) | Send to Kitchen (Blue) */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={clearCart}
              className="py-3 bg-red-600 hover:bg-red-700 active:scale-98 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={handleSendToKitchen}
              className="py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Kitchen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
