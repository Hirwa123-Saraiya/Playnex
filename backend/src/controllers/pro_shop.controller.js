import { pool } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getTenantId } from '../utils/tenantHelper.js';

/**
 * GET /api/v1/pro-shop/overview
 * Returns executive overview metrics for Pro Shop & Inventory
 */
export async function getProShopOverview(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    // 1. Inventory counts and valuation
    const stockStats = await pool.query(
      `SELECT 
         COUNT(*) as total_items,
         COALESCE(SUM(stock_quantity), 0) as total_units,
         COALESCE(SUM(stock_quantity * unit_price), 0) as inventory_retail_value,
         COALESCE(SUM(stock_quantity * cost_price), 0) as inventory_cost_value,
         COUNT(CASE WHEN stock_quantity <= reorder_threshold THEN 1 END) as low_stock_count
       FROM pro_shop_items
       WHERE tenant_id = $1 AND is_active = TRUE`,
      [tenantId]
    );

    // 2. Sales stats (Today, This Month, All Time)
    const salesStats = await pool.query(
      `SELECT 
         COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE THEN grand_total ELSE 0 END), 0) as today_sales,
         COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE THEN gst_amount ELSE 0 END), 0) as today_gst,
         COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as today_transactions,
         COALESCE(SUM(CASE WHEN date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE) THEN grand_total ELSE 0 END), 0) as month_sales,
         COALESCE(SUM(CASE WHEN date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE) THEN gst_amount ELSE 0 END), 0) as month_gst,
         COUNT(CASE WHEN date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE) THEN 1 END) as month_transactions
       FROM pro_shop_sales
       WHERE tenant_id = $1 AND status = 'PAID'`,
      [tenantId]
    );

    // 3. Category distribution
    const categoriesRes = await pool.query(
      `SELECT 
         category,
         COUNT(*) as item_count,
         COALESCE(SUM(stock_quantity), 0) as total_units,
         COALESCE(SUM(stock_quantity * unit_price), 0) as category_value
       FROM pro_shop_items
       WHERE tenant_id = $1 AND is_active = TRUE
       GROUP BY category
       ORDER BY category_value DESC`,
      [tenantId]
    );

    // 4. Low stock items
    const lowStockRes = await pool.query(
      `SELECT item_id, sku, name, category, brand, stock_quantity, reorder_threshold, unit_price
       FROM pro_shop_items
       WHERE tenant_id = $1 AND is_active = TRUE AND stock_quantity <= reorder_threshold
       ORDER BY stock_quantity ASC
       LIMIT 6`,
      [tenantId]
    );

    // 5. Recent sales / invoices
    const recentSalesRes = await pool.query(
      `SELECT sale_id, sale_number, customer_name, operator_name, subtotal, gst_amount, grand_total, payment_method, created_at
       FROM pro_shop_sales
       WHERE tenant_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [tenantId]
    );

    const stats = stockStats.rows[0] || {};
    const sales = salesStats.rows[0] || {};

    return successResponse(
      res,
      {
        totalItems: parseInt(stats.total_items || 0, 10),
        totalStockUnits: parseInt(stats.total_units || 0, 10),
        inventoryRetailValue: parseFloat(stats.inventory_retail_value || 0),
        inventoryCostValue: parseFloat(stats.inventory_cost_value || 0),
        lowStockCount: parseInt(stats.low_stock_count || 0, 10),
        todaySales: parseFloat(sales.today_sales || 0),
        todayGst: parseFloat(sales.today_gst || 0),
        todayTransactions: parseInt(sales.today_transactions || 0, 10),
        monthSales: parseFloat(sales.month_sales || 0),
        monthGst: parseFloat(sales.month_gst || 0),
        monthTransactions: parseInt(sales.month_transactions || 0, 10),
        categoryDistribution: categoriesRes.rows.map((c) => ({
          category: c.category,
          itemCount: parseInt(c.item_count, 10),
          totalUnits: parseInt(c.total_units, 10),
          categoryValue: parseFloat(c.category_value),
        })),
        lowStockItems: lowStockRes.rows,
        recentSales: recentSalesRes.rows,
      },
      'Pro shop overview retrieved successfully'
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * GET /api/v1/pro-shop/items
 * Returns all catalog inventory items for this tenant
 */
export async function getProShopItems(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { category, search } = req.query;
    let query = `SELECT * FROM pro_shop_items WHERE tenant_id = $1 AND is_active = TRUE`;
    const params = [tenantId];

    if (category && category !== 'All') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      query += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(sku) LIKE $${params.length} OR LOWER(brand) LIKE $${params.length})`;
    }

    query += ` ORDER BY name ASC`;

    const { rows } = await pool.query(query, params);
    return successResponse(res, rows, 'Inventory items retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * POST /api/v1/pro-shop/items
 * Create new inventory item
 */
export async function createProShopItem(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { name, category, brand, sku, unitPrice, costPrice, stockQuantity, reorderThreshold, barcode } = req.body;
    if (!name || !category) return errorResponse(res, 'Name and category are required', 400);

    const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const effectiveSku = sku || `SKU-${Date.now().toString().slice(-6)}`;

    const { rows } = await pool.query(
      `INSERT INTO pro_shop_items (
         item_id, tenant_id, sku, name, category, brand, unit_price, cost_price, 
         stock_quantity, reorder_threshold, barcode
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        itemId,
        tenantId,
        effectiveSku,
        name.trim(),
        category,
        brand ? brand.trim() : 'General',
        parseFloat(unitPrice) || 0.0,
        parseFloat(costPrice) || 0.0,
        parseInt(stockQuantity, 10) || 0,
        parseInt(reorderThreshold, 10) || 5,
        barcode || null,
      ]
    );

    return successResponse(res, rows[0], 'Item created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * PUT /api/v1/pro-shop/items/:id
 * Update inventory item details
 */
export async function updateProShopItem(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { id } = req.params;
    const { name, category, brand, sku, unitPrice, costPrice, stockQuantity, reorderThreshold, barcode } = req.body;

    const { rows } = await pool.query(
      `UPDATE pro_shop_items
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           brand = COALESCE($3, brand),
           sku = COALESCE($4, sku),
           unit_price = COALESCE($5, unit_price),
           cost_price = COALESCE($6, cost_price),
           stock_quantity = COALESCE($7, stock_quantity),
           reorder_threshold = COALESCE($8, reorder_threshold),
           barcode = COALESCE($9, barcode),
           updated_at = NOW()
       WHERE item_id = $10 AND tenant_id = $11
       RETURNING *`,
      [
        name,
        category,
        brand,
        sku,
        unitPrice !== undefined ? parseFloat(unitPrice) : null,
        costPrice !== undefined ? parseFloat(costPrice) : null,
        stockQuantity !== undefined ? parseInt(stockQuantity, 10) : null,
        reorderThreshold !== undefined ? parseInt(reorderThreshold, 10) : null,
        barcode,
        id,
        tenantId,
      ]
    );

    if (rows.length === 0) return errorResponse(res, 'Item not found', 404);
    return successResponse(res, rows[0], 'Item updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * DELETE /api/v1/pro-shop/items/:id
 * Remove inventory item
 */
export async function deleteProShopItem(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { id } = req.params;
    const { rows } = await pool.query(
      `UPDATE pro_shop_items SET is_active = FALSE, updated_at = NOW() WHERE item_id = $1 AND tenant_id = $2 RETURNING item_id`,
      [id, tenantId]
    );

    if (rows.length === 0) return errorResponse(res, 'Item not found', 404);
    return successResponse(res, { itemId: id }, 'Item removed successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * PUT /api/v1/pro-shop/items/:id/stock
 * Adjust stock or restock item
 */
export async function updateProShopStock(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { id } = req.params;
    const { deltaQuantity, newQuantity } = req.body;

    let updateQuery;
    let params;

    if (newQuantity !== undefined) {
      updateQuery = `UPDATE pro_shop_items SET stock_quantity = $1, updated_at = NOW() WHERE item_id = $2 AND tenant_id = $3 RETURNING *`;
      params = [parseInt(newQuantity, 10), id, tenantId];
    } else if (deltaQuantity !== undefined) {
      updateQuery = `UPDATE pro_shop_items SET stock_quantity = GREATEST(0, stock_quantity + $1), updated_at = NOW() WHERE item_id = $2 AND tenant_id = $3 RETURNING *`;
      params = [parseInt(deltaQuantity, 10), id, tenantId];
    } else {
      return errorResponse(res, 'deltaQuantity or newQuantity is required', 400);
    }

    const { rows } = await pool.query(updateQuery, params);
    if (rows.length === 0) return errorResponse(res, 'Item not found', 404);

    return successResponse(res, rows[0], 'Stock updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * POST /api/v1/pro-shop/pos/checkout
 * Process counter sale transaction, reduce inventory stock, calculate 18% GST, and record platform tax invoice
 */
export async function createProShopSale(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { items, customerName, customerPhone, paymentMethod, operatorName, operatorId } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 'At least one item is required for checkout', 400);
    }

    let subtotal = 0;
    const processedItems = [];

    // Calculate subtotal and deduct inventory
    for (const line of items) {
      const { itemId, qty } = line;
      const quantity = parseInt(qty, 10) || 1;

      const itemRes = await pool.query(
        `SELECT item_id, name, unit_price, stock_quantity 
         FROM pro_shop_items 
         WHERE item_id = $1 AND tenant_id = $2`,
        [itemId, tenantId]
      );

      if (itemRes.rows.length > 0) {
        const item = itemRes.rows[0];
        const lineTotal = parseFloat(item.unit_price) * quantity;
        subtotal += lineTotal;

        // Deduct inventory
        await pool.query(
          `UPDATE pro_shop_items 
           SET stock_quantity = GREATEST(0, stock_quantity - $1), updated_at = NOW() 
           WHERE item_id = $2`,
          [quantity, itemId]
        );

        processedItems.push({
          itemId: item.item_id,
          name: item.name,
          unitPrice: parseFloat(item.unit_price),
          qty: quantity,
          lineTotal,
        });
      }
    }

    const gstRate = 18.0;
    const gstAmount = parseFloat((subtotal * 0.18).toFixed(2));
    const grandTotal = parseFloat((subtotal + gstAmount).toFixed(2));
    const saleId = `sale_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const saleNumber = `INV-SHOP-${Date.now().toString().slice(-5)}`;

    const { rows } = await pool.query(
      `INSERT INTO pro_shop_sales (
         sale_id, tenant_id, sale_number, customer_name, customer_phone,
         operator_id, operator_name, subtotal, gst_rate_percent, gst_amount,
         discount_amount, grand_total, payment_method, items_json, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'PAID')
       RETURNING *`,
      [
        saleId,
        tenantId,
        saleNumber,
        customerName || 'Walk-in Customer',
        customerPhone || null,
        operatorId || req.user?.userId || null,
        operatorName || req.user?.name || 'Counter Operator',
        subtotal,
        gstRate,
        gstAmount,
        0.0,
        grandTotal,
        paymentMethod || 'UPI',
        JSON.stringify(processedItems),
      ]
    );

    // Also record into platform_invoices for Government & Super Admin tax compliance
    await pool.query(
      `INSERT INTO platform_invoices (
         invoice_id, tenant_id, invoice_number, plan_name, base_amount, gst_rate, gst_amount, total_amount,
         billing_cycle, payment_status, payment_method, invoice_date, created_at
       ) VALUES ($1, $2, $3, $4, $5, 18.00, $6, $7, 'One-Time POS', 'PAID', $8, CURRENT_DATE, NOW())
       ON CONFLICT (invoice_id) DO NOTHING`,
      [
        `inv_shop_${saleId}`,
        tenantId,
        saleNumber,
        `Pro Shop Counter Sale (${saleNumber})`,
        subtotal,
        gstAmount,
        grandTotal,
        paymentMethod || 'UPI',
      ]
    );

    return successResponse(res, rows[0], 'Counter sale processed and GST invoice generated', 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * GET /api/v1/pro-shop/sales
 * List counter sales audit transactions
 */
export async function getProShopSales(req, res) {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) return errorResponse(res, 'Tenant context missing', 400);

    const { rows } = await pool.query(
      `SELECT * FROM pro_shop_sales WHERE tenant_id = $1 ORDER BY created_at DESC`,
      [tenantId]
    );

    return successResponse(res, rows, 'Sales history retrieved successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
