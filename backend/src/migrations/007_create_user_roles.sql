-- Migration 007: Create User Roles Junction Table (Staff dynamic role assignments)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(64) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role_id VARCHAR(64) NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
