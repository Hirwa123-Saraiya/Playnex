import { pool } from '../config/database.js';

async function migrateRoles() {
  console.log('--- Migrating Roles & Permissions for Multi-Tenant Staff ---');

  await pool.query(`
    ALTER TABLE roles 
      ADD COLUMN IF NOT EXISTS target_module VARCHAR(100) DEFAULT 'Pro Shop & Inventory',
      ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;
  `);
  console.log('✅ Columns target_module & permissions verified on roles.');

  // Seed standard roles for existing tenants if empty
  const tenantsRes = await pool.query('SELECT tenant_id FROM tenants');
  for (const t of tenantsRes.rows) {
    const rolesRes = await pool.query('SELECT COUNT(*) FROM roles WHERE tenant_id = $1', [t.tenant_id]);
    if (parseInt(rolesRes.rows[0].count, 10) === 0) {
      console.log(`Seeding standard departmental roles for tenant ${t.tenant_id}...`);
      const defaultRoles = [
        {
          id: `role_proshop_${t.tenant_id.slice(-6)}`,
          name: 'Pro Shop & Inventory Manager',
          description: 'Full oversight of equipment stock, inventory shipments, POs, and counter barcode sales.',
          targetModule: 'Pro Shop & Inventory',
          permissions: ['Inventory Management', 'POS Counter Billing', 'Stock Reorder', 'Returns Processing'],
        },
        {
          id: `role_barkitchen_${t.tenant_id.slice(-6)}`,
          name: 'Bar & Kitchen Supervisor',
          description: 'Punches table orders, handles running tabs, settles member discounts, and routes KOTs.',
          targetModule: 'Restaurant & Bar',
          permissions: ['Table Punch Orders', 'Member Tab Settlement', 'KOT Routing', 'Closing Shift Reconciliation'],
        },
        {
          id: `role_frontdesk_${t.tenant_id.slice(-6)}`,
          name: 'Front Desk & Slot Receptionist',
          description: 'Welcomes players, handles court check-ins, books walk-in slots, and handles equipment rentals.',
          targetModule: 'Walk-in Front Desk',
          permissions: ['Court Slot Booking', 'Player Check-in', 'Equipment Rental', 'Inquiry Intake'],
        },
        {
          id: `role_finance_${t.tenant_id.slice(-6)}`,
          name: 'Club Finance Auditor & GST Manager',
          description: 'Access to financial ledgers, member subscription invoicing, and government tax compliance auditing.',
          targetModule: 'Finance & Payments',
          permissions: ['GST Invoicing', 'Revenue Ledger Audit', 'Tax Compliance Filings', 'Z-Reports'],
        },
        {
          id: `role_coach_${t.tenant_id.slice(-6)}`,
          name: 'Head Academy Coach',
          description: 'Coordinates training schedules, clinic bookings, player skill tracking, and tournaments.',
          targetModule: 'Bookings',
          permissions: ['Clinic Scheduling', 'Player Evaluations', 'Tournament Planning'],
        },
      ];

      for (const r of defaultRoles) {
        await pool.query(
          `INSERT INTO roles (role_id, tenant_id, name, description, target_module, permissions)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (role_id) DO NOTHING`,
          [r.id, t.tenant_id, r.name, r.description, r.targetModule, JSON.stringify(r.permissions)]
        );
      }
    }
  }

  console.log('--- Roles Migration Complete ---');
}

migrateRoles().then(() => process.exit(0)).catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
