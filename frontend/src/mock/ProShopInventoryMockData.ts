import {
  ProShopProduct,
  MemberTierDiscount,
  ProShopMember,
  ProShopVendor,
  ProShopPurchaseOrder,
  ProShopReturn,
  InventoryTransaction,
  LowStockAlertItem,
  UserRolePermission
} from '../types/ProShopInventoryTypes';

export const mockProShopProducts: ProShopProduct[] = [
  {
    id: 'PROD-01',
    name: 'Wilson Pro Staff 97 Tennis Racket',
    sku: 'WR001',
    category: 'Rackets',
    brand: 'Wilson',
    description: 'Precision engineered tournament graphite frame with countervail vibration dampening.',
    sellingPrice: 12000,
    costPrice: 8000,
    taxPercentage: 18,
    availableStock: 25,
    reservedStock: 2,
    soldToday: 8,
    reorderLevel: 5,
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1617083934555-563d76e4c760?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Wilson Sports India Ltd',
    lastRestockedDate: '28 Sep 2025',
    rating: 4.9,
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: 'PROD-02',
    name: 'Babolat Pure Drive Tennis Racket',
    sku: 'WR002',
    category: 'Rackets',
    brand: 'Babolat',
    description: 'Iconic power and spin racket favored by club champions and advanced junior athletes.',
    sellingPrice: 10000,
    costPrice: 7000,
    taxPercentage: 18,
    availableStock: 12,
    reservedStock: 2,
    soldToday: 4,
    reorderLevel: 4,
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Apex Rackets & Strings Co',
    lastRestockedDate: '01 Oct 2025',
    rating: 4.8,
    isFeatured: true
  },
  {
    id: 'PROD-03',
    name: 'Wilson Championship Tennis Balls (3-Pack Can)',
    sku: 'WB001',
    category: 'Balls',
    brand: 'Wilson',
    description: 'Dura-Weave extra duty felt pressurized tennis balls for all court surfaces.',
    sellingPrice: 600,
    costPrice: 380,
    taxPercentage: 12,
    availableStock: 18,
    reservedStock: 10,
    soldToday: 25,
    reorderLevel: 20,
    status: 'Low Stock',
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Wilson Sports India Ltd',
    lastRestockedDate: '24 Sep 2025',
    rating: 4.7,
    isBestSeller: true
  },
  {
    id: 'PROD-04',
    name: 'Dunlop Fort Clay Court Tennis Balls (4-Pack)',
    sku: 'DB002',
    category: 'Balls',
    brand: 'Dunlop',
    description: 'Premium tournament grade pressurized felt balls with water-resistant core.',
    sellingPrice: 850,
    costPrice: 550,
    taxPercentage: 12,
    availableStock: 120,
    reservedStock: 10,
    soldToday: 25,
    reorderLevel: 30,
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Dunlop Sporting Goods',
    lastRestockedDate: '02 Oct 2025',
    rating: 4.8
  },
  {
    id: 'PROD-05',
    name: 'Nike Court Air Zoom Vapor Pro 2 Shoes',
    sku: 'NS001',
    category: 'Shoes',
    brand: 'Nike',
    description: 'Low-to-the-court speed shoe engineered for clay and synthetic court traction.',
    sellingPrice: 6000,
    costPrice: 4200,
    taxPercentage: 18,
    availableStock: 5,
    reservedStock: 0,
    soldToday: 3,
    reorderLevel: 10,
    status: 'Low Stock',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Nike Athletic Distributor',
    lastRestockedDate: '15 Sep 2025',
    rating: 4.9,
    isFeatured: true
  },
  {
    id: 'PROD-06',
    name: 'Asics Gel-Resolution 9 Tennis Shoes',
    sku: 'AS002',
    category: 'Shoes',
    brand: 'Asics',
    description: 'Dynawall support technology for elite stability and lateral baseline movement.',
    sellingPrice: 7500,
    costPrice: 5200,
    taxPercentage: 18,
    availableStock: 14,
    reservedStock: 2,
    soldToday: 2,
    reorderLevel: 6,
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Pro Court Footwear Ltd',
    lastRestockedDate: '29 Sep 2025',
    rating: 4.8
  },
  {
    id: 'PROD-07',
    name: 'Playnex Official Club Performance T-Shirt',
    sku: 'AT001',
    category: 'Apparel',
    brand: 'Playnex Club',
    description: 'Breathable dry-fit polyester polo with club embroidered crest and UV protection.',
    sellingPrice: 1200,
    costPrice: 650,
    taxPercentage: 5,
    availableStock: 25,
    reservedStock: 5,
    soldToday: 10,
    reorderLevel: 15,
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Prime Apparel Manufacturers',
    lastRestockedDate: '01 Oct 2025',
    rating: 4.6,
    isBestSeller: true
  },
  {
    id: 'PROD-08',
    name: 'Playnex Breathable Club Aerobill Cap',
    sku: 'AC002',
    category: 'Accessories',
    brand: 'Playnex Club',
    description: 'Lightweight moisture-wicking sun visor cap with adjustable snap closure.',
    sellingPrice: 800,
    costPrice: 420,
    taxPercentage: 12,
    availableStock: 8,
    reservedStock: 0,
    soldToday: 6,
    reorderLevel: 12,
    status: 'Low Stock',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Prime Apparel Manufacturers',
    lastRestockedDate: '18 Sep 2025',
    rating: 4.5
  },
  {
    id: 'PROD-09',
    name: 'Wilson Super Tour 9-Racket Thermal Bag',
    sku: 'BG001',
    category: 'Bags',
    brand: 'Wilson',
    description: 'Dual thermo-guard compartments that shield racket string tension from extreme heat.',
    sellingPrice: 4500,
    costPrice: 2900,
    taxPercentage: 18,
    availableStock: 9,
    reservedStock: 1,
    soldToday: 2,
    reorderLevel: 5,
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Wilson Sports India Ltd',
    lastRestockedDate: '26 Sep 2025',
    rating: 4.9
  },
  {
    id: 'PROD-10',
    name: 'Tourna Grip Original Dry Feel Overgrip (10-Pack)',
    sku: 'AG003',
    category: 'Accessories',
    brand: 'Tourna',
    description: 'The world standard moisture absorbing grip that gets tackier as hands sweat.',
    sellingPrice: 950,
    costPrice: 580,
    taxPercentage: 12,
    availableStock: 45,
    reservedStock: 5,
    soldToday: 14,
    reorderLevel: 15,
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Apex Rackets & Strings Co',
    lastRestockedDate: '02 Oct 2025',
    rating: 4.9,
    isBestSeller: true
  },
  {
    id: 'PROD-11',
    name: 'Stainless Steel Insulated Club Water Bottle (750ml)',
    sku: 'AB004',
    category: 'Accessories',
    brand: 'Playnex Club',
    description: 'Double-wall vacuum insulation keeps iced fluids cold for 24 hours courtside.',
    sellingPrice: 1100,
    costPrice: 600,
    taxPercentage: 18,
    availableStock: 0,
    reservedStock: 0,
    soldToday: 0,
    reorderLevel: 8,
    status: 'Out Of Stock',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80',
    vendorName: 'Hydra Equipments India',
    lastRestockedDate: '10 Sep 2025',
    rating: 4.6
  }
];

// Member Tier Discounts (Strictly Junior 5%, Silver 10%, Gold 15% - NO Bronze, NO Platinum)
export const mockTierDiscounts: MemberTierDiscount[] = [
  {
    tier: 'Junior',
    label: 'Junior Member (18 years or below)',
    ageCriteria: '18 Years or Below',
    discountPercentage: 5,
    isEnabled: true,
    effectiveDate: '01 Jan 2025'
  },
  {
    tier: 'Silver',
    label: 'Silver Member',
    ageCriteria: 'Adult Standard Tier',
    discountPercentage: 10,
    isEnabled: true,
    effectiveDate: '01 Jan 2025'
  },
  {
    tier: 'Gold',
    label: 'Gold Member',
    ageCriteria: 'Executive / Lifetime Tier',
    discountPercentage: 15,
    isEnabled: true,
    effectiveDate: '01 Jan 2025'
  }
];

export const mockProShopMembers: ProShopMember[] = [
  {
    id: 'MEM-01',
    membershipId: 'PN-GLD-8821',
    name: 'Rajesh Singhania',
    mobile: '+91 98200 44102',
    email: 'rajesh.singhania@apexcorp.com',
    tier: 'Gold'
  },
  {
    id: 'MEM-02',
    membershipId: 'PN-SLV-3490',
    name: 'Vikram Merchant',
    mobile: '+91 98199 87654',
    email: 'vikram.merchant@gmail.com',
    tier: 'Silver'
  },
  {
    id: 'MEM-03',
    membershipId: 'PN-JNR-1054',
    name: 'Aarav Mehta',
    mobile: '+91 98333 12345',
    email: 'aarav.tennis@mehta.net',
    tier: 'Junior'
  },
  {
    id: 'MEM-04',
    membershipId: 'PN-GLD-9912',
    name: 'Dr. Priya Kothari',
    mobile: '+91 97690 99881',
    email: 'drpriya@kotharihospitals.com',
    tier: 'Gold'
  }
];

export const mockLowStockAlerts: LowStockAlertItem[] = [
  {
    id: 'ALT-01',
    productId: 'PROD-03',
    productName: 'Wilson Championship Tennis Balls (3-Pack Can)',
    sku: 'WB001',
    category: 'Balls',
    currentStock: 18,
    minimumStock: 20,
    alertDate: '03 Oct 2025',
    notificationChannels: ['Email', 'Push Notification', 'SMS', 'Dashboard Alert'],
    vendorName: 'Wilson Sports India Ltd'
  },
  {
    id: 'ALT-02',
    productId: 'PROD-05',
    productName: 'Nike Court Air Zoom Vapor Pro 2 Shoes',
    sku: 'NS001',
    category: 'Shoes',
    currentStock: 5,
    minimumStock: 10,
    alertDate: '02 Oct 2025',
    notificationChannels: ['Email', 'Push Notification', 'Dashboard Alert'],
    vendorName: 'Nike Athletic Distributor'
  },
  {
    id: 'ALT-03',
    productId: 'PROD-08',
    productName: 'Playnex Breathable Club Aerobill Cap',
    sku: 'AC002',
    category: 'Accessories',
    currentStock: 8,
    minimumStock: 12,
    alertDate: '01 Oct 2025',
    notificationChannels: ['Email', 'SMS', 'Dashboard Alert'],
    vendorName: 'Prime Apparel Manufacturers'
  },
  {
    id: 'ALT-04',
    productId: 'PROD-11',
    productName: 'Stainless Steel Insulated Club Water Bottle (750ml)',
    sku: 'AB004',
    category: 'Accessories',
    currentStock: 0,
    minimumStock: 8,
    alertDate: '29 Sep 2025',
    notificationChannels: ['Email', 'Push Notification', 'SMS', 'Dashboard Alert'],
    vendorName: 'Hydra Equipments India'
  }
];

export const mockVendors: ProShopVendor[] = [
  {
    id: 'VND-01',
    name: 'Wilson Sports India Ltd',
    contactPerson: 'Harshwardhan Patel',
    phone: '+91 22 6150 9000',
    email: 'orders@wilsonsports.in',
    productsSupplied: ['Rackets', 'Balls', 'Bags', 'Strings'],
    lastOrderDate: '28 Sep 2025',
    status: 'Active'
  },
  {
    id: 'VND-02',
    name: 'Nike Athletic Distributor',
    contactPerson: 'Sanjay Deshmukh',
    phone: '+91 22 4920 1100',
    email: 'b2b@nikeathletic.in',
    productsSupplied: ['Shoes', 'Apparel', 'Caps'],
    lastOrderDate: '15 Sep 2025',
    status: 'Active'
  },
  {
    id: 'VND-03',
    name: 'Dunlop Sporting Goods',
    contactPerson: 'Deepak Chopra',
    phone: '+91 11 2680 4400',
    email: 'dunlop.india@sports.com',
    productsSupplied: ['Balls', 'Squash Equipment'],
    lastOrderDate: '02 Oct 2025',
    status: 'Active'
  },
  {
    id: 'VND-04',
    name: 'Prime Apparel Manufacturers',
    contactPerson: 'Mehul Shah',
    phone: '+91 79 2650 3320',
    email: 'textiles@primeapparel.com',
    productsSupplied: ['Apparel', 'Caps', 'Towels'],
    lastOrderDate: '01 Oct 2025',
    status: 'Active'
  }
];

export const mockPurchaseOrders: ProShopPurchaseOrder[] = [
  {
    id: 'PO-1001',
    poNumber: 'PO-2025-101',
    vendorId: 'VND-01',
    vendorName: 'Wilson Sports India Ltd',
    items: [
      { productId: 'PROD-03', productName: 'Wilson Championship Tennis Balls (3-Pack)', quantity: 150, unitCost: 380, totalCost: 57000 },
      { productId: 'PROD-01', productName: 'Wilson Pro Staff 97 Tennis Racket', quantity: 10, unitCost: 8000, totalCost: 80000 }
    ],
    totalAmount: 137000,
    status: 'Received',
    createdDate: '26 Sep 2025',
    expectedDeliveryDate: '28 Sep 2025',
    notes: 'Restock for upcoming State Ranking Tournament'
  },
  {
    id: 'PO-1002',
    poNumber: 'PO-2025-102',
    vendorId: 'VND-02',
    vendorName: 'Nike Athletic Distributor',
    items: [
      { productId: 'PROD-05', productName: 'Nike Court Air Zoom Vapor Pro 2 Shoes', quantity: 20, unitCost: 4200, totalCost: 84000 }
    ],
    totalAmount: 84000,
    status: 'Ordered',
    createdDate: '01 Oct 2025',
    expectedDeliveryDate: '06 Oct 2025',
    notes: 'Urgent shoe inventory replenish'
  },
  {
    id: 'PO-1003',
    poNumber: 'PO-2025-103',
    vendorId: 'VND-04',
    vendorName: 'Prime Apparel Manufacturers',
    items: [
      { productId: 'PROD-07', productName: 'Playnex Official Club T-Shirt', quantity: 100, unitCost: 650, totalCost: 65000 },
      { productId: 'PROD-08', productName: 'Playnex Aerobill Cap', quantity: 50, unitCost: 420, totalCost: 21000 }
    ],
    totalAmount: 86000,
    status: 'Submitted',
    createdDate: '02 Oct 2025',
    expectedDeliveryDate: '08 Oct 2025'
  }
];

export const mockReturns: ProShopReturn[] = [
  {
    id: 'RET-01',
    returnId: 'RET-2025-01',
    productId: 'PROD-05',
    productName: 'Nike Court Air Zoom Vapor Pro 2 Shoes',
    productSku: 'NS001',
    memberId: 'MEM-02',
    memberName: 'Vikram Merchant',
    quantity: 1,
    refundAmount: 5400, // after 10% silver discount
    reason: 'Wrong Size / Fit',
    status: 'Pending',
    requestDate: '03 Oct 2025'
  },
  {
    id: 'RET-02',
    returnId: 'RET-2025-02',
    productId: 'PROD-07',
    productName: 'Playnex Official Club Performance T-Shirt',
    productSku: 'AT001',
    memberId: 'MEM-03',
    memberName: 'Aarav Mehta',
    quantity: 1,
    refundAmount: 1140, // after 5% junior discount
    reason: 'Wrong Size / Fit',
    status: 'Approved',
    requestDate: '02 Oct 2025',
    resolutionDate: '03 Oct 2025'
  },
  {
    id: 'RET-03',
    returnId: 'RET-2025-03',
    productId: 'PROD-01',
    productName: 'Wilson Pro Staff 97 Tennis Racket',
    productSku: 'WR001',
    memberId: 'MEM-01',
    memberName: 'Rajesh Singhania',
    quantity: 1,
    refundAmount: 10200, // after 15% gold discount
    reason: 'Defective Product',
    status: 'Refunded',
    requestDate: '29 Sep 2025',
    resolutionDate: '30 Sep 2025'
  }
];

export const mockInventoryTransactions: InventoryTransaction[] = [
  {
    id: 'TXN-01',
    transactionId: 'ITX-8801',
    productId: 'PROD-03',
    productName: 'Wilson Championship Tennis Balls (3-Pack Can)',
    sku: 'WB001',
    type: 'Stock Out',
    quantity: -12,
    date: '03 Oct 2025, 04:30 PM',
    performedBy: 'Counter POS (Amit S.)',
    remarks: 'POS Counter Sale - 4 cans to court 3 players'
  },
  {
    id: 'TXN-02',
    transactionId: 'ITX-8802',
    productId: 'PROD-01',
    productName: 'Wilson Pro Staff 97 Tennis Racket',
    sku: 'WR001',
    type: 'Stock Out',
    quantity: -1,
    date: '03 Oct 2025, 02:15 PM',
    performedBy: 'Online Store Webhook',
    remarks: 'Website Order #WB-9042 - Member Rajesh Singhania'
  },
  {
    id: 'TXN-03',
    transactionId: 'ITX-8803',
    productId: 'PROD-04',
    productName: 'Dunlop Fort Clay Court Tennis Balls (4-Pack)',
    sku: 'DB002',
    type: 'Stock In',
    quantity: +60,
    date: '02 Oct 2025, 11:00 AM',
    performedBy: 'Store Mgr (Kavita N.)',
    remarks: 'Received against PO-2025-101'
  },
  {
    id: 'TXN-04',
    transactionId: 'ITX-8804',
    productId: 'PROD-10',
    productName: 'Tourna Grip Original Dry Feel (10-Pack)',
    sku: 'AG003',
    type: 'Adjustments',
    quantity: -2,
    date: '01 Oct 2025, 06:00 PM',
    performedBy: 'Store Mgr (Kavita N.)',
    remarks: 'Quarterly Physical Audit reconciliation variance'
  },
  {
    id: 'TXN-05',
    transactionId: 'ITX-8805',
    productId: 'PROD-11',
    productName: 'Stainless Steel Insulated Club Bottle',
    sku: 'AB004',
    type: 'Damaged Products',
    quantity: -2,
    date: '29 Sep 2025, 10:45 AM',
    performedBy: 'Warehouse Assistant',
    remarks: 'Dent damage during transit from supplier'
  }
];

export const mockUserRoles: UserRolePermission[] = [
  {
    role: 'Super Admin',
    title: 'Executive Super Administrator',
    badge: 'Full Access',
    description: 'Complete unrestricted governance across multi-branch pro shops, procurement, fiscal margins, and system configurations.',
    permissions: ['Product Management', 'Central Inventory Flow', 'Purchase Orders', 'POS Counter Billing', 'Returns & Refunds', 'Audit & Reports', 'User Roles & Security'],
    avatarColor: 'bg-indigo-600'
  },
  {
    role: 'Club Admin',
    title: 'Club Operations Administrator',
    badge: 'Operations Lead',
    description: 'Manages catalog pricing, member tier discount policies, stock alerts, and financial reconciliations.',
    permissions: ['Product Catalog CRUD', 'Inventory Stock Tracking', 'Vendor Management', 'Refund Authorization', 'Valuation & Sales Reports'],
    avatarColor: 'bg-emerald-600'
  },
  {
    role: 'Store Manager',
    title: 'Pro Shop & Inventory Manager',
    badge: 'Procurement & Stock',
    description: 'Responsible for daily stock receipts, vendor purchase orders, reorder point thresholds, and stock count audits.',
    permissions: ['Stock Tracking', 'PO Creation & GRN', 'Low Stock Alerts', 'Stock In / Out Adjustments', 'Damage Logging'],
    avatarColor: 'bg-amber-600'
  },
  {
    role: 'Sales Staff',
    title: 'Counter POS & Front Desk Cashier',
    badge: 'POS Terminal',
    description: 'Operates counter barcode checkout, member lookup, instant discounts, cash/card/UPI receipt printing, and intake of returns.',
    permissions: ['POS Billing', 'Member Verification', 'Return Intake', 'Receipt Printing'],
    avatarColor: 'bg-blue-600'
  },
  {
    role: 'Member',
    title: 'Club Registered Sports Member',
    badge: 'Customer View',
    description: 'Accesses online club store via mobile app/web, enjoys automatic tier discounts (Junior 5%, Silver 10%, Gold 15%), and tracks orders.',
    permissions: ['Browse Catalog', 'Member Discount Checkout', 'Club Pickup / Home Delivery', 'Order Tracking', 'Return Requests'],
    avatarColor: 'bg-purple-600'
  }
];

export const mockMonthlySalesTrend = [
  { month: 'May', inStore: 145000, online: 68000, total: 213000 },
  { month: 'Jun', inStore: 172000, online: 84000, total: 256000 },
  { month: 'Jul', inStore: 189000, online: 92000, total: 281000 },
  { month: 'Aug', inStore: 210000, online: 110000, total: 320000 },
  { month: 'Sep', inStore: 245000, online: 135000, total: 380000 },
  { month: 'Oct', inStore: 285000, online: 152000, total: 437000 }
];

export const mockCategoryRevenue = [
  { name: 'Rackets', value: 185000, percentage: 38, fill: '#3b82f6' },
  { name: 'Balls', value: 92000, percentage: 19, fill: '#10b981' },
  { name: 'Shoes', value: 88000, percentage: 18, fill: '#f59e0b' },
  { name: 'Apparel', value: 58000, percentage: 12, fill: '#8b5cf6' },
  { name: 'Accessories', value: 38000, percentage: 8, fill: '#06b6d4' },
  { name: 'Bags', value: 24000, percentage: 5, fill: '#ec4899' }
];
