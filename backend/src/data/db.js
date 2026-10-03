import bcrypt from 'bcryptjs';

// Pre-hashed password for demo accounts ("password123")
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

/**
 * In-Memory Multi-Tenant Store matching the PostgreSQL schema:
 * - tenants (clubs)
 * - departments
 * - roles (dynamic per tenant)
 * - permissions
 * - role_permissions
 * - users (Super Admin, Club Owner, Staff, Members)
 * - facilities
 */
export const db = {
  // 1. Tenants (Clubs)
  tenants: [
    {
      tenant_id: 'tenant_champions',
      club_name: 'The Champions Club',
      subdomain: 'champions',
      status: 'active',
      subscription_plan: 'Enterprise',
      created_at: new Date('2026-01-01').toISOString(),
    },
    {
      tenant_id: 'tenant_ace_padel',
      club_name: 'Ace Padel & Tennis Arena',
      subdomain: 'ace-padel',
      status: 'active',
      subscription_plan: 'Standard',
      created_at: new Date('2026-02-15').toISOString(),
    },
  ],

  // 2. Departments (Configured dynamically by Club Owner)
  departments: [
    {
      department_id: 'dept_courts_1',
      tenant_id: 'tenant_champions',
      name: 'Courts & Turf Arena',
      description: 'Tennis and Cricket booking management',
    },
    {
      department_id: 'dept_bar_1',
      tenant_id: 'tenant_champions',
      name: 'Bar & Cafeteria',
      description: 'Food, beverages, and table tabs POS',
    },
    {
      department_id: 'dept_shop_1',
      tenant_id: 'tenant_champions',
      name: 'Pro Gear Shop',
      description: 'Sports equipment and apparel inventory',
    },
    {
      department_id: 'dept_finance_1',
      tenant_id: 'tenant_champions',
      name: 'Finance & Admin',
      description: 'Invoicing, payroll, and monthly reporting',
    },
  ],

  // 3. System Permission Catalog
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

  // 4. Dynamic Roles created by Club Owners
  roles: [
    {
      role_id: 'role_court_manager',
      tenant_id: 'tenant_champions',
      department_id: 'dept_courts_1',
      name: 'Court Manager',
      description: 'Oversees court schedules, walk-ins, and conflict resolution',
      is_active: true,
      permissions: ['courts:view', 'courts:book', 'courts:manage', 'members:view'],
    },
    {
      role_id: 'role_bartender',
      tenant_id: 'tenant_champions',
      department_id: 'dept_bar_1',
      name: 'Bartender / Cashier',
      description: 'Manages open tabs, food orders, and member discounts',
      is_active: true,
      permissions: ['bar:view', 'bar:order', 'bar:settle', 'members:view'],
    },
    {
      role_id: 'role_gear_manager',
      tenant_id: 'tenant_champions',
      department_id: 'dept_shop_1',
      name: 'Pro Shop Attendant',
      description: 'Handles racket restringing, omnichannel pickup, and sales',
      is_active: true,
      permissions: ['shop:view', 'shop:sell', 'members:view'],
    },
  ],

  // 5. Users
  users: [
    // Super Admin (Platform Owner)
    {
      user_id: 'user_super_admin',
      tenant_id: null,
      name: 'Alex Mercer (Platform Owner)',
      email: 'superadmin@playnex.com',
      password_hash: DEFAULT_PASSWORD_HASH,
      system_role: 'SUPER_ADMIN',
      role_id: null,
      tier: null,
      is_active: true,
      created_at: new Date('2026-01-01').toISOString(),
    },
    // Club Owner (Tenant Admin)
    {
      user_id: 'user_club_owner',
      tenant_id: 'tenant_champions',
      name: 'Marcus Vance (Club Owner)',
      email: 'owner@championsclub.com',
      password_hash: DEFAULT_PASSWORD_HASH,
      system_role: 'CLUB_OWNER',
      role_id: null,
      tier: null,
      is_active: true,
      created_at: new Date('2026-01-01').toISOString(),
    },
    // Staff: Court Manager (Dynamic Role)
    {
      user_id: 'user_court_manager',
      tenant_id: 'tenant_champions',
      name: 'Liam Davies',
      email: 'courtmanager@championsclub.com',
      password_hash: DEFAULT_PASSWORD_HASH,
      system_role: 'STAFF',
      role_id: 'role_court_manager',
      tier: null,
      is_active: true,
      created_at: new Date('2026-01-10').toISOString(),
    },
    // Staff: Bartender (Dynamic Role)
    {
      user_id: 'user_bartender',
      tenant_id: 'tenant_champions',
      name: 'Chloe Bennett',
      email: 'bartender@championsclub.com',
      password_hash: DEFAULT_PASSWORD_HASH,
      system_role: 'STAFF',
      role_id: 'role_bartender',
      tier: null,
      is_active: true,
      created_at: new Date('2026-01-15').toISOString(),
    },
    // Member: Separate User Login (Gold Tier)
    {
      user_id: 'user_member_1',
      tenant_id: 'tenant_champions',
      name: 'Rohan Sharma',
      email: 'member@gmail.com',
      password_hash: DEFAULT_PASSWORD_HASH,
      system_role: 'MEMBER',
      role_id: null,
      tier: 'Gold',
      is_active: true,
      created_at: new Date('2026-01-20').toISOString(),
    },
  ],
};
