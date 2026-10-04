import { apiMethod } from './api';
import type { BarKitchenMenuItem, BarKitchenTable, MenuCategoryType } from '../types/BarKitchenTypes';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number | string;
  isAvailable: boolean;
}

export function mapRestaurantMenuItem(item: MenuItem): BarKitchenMenuItem {
  const validCategories = ['Food', 'Beverage', 'Snacks', 'Combos', 'Seasonal', 'Dessert', 'Alcohol'];
  const category = validCategories.includes(item.category) ? item.category : 'Food';
  return { id: item.id, name: item.name, category: category as MenuCategoryType, subCategory: item.category || 'General', price: Number(item.price) || 0, costPrice: 0, marginPercent: 0, image: '', isAvailable: item.isAvailable, isVeg: true, preparationTimeMins: 12, station: category === 'Beverage' || category === 'Alcohol' ? 'Beverage Station' : 'Main Course Station', description: `${item.category || 'Menu'} item` };
}

export function mapRestaurantTable(item: any): BarKitchenTable {
  return {
    id: item.id,
    tableNumber: item.tableNumber,
    area: 'Indoor',
    seats: Number(item.capacity) || 4,
    status: item.status === 'OCCUPIED' ? 'Occupied' : 'Available',
    facilityId: 'restaurant',
    occupiedSince: item.activeKot?.seated_at,
  };
}

export interface RestaurantOrder {
  id: string;
  memberName: string;
  tableNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number | string;
  status: string;
  createdAt: string;
}

export interface CreateMenuItemPayload {
  name: string;
  category?: string;
  price: number;
  isAvailable?: boolean;
}

export interface CreateOrderPayload {
  memberName: string;
  tableNumber?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
}

export const restaurantService = {
  async getMenu(tenantId?: string, includeInactive = false) {
    return apiMethod<MenuItem[]>({
      method: 'GET',
      url: '/club/restaurant/menu',
      params: { ...(tenantId ? { tenantId } : {}), ...(includeInactive ? { includeInactive: 'true' } : {}) },
    });
  },

  async createMenuItem(data: CreateMenuItemPayload) {
    return apiMethod<MenuItem>({
      method: 'POST',
      url: '/club/restaurant/menu',
      data,
    });
  },

  async updateMenuItem(id: string, data: Partial<CreateMenuItemPayload>) {
    return apiMethod<MenuItem>({
      method: 'PUT',
      url: `/club/restaurant/menu/${id}`,
      data,
    });
  },

  async deleteMenuItem(id: string) {
    return apiMethod<{ id: string }>({
      method: 'DELETE',
      url: `/club/restaurant/menu/${id}`,
    });
  },

  async getOrders(tenantId?: string) {
    return apiMethod<RestaurantOrder[]>({
      method: 'GET',
      url: '/club/restaurant/orders',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async createOrder(data: CreateOrderPayload) {
    return apiMethod<RestaurantOrder>({ method: 'POST', url: '/restaurant/orders', data });
  },

  async getOverview(tenantId?: string) {
    return apiMethod<any>({
      method: 'GET',
      url: '/restaurant/overview',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async getTables(tenantId?: string) {
    return apiMethod<any[]>({
      method: 'GET',
      url: '/restaurant/tables',
      params: tenantId ? { tenantId } : undefined,
    });
  },

  async updateOrderStatus(id: string, status: string) {
    return apiMethod<any>({
      method: 'PUT',
      url: `/restaurant/orders/${id}/status`,
      data: { status },
    });
  },
};

export default restaurantService;
