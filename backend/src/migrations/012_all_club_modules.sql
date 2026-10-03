-- Migration 012: Comprehensive Schema for All Club Sidebar Modules

-- 1. Extend Facilities table with hourly rate, surface and timing
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC(10, 2) DEFAULT 500.00;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS surface VARCHAR(100) DEFAULT 'Hard Court';
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS open_time TIME DEFAULT '06:00:00';
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS close_time TIME DEFAULT '23:00:00';

-- 2. Extend Users table with phone, department_id, and status
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id VARCHAR(64) REFERENCES departments(department_id) ON DELETE SET NULL;

-- 3. Membership Plans Table
CREATE TABLE IF NOT EXISTS membership_plans (
    plan_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    billing_cycle VARCHAR(50) DEFAULT 'monthly', -- 'monthly', 'quarterly', 'yearly'
    tier VARCHAR(50) DEFAULT 'Standard',
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_membership_plans_tenant ON membership_plans(tenant_id);

-- 4. Club Events & Tournaments Table
CREATE TABLE IF NOT EXISTS club_events (
    event_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sport VARCHAR(100) DEFAULT 'Multi-Sport',
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    entry_fee NUMERIC(10, 2) DEFAULT 0.00,
    max_participants INT DEFAULT 32,
    registered_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_club_events_tenant ON club_events(tenant_id);

-- 5. Restaurant Items (Menu) Table
CREATE TABLE IF NOT EXISTS restaurant_items (
    item_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) DEFAULT 'Food', -- 'Food', 'Beverages', 'Alcohol', 'Snacks'
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_restaurant_items_tenant ON restaurant_items(tenant_id);

-- 6. Restaurant Orders & Tabs Table
CREATE TABLE IF NOT EXISTS restaurant_orders (
    order_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(user_id) ON DELETE SET NULL,
    member_name VARCHAR(150) NOT NULL,
    table_number VARCHAR(50),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'served', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_restaurant_orders_tenant ON restaurant_orders(tenant_id);

-- 7. Operational Approvals Table
CREATE TABLE IF NOT EXISTS approvals (
    approval_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- 'Membership', 'Refund', 'Guest Pass', 'Slot Cancellation'
    title VARCHAR(255) NOT NULL,
    requester VARCHAR(150) NOT NULL,
    details TEXT,
    amount NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_approvals_tenant ON approvals(tenant_id);

-- 8. Club Communications & Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    announcement_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_audience VARCHAR(100) DEFAULT 'all', -- 'all', 'members', 'staff'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_announcements_tenant ON announcements(tenant_id);
