import { apiMethod } from './api';

export interface ProShopOverviewData {
  totalItems: number;
  totalStockUnits: number;
  inventoryRetailValue: number;
  inventoryCostValue: number;
  lowStockCount: number;
  todaySales: number;
  todayGst: number;
  todayTransactions: number;
  monthSales: number;
  monthGst: number;
  monthTransactions: number;
  categoryDistribution: Array<{
    category: string;
    itemCount: number;
    totalUnits: number;
    categoryValue: number;
  }>;
  lowStockItems: Array<{
    item_id: string;
    sku: string;
    name: string;
    category: string;
    brand: string;
    stock_quantity: number;
    reorder_threshold: number;
    unit_price: string | number;
  }>;
  recentSales: Array<{
    sale_id: string;
    sale_number: string;
    customer_name: string;
    operator_name: string;
    subtotal: string | number;
    gst_amount: string | number;
    grand_total: string | number;
    payment_method: string;
    created_at: string;
  }>;
}

export interface ProShopItem {
  item_id: string;
  tenant_id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  unit_price: number;
  cost_price: number;
  stock_quantity: number;
  reorder_threshold: number;
  tax_rate_percent: number;
  barcode?: string;
  image_url?: string;
  is_active: boolean;
}

export const proShopService = {
  async getOverview(tenantId?: string) {
    return apiMethod<ProShopOverviewData>({
      method: 'GET',
      url: '/pro-shop/overview',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async getItems(params?: { category?: string; search?: string; tenantId?: string }) {
    return apiMethod<ProShopItem[]>({
      method: 'GET',
      url: '/pro-shop/items',
      params,
    });
  },

  async createItem(payload: Partial<ProShopItem>) {
    return apiMethod<ProShopItem>({
      method: 'POST',
      url: '/pro-shop/items',
      data: payload,
    });
  },

  async updateStock(id: string, payload: { deltaQuantity?: number; newQuantity?: number }) {
    return apiMethod<ProShopItem>({
      method: 'PUT',
      url: `/pro-shop/items/${id}/stock`,
      data: payload,
    });
  },

  async checkoutPOS(payload: {
    items: Array<{ itemId: string; qty: number }>;
    customerName?: string;
    customerPhone?: string;
    paymentMethod?: string;
    operatorName?: string;
    operatorId?: string;
  }) {
    return apiMethod<any>({
      method: 'POST',
      url: '/pro-shop/pos/checkout',
      data: payload,
    });
  },
};

export default proShopService;
