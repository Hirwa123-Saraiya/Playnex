-- Migration 006: Create Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(tenant_id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    system_role VARCHAR(50) NOT NULL DEFAULT 'MEMBER', -- 'SUPER_ADMIN', 'SUPPORT_ADMIN', 'CLUB_OWNER', 'STAFF', 'MEMBER'
    tier VARCHAR(50), -- 'Gold', 'Silver', 'Junior' (for Members)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
