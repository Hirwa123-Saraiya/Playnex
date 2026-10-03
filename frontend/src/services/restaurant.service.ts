import { apiMethod } from './api';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number | string;
  isAvailable: boolean;
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
  async getMenu(tenantId?: string) {
    return apiMethod<MenuItem[]>({
      method: 'GET',
      url: '/club/restaurant/menu',
      params: tenantId ? { tenantId } : undefined,
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
    return apiMethod<RestaurantOrder>({
      method: 'POST',
      url: '/club/restaurant/orders',
      data,
    });
  },
};

export default restaurantService;
