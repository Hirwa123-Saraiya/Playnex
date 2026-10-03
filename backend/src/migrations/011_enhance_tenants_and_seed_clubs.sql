-- Migration 011: Add sport, location, address, phone to tenants table (Clubs)
-- All clubs and their main admins are created dynamically via Super Admin portal!

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS sport VARCHAR(100) DEFAULT 'Multi-Sport';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT 'India';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
