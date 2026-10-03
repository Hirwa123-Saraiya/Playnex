import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

export async function getRestaurantMenu(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const items = await dbService.getRestaurantMenu(tenantId);
    return successResponse(res, items, 'Restaurant menu retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createMenuItem(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { name, category, price, isAvailable } = req.body;
    if (!name || price === undefined) return errorResponse(res, 'Item name and price are required', 400);

    const itemId = `itm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createMenuItem({
      itemId,
      tenantId,
      name,
      category: category || 'Food',
      price: Number(price) || 0,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });
    return successResponse(res, created, 'Menu item added successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function updateMenuItem(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const updated = await dbService.updateMenuItem(id, tenantId, req.body);
    if (!updated) return errorResponse(res, 'Menu item not found', 404);
    return successResponse(res, updated, 'Menu item updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function deleteMenuItem(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const deleted = await dbService.deleteMenuItem(id, tenantId);
    if (!deleted) return errorResponse(res, 'Menu item not found', 404);
    return successResponse(res, { id }, 'Menu item deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function getRestaurantOrders(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const orders = await dbService.getRestaurantOrders(tenantId);
    return successResponse(res, orders, 'Restaurant orders retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

export async function createRestaurantOrder(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { memberName, tableNumber, items, totalAmount } = req.body;
    if (!memberName || !items) return errorResponse(res, 'Member name and order items are required', 400);

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const created = await dbService.createRestaurantOrder({
      orderId,
      tenantId,
      userId: req.user?.userId || null,
      memberName,
      tableNumber: tableNumber || 'Counter',
      items,
      totalAmount: Number(totalAmount) || 0,
      status: 'completed',
    });
    return successResponse(res, created, 'Order placed successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
