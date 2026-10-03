import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';

const PDF_STAFF_DEFINITIONS = [
  {
    roleName: 'Shop Manager',
    targetModule: 'Pro Shop & Inventory',
    department: 'Pro Shop & Gear Inventory',
    emailSlug: 'shop',
    displayName: 'Vikram Mehta (Shop Lead)',
    phone: '+91 98201 11001',
    description: 'Central stock, item SKU inventory, POS counter checkout, emergency restock & stringing.',
    permissions: [
      'shop:create',
      'shop:read',
      'shop:update',
      'shop:stock',
      'shop:sell',
      'inventory:audit',
      'gst:invoice',
    ],
  },
  {
    roleName: 'Bar Manager',
    targetModule: 'Restaurant & Bar',
    department: 'Food & Beverage (Restaurant & Bar)',
    emailSlug: 'bar',
    displayName: 'Chef Manish Joshi (Bar Lead)',
    phone: '+91 98201 11002',
    description: 'Bar tables, tabs, kitchen order tickets (KOT), closing day-end reconciliations.',
    permissions: [
      'bar:create',
      'bar:read',
      'bar:update',
      'bar:settle',
      'bar:void',
      'report:read',
      'kot:dispatch',
    ],
  },
  {
    roleName: 'Front Desk',
    targetModule: 'Walk-in Front Desk',
    department: 'Front Desk & Reception',
    emailSlug: 'frontdesk',
    displayName: 'Sneha Vyas (Front Desk)',
    phone: '+91 98201 11003',
    description: 'Manages walk-ins, phone calls, player check-in, court schedule locks & inquiries.',
    permissions: [
      'booking:create',
      'booking:read',
      'booking:update',
      'booking:cancel',
      'member:create',
      'member:read',
      'member:update',
      'walkin:checkin',
    ],
  },
  {
    roleName: 'Accountant',
    targetModule: 'Finance & Payments',
    department: 'Finance & Accounting',
    emailSlug: 'accountant',
    displayName: 'Nirav Shah (CA & Tax Auditor)',
    phone: '+91 98201 11004',
    description: 'Financial ledgers, 18% GST invoice generation, staff payroll, and government tax compliance audits.',
    permissions: [
      'finance:read',
      'finance:invoice',
      'finance:payroll',
      'finance:tax',
      'report:read',
      'report:export',
      'gst:b2b',
    ],
  },
  {
    roleName: 'Coach',
    targetModule: 'Bookings',
    department: 'Sports Academy & Coaching',
    emailSlug: 'coach',
    displayName: 'Coach Anand Iyer',
    phone: '+91 98201 11005',
    description: 'View coaching calendar, junior academy sessions, player skill assessments, and weekend tournaments.',
    permissions: ['booking:read', 'member:read', 'event:read', 'clinic:schedule'],
  },
  {
    roleName: 'HR',
    targetModule: 'Staff Management',
    department: 'Human Resources & Personnel',
    emailSlug: 'hr',
    displayName: 'Pooja Nair (HR Lead)',
    phone: '+91 98201 11006',
    description: 'Staff onboarding, attendance schedules, leave approvals, and shift rotations.',
    permissions: ['staff:read', 'staff:manage', 'staff:schedule', 'staff:approve_leave'],
  },
  {
    roleName: 'Groundskeeper',
    targetModule: 'Facilities & Courts',
    department: 'Court & Facility Operations',
    emailSlug: 'grounds',
    displayName: 'Ramesh Patel (Grounds & Courts)',
    phone: '+91 98201 11007',
    description: 'Facility maintenance, wooden court recoating, net tension checks, and court availability toggling.',
    permissions: ['facility:read', 'facility:update', 'court:toggle_availability', 'maintenance:log'],
  },
];

async function seedPdfStaffCredentials() {
  console.log('--- Seeding PDF Staff Sub-Roles & Multi-Tenant Credentials ---');

  const passwordHash = bcrypt.hashSync('Playnex@2026', 10);
  const { rows: tenants } = await pool.query('SELECT tenant_id, club_name FROM tenants');

  for (const t of tenants) {
    const clubPrefix = t.club_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    console.log(`\nProcessing Tenant: ${t.club_name} (${t.tenant_id})...`);

    for (const def of PDF_STAFF_DEFINITIONS) {
      // 1. Upsert Role
      const roleId = `role_${def.emailSlug}_${t.tenant_id.slice(-6)}`;
      await pool.query(
        `INSERT INTO roles (role_id, tenant_id, name, description, target_module, permissions, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE)
         ON CONFLICT (role_id) DO UPDATE
         SET name = EXCLUDED.name,
             description = EXCLUDED.description,
             target_module = EXCLUDED.target_module,
             permissions = EXCLUDED.permissions`,
        [roleId, t.tenant_id, def.roleName, def.description, def.targetModule, JSON.stringify(def.permissions)]
      );

      // 2. Upsert Staff User
      const email = `${def.emailSlug}.${clubPrefix}@playnex.com`;
      const genericEmail = `${def.emailSlug}@playnex.com`;
      const userId = `usr_${def.emailSlug}_${t.tenant_id.slice(-6)}`;

      // Insert tenant-specific user
      await pool.query(
        `INSERT INTO users (user_id, tenant_id, email, password_hash, name, phone, system_role, is_active, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'STAFF', TRUE, 'active')
         ON CONFLICT (user_id) DO UPDATE
         SET email = EXCLUDED.email,
             password_hash = EXCLUDED.password_hash,
             name = EXCLUDED.name,
             tenant_id = EXCLUDED.tenant_id,
             system_role = 'STAFF',
             is_active = TRUE`,
        [userId, t.tenant_id, email, passwordHash, `${def.displayName} (${t.club_name})`, def.phone]
      );

      // Link in user_roles
      await pool.query(
        `INSERT INTO user_roles (user_id, role_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [userId, roleId]
      );

      // Also ensure generic email (e.g. shop@playnex.com) routes to the first/primary tenant (Ananya Shah)
      if (t.tenant_id === 'tenant_1791026940545') {
        const primaryUserId = `usr_${def.emailSlug}_primary`;
        await pool.query(
          `INSERT INTO users (user_id, tenant_id, email, password_hash, name, phone, system_role, is_active, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'STAFF', TRUE, 'active')
           ON CONFLICT (user_id) DO UPDATE
           SET email = EXCLUDED.email,
               password_hash = EXCLUDED.password_hash,
               name = EXCLUDED.name,
               tenant_id = EXCLUDED.tenant_id,
               system_role = 'STAFF',
               is_active = TRUE`,
          [primaryUserId, t.tenant_id, genericEmail, passwordHash, `${def.displayName} (${t.club_name})`, def.phone]
        );

        await pool.query(
          `INSERT INTO user_roles (user_id, role_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [primaryUserId, roleId]
        );
      }

      console.log(`  ✓ Seeded [${def.roleName}] -> ${email} (Password: Playnex@2026) -> Module: ${def.targetModule}`);
    }
  }

  console.log('\n--- PDF Staff Roles & Credentials Seed Completed Successfully! ---');
}

seedPdfStaffCredentials()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to seed staff credentials:', err);
    process.exit(1);
  });
