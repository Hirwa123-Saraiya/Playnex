import { create } from 'zustand';
import {
  ProShopProduct,
  MemberTierDiscount,
  ProShopMember,
  ProShopCartItem,
  DeliveryMethod,
  PaymentMethod,
  ProShopVendor,
  ProShopPurchaseOrder,
  ProShopReturn,
  InventoryTransaction,
  LowStockAlertItem,
  ProShopCategory
} from '../types/ProShopInventoryTypes';
import {
  mockProShopProducts,
  mockTierDiscounts,
  mockProShopMembers,
  mockLowStockAlerts,
  mockVendors,
  mockPurchaseOrders,
  mockReturns,
  mockInventoryTransactions
} from '../mock/ProShopInventoryMockData';

export type ProShopActiveView = 
  | 'overview' 
  | 'catalog' 
  | 'central-inventory' 
  | 'stock-tracking' 
  | 'low-stock-alerts' 
  | 'online-store' 
  | 'member-discounts' 
  | 'pos-counter' 
  | 'purchases' 
  | 'returns-refunds' 
  | 'reports-analytics' 
  | 'user-roles' 
  | 'inventory-transactions';

interface ProShopStoreState {
  activeView: ProShopActiveView;
  setActiveView: (view: ProShopActiveView) => void;

  // Products
  products: ProShopProduct[];
  selectedCategory: ProShopCategory | 'All';
  setSelectedCategory: (cat: ProShopCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addProduct: (product: Omit<ProShopProduct, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<ProShopProduct>) => void;
  deleteProduct: (id: string) => void;

  // Discounts
  tierDiscounts: MemberTierDiscount[];
  updateTierDiscount: (tier: MemberTierDiscount['tier'], percentage: number, isEnabled: boolean) => void;

  // Online Store Cart & Member Session
  onlineMember: ProShopMember;
  setOnlineMember: (member: ProShopMember) => void;
  onlineCart: ProShopCartItem[];
  addToOnlineCart: (product: ProShopProduct) => void;
  updateOnlineCartQuantity: (productId: string, quantity: number) => void;
  removeFromOnlineCart: (productId: string) => void;
  clearOnlineCart: () => void;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  checkoutSuccess: boolean;
  setCheckoutSuccess: (status: boolean) => void;

  // POS State
  posMember: ProShopMember | null;
  setPosMember: (member: ProShopMember | null) => void;
  posCart: ProShopCartItem[];
  addToPosCart: (product: ProShopProduct) => void;
  updatePosCartQuantity: (productId: string, delta: number) => void;
  removeFromPosCart: (productId: string) => void;
  clearPosCart: () => void;
  posPaymentMethod: PaymentMethod;
  setPosPaymentMethod: (pm: PaymentMethod) => void;
  posLastSaleReceipt: any | null;
  completePosSale: () => void;

  // Purchase Management
  vendors: ProShopVendor[];
  purchaseOrders: ProShopPurchaseOrder[];
  addPurchaseOrder: (po: Omit<ProShopPurchaseOrder, 'id' | 'poNumber'>) => void;
  updatePurchaseOrderStatus: (poId: string, status: ProShopPurchaseOrder['status']) => void;

  // Returns & Refunds
  returns: ProShopReturn[];
  updateReturnStatus: (returnId: string, status: ProShopReturn['status']) => void;

  // Inventory Transactions
  transactions: InventoryTransaction[];
  addTransaction: (tx: Omit<InventoryTransaction, 'id' | 'transactionId' | 'date'>) => void;

  // Alerts
  alerts: LowStockAlertItem[];
  reorderAlertItem: (alertId: string) => void;

  // Toast
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

export const useProShopStore = create<ProShopStoreState>((set, get) => ({
  activeView: 'overview',
  setActiveView: (view) => set({ activeView: view }),

  products: mockProShopProducts,
  selectedCategory: 'All',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  addProduct: (prod) => {
    const id = `PROD-${Date.now().toString().slice(-4)}`;
    const newProduct: ProShopProduct = { ...prod, id };
    set((state) => ({ products: [newProduct, ...state.products] }));
    get().setToastMessage(`Product "${prod.name}" created successfully.`);
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p))
    }));
    get().setToastMessage(`Product specifications updated.`);
  },

  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id)
    }));
    get().setToastMessage(`Product removed from catalog.`);
  },

  tierDiscounts: mockTierDiscounts,
  updateTierDiscount: (tier, percentage, isEnabled) => {
    set((state) => ({
      tierDiscounts: state.tierDiscounts.map((td) =>
        td.tier === tier ? { ...td, discountPercentage: percentage, isEnabled } : td
      )
    }));
    get().setToastMessage(`${tier} discount policy adjusted to ${percentage}%.`);
  },

  // Online Store
  onlineMember: mockProShopMembers[0], // Default Gold member
  setOnlineMember: (member) => set({ onlineMember: member }),
  onlineCart: [
    {
      product: mockProShopProducts[0], // Wilson Tennis Racket (₹12,000)
      quantity: 1,
      unitPrice: 12000,
      discountedPrice: 10200, // 15% Gold discount
      totalPrice: 10200
    },
    {
      product: mockProShopProducts[2], // Tennis Balls (₹600)
      quantity: 2,
      unitPrice: 600,
      discountedPrice: 510,
      totalPrice: 1020
    }
  ],
  deliveryMethod: 'Club Pickup',
  setDeliveryMethod: (method) => set({ deliveryMethod: method }),
  checkoutSuccess: false,
  setCheckoutSuccess: (status) => set({ checkoutSuccess: status }),

  addToOnlineCart: (product) => {
    const { onlineCart, onlineMember, tierDiscounts } = get();
    const discountObj = tierDiscounts.find((d) => d.tier === onlineMember.tier && d.isEnabled);
    const discPct = discountObj ? discountObj.discountPercentage : 0;
    const discountedPrice = Math.round(product.sellingPrice * (1 - discPct / 100));

    const existing = onlineCart.find((item) => item.product.id === product.id);
    if (existing) {
      set({
        onlineCart: onlineCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.discountedPrice }
            : item
        )
      });
    } else {
      set({
        onlineCart: [
          ...onlineCart,
          {
            product,
            quantity: 1,
            unitPrice: product.sellingPrice,
            discountedPrice,
            totalPrice: discountedPrice
          }
        ]
      });
    }
    get().setToastMessage(`Added "${product.name}" to cart.`);
  },

  updateOnlineCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromOnlineCart(productId);
      return;
    }
    set((state) => ({
      onlineCart: state.onlineCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity, totalPrice: quantity * item.discountedPrice }
          : item
      )
    }));
  },

  removeFromOnlineCart: (productId) => {
    set((state) => ({
      onlineCart: state.onlineCart.filter((item) => item.product.id !== productId)
    }));
  },

  clearOnlineCart: () => set({ onlineCart: [] }),

  // POS
  posMember: mockProShopMembers[0], // Rajesh Singhania (Gold - 15%)
  setPosMember: (member) => {
    set({ posMember: member });
    // Recalculate POS cart discounts
    const { posCart, tierDiscounts } = get();
    const discountObj = member ? tierDiscounts.find((d) => d.tier === member.tier && d.isEnabled) : null;
    const discPct = discountObj ? discountObj.discountPercentage : 0;

    const recalculated = posCart.map((item) => {
      const discountedPrice = Math.round(item.unitPrice * (1 - discPct / 100));
      return {
        ...item,
        discountedPrice,
        totalPrice: discountedPrice * item.quantity
      };
    });
    set({ posCart: recalculated });
    get().setToastMessage(member ? `Linked POS sale to ${member.name} (${member.tier} - ${discPct}% OFF)` : 'Switched to Guest checkout');
  },

  posCart: [
    {
      product: mockProShopProducts[1], // Babolat Pure Drive ₹10,000
      quantity: 1,
      unitPrice: 10000,
      discountedPrice: 8500, // 15% discount
      totalPrice: 8500
    },
    {
      product: mockProShopProducts[2], // Tennis Balls 3 pack ₹600
      quantity: 1,
      unitPrice: 600,
      discountedPrice: 510,
      totalPrice: 510
    },
    {
      product: mockProShopProducts[6], // Club T-Shirt ₹1,200
      quantity: 1,
      unitPrice: 1200,
      discountedPrice: 1020,
      totalPrice: 1020
    }
  ],

  addToPosCart: (product) => {
    const { posCart, posMember, tierDiscounts } = get();
    const discountObj = posMember ? tierDiscounts.find((d) => d.tier === posMember.tier && d.isEnabled) : null;
    const discPct = discountObj ? discountObj.discountPercentage : 0;
    const discountedPrice = Math.round(product.sellingPrice * (1 - discPct / 100));

    const existing = posCart.find((item) => item.product.id === product.id);
    if (existing) {
      set({
        posCart: posCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.discountedPrice }
            : item
        )
      });
    } else {
      set({
        posCart: [
          ...posCart,
          {
            product,
            quantity: 1,
            unitPrice: product.sellingPrice,
            discountedPrice,
            totalPrice: discountedPrice
          }
        ]
      });
    }
  },

  updatePosCartQuantity: (productId, delta) => {
    const { posCart } = get();
    const existing = posCart.find((item) => item.product.id === productId);
    if (!existing) return;
    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      get().removeFromPosCart(productId);
    } else {
      set({
        posCart: posCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQty, totalPrice: newQty * item.discountedPrice }
            : item
        )
      });
    }
  },

  removeFromPosCart: (productId) => {
    set((state) => ({
      posCart: state.posCart.filter((item) => item.product.id !== productId)
    }));
  },

  clearPosCart: () => set({ posCart: [] }),

  posPaymentMethod: 'Cash',
  setPosPaymentMethod: (pm) => set({ posPaymentMethod: pm }),
  posLastSaleReceipt: null,

  completePosSale: () => {
    const { posCart, posMember, posPaymentMethod, products } = get();
    if (posCart.length === 0) return;

    const subtotal = posCart.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);
    const total = posCart.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const discount = subtotal - total;

    // Deduct stock from central inventory
    const updatedProducts = products.map((p) => {
      const soldItem = posCart.find((c) => c.product.id === p.id);
      if (soldItem) {
        const newStock = Math.max(0, p.availableStock - soldItem.quantity);
        return {
          ...p,
          availableStock: newStock,
          soldToday: p.soldToday + soldItem.quantity,
          status: newStock === 0 ? ('Out Of Stock' as const) : newStock <= p.reorderLevel ? ('Low Stock' as const) : ('In Stock' as const)
        };
      }
      return p;
    });

    const receipt = {
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      member: posMember,
      items: [...posCart],
      subtotal,
      discount,
      total,
      paymentMethod: posPaymentMethod
    };

    // Add inventory transaction
    posCart.forEach((item) => {
      get().addTransaction({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        type: 'Stock Out',
        quantity: -item.quantity,
        performedBy: 'Counter POS',
        remarks: `POS Sale Receipt #${receipt.receiptNumber}`
      });
    });

    set({
      products: updatedProducts,
      posLastSaleReceipt: receipt,
      posCart: []
    });

    get().setToastMessage(`Sale completed! Receipt #${receipt.receiptNumber} generated.`);
  },

  // Purchases
  vendors: mockVendors,
  purchaseOrders: mockPurchaseOrders,
  addPurchaseOrder: (po) => {
    const id = `PO-${Date.now().toString().slice(-4)}`;
    const poNumber = `PO-2025-${Math.floor(100 + Math.random() * 900)}`;
    const newPO: ProShopPurchaseOrder = { ...po, id, poNumber };
    set((state) => ({ purchaseOrders: [newPO, ...state.purchaseOrders] }));
    get().setToastMessage(`Purchase Order ${poNumber} created.`);
  },

  updatePurchaseOrderStatus: (poId, status) => {
    const { purchaseOrders, products } = get();
    const targetPO = purchaseOrders.find((po) => po.id === poId);

    // If marked received, automatically add stock to Central Inventory
    let updatedProducts = products;
    if (status === 'Received' && targetPO) {
      updatedProducts = products.map((prod) => {
        const poItem = targetPO.items.find((i) => i.productId === prod.id);
        if (poItem) {
          const newAvail = prod.availableStock + poItem.quantity;
          return {
            ...prod,
            availableStock: newAvail,
            status: newAvail > prod.reorderLevel ? ('In Stock' as const) : ('Low Stock' as const)
          };
        }
        return prod;
      });

      targetPO.items.forEach((item) => {
        get().addTransaction({
          productId: item.productId,
          productName: item.productName,
          sku: 'IN-RESTOCK',
          type: 'Stock In',
          quantity: +item.quantity,
          performedBy: 'Store Manager',
          remarks: `Stock Received from ${targetPO.vendorName} against ${targetPO.poNumber}`
        });
      });
    }

    set({
      products: updatedProducts,
      purchaseOrders: purchaseOrders.map((po) => (po.id === poId ? { ...po, status } : po))
    });
    get().setToastMessage(`PO ${targetPO?.poNumber} updated to "${status}".`);
  },

  // Returns
  returns: mockReturns,
  updateReturnStatus: (returnId, status) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === returnId
          ? { ...r, status, resolutionDate: status !== 'Pending' ? 'Today' : undefined }
          : r
      )
    }));
    get().setToastMessage(`Return request updated to "${status}".`);
  },

  // Transactions
  transactions: mockInventoryTransactions,
  addTransaction: (tx) => {
    const id = `TXN-${Date.now().toString().slice(-4)}`;
    const transactionId = `ITX-${Math.floor(8000 + Math.random() * 1000)}`;
    const date = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const newTx: InventoryTransaction = { ...tx, id, transactionId, date };
    set((state) => ({ transactions: [newTx, ...state.transactions] }));
  },

  // Alerts
  alerts: mockLowStockAlerts,
  reorderAlertItem: (alertId) => {
    const alert = get().alerts.find((a) => a.id === alertId);
    if (!alert) return;
    get().addPurchaseOrder({
      vendorId: 'VND-01',
      vendorName: alert.vendorName,
      items: [
        {
          productId: alert.productId,
          productName: alert.productName,
          quantity: alert.minimumStock * 2,
          unitCost: 500,
          totalCost: alert.minimumStock * 2 * 500
        }
      ],
      totalAmount: alert.minimumStock * 2 * 500,
      status: 'Submitted',
      createdDate: 'Today',
      expectedDeliveryDate: 'In 3 Days',
      notes: `Automated reorder triggered by low stock alert (${alert.currentStock} left)`
    });
    get().setToastMessage(`Reorder PO created for ${alert.productName}`);
  },

  toastMessage: null,
  setToastMessage: (msg) => {
    set({ toastMessage: msg });
    if (msg) {
      setTimeout(() => {
        if (get().toastMessage === msg) {
          set({ toastMessage: null });
        }
      }, 4000);
    }
  }
}));
