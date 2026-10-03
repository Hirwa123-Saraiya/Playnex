import { pool } from '../config/database.js';
import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

/**
 * GET /api/v1/restaurant/overview or /api/v1/club/restaurant/overview
 * Executive F&B overview stats for restaurant & bar
 */
export async function getRestaurantOverview(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    // Sales stats for today and month
    const salesStats = await pool.query(
      `SELECT 
         COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE THEN total_amount ELSE 0 END), 0) as today_sales,
         COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as today_orders,
         COALESCE(AVG(total_amount), 0) as avg_order_value,
         COUNT(CASE WHEN status IN ('pending', 'cooking', 'prepping', 'ready') THEN 1 END) as active_kots,
         COUNT(DISTINCT CASE WHEN status IN ('pending', 'cooking', 'prepping', 'ready') THEN table_number END) as active_tables
       FROM restaurant_orders
       WHERE tenant_id = $1`,
      [tenantId]
    );

    // Live KOTs
    const liveKotsRes = await pool.query(
      `SELECT order_id, table_number, member_name, items, total_amount, status, created_at
       FROM restaurant_orders
       WHERE tenant_id = $1 AND status IN ('pending', 'cooking', 'prepping', 'ready')
       ORDER BY created_at ASC`,
      [tenantId]
    );

    // Recent orders
    const recentOrdersRes = await pool.query(
      `SELECT order_id, table_number, member_name, total_amount, status, created_at
       FROM restaurant_orders
       WHERE tenant_id = $1
       ORDER BY created_at DESC
       LIMIT 6`,
      [tenantId]
    );

    const stats = salesStats.rows[0] || {};

    return successResponse(
      res,
      {
        todaySales: parseFloat(stats.today_sales || 0),
        todayOrders: parseInt(stats.today_orders || 0, 10),
        avgOrderValue: Math.round(parseFloat(stats.avg_order_value || 0)),
        activeKots: parseInt(stats.active_kots || 0, 10),
        activeTables: parseInt(stats.active_tables || 0, 10),
        totalTables: 24,
        liveKots: liveKotsRes.rows,
        recentOrders: recentOrdersRes.rows.map((o) => ({
          ...o,
          subtotal: parseFloat(o.total_amount),
          gstAmount: parseFloat((parseFloat(o.total_amount) * 0.18).toFixed(2)),
          grandTotal: parseFloat((parseFloat(o.total_amount) * 1.18).toFixed(2)),
        })),
      },
      'Restaurant overview retrieved successfully'
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * GET /api/v1/restaurant/menu
 */
export async function getRestaurantMenu(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { category } = req.query;
    let query = 'SELECT * FROM restaurant_items WHERE tenant_id = $1 AND is_available = TRUE';
    const params = [tenantId];

    if (category && category !== 'All') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += ' ORDER BY category ASC, name ASC';

    const { rows } = await pool.query(query, params);
    return successResponse(res, rows, 'Restaurant menu retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * POST /api/v1/restaurant/menu
 */
export async function createMenuItem(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { name, category, price, isAvailable } = req.body;
    if (!name || price === undefined) return errorResponse(res, 'Item name and price are required', 400);

    const itemId = `itm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const { rows } = await pool.query(
      `INSERT INTO restaurant_items (item_id, tenant_id, name, category, price, is_available)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [itemId, tenantId, name.trim(), category || 'Food', Number(price) || 0, isAvailable !== undefined ? isAvailable : true]
    );

    return successResponse(res, rows[0], 'Menu item added successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * PUT /api/v1/restaurant/menu/:id
 */
export async function updateMenuItem(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const { name, category, price, isAvailable } = req.body;

    const { rows } = await pool.query(
      `UPDATE restaurant_items
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           price = COALESCE($3, price),
           is_available = COALESCE($4, is_available)
       WHERE item_id = $5 AND tenant_id = $6
       RETURNING *`,
      [name, category, price !== undefined ? Number(price) : null, isAvailable, id, tenantId]
    );

    if (rows.length === 0) return errorResponse(res, 'Menu item not found', 404);
    return successResponse(res, rows[0], 'Menu item updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * DELETE /api/v1/restaurant/menu/:id
 */
export async function deleteMenuItem(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    await pool.query('DELETE FROM restaurant_items WHERE item_id = $1 AND tenant_id = $2', [id, tenantId]);
    return successResponse(res, { id }, 'Menu item deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * GET /api/v1/restaurant/orders
 */
export async function getRestaurantOrders(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { rows } = await pool.query(
      `SELECT * FROM restaurant_orders WHERE tenant_id = $1 ORDER BY created_at DESC`,
      [tenantId]
    );
    return successResponse(res, rows, 'Restaurant orders retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * POST /api/v1/restaurant/orders
 */
export async function createRestaurantOrder(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);
    const { memberName, tableNumber, items, totalAmount } = req.body;
    if (!memberName || !items) return errorResponse(res, 'Member name and order items are required', 400);

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const subtotal = Number(totalAmount) || 0;
    const gstAmount = parseFloat((subtotal * 0.18).toFixed(2));
    const grandTotal = parseFloat((subtotal + gstAmount).toFixed(2));
    const invoiceNumber = `INV-BAR-${orderId.slice(-5)}`;

    const { rows } = await pool.query(
      `INSERT INTO restaurant_orders (order_id, tenant_id, user_id, member_name, table_number, items, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'cooking')
       RETURNING *`,
      [
        orderId,
        tenantId,
        req.user?.userId || null,
        memberName,
        tableNumber || 'Table 1',
        JSON.stringify(items),
        subtotal,
      ]
    );

    // Also record into platform_invoices for Government & Super Admin tax compliance
    await pool.query(
      `INSERT INTO platform_invoices (
         invoice_id, tenant_id, invoice_number, plan_name, base_amount, gst_rate, gst_amount, total_amount,
         billing_cycle, payment_status, payment_method, invoice_date, created_at
       ) VALUES ($1, $2, $3, $4, $5, 18.00, $6, $7, 'Restaurant Order', 'PAID', 'Counter POS', CURRENT_DATE, NOW())
       ON CONFLICT (invoice_id) DO NOTHING`,
      [
        `inv_rest_${orderId}`,
        tenantId,
        invoiceNumber,
        `Restaurant & Bar F&B Bill (${tableNumber || 'Table'})`,
        subtotal,
        gstAmount,
        grandTotal,
      ]
    );

    return successResponse(res, rows[0], 'Order dispatched to kitchen and registered', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * PUT /api/v1/restaurant/orders/:id/status
 */
export async function updateOrderStatus(req, res) {
  try {
    const tenantId = getTenantId(req);
    const { id } = req.params;
    const { status } = req.body;

    const { rows } = await pool.query(
      `UPDATE restaurant_orders SET status = $1 WHERE order_id = $2 AND tenant_id = $3 RETURNING *`,
      [status, id, tenantId]
    );

    if (rows.length === 0) return errorResponse(res, 'Order not found', 404);
    return successResponse(res, rows[0], 'Order status updated');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * GET /api/v1/restaurant/tables
 * Floor table occupancy status
 */
export async function getRestaurantTables(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { rows } = await pool.query(
      `SELECT table_number, COUNT(*) as active_kots, MAX(status) as current_status, MAX(created_at) as seated_at
       FROM restaurant_orders
       WHERE tenant_id = $1 AND status IN ('pending', 'cooking', 'prepping', 'ready')
       GROUP BY table_number`,
      [tenantId]
    );

    const occupiedMap = new Map();
    rows.forEach(r => occupiedMap.set(r.table_number, r));

    const totalTables = 24;
    const tables = [];
    for (let i = 1; i <= totalTables; i++) {
      const tName = `Table ${i}`;
      const active = occupiedMap.get(tName);
      tables.push({
        id: `tbl_${i}`,
        tableNumber: tName,
        capacity: i <= 8 ? 2 : i <= 18 ? 4 : 8,
        status: active ? 'OCCUPIED' : 'AVAILABLE',
        activeKot: active || null,
      });
    }

    return successResponse(res, tables, 'Tables occupancy retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
