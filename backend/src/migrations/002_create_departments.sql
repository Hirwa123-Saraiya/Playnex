-- Migration 002: Create Departments Table
CREATE TABLE IF NOT EXISTS departments (
    department_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    parent_department_id VARCHAR(64) REFERENCES departments(department_id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_departments_tenant_id ON departments(tenant_id);
