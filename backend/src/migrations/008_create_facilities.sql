-- Migration 008: Create Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
    facility_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    department_id VARCHAR(64) REFERENCES departments(department_id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'tennis_court', 'cricket_turf', 'padel_court', 'table'
    config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_facilities_tenant_id ON facilities(tenant_id);
