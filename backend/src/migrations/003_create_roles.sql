-- Migration 003: Create Dynamic Roles Table
CREATE TABLE IF NOT EXISTS roles (
    role_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    department_id VARCHAR(64) REFERENCES departments(department_id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_roles_tenant_id ON roles(tenant_id);
