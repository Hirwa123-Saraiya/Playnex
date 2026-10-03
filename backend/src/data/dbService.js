import { pool } from '../config/database.js';
import { db as memoryDb } from './db.js';

let isPgAvailable = false;

// Check once if PostgreSQL is accessible
async function checkPg() {
  try {
    const res = await pool.query('SELECT 1');
    isPgAvailable = !!res;
  } catch {
    isPgAvailable = false;
  }
  return isPgAvailable;
}

checkPg();

export const dbService = {
  /**
   * Find user by email (checks PostgreSQL, falls back to memory if DB is starting)
   */
  async findUserByEmail(email) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT u.*, t.club_name as tenant_name, r.name as role_name, r.role_id as dynamic_role_id
         FROM users u
         LEFT JOIN tenants t ON u.tenant_id = t.tenant_id
         LEFT JOIN user_roles ur ON u.user_id = ur.user_id
         LEFT JOIN roles r ON ur.role_id = r.role_id
         WHERE LOWER(u.email) = LOWER($1) AND u.is_active = TRUE`,
        [email]
      );
      return rows[0] || null;
    }
    return memoryDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  /**
   * Find user by ID
   */
  async findUserById(userId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT u.*, t.club_name as tenant_name, r.name as role_name, r.role_id as dynamic_role_id
         FROM users u
         LEFT JOIN tenants t ON u.tenant_id = t.tenant_id
         LEFT JOIN user_roles ur ON u.user_id = ur.user_id
         LEFT JOIN roles r ON ur.role_id = r.role_id
         WHERE u.user_id = $1 AND u.is_active = TRUE`,
        [userId]
      );
      return rows[0] || null;
    }
    return memoryDb.users.find((u) => u.user_id === userId) || null;
  },

  /**
   * Get dynamic permissions for a user
   */
  async getUserPermissions(userId, systemRole) {
    if (systemRole === 'SUPER_ADMIN' || systemRole === 'CLUB_OWNER') {
      if (await checkPg()) {
        const { rows } = await pool.query('SELECT permission_id FROM permissions');
        return rows.map((r) => r.permission_id);
      }
      return memoryDb.permissions.map((p) => p.permission_id);
    }

    if (systemRole === 'MEMBER') {
      return ['courts:view', 'courts:book', 'shop:view', 'bar:view'];
    }

    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT DISTINCT rp.permission_id
         FROM user_roles ur
         JOIN role_permissions rp ON ur.role_id = rp.role_id
         WHERE ur.user_id = $1`,
        [userId]
      );
      return rows.map((r) => r.permission_id);
    }

    const u = memoryDb.users.find((usr) => usr.user_id === userId);
    if (u && u.role_id) {
      const role = memoryDb.roles.find((r) => r.role_id === u.role_id);
      return role?.permissions || [];
    }
    return [];
  },

  /**
   * Create dynamic Tenant (Club)
   */
  async createTenant({ tenantId, clubName, subdomain, subscriptionPlan }) {
    if (await checkPg()) {
      await pool.query(
        `INSERT INTO tenants (tenant_id, club_name, subdomain, status, subscription_plan)
         VALUES ($1, $2, $3, 'active', $4)`,
        [tenantId, clubName, subdomain, subscriptionPlan || 'Standard']
      );
    }
    memoryDb.tenants.push({
      tenant_id: tenantId,
      club_name: clubName,
      subdomain,
      status: 'active',
      subscription_plan: subscriptionPlan || 'Standard',
      created_at: new Date().toISOString(),
    });
  },

  /**
   * Create dynamic User
   */
  async createUser({ userId, tenantId, name, email, passwordHash, systemRole, tier }) {
    if (await checkPg()) {
      await pool.query(
        `INSERT INTO users (user_id, tenant_id, name, email, password_hash, system_role, tier, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
        [userId, tenantId || null, name, email.toLowerCase(), passwordHash, systemRole, tier || null]
      );
    }
    memoryDb.users.push({
      user_id: userId,
      tenant_id: tenantId || null,
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      system_role: systemRole,
      role_id: null,
      tier: tier || null,
      is_active: true,
      created_at: new Date().toISOString(),
    });
  },

  /**
   * Get Departments for a Tenant
   */
  async getDepartments(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        'SELECT * FROM departments WHERE tenant_id = $1 ORDER BY created_at ASC',
        [tenantId]
      );
      return rows;
    }
    return memoryDb.departments.filter((d) => d.tenant_id === tenantId);
  },

  /**
   * Create Dynamic Department
   */
  async createDepartment({ departmentId, tenantId, name, description }) {
    if (await checkPg()) {
      await pool.query(
        `INSERT INTO departments (department_id, tenant_id, name, description)
         VALUES ($1, $2, $3, $4)`,
        [departmentId, tenantId, name, description || null]
      );
    }
    const newDept = { department_id: departmentId, tenant_id: tenantId, name, description: description || '' };
    memoryDb.departments.push(newDept);
    return newDept;
  },

  /**
   * Get Dynamic Roles for a Tenant
   */
  async getRoles(tenantId) {
    if (await checkPg()) {
      const { rows: roleRows } = await pool.query(
        'SELECT * FROM roles WHERE tenant_id = $1 AND is_active = TRUE',
        [tenantId]
      );

      const rolesWithPerms = await Promise.all(
        roleRows.map(async (r) => {
          const { rows: permRows } = await pool.query(
            'SELECT permission_id FROM role_permissions WHERE role_id = $1',
            [r.role_id]
          );
          return {
            ...r,
            permissions: permRows.map((p) => p.permission_id),
          };
        })
      );
      return rolesWithPerms;
    }
    return memoryDb.roles.filter((r) => r.tenant_id === tenantId);
  },

  /**
   * Create Dynamic Role with Permissions
   */
  async createRole({ roleId, tenantId, departmentId, name, description, permissions }) {
    if (await checkPg()) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(
          `INSERT INTO roles (role_id, tenant_id, department_id, name, description, is_active)
           VALUES ($1, $2, $3, $4, $5, TRUE)`,
          [roleId, tenantId, departmentId || null, name, description || null]
        );

        if (Array.isArray(permissions)) {
          for (const permId of permissions) {
            await client.query(
              `INSERT INTO role_permissions (role_id, permission_id)
               VALUES ($1, $2) ON CONFLICT DO NOTHING`,
              [roleId, permId]
            );
          }
        }
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    }

    const newRole = {
      role_id: roleId,
      tenant_id: tenantId,
      department_id: departmentId || null,
      name,
      description: description || '',
      is_active: true,
      permissions: permissions || [],
    };
    memoryDb.roles.push(newRole);
    return newRole;
  },

  /**
   * Get System Permissions Catalog
   */
  async getPermissionsCatalog() {
    if (await checkPg()) {
      const { rows } = await pool.query('SELECT * FROM permissions ORDER BY module, action');
      return rows;
    }
    return memoryDb.permissions;
  },
};

export default dbService;
