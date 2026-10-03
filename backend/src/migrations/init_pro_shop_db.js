import { pool } from '../config/database.js';

async function migrateProShop() {
  console.log('--- Migrating Pro Shop & Inventory Tables ---');

  // 1. Create pro_shop_items table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pro_shop_items (
      item_id VARCHAR(100) PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL,
      sku VARCHAR(100),
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      brand VARCHAR(100),
      unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      reorder_threshold INTEGER NOT NULL DEFAULT 5,
      tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
      image_url TEXT,
      barcode VARCHAR(100),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // 2. Create pro_shop_sales table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pro_shop_sales (
      sale_id VARCHAR(100) PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL,
      sale_number VARCHAR(100),
      customer_name VARCHAR(255),
      customer_phone VARCHAR(50),
      operator_id VARCHAR(100),
      operator_name VARCHAR(255),
      subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      gst_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
      gst_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      grand_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
      payment_method VARCHAR(50) NOT NULL DEFAULT 'UPI',
      items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      status VARCHAR(50) NOT NULL DEFAULT 'PAID',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('✅ Tables pro_shop_items and pro_shop_sales verified.');

  // Seed sample inventory for all tenants
  const { rows: tenants } = await pool.query('SELECT tenant_id, club_name FROM tenants');

  const INITIAL_ITEMS = [
    {
      sku: 'RKT-YNX-AST99',
      name: 'Yonex Astrox 99 Pro Badminton Racket',
      category: 'Rackets',
      brand: 'Yonex',
      unit_price: 18500.0,
      cost_price: 13800.0,
      stock_quantity: 12,
      reorder_threshold: 4,
      barcode: '8901234567890',
    },
    {
      sku: 'RKT-WLS-PRO14',
      name: 'Wilson Pro Staff v14 315g Tennis Racket',
      category: 'Rackets',
      brand: 'Wilson',
      unit_price: 24900.0,
      cost_price: 18500.0,
      stock_quantity: 8,
      reorder_threshold: 3,
      barcode: '8901234567891',
    },
    {
      sku: 'SHT-YNX-AS30',
      name: 'Yonex Aerosensa 30 Feather Shuttles (Tube of 12)',
      category: 'Balls & Shuttles',
      brand: 'Yonex',
      unit_price: 2650.0,
      cost_price: 1950.0,
      stock_quantity: 65,
      reorder_threshold: 15,
      barcode: '8901234567892',
    },
    {
      sku: 'BAL-DNL-FORT4',
      name: 'Dunlop Fort All Court Tennis Balls (Can of 4)',
      category: 'Balls & Shuttles',
      brand: 'Dunlop',
      unit_price: 850.0,
      cost_price: 620.0,
      stock_quantity: 80,
      reorder_threshold: 20,
      barcode: '8901234567893',
    },
    {
      sku: 'SHO-ASC-BLD8',
      name: 'Asics Gel-Blade 8 Indoor Court Shoes (UK 9)',
      category: 'Shoes',
      brand: 'Asics',
      unit_price: 8999.0,
      cost_price: 6400.0,
      stock_quantity: 6,
      reorder_threshold: 3,
      barcode: '8901234567894',
    },
    {
      sku: 'STR-YNX-BG80',
      name: 'Yonex BG80 Power High-Repulsion String Roll (200m)',
      category: 'Strings',
      brand: 'Yonex',
      unit_price: 9500.0,
      cost_price: 7100.0,
      stock_quantity: 3, // Low stock alert!
      reorder_threshold: 5,
      barcode: '8901234567895',
    },
    {
      sku: 'GRP-YNX-SUP12',
      name: 'Yonex Super Grap Overgrip (Pack of 12)',
      category: 'Accessories',
      brand: 'Yonex',
      unit_price: 1450.0,
      cost_price: 950.0,
      stock_quantity: 42,
      reorder_threshold: 10,
      barcode: '8901234567896',
    },
    {
      sku: 'APP-NKE-DRFT',
      name: 'Nike Court Dri-FIT Performance Crew Tee',
      category: 'Apparel',
      brand: 'Nike',
      unit_price: 2495.0,
      cost_price: 1650.0,
      stock_quantity: 18,
      reorder_threshold: 5,
      barcode: '8901234567897',
    },
  ];

  for (const t of tenants) {
    const existing = await pool.query('SELECT COUNT(*) FROM pro_shop_items WHERE tenant_id = $1', [t.tenant_id]);
    if (parseInt(existing.rows[0].count, 10) === 0) {
      console.log(`Seeding Pro Shop catalog for tenant ${t.club_name} (${t.tenant_id})...`);
      for (const item of INITIAL_ITEMS) {
        const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await pool.query(
          `INSERT INTO pro_shop_items (item_id, tenant_id, sku, name, category, brand, unit_price, cost_price, stock_quantity, reorder_threshold, barcode)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            itemId,
            t.tenant_id,
            item.sku,
            item.name,
            item.category,
            item.brand,
            item.unit_price,
            item.cost_price,
            item.stock_quantity,
            item.reorder_threshold,
            item.barcode,
          ]
        );
      }

      // Seed initial sample sales
      const sampleSaleId = `sale_${Date.now()}_01`;
      await pool.query(
        `INSERT INTO pro_shop_sales (sale_id, tenant_id, sale_number, customer_name, customer_phone, operator_id, operator_name, subtotal, gst_rate_percent, gst_amount, discount_amount, grand_total, payment_method, items_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          sampleSaleId,
          t.tenant_id,
          'INV-SHOP-2026-001',
          'Arun Verma (Gold Member)',
          '+91 98201 55443',
          'usr_shop_940545',
          'Vikram Mehta (Shop Lead)',
          3800.0,
          18.0,
          684.0,
          0.0,
          4484.0,
          'UPI',
          JSON.stringify([
            { name: 'Yonex Aerosensa 30 Feather Shuttles', qty: 1, unit_price: 2650.0 },
            { name: 'Yonex Super Grap Overgrip', qty: 1, unit_price: 1150.0 },
          ]),
        ]
      );
    }
  }

  console.log('--- Pro Shop Migration Completed Successfully! ---');
}

migrateProShop()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
