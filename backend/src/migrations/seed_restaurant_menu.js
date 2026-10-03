import { pool } from '../config/database.js';

async function seedRestaurantMenu() {
  console.log('--- Seeding Restaurant Menu & Active Orders ---');

  const { rows: tenants } = await pool.query('SELECT tenant_id, club_name FROM tenants');

  const MENU_ITEMS = [
    { name: 'Cold Brew / Iced Coffee', category: 'Beverages', price: 220.0 },
    { name: 'Fresh Lime Soda (Sweet / Salted)', category: 'Beverages', price: 120.0 },
    { name: 'Kingfisher Ultra Draught Pitcher (1.5L)', category: 'Bar', price: 950.0 },
    { name: 'Classic Gin & Tonic (Bombay Sapphire)', category: 'Bar', price: 480.0 },
    { name: 'Peri Peri Crisp French Fries', category: 'Snacks', price: 240.0 },
    { name: 'Crispy Corn & Water Chestnut Salt & Pepper', category: 'Snacks', price: 320.0 },
    { name: 'Smoked Chicken & Bacon Club Sandwich', category: 'Food', price: 380.0 },
    { name: 'Paneer Tikka Angara Platter', category: 'Food', price: 420.0 },
    { name: 'Dal Makhani Slow Cooked', category: 'Food', price: 360.0 },
    { name: 'Garlic Butter Naan', category: 'Food', price: 90.0 },
    { name: 'Warm Chocolate Lava Cake with Gelato', category: 'Dessert', price: 280.0 },
  ];

  for (const t of tenants) {
    const existing = await pool.query('SELECT COUNT(*) FROM restaurant_items WHERE tenant_id = $1', [t.tenant_id]);
    if (parseInt(existing.rows[0].count, 10) === 0) {
      console.log(`Seeding menu for ${t.club_name}...`);
      for (const item of MENU_ITEMS) {
        const itemId = `itm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await pool.query(
          `INSERT INTO restaurant_items (item_id, tenant_id, name, category, price, is_available)
           VALUES ($1, $2, $3, $4, $5, TRUE)`,
          [itemId, t.tenant_id, item.name, item.category, item.price]
        );
      }

      // Seed 4 sample orders
      const orders = [
        {
          id: `ord_${Date.now()}_01`,
          table: 'Table 4 (Poolside)',
          customer: 'Siddharth Patel (Silver Member)',
          items: [{ name: 'Cold Brew Coffee', qty: 2, price: 220 }, { name: 'Smoked Chicken Club Sandwich', qty: 1, price: 380 }],
          amount: 820.0,
          status: 'completed',
        },
        {
          id: `ord_${Date.now()}_02`,
          table: 'Table 8 (Lounge)',
          customer: 'Chef Manish Guest',
          items: [{ name: 'Kingfisher Ultra Draught Pitcher', qty: 1, price: 950 }, { name: 'Peri Peri Fries', qty: 2, price: 240 }],
          amount: 1430.0,
          status: 'cooking',
        },
        {
          id: `ord_${Date.now()}_03`,
          table: 'Table 12 (Dining)',
          customer: 'Ananya Shah (Club Owner Tab)',
          items: [{ name: 'Paneer Tikka Platter', qty: 1, price: 420 }, { name: 'Dal Makhani', qty: 1, price: 360 }, { name: 'Garlic Butter Naan', qty: 3, price: 90 }],
          amount: 1050.0,
          status: 'cooking',
        },
        {
          id: `ord_${Date.now()}_04`,
          table: 'Bar Counter',
          customer: 'Rajesh Mehra (Gold Member)',
          items: [{ name: 'Classic Gin & Tonic', qty: 2, price: 480 }, { name: 'Crispy Corn', qty: 1, price: 320 }],
          amount: 1280.0,
          status: 'completed',
        },
      ];

      for (const o of orders) {
        await pool.query(
          `INSERT INTO restaurant_orders (order_id, tenant_id, member_name, table_number, items, total_amount, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [o.id, t.tenant_id, o.customer, o.table, JSON.stringify(o.items), o.amount, o.status]
        );
      }
    }
  }

  console.log('--- Restaurant Menu Seed Completed! ---');
}

seedRestaurantMenu()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
