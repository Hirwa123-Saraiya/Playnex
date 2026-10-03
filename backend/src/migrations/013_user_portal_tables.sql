-- Migration 013: User Portal Tables (Family Members, User Memberships, Reviews)

-- 1. Ensure columns on Bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS member_name VARCHAR(150);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS court_name VARCHAR(100);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price NUMERIC(10, 2);

-- 2. Family Members Table
CREATE TABLE IF NOT EXISTS family_members (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    relation VARCHAR(50) NOT NULL,
    age INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_family_members_user ON family_members(user_id);

-- 3. User Purchased Memberships Table
CREATE TABLE IF NOT EXISTS user_memberships (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    plan_id VARCHAR(64) REFERENCES membership_plans(plan_id) ON DELETE SET NULL,
    plan_name VARCHAR(150),
    tier VARCHAR(50) DEFAULT 'Standard',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    payment_method VARCHAR(100) DEFAULT 'UPI',
    amount NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_memberships_user ON user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_tenant ON user_memberships(tenant_id);

-- 4. Club Reviews Table
CREATE TABLE IF NOT EXISTS club_reviews (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(user_id) ON DELETE SET NULL,
    user_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_club_reviews_tenant ON club_reviews(tenant_id);
