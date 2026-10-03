export type BarKitchenRole =
  | 'Restaurant Manager'
  | 'Bar Manager'
  | 'Head Chef'
  | 'Kitchen Staff'
  | 'Steward'
  | 'Cashier'
  | 'Inventory Manager'
  | 'Banquet Manager';

export type BarKitchenFacilityType =
  | 'Restaurant'
  | 'Cafe'
  | 'Bar'
  | 'Poolside'
  | 'Room Service'
  | 'Banquet';

export interface BarKitchenFacility {
  id: string;
  name: string;
  type: BarKitchenFacilityType;
  clubId: string;
  branchId: string;
  capacity: number;
  tablesCount: number;
  isOpen: boolean;
  openingHours: string;
}

export type TableArea = 'Indoor' | 'Outdoor' | 'Poolside' | 'VIP' | 'Lounge' | 'Banquet';

export type TableStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'Out Of Service';

export interface BarKitchenTable {
  id: string;
  tableNumber: string;
  area: TableArea;
  seats: number;
  status: TableStatus;
  facilityId: string;
  currentOrderId?: string;
  stewardId?: string;
  stewardName?: string;
  activeBillAmount?: number;
  occupiedSince?: string;
  reservedFor?: string;
  reservationTime?: string;
  mergedWith?: string[];
}

export type MenuCategoryType = 'Food' | 'Beverage' | 'Snacks' | 'Combos' | 'Seasonal' | 'Dessert' | 'Alcohol';

export interface BarKitchenMenuItem {
  id: string;
  name: string;
  category: MenuCategoryType;
  subCategory: string;
  price: number;
  costPrice: number;
  marginPercent: number;
  image: string;
  isAvailable: boolean;
  isVeg: boolean;
  preparationTimeMins: number;
  station: KitchenStation;
  description: string;
  tags?: string[];
  calories?: number;
  isHappyHourEligible?: boolean;
}

export type KitchenStation =
  | 'Grill Station'
  | 'Pizza Station'
  | 'Beverage Station'
  | 'Dessert Station'
  | 'Main Course Station'
  | 'Snacks Station'
  | 'Bar Station';

export type OrderType = 'Dine In' | 'Take Away' | 'Delivery' | 'Room Service';

export type OrderStatus = 'Draft' | 'Sent to Kitchen' | 'Preparing' | 'Ready' | 'Served' | 'Billed' | 'Settled' | 'Cancelled';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  station: KitchenStation;
  status?: 'Pending' | 'Preparing' | 'Ready' | 'Served';
}

export interface BarKitchenOrder {
  id: string;
  orderNumber: string;
  tableId?: string;
  tableNumber?: string;
  facilityId: string;
  orderType: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  discountType?: 'Member Tier' | 'Promo Code' | 'Manager Override' | 'Happy Hour';
  gstPercent: number;
  gstAmount: number;
  serviceChargePercent: number;
  serviceChargeAmount: number;
  total: number;
  memberId?: string;
  memberName?: string;
  memberTier?: 'Gold' | 'Silver' | 'Platinum' | 'Corporate' | 'Guest';
  stewardId?: string;
  stewardName?: string;
  roomNumber?: string;
  createdAt: string;
  kotIds: string[];
}

export type KOTStatus = 'New' | 'Accepted' | 'Preparing' | 'Ready' | 'Served' | 'Cancelled';

export interface BarKitchenKOT {
  id: string;
  kotNumber: string;
  orderId: string;
  orderNumber: string;
  tableNumber: string;
  stewardName: string;
  createdAt: string;
  timestamp: string;
  status: KOTStatus;
  station: KitchenStation;
  priority: 'Normal' | 'Rush' | 'VIP';
  notes?: string;
  items: {
    name: string;
    quantity: number;
    notes?: string;
  }[];
}

export interface BarKitchenReservation {
  id: string;
  guestName: string;
  memberId?: string;
  phone: string;
  email: string;
  type: 'Advance' | 'Waitlist' | 'VIP' | 'Event' | 'Online';
  status: 'Reserved' | 'Checked In' | 'No Show' | 'Cancelled' | 'Completed';
  date: string;
  timeSlot: string;
  pax: number;
  area: TableArea;
  assignedTableId?: string;
  assignedTableNumber?: string;
  specialRequests?: string;
}

export type PaymentMode = 'Cash' | 'Card' | 'UPI' | 'Wallet' | 'Member Account' | 'Corporate Account';

export interface BarKitchenBill {
  id: string;
  billNumber: string;
  orderId: string;
  tableNumber: string;
  facilityId: string;
  subtotal: number;
  discountAmount: number;
  discountDesc: string;
  gstAmount: number;
  serviceCharge: number;
  roundOff: number;
  totalPayable: number;
  paymentMode?: PaymentMode;
  status: 'Unpaid' | 'Paid' | 'Voided' | 'Refunded';
  settledAt?: string;
  cashierName: string;
  memberId?: string;
  memberName?: string;
  splitDetails?: {
    personCount: number;
    amountPerPerson: number;
  };
}

export interface BarKitchenInventoryItem {
  id: string;
  name: string;
  category: 'Spirits' | 'Wine & Beer' | 'Dairy' | 'Meat & Poultry' | 'Produce' | 'Dry Goods' | 'Beverages';
  currentStock: number;
  unit: 'kg' | 'liters' | 'bottles' | 'packs' | 'units';
  minStockLevel: number;
  reorderQuantity: number;
  costPerUnit: number;
  supplier: string;
  expiryDate?: string;
  status: 'In Stock' | 'Low Stock' | 'Critical' | 'Expired';
}

export interface BarKitchenRecipe {
  id: string;
  menuItemId: string;
  menuItemName: string;
  portionSize: string;
  prepTimeMinutes: number;
  costPrice: number;
  sellingPrice: number;
  foodCostPercentage: number;
  ingredients: {
    inventoryItemId: string;
    ingredientName: string;
    quantity: number;
    unit: string;
    cost: number;
  }[];
  instructions: string[];
}

export interface BarKitchenSteward {
  id: string;
  name: string;
  code: string;
  phone: string;
  assignedArea: TableArea;
  assignedTables: string[];
  status: 'On Duty' | 'On Break' | 'Off Duty';
  ordersServedToday: number;
  revenueGeneratedToday: number;
  avgServiceTimeMins: number;
  tipsEarnedToday: number;
  rating: number;
}

export interface BarKitchenBanquetEvent {
  id: string;
  eventNumber: string;
  eventName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  packageType: 'Wedding' | 'Birthday' | 'Corporate' | 'Tournament Catering' | 'Cocktail Evening';
  eventDate: string;
  hallName: string;
  guestCount: number;
  ratePerPax: number;
  estimatedCost: number;
  estimatedRevenue: number;
  advancePaid: number;
  status: 'Inquiry' | 'Confirmed' | 'Live' | 'Completed' | 'Cancelled';
  menuCourses: {
    course: 'Welcome Drinks' | 'Starters' | 'Main Course' | 'Desserts' | 'Bar Package';
    items: string[];
  }[];
}

export interface BarKitchenAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: BarKitchenRole;
  action: 'Deleted Order' | 'Voided Bill' | 'Refund Processed' | 'Discount Override' | 'Cash Drawer Opened' | 'Login' | 'Table Transfer' | 'Recipe Modified';
  details: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

export interface BarKitchenMemberDiscount {
  tier: 'Gold' | 'Silver' | 'Platinum' | 'Corporate' | 'Guest';
  discountPercent: number;
  alcoholDiscountPercent: number;
  specialPerk: string;
  loyaltyPointsPer100: number;
  happyHourBonus: number;
}
