import { create } from 'zustand';
import {
  BarKitchenFacility,
  BarKitchenTable,
  BarKitchenMenuItem,
  BarKitchenKOT,
  BarKitchenReservation,
  BarKitchenBill,
  BarKitchenInventoryItem,
  BarKitchenRecipe,
  BarKitchenSteward,
  BarKitchenBanquetEvent,
  BarKitchenAuditLog,
  BarKitchenRole,
  TableStatus,
  KOTStatus,
  OrderType,
  PaymentMode,
  KitchenStation,
  MenuCategoryType,
} from '../types/BarKitchenTypes';
import {
  mockFacilities,
  mockTables,
  mockMenuItems,
  mockKOTs,
  mockReservations,
  mockInventory,
  mockRecipes,
  mockStewards,
  mockBanquets,
  mockAuditLogs,
} from '../mock/BarKitchenMockData';

export interface CartItem {
  menuItem: BarKitchenMenuItem;
  quantity: number;
  notes?: string;
}

interface BarKitchenStoreState {
  // Multi-tenant & Facility
  tenantId: string;
  clubId: string;
  facilities: BarKitchenFacility[];
  currentFacility: BarKitchenFacility;
  setFacility: (facility: BarKitchenFacility) => void;

  // RBAC & Navigation
  currentRole: BarKitchenRole;
  setRole: (role: BarKitchenRole) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;

  // Tables
  tables: BarKitchenTable[];
  selectedTable: BarKitchenTable | null;
  selectedTableArea: string;
  setSelectedTableArea: (area: string) => void;
  setSelectedTable: (table: BarKitchenTable | null) => void;
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  transferTable: (fromTableId: string, toTableId: string) => void;

  // Menu
  menuItems: BarKitchenMenuItem[];
  selectedCategory: MenuCategoryType | 'All Items';
  setSelectedCategory: (cat: MenuCategoryType | 'All Items') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toggleMenuItemAvailability: (id: string) => void;
  addMenuItem: (item: BarKitchenMenuItem) => void;
  deleteMenuItem: (id: string) => void;

  // POS / Cart
  cartItems: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  targetTableNumber: string;
  setTargetTableNumber: (num: string) => void;
  memberTier: 'Gold' | 'Silver' | 'Platinum' | 'Corporate' | 'Guest';
  setMemberTier: (tier: 'Gold' | 'Silver' | 'Platinum' | 'Corporate' | 'Guest') => void;
  memberName: string;
  setMemberName: (name: string) => void;
  addToCart: (item: BarKitchenMenuItem, quantity?: number, notes?: string) => void;
  updateCartItemQty: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  sendCartToKitchen: () => BarKitchenKOT | null;

  // KOT & KDS
  kots: BarKitchenKOT[];
  updateKOTStatus: (kotId: string, newStatus: KOTStatus) => void;
  kdsFilterStation: KitchenStation | 'All Stations';
  setKdsFilterStation: (station: KitchenStation | 'All Stations') => void;

  // Billing
  bills: BarKitchenBill[];
  activeBill: BarKitchenBill | null;
  setActiveBill: (bill: BarKitchenBill | null) => void;
  generateBillForTable: (tableNumber: string) => BarKitchenBill;
  settleBill: (billId: string, paymentMode: PaymentMode) => void;

  // Reservations
  reservations: BarKitchenReservation[];
  addReservation: (res: BarKitchenReservation) => void;
  updateReservationStatus: (id: string, status: BarKitchenReservation['status']) => void;

  // Inventory
  inventory: BarKitchenInventoryItem[];
  updateStock: (id: string, delta: number) => void;

  // Recipes
  recipes: BarKitchenRecipe[];

  // Stewards
  stewards: BarKitchenSteward[];
  updateStewardStatus: (id: string, status: BarKitchenSteward['status']) => void;

  // Banquet
  banquets: BarKitchenBanquetEvent[];
  addBanquetEvent: (event: BarKitchenBanquetEvent) => void;
  updateBanquetStatus: (id: string, status: BarKitchenBanquetEvent['status']) => void;

  // Audit Logs
  auditLogs: BarKitchenAuditLog[];
  addAuditLog: (action: BarKitchenAuditLog['action'], details: string, severity?: BarKitchenAuditLog['severity']) => void;

  // Toast / Feedback
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

export const useBarKitchenStore = create<BarKitchenStoreState>((set, get) => ({
  tenantId: 'TENANT-PLAYNEX-GLOBAL',
  clubId: 'CLUB-ROYAL-SPORTS',
  facilities: mockFacilities,
  currentFacility: mockFacilities[0],
  setFacility: (facility) => {
    set({ currentFacility: facility });
    get().addAuditLog('Login', `Switched facility context to ${facility.name}`, 'Info');
  },

  currentRole: 'Restaurant Manager',
  setRole: (role) => set({ currentRole: role }),
  activeNav: 'Dashboard',
  setActiveNav: (nav) => set({ activeNav: nav }),

  // Tables
  tables: mockTables,
  selectedTable: mockTables[1], // Table T2 as default selected
  selectedTableArea: 'All',
  setSelectedTableArea: (area) => set({ selectedTableArea: area }),
  setSelectedTable: (table) => {
    set({ selectedTable: table });
    if (table) {
      set({ targetTableNumber: table.tableNumber });
    }
  },
  updateTableStatus: (tableId, status) => {
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId ? { ...t, status } : t
      ),
      selectedTable:
        state.selectedTable?.id === tableId
          ? { ...state.selectedTable, status }
          : state.selectedTable,
    }));
  },
  transferTable: (fromTableId, toTableId) => {
    const { tables, addAuditLog } = get();
    const from = tables.find((t) => t.id === fromTableId);
    const to = tables.find((t) => t.id === toTableId);
    if (!from || !to) return;

    set((state) => ({
      tables: state.tables.map((t) => {
        if (t.id === fromTableId) {
          return { ...t, status: 'Available', activeBillAmount: undefined, occupiedSince: undefined };
        }
        if (t.id === toTableId) {
          return {
            ...t,
            status: 'Occupied',
            activeBillAmount: from.activeBillAmount,
            occupiedSince: from.occupiedSince || 'Just now',
            stewardName: from.stewardName,
          };
        }
        return t;
      }),
    }));
    addAuditLog('Table Transfer', `Transferred ${from.tableNumber} to ${to.tableNumber}`, 'Info');
  },

  // Menu
  menuItems: mockMenuItems,
  selectedCategory: 'All Items',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleMenuItemAvailability: (id) => {
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      ),
    }));
  },
  addMenuItem: (item) => {
    set((state) => ({ menuItems: [item, ...state.menuItems] }));
  },
  deleteMenuItem: (id) => {
    set((state) => ({
      menuItems: state.menuItems.filter((i) => i.id !== id),
    }));
  },

  // POS / Cart
  cartItems: [
    { menuItem: mockMenuItems[0], quantity: 2, notes: 'Medium rare' }, // Club House Burger
    { menuItem: mockMenuItems[4], quantity: 1 }, // Artisan Cappuccino
    { menuItem: mockMenuItems[3], quantity: 1, notes: 'Extra seasoning' }, // Peri Peri Fries
  ],
  orderType: 'Dine In',
  setOrderType: (type) => set({ orderType: type }),
  targetTableNumber: 'T2',
  setTargetTableNumber: (num) => set({ targetTableNumber: num }),
  memberTier: 'Gold',
  setMemberTier: (tier) => set({ memberTier: tier }),
  memberName: 'Dr. Sameer Desai',
  setMemberName: (name) => set({ memberName: name }),

  addToCart: (item, quantity = 1, notes = '') => {
    set((state) => {
      const existingIndex = state.cartItems.findIndex(
        (ci) => ci.menuItem.id === item.id
      );
      if (existingIndex > -1) {
        const updated = [...state.cartItems];
        updated[existingIndex].quantity += quantity;
        if (notes) updated[existingIndex].notes = notes;
        return { cartItems: updated };
      }
      return {
        cartItems: [...state.cartItems, { menuItem: item, quantity, notes }],
      };
    });
  },

  updateCartItemQty: (itemId, delta) => {
    set((state) => {
      const updated = state.cartItems
        .map((ci) => {
          if (ci.menuItem.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
      return { cartItems: updated };
    });
  },

  removeFromCart: (itemId) => {
    set((state) => ({
      cartItems: state.cartItems.filter((ci) => ci.menuItem.id !== itemId),
    }));
  },

  clearCart: () => set({ cartItems: [] }),

  sendCartToKitchen: () => {
    const { cartItems, targetTableNumber, kots, addAuditLog, setToastMessage } = get();
    if (cartItems.length === 0) return null;

    const newKotId = `KOT-${kots.length + 101}`;
    const newKotNumber = `#${kots.length + 101}`;

    const newKOT: BarKitchenKOT = {
      id: newKotId,
      kotNumber: newKotNumber,
      orderId: `ORD-${Date.now().toString().slice(-4)}`,
      orderNumber: `ORD-${Date.now().toString().slice(-4)}`,
      tableNumber: targetTableNumber || 'T2',
      stewardName: 'Vikram Singh',
      createdAt: 'Just now',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'New',
      station: cartItems[0]?.menuItem.station || 'Grill Station',
      priority: 'Normal',
      items: cartItems.map((ci) => ({
        name: ci.menuItem.name,
        quantity: ci.quantity,
        notes: ci.notes,
      })),
    };

    set((state) => ({
      kots: [newKOT, ...state.kots],
      cartItems: [],
      // Mark table as occupied
      tables: state.tables.map((t) =>
        t.tableNumber === targetTableNumber
          ? { ...t, status: 'Occupied', occupiedSince: 'Just now' }
          : t
      ),
    }));

    addAuditLog(
      'Login',
      `Sent ${newKotNumber} to Kitchen for Table ${targetTableNumber}`,
      'Info'
    );
    setToastMessage(`KOT ${newKotNumber} successfully sent to Kitchen!`);
    return newKOT;
  },

  // KOT & KDS
  kots: mockKOTs,
  updateKOTStatus: (kotId, newStatus) => {
    set((state) => ({
      kots: state.kots.map((k) =>
        k.id === kotId ? { ...k, status: newStatus } : k
      ),
    }));
    get().setToastMessage(`Order ${kotId} marked as ${newStatus}`);
  },
  kdsFilterStation: 'All Stations',
  setKdsFilterStation: (station) => set({ kdsFilterStation: station }),

  // Billing
  bills: [],
  activeBill: null,
  setActiveBill: (bill) => set({ activeBill: bill }),
  generateBillForTable: (tableNumber) => {
    const { memberTier, memberName, currentFacility } = get();
    const discountRate =
      memberTier === 'Platinum' ? 0.25 : memberTier === 'Gold' ? 0.2 : memberTier === 'Silver' ? 0.15 : 0;

    const subtotal = 480;
    const discountAmount = Math.round(subtotal * discountRate);
    const taxable = subtotal - discountAmount;
    const gstAmount = Math.round(taxable * 0.05 * 10) / 10;
    const serviceCharge = Math.round(taxable * 0.05 * 10) / 10;
    const totalPayable = Math.round((taxable + gstAmount + serviceCharge) * 10) / 10;

    const newBill: BarKitchenBill = {
      id: `BL-${Date.now().toString().slice(-4)}`,
      billNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: `ORD-${tableNumber}`,
      tableNumber,
      facilityId: currentFacility.id,
      subtotal,
      discountAmount,
      discountDesc: `Member Discount (${Math.round(discountRate * 100)}% ${memberTier})`,
      gstAmount,
      serviceCharge,
      roundOff: 0,
      totalPayable,
      status: 'Unpaid',
      cashierName: 'Arun Dave',
      memberName: memberName || 'Dr. Sameer Desai',
      memberId: 'MEM-9402',
    };

    set({ activeBill: newBill });
    return newBill;
  },

  settleBill: (billId, paymentMode) => {
    const { activeBill, addAuditLog, setToastMessage } = get();
    if (!activeBill) return;

    const settled: BarKitchenBill = {
      ...activeBill,
      paymentMode,
      status: 'Paid',
      settledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      bills: [settled, ...state.bills],
      activeBill: settled,
      tables: state.tables.map((t) =>
        t.tableNumber === settled.tableNumber
          ? { ...t, status: 'Cleaning', activeBillAmount: undefined, occupiedSince: undefined }
          : t
      ),
    }));

    addAuditLog('Cash Drawer Opened', `Bill ${settled.billNumber} settled via ${paymentMode}`, 'Info');
    setToastMessage(`Payment of ₹${settled.totalPayable} received via ${paymentMode}!`);
  },

  // Reservations
  reservations: mockReservations,
  addReservation: (res) => {
    set((state) => ({ reservations: [res, ...state.reservations] }));
    get().setToastMessage(`Reservation booked for ${res.guestName}!`);
  },
  updateReservationStatus: (id, status) => {
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    }));
  },

  // Inventory
  inventory: mockInventory,
  updateStock: (id, delta) => {
    set((state) => ({
      inventory: state.inventory.map((inv) =>
        inv.id === id ? { ...inv, currentStock: Math.max(0, inv.currentStock + delta) } : inv
      ),
    }));
  },

  // Recipes
  recipes: mockRecipes,

  // Stewards
  stewards: mockStewards,
  updateStewardStatus: (id, status) => {
    set((state) => ({
      stewards: state.stewards.map((s) => (s.id === id ? { ...s, status } : s)),
    }));
  },

  // Banquet
  banquets: mockBanquets,
  addBanquetEvent: (event) => {
    set((state) => ({ banquets: [event, ...state.banquets] }));
    get().setToastMessage(`Banquet event booked: ${event.eventName}`);
  },
  updateBanquetStatus: (id, status) => {
    set((state) => ({
      banquets: state.banquets.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
  },

  // Audit Logs
  auditLogs: mockAuditLogs,
  addAuditLog: (action, details, severity = 'Info') => {
    const newLog: BarKitchenAuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: `${new Date().toLocaleTimeString()} Today`,
      user: get().currentRole,
      role: get().currentRole,
      action,
      details,
      severity,
    };
    set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
  },

  // Toast
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
  },
}));
