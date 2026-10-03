-- Migration 010: Seed System Permissions and Super Admin ONLY
-- Everything else (Clubs, Departments, Dynamic Roles, Staff, Members) is created dynamically!

-- 1. System Permissions Catalog
INSERT INTO permissions (permission_id, module, action, description)
VALUES
    ('courts:view', 'Courts', 'View', 'View court schedule and availability'),
    ('courts:book', 'Courts', 'Book', 'Create bookings for walk-ins and members'),
    ('courts:manage', 'Courts', 'Manage', 'Modify court slots, pricing and social play'),
    ('bar:view', 'Bar', 'View', 'View active tables and bar menu'),
    ('bar:order', 'Bar', 'Order', 'Punch table orders and manage tabs'),
    ('bar:settle', 'Bar', 'Settle', 'Apply member discounts and settle bills'),
    ('shop:view', 'Shop', 'View', 'Browse inventory and stock levels'),
    ('shop:sell', 'Shop', 'Sell', 'Process counter orders and click-and-collect'),
    ('shop:manage', 'Shop', 'Manage', 'Update stock and trigger replenishment alerts'),
    ('members:view', 'Members', 'View', 'Lookup member tiers and validity'),
    ('members:manage', 'Members', 'Manage', 'Register members and renew plans'),
    ('reports:view', 'Reports', 'View', 'Access daily and monthly club revenue analytics'),
    ('roles:manage', 'Roles', 'Manage', 'Create custom roles and assign staff permissions')
ON CONFLICT (permission_id) DO UPDATE SET description = EXCLUDED.description;

-- 2. Platform Super Admin (Direct to Database)
-- Password is 'password123' hashed with bcrypt ($2a$10$wE96t0.XbH2yG1o7r97xEu1k51rVd0WqXF1W2S4jV8e7p0y1m7c.e)
INSERT INTO users (user_id, tenant_id, name, email, password_hash, system_role, tier, is_active)
VALUES (
    'user_super_admin',
    NULL,
    'Super Admin',
    'superadmin@playnex.com',
    '$2a$10$wE96t0.XbH2yG1o7r97xEu1k51rVd0WqXF1W2S4jV8e7p0y1m7c.e',
    'SUPER_ADMIN',
    NULL,
    TRUE
)
ON CONFLICT (email) DO NOTHING;
