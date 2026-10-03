-- Role metadata used by tenant staff workstations.
ALTER TABLE roles ADD COLUMN IF NOT EXISTS target_module VARCHAR(150) DEFAULT 'Pro Shop & Inventory';
ALTER TABLE roles ADD COLUMN IF NOT EXISTS permissions JSONB NOT NULL DEFAULT '[]'::jsonb;
