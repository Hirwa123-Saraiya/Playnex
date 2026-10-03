import { pool } from '../config/database.js';
import { db as memoryDb } from './db.js';

let isPgAvailable = false;

// Check once if PostgreSQL is accessible and ensure schema is up to date
async function checkPg() {
  try {
    const res = await pool.query('SELECT 1');
    isPgAvailable = !!res;
    if (isPgAvailable) {
      await pool.query(`
        ALTER TABLE tenants ADD COLUMN IF NOT EXISTS sport VARCHAR(100) DEFAULT 'Multi-Sport';
        ALTER TABLE tenants ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT 'India';
        ALTER TABLE tenants ADD COLUMN IF NOT EXISTS address TEXT;
        ALTER TABLE tenants ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      `);
    }
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
   * Get all Tenants (Clubs) with their main Admin info directly from database
   */
  async getTenants() {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT t.tenant_id as id,
                t.club_name as name,
                COALESCE(t.sport, 'Multi-Sport') as sport,
                COALESCE(t.location, 'India') as location,
                CASE 
                  WHEN LOWER(t.status) = 'active' THEN 'Active'
                  WHEN LOWER(t.status) = 'suspended' THEN 'Suspended'
                  ELSE 'Pending'
                END as status,
                t.subscription_plan as "subscriptionPlan",
                t.subdomain,
                COALESCE(u.name, 'Unassigned') as admin,
                COALESCE(u.email, '') as "adminEmail",
                COALESCE((SELECT COUNT(*) FROM users WHERE tenant_id = t.tenant_id), 0)::int as members,
                COALESCE((SELECT COUNT(*) FROM bookings WHERE tenant_id = t.tenant_id AND booking_date = CURRENT_DATE), 0)::int as "bookingsToday",
                COALESCE((SELECT SUM(total_amount) FROM bookings WHERE tenant_id = t.tenant_id), 0)::numeric as revenue
         FROM tenants t
         LEFT JOIN users u ON u.tenant_id = t.tenant_id AND u.system_role = 'CLUB_OWNER'
         ORDER BY t.created_at DESC`
      );
      return rows;
    }
    return memoryDb.tenants.map((t) => {
      const admin = memoryDb.users.find((u) => u.tenant_id === t.tenant_id && u.system_role === 'CLUB_OWNER');
      const count = memoryDb.users.filter((u) => u.tenant_id === t.tenant_id).length;
      return {
        id: t.tenant_id,
        name: t.club_name,
        sport: t.sport || 'Multi-Sport',
        location: t.location || 'India',
        status: t.status || 'Active',
        subscriptionPlan: t.subscription_plan || 'Standard',
        subdomain: t.subdomain,
        admin: admin ? admin.name : 'Unassigned',
        adminEmail: admin ? admin.email : '',
        members: count,
        bookingsToday: 0,
        revenue: 0,
      };
    });
  },

  /**
   * Create dynamic Tenant (Club) in database
   */
  async createTenant({ tenantId, clubName, subdomain, subscriptionPlan, sport, location, address, phone }) {
    if (await checkPg()) {
      await pool.query(
        `INSERT INTO tenants (tenant_id, club_name, subdomain, status, subscription_plan, sport, location, address, phone)
         VALUES ($1, $2, $3, 'active', $4, $5, $6, $7, $8)
         ON CONFLICT (tenant_id) DO NOTHING`,
        [
          tenantId,
          clubName,
          subdomain,
          subscriptionPlan || 'Standard',
          sport || 'Multi-Sport',
          location || 'India',
          address || null,
          phone || null,
        ]
      );
    }
    memoryDb.tenants.push({
      tenant_id: tenantId,
      club_name: clubName,
      subdomain,
      status: 'active',
      subscription_plan: subscriptionPlan || 'Standard',
      sport: sport || 'Multi-Sport',
      location: location || 'India',
      address: address || '',
      phone: phone || '',
      created_at: new Date().toISOString(),
    });
  },

  /**
   * Update Tenant (Club)
   */
  async updateTenant(tenantId, updates) {
    const { clubName, sport, location, address, phone, status, subscriptionPlan } = updates;
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE tenants
         SET 
           club_name = COALESCE($2, club_name),
           sport = COALESCE($3, sport),
           location = COALESCE($4, location),
           address = COALESCE($5, address),
           phone = COALESCE($6, phone),
           status = COALESCE($7, status),
           subscription_plan = COALESCE($8, subscription_plan)
         WHERE tenant_id = $1
         RETURNING *`,
        [tenantId, clubName || null, sport || null, location || null, address || null, phone || null, status || null, subscriptionPlan || null]
      );
      return rows[0] || null;
    }

    const t = memoryDb.tenants.find((item) => item.tenant_id === tenantId);
    if (t) {
      if (clubName) t.club_name = clubName;
      if (sport) t.sport = sport;
      if (location) t.location = location;
      if (address !== undefined) t.address = address;
      if (phone !== undefined) t.phone = phone;
      if (status) t.status = status;
      if (subscriptionPlan) t.subscription_plan = subscriptionPlan;
      return t;
    }
    return null;
  },

  /**
   * Delete Tenant (Club) along with associated records
   */
  async deleteTenant(tenantId) {
    if (await checkPg()) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('DELETE FROM bookings WHERE tenant_id = $1', [tenantId]);
        await client.query('DELETE FROM facilities WHERE tenant_id = $1', [tenantId]);
        await client.query('DELETE FROM user_roles WHERE user_id IN (SELECT user_id FROM users WHERE tenant_id = $1)', [tenantId]);
        await client.query('DELETE FROM role_permissions WHERE role_id IN (SELECT role_id FROM roles WHERE tenant_id = $1)', [tenantId]);
        await client.query('DELETE FROM users WHERE tenant_id = $1 AND system_role != $2', [tenantId, 'SUPER_ADMIN']);
        await client.query('DELETE FROM roles WHERE tenant_id = $1', [tenantId]);
        await client.query('DELETE FROM departments WHERE tenant_id = $1', [tenantId]);
        const res = await client.query('DELETE FROM tenants WHERE tenant_id = $1 RETURNING tenant_id', [tenantId]);
        await client.query('COMMIT');
        return res.rowCount > 0;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    const idx = memoryDb.tenants.findIndex((t) => t.tenant_id === tenantId);
    if (idx !== -1) {
      memoryDb.tenants.splice(idx, 1);
      memoryDb.users = memoryDb.users.filter((u) => u.tenant_id !== tenantId);
      memoryDb.departments = memoryDb.departments.filter((d) => d.tenant_id !== tenantId);
      memoryDb.roles = memoryDb.roles.filter((r) => r.tenant_id !== tenantId);
      memoryDb.facilities = memoryDb.facilities.filter((f) => f.tenant_id !== tenantId);
      memoryDb.bookings = memoryDb.bookings.filter((b) => b.tenant_id !== tenantId);
      return true;
    }
    return false;
  },

  /**
   * Get Platform-Wide Aggregated Statistics for Super Admin directly from DB
   */
  async getPlatformStats() {
    if (await checkPg()) {
      const { rows } = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM tenants)::int as total_clubs,
          (SELECT COUNT(*) FROM users WHERE system_role != 'SUPER_ADMIN')::int as total_members,
          (SELECT COUNT(*) FROM users WHERE system_role IN ('CLUB_OWNER', 'STAFF'))::int as total_admins,
          (SELECT COUNT(*) FROM bookings WHERE booking_date = CURRENT_DATE)::int as today_bookings,
          COALESCE((SELECT SUM(total_amount) FROM bookings WHERE booking_date = CURRENT_DATE), 0)::numeric as today_revenue,
          (SELECT COUNT(*) FROM facilities WHERE is_active = TRUE)::int as active_facilities,
          (SELECT COUNT(*) FROM facilities)::int as total_facilities
      `);
      const s = rows[0] || {};
      return {
        total_clubs: Number(s.total_clubs || 0),
        total_members: Number(s.total_members || 0),
        total_admins: Number(s.total_admins || 0),
        today_bookings: Number(s.today_bookings || 0),
        today_revenue: Number(s.today_revenue || 0),
        active_facilities: Number(s.active_facilities || 0),
        total_facilities: Number(s.total_facilities || 0),
      };
    }
    return {
      total_clubs: memoryDb.tenants.length,
      total_members: memoryDb.users.filter(u => u.system_role !== 'SUPER_ADMIN').length,
      total_admins: memoryDb.users.filter(u => u.system_role === 'CLUB_OWNER' || u.system_role === 'STAFF').length,
      today_bookings: 0,
      today_revenue: 0,
      active_facilities: memoryDb.facilities.length,
      total_facilities: memoryDb.facilities.length,
    };
  },

  /**
   * Get all Club Admins directly from database
   */
  async getAdmins() {
    if (await checkPg()) {
      const { rows } = await pool.query(`
        SELECT 
          u.user_id as id,
          u.name,
          u.email,
          COALESCE(t.club_name, 'Unassigned') as club,
          CASE 
            WHEN u.system_role = 'CLUB_OWNER' THEN 'Owner'
            WHEN u.system_role = 'STAFF' THEN 'Staff'
            ELSE 'Manager'
          END as role,
          CASE 
            WHEN u.is_active = TRUE THEN 'Active' 
            ELSE 'Disabled' 
          END as status,
          COALESCE(TO_CHAR(u.created_at, 'DD Mon YYYY'), 'Recently') as "lastLogin"
        FROM users u
        LEFT JOIN tenants t ON u.tenant_id = t.tenant_id
        WHERE u.system_role IN ('CLUB_OWNER', 'STAFF')
        ORDER BY u.created_at DESC
      `);
      return rows;
    }
    return memoryDb.users
      .filter((u) => u.system_role === 'CLUB_OWNER' || u.system_role === 'STAFF')
      .map((u) => {
        const tenant = memoryDb.tenants.find((t) => t.tenant_id === u.tenant_id);
        return {
          id: u.user_id,
          name: u.name,
          email: u.email,
          club: tenant ? tenant.club_name : 'Unassigned',
          role: u.system_role === 'CLUB_OWNER' ? 'Owner' : 'Staff',
          status: u.is_active ? 'Active' : 'Disabled',
          lastLogin: 'Recently',
        };
      });
  },

  /**
   * Get all End Users / Members directly from database
   */
  async getClubUsers() {
    if (await checkPg()) {
      const { rows } = await pool.query(`
        SELECT 
          u.user_id as id,
          u.name,
          u.email,
          COALESCE(t.club_name, 'Unassigned') as club,
          COALESCE(u.tier, 'Annual') as plan,
          COALESCE(TO_CHAR(u.created_at, 'DD Mon YYYY'), 'Recently') as joined,
          u.is_active as active
        FROM users u
        LEFT JOIN tenants t ON u.tenant_id = t.tenant_id
        WHERE u.system_role = 'MEMBER'
        ORDER BY u.created_at DESC
      `);
      return rows;
    }
    return memoryDb.users
      .filter((u) => u.system_role === 'MEMBER')
      .map((u) => {
        const tenant = memoryDb.tenants.find((t) => t.tenant_id === u.tenant_id);
        return {
          id: u.user_id,
          name: u.name,
          email: u.email,
          club: tenant ? tenant.club_name : 'Unassigned',
          plan: u.tier || 'Annual',
          joined: 'Recently',
          active: u.is_active,
        };
      });
  },

  /**
   * Get Revenue data by Club directly from database
   */
  async getRevenueData() {
    if (await checkPg()) {
      const { rows } = await pool.query(`
        SELECT 
          t.tenant_id as id,
          t.club_name as club,
          COALESCE((SELECT SUM(total_amount) FROM bookings WHERE tenant_id = t.tenant_id AND booking_date >= CURRENT_DATE - INTERVAL '30 days'), 0)::numeric as month,
          COALESCE((SELECT SUM(total_amount) FROM bookings WHERE tenant_id = t.tenant_id AND booking_date >= CURRENT_DATE - INTERVAL '7 days'), 0)::numeric as week,
          COALESCE((SELECT SUM(total_amount) FROM bookings WHERE tenant_id = t.tenant_id AND booking_date = CURRENT_DATE), 0)::numeric as today,
          0 as growth
        FROM tenants t
        ORDER BY month DESC
      `);
      return rows;
    }
    return memoryDb.tenants.map((t) => ({
      id: t.tenant_id,
      club: t.club_name,
      month: 0,
      week: 0,
      today: 0,
      growth: 0,
    }));
  },

  /**
   * Get dynamic Club details by tenant ID
   */
  async getClubDetails(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(`
        SELECT 
          t.tenant_id as id,
          t.club_name as name,
          COALESCE(t.sport, 'Multi-Sport') as sport,
          COALESCE(t.location, 'India') as location,
          t.address,
          t.phone,
          t.status,
          t.subscription_plan as "subscriptionPlan",
          t.subdomain,
          t.created_at as "createdAt"
        FROM tenants t
        WHERE t.tenant_id = $1
      `, [tenantId]);

      if (!rows[0]) return null;
      const club = rows[0];

      const { rows: depts } = await pool.query(
        'SELECT department_id as id, name, description FROM departments WHERE tenant_id = $1',
        [tenantId]
      );
      const { rows: facilities } = await pool.query(
        'SELECT facility_id as id, name, type, is_active as "isActive" FROM facilities WHERE tenant_id = $1',
        [tenantId]
      );
      const { rows: adminRows } = await pool.query(
        `SELECT user_id as id, name, email, system_role as role FROM users WHERE tenant_id = $1 AND system_role = 'CLUB_OWNER'`,
        [tenantId]
      );

      return {
        ...club,
        admin: adminRows[0] || null,
        departments: depts,
        facilities: facilities,
      };
    }

    const t = memoryDb.tenants.find((item) => item.tenant_id === tenantId);
    if (!t) return null;
    return {
      id: t.tenant_id,
      name: t.club_name,
      sport: t.sport || 'Multi-Sport',
      location: t.location || 'India',
      status: t.status,
      departments: memoryDb.departments.filter(d => d.tenant_id === tenantId),
      facilities: memoryDb.facilities.filter(f => f.tenant_id === tenantId),
      admin: memoryDb.users.find(u => u.tenant_id === tenantId && u.system_role === 'CLUB_OWNER') || null,
    };
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
