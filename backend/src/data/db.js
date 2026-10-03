import bcrypt from 'bcryptjs';

// Pre-hashed password for demo super admin ("password123")
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

/**
 * Multi-Tenant Store matching the PostgreSQL schema:
 * All clubs (tenants), dynamic roles, staff, and members are created dynamically in the database!
 * Only platform Super Admin and standard system permissions are pre-configured.
 */
export const db = {
  // 1. Tenants (Clubs) - 100% Dynamic, populated from database
  tenants: [],

  // 2. Departments - Configured dynamically by Club Owner / Tenant
  departments: [],

  // 3. System Permissions Catalog (Global)
  permissions: [
    { permission_id: 'courts:view', module: 'Courts', action: 'View', description: 'View court schedule and availability' },
    { permission_id: 'courts:book', module: 'Courts', action: 'Book', description: 'Create bookings for walk-ins and members' },
    { permission_id: 'courts:manage', module: 'Courts', action: 'Manage', description: 'Modify court slots, pricing and social play' },
    { permission_id: 'bar:view', module: 'Bar', action: 'View', description: 'View active tables and bar menu' },
    { permission_id: 'bar:order', module: 'Bar', action: 'Order', description: 'Punch table orders and manage tabs' },
    { permission_id: 'bar:settle', module: 'Bar', action: 'Settle', description: 'Apply member discounts and settle bills' },
    { permission_id: 'shop:view', module: 'Shop', action: 'View', description: 'Browse inventory and stock levels' },
    { permission_id: 'shop:sell', module: 'Shop', action: 'Sell', description: 'Process counter orders and click-and-collect' },
    { permission_id: 'shop:manage', module: 'Shop', action: 'Manage', description: 'Update stock and trigger replenishment alerts' },
    { permission_id: 'members:view', module: 'Members', action: 'View', description: 'Lookup member tiers and validity' },
    { permission_id: 'members:manage', module: 'Members', action: 'Manage', description: 'Register members and renew plans' },
    { permission_id: 'reports:view', module: 'Reports', action: 'View', description: 'Access daily and monthly club revenue analytics' },
    { permission_id: 'roles:manage', module: 'Roles', action: 'Manage', description: 'Create custom roles and assign staff permissions' },
  ],

  // 4. Dynamic Roles - Configured dynamically per club
  roles: [],

  // 5. Users - Super Admin seeded, all club owners/staff/members are created dynamically
  users: [
    {
      user_id: 'user_super_admin',
      tenant_id: null,
      name: 'Super Admin',
      email: 'superadmin@playnex.com',
      password_hash: DEFAULT_PASSWORD_HASH,
      system_role: 'SUPER_ADMIN',
      role_id: null,
      tier: null,
      is_active: true,
      created_at: new Date('2026-01-01').toISOString(),
    },
  ],

  // 6. Facilities - Dynamic per club
  facilities: [],

  // 7. Bookings - Dynamic per club
  bookings: [],
};

export default db;
