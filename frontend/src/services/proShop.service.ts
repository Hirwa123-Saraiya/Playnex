import { apiMethod } from './api';
import type { ProShopProduct } from '../types/ProShopInventoryTypes';

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

export function mapProShopItemToProduct(item: ProShopItem): ProShopProduct {
  const availableStock = Number(item.stock_quantity) || 0;
  const reorderLevel = Number(item.reorder_threshold) || 0;
  const categoryLabel = item.category.toLowerCase();
  const category = categoryLabel.includes('racket') ? 'Rackets'
    : categoryLabel.includes('ball') || categoryLabel.includes('shuttle') ? 'Balls'
    : categoryLabel.includes('shoe') ? 'Shoes'
    : categoryLabel.includes('apparel') || categoryLabel.includes('shirt') ? 'Apparel'
    : categoryLabel.includes('bag') ? 'Bags'
    : 'Accessories';

  return {
    id: item.item_id,
    name: item.name,
    sku: item.sku,
    category: category as ProShopProduct['category'],
    brand: item.brand || 'General',
    description: `${item.brand || 'General'} ${item.category}`,
    sellingPrice: Number(item.unit_price) || 0,
    costPrice: Number(item.cost_price) || 0,
    taxPercentage: Number(item.tax_rate_percent) || 18,
    availableStock,
    reservedStock: 0,
    soldToday: 0,
    reorderLevel,
    status: availableStock === 0 ? 'Out Of Stock' : availableStock <= reorderLevel ? 'Low Stock' : 'In Stock',
    imageUrl: item.image_url || '',
    vendorName: item.brand || 'General supplier',
    lastRestockedDate: 'Not recorded',
  };
}

function toApiItemPayload(item: Partial<ProShopItem>) {
  return {
    ...item,
    unitPrice: item.unit_price,
    costPrice: item.cost_price,
    stockQuantity: item.stock_quantity,
    reorderThreshold: item.reorder_threshold,
    imageUrl: item.image_url,
  };
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
      data: toApiItemPayload(payload),
    });
  },

  async updateItem(id: string, payload: Partial<ProShopItem>) {
    return apiMethod<ProShopItem>({
      method: 'PUT',
      url: `/pro-shop/items/${id}`,
      data: toApiItemPayload(payload),
    });
  },

  async deleteItem(id: string) {
    return apiMethod<{ itemId: string }>({
      method: 'DELETE',
      url: `/pro-shop/items/${id}`,
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

  async getSales() {
    return apiMethod<ProShopOverviewData['recentSales']>({
      method: 'GET',
      url: '/pro-shop/sales',
    });
  },
};

export default proShopService;
