export type ProShopCategory = 
  | 'Rackets' 
  | 'Balls' 
  | 'Shoes' 
  | 'Apparel' 
  | 'Accessories' 
  | 'Bags';

export type ProductStockStatus = 'In Stock' | 'Low Stock' | 'Out Of Stock';

export interface ProShopProduct {
  id: string;
  name: string;
  sku: string;
  category: ProShopCategory;
  brand: string;
  description: string;
  sellingPrice: number;
  costPrice: number;
  taxPercentage: number;
  availableStock: number;
  reservedStock: number;
  soldToday: number;
  reorderLevel: number;
  status: ProductStockStatus;
  imageUrl: string;
  vendorName: string;
  lastRestockedDate: string;
  rating?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export type MembershipTier = 'Junior' | 'Silver' | 'Gold';

export interface MemberTierDiscount {
  tier: MembershipTier;
  label: string;
  ageCriteria?: string;
  discountPercentage: number;
  isEnabled: boolean;
  effectiveDate: string;
}

export interface ProShopMember {
  id: string;
  membershipId: string;
  name: string;
  mobile: string;
  email: string;
  tier: MembershipTier;
  avatarUrl?: string;
}

export interface ProShopCartItem {
  product: ProShopProduct;
  quantity: number;
  unitPrice: number;
  discountedPrice: number;
  totalPrice: number;
}

export type DeliveryMethod = 'Club Pickup' | 'Home Delivery';

export type PaymentMethod = 'Cash' | 'Card' | 'UPI';

export interface ProShopVendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  productsSupplied: string[];
  lastOrderDate: string;
  status: 'Active' | 'Inactive';
}

export type PurchaseOrderStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'Approved' 
  | 'Ordered' 
  | 'Received' 
  | 'Cancelled';

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface ProShopPurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseOrderStatus;
  createdDate: string;
  expectedDeliveryDate: string;
  notes?: string;
}

export type ReturnStatus = 'Pending' | 'Approved' | 'Rejected' | 'Refunded';

export interface ProShopReturn {
  id: string;
  returnId: string;
  productId: string;
  productName: string;
  productSku: string;
  memberId: string;
  memberName: string;
  quantity: number;
  refundAmount: number;
  reason: 'Defective Product' | 'Wrong Size / Fit' | 'Changed Mind' | 'Damaged in Packaging';
  status: ReturnStatus;
  requestDate: string;
  resolutionDate?: string;
}

export type InventoryTransactionType = 
  | 'Stock In' 
  | 'Stock Out' 
  | 'Adjustments' 
  | 'Damaged Products' 
  | 'Product Returns';

export interface InventoryTransaction {
  id: string;
  transactionId: string;
  productId: string;
  productName: string;
  sku: string;
  type: InventoryTransactionType;
  quantity: number;
  date: string;
  performedBy: string;
  remarks: string;
}

export interface LowStockAlertItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: ProShopCategory;
  currentStock: number;
  minimumStock: number;
  alertDate: string;
  notificationChannels: ('Email' | 'Push Notification' | 'SMS' | 'Dashboard Alert')[];
  vendorName: string;
}

export interface UserRolePermission {
  role: 'Super Admin' | 'Club Admin' | 'Store Manager' | 'Sales Staff' | 'Member';
  title: string;
  badge: string;
  description: string;
  permissions: string[];
  avatarColor: string;
}
