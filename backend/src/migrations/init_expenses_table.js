import { pool } from '../config/database.js';

export async function initExpensesTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS club_expenses (
        expense_id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        gst_amount NUMERIC(12, 2) DEFAULT 0.00,
        vendor_name VARCHAR(255),
        payment_method VARCHAR(50) DEFAULT 'Bank Transfer',
        receipt_number VARCHAR(100),
        expense_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_club_expenses_tenant ON club_expenses(tenant_id);
    `);

    const tenants = await pool.query('SELECT tenant_id FROM tenants');
    const countRes = await pool.query('SELECT COUNT(*) FROM club_expenses');
    if (parseInt(countRes.rows[0].count, 10) === 0 && tenants.rows.length > 0) {
      for (const t of tenants.rows) {
        const tid = t.tenant_id;
        await pool.query(`
          INSERT INTO club_expenses (expense_id, tenant_id, category, description, amount, gst_amount, vendor_name, payment_method, receipt_number, expense_date)
          VALUES 
            ($1, $2, 'Utilities', 'Club Arena Monthly Electricity & HVAC Grid', 14500.00, 2610.00, 'Torrent Power Ltd', 'Bank Transfer', 'REC-PWR-9921', CURRENT_DATE - 3),
            ($3, $2, 'Maintenance', 'Court 1 & 2 Synthetic Turf Deep Grooming', 8200.00, 1476.00, 'Apex Sports Turf Services', 'Cheque', 'REC-MAINT-441', CURRENT_DATE - 5),
            ($4, $2, 'Inventory', 'Restock Yonex Mavis 350 Nylon Shuttlecock Crates', 12000.00, 2160.00, 'Sunrise Sports Distribution', 'NEFT', 'REC-SUN-1002', CURRENT_DATE - 7),
            ($5, $2, 'Beverages & F&B', 'Arabica Coffee Beans & Fresh Dairy Supplies', 4900.00, 245.00, 'Blue Tokai Roasters', 'UPI', 'REC-BT-889', CURRENT_DATE - 1)
        `, [
          `exp_1_${tid}`,
          tid,
          `exp_2_${tid}`,
          `exp_3_${tid}`,
          `exp_4_${tid}`,
        ]);
      }
      console.log('✅ Seeded club_expenses table successfully');
    } else {
      console.log('✅ club_expenses table ready with', countRes.rows[0].count, 'rows');
    }
    return true;
  } catch (err) {
    console.error('Error initializing club_expenses table:', err.message);
    return false;
  }
}

if (process.argv[1] && process.argv[1].includes('init_expenses_table.js')) {
  initExpensesTable().then(() => process.exit(0));
}
