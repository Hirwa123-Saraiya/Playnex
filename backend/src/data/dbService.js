import bcrypt from 'bcryptjs';
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
        `SELECT u.*, t.club_name as tenant_name, r.name as role_name, r.role_id as dynamic_role_id, r.target_module, r.permissions as role_permissions
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
        `SELECT u.*, t.club_name as tenant_name, r.name as role_name, r.role_id as dynamic_role_id, r.target_module, r.permissions as role_permissions
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
                COALESCE((SELECT COUNT(*) FROM users WHERE tenant_id = t.tenant_id AND system_role = 'MEMBER'), 0)::int as members,
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
      const count = memoryDb.users.filter((u) => u.tenant_id === t.tenant_id && u.system_role === 'MEMBER').length;
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
    const plan = subscriptionPlan || 'Standard';
    const isEnterprise = plan.toLowerCase() === 'enterprise';
    const isGrowth = plan.toLowerCase() === 'growth';
    const base = isEnterprise ? 19999 : isGrowth ? 9999 : 4999;
    const gst = Math.round(base * 0.18 * 100) / 100;
    const total = base + gst;
    const invId = `inv_${tenantId}_${Date.now()}`;
    const invNum = `INV-PNX-${tenantId.slice(-6).toUpperCase()}`;

    if (await checkPg()) {
      await pool.query(
        `INSERT INTO tenants (tenant_id, club_name, subdomain, status, subscription_plan, sport, location, address, phone)
         VALUES ($1, $2, $3, 'active', $4, $5, $6, $7, $8)
         ON CONFLICT (tenant_id) DO NOTHING`,
        [
          tenantId,
          clubName,
          subdomain,
          plan,
          sport || 'Multi-Sport',
          location || 'India',
          address || null,
          phone || null,
        ]
      );

      // Auto-generate official SaaS platform invoice in database
      await pool.query(
        `INSERT INTO platform_invoices (
           invoice_id, tenant_id, invoice_number, billing_month, plan_name, subdomain,
           base_amount, gst_amount, total_amount, billing_cycle, payment_status, payment_method,
           invoice_date, due_date
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Monthly', 'Paid', 'Razorpay SaaS Auto-Debit', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days')
         ON CONFLICT (invoice_id) DO NOTHING`,
        [
          invId,
          tenantId,
          invNum,
          new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          plan,
          subdomain || clubName.toLowerCase().replace(/\s+/g, '-'),
          base,
          gst,
          total,
        ]
      );
    }
    memoryDb.tenants.push({
      tenant_id: tenantId,
      club_name: clubName,
      subdomain,
      status: 'active',
      subscription_plan: plan,
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
          (SELECT COUNT(*) FROM users WHERE system_role = 'MEMBER')::int as total_members,
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
      total_members: memoryDb.users.filter(u => u.system_role === 'MEMBER').length,
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
          u.tenant_id as "tenantId",
          t.subdomain,
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
   * Update an existing Club Admin in PostgreSQL
   */
  async updateAdmin(userId, { name, email, role, status }) {
    let systemRole = undefined;
    if (role) {
      systemRole = role.toLowerCase() === 'owner' ? 'CLUB_OWNER' : 'STAFF';
    }
    const isActive = status ? status.toLowerCase() === 'active' : undefined;

    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE users
         SET name = COALESCE($2, name),
             email = COALESCE($3, email),
             system_role = COALESCE($4, system_role),
             is_active = COALESCE($5, is_active)
         WHERE user_id = $1
         RETURNING user_id as id, name, email, system_role, is_active`,
        [userId, name || null, email || null, systemRole || null, isActive !== undefined ? isActive : null]
      );
      return rows[0] || null;
    }

    const u = memoryDb.users.find((user) => user.user_id === userId);
    if (u) {
      if (name) u.name = name;
      if (email) u.email = email;
      if (systemRole) u.system_role = systemRole;
      if (isActive !== undefined) u.is_active = isActive;
      return u;
    }
    return null;
  },

  /**
   * Reset Admin Password in PostgreSQL
   */
  async resetAdminPassword(userId, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE users SET password_hash = $2 WHERE user_id = $1 RETURNING user_id`,
        [userId, hash]
      );
      return rows.length > 0;
    }

    const u = memoryDb.users.find((user) => user.user_id === userId);
    if (u) {
      u.password_hash = hash;
      return true;
    }
    return false;
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
   * Get Platform Revenue from Club Subscriptions & SaaS Charges
   */
  async getRevenueData() {
    if (await checkPg()) {
      const { rows } = await pool.query(`
        SELECT 
          COALESCE(i.invoice_id, 'inv_' || t.tenant_id) as id,
          COALESCE(i.invoice_number, 'INV-PNX-' || SUBSTRING(t.tenant_id, 8, 6)) as "invoiceNumber",
          t.tenant_id as "tenantId",
          t.club_name as club,
          COALESCE(i.plan_name, t.subscription_plan, 'Standard') as "subscriptionPlan",
          COALESCE(i.subdomain, t.subdomain, '') as subdomain,
          t.status as "status",
          COALESCE(i.base_amount, 
            CASE 
              WHEN LOWER(COALESCE(t.subscription_plan, 'standard')) = 'enterprise' THEN 19999
              WHEN LOWER(COALESCE(t.subscription_plan, 'standard')) = 'growth' THEN 9999
              ELSE 4999
            END
          )::numeric as "platformFee",
          COALESCE(i.base_amount, 
            CASE 
              WHEN LOWER(COALESCE(t.subscription_plan, 'standard')) = 'enterprise' THEN 19999
              WHEN LOWER(COALESCE(t.subscription_plan, 'standard')) = 'growth' THEN 9999
              ELSE 4999
            END
          )::numeric as month,
          COALESCE(i.gst_amount, 
            CASE 
              WHEN LOWER(COALESCE(t.subscription_plan, 'standard')) = 'enterprise' THEN 3599.82
              WHEN LOWER(COALESCE(t.subscription_plan, 'standard')) = 'growth' THEN 1799.82
              ELSE 899.82
            END
          )::numeric as "gstAmount",
          COALESCE(i.total_amount, 
            CASE 
              WHEN LOWER(COALESCE(t.subscription_plan, 'standard')) = 'enterprise' THEN 23598.82
              WHEN LOWER(COALESCE(t.subscription_plan, 'standard')) = 'growth' THEN 11798.82
              ELSE 5898.82
            END
          )::numeric as "totalAmount",
          COALESCE(i.billing_cycle, 'Monthly') as "billingCycle",
          COALESCE(i.payment_status, 'Paid') as "paymentStatus",
          COALESCE(i.payment_method, 'Razorpay SaaS Auto-Debit') as "paymentMethod",
          COALESCE(TO_CHAR(i.invoice_date, 'DD Mon YYYY'), TO_CHAR(t.created_at, 'DD Mon YYYY')) as "invoiceDate",
          COALESCE(TO_CHAR(i.due_date, 'DD Mon YYYY'), TO_CHAR(t.created_at + INTERVAL '1 month', 'DD Mon YYYY')) as "nextInvoice",
          0 as growth
        FROM tenants t
        LEFT JOIN platform_invoices i ON t.tenant_id = i.tenant_id
        ORDER BY month DESC
      `);
      return rows;
    }
    return memoryDb.tenants.map((t) => {
      const plan = t.subscription_plan || 'Standard';
      const fee = plan.toLowerCase() === 'enterprise' ? 19999 : plan.toLowerCase() === 'growth' ? 9999 : 4999;
      return {
        id: t.tenant_id,
        club: t.club_name,
        subscriptionPlan: plan,
        subdomain: t.subdomain,
        status: t.status || 'Active',
        platformFee: fee,
        month: fee,
        week: 0,
        today: 0,
        billingCycle: 'Monthly',
        paymentStatus: 'Paid',
        nextInvoice: 'Next Month',
        growth: 0,
      };
    });
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
  /**
   * FACILITIES MODULE
   */
  async getFacilitiesByTenant(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT f.facility_id as id, f.name, f.type, f.hourly_rate as "hourlyRate",
                f.surface, f.open_time as "openTime", f.close_time as "closeTime",
                f.is_active as "isActive", d.name as department
         FROM facilities f
         LEFT JOIN departments d ON f.department_id = d.department_id
         WHERE f.tenant_id = $1
         ORDER BY f.created_at DESC`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async createFacility({ facilityId, tenantId, departmentId, name, type, hourlyRate, surface, openTime, closeTime }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO facilities (facility_id, tenant_id, department_id, name, type, hourly_rate, surface, open_time, close_time)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING facility_id as id, name, type, hourly_rate as "hourlyRate", surface, open_time as "openTime", close_time as "closeTime", is_active as "isActive"`,
        [facilityId, tenantId, departmentId || null, name, type, hourlyRate || 500, surface || 'Synthetic', openTime || '06:00:00', closeTime || '23:00:00']
      );
      return rows[0];
    }
    return null;
  },

  async updateFacility(facilityId, tenantId, { name, type, hourlyRate, surface, openTime, closeTime, isActive }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE facilities
         SET name = COALESCE($3, name),
             type = COALESCE($4, type),
             hourly_rate = COALESCE($5, hourly_rate),
             surface = COALESCE($6, surface),
             open_time = COALESCE($7, open_time),
             close_time = COALESCE($8, close_time),
             is_active = COALESCE($9, is_active)
         WHERE facility_id = $1 AND tenant_id = $2
         RETURNING facility_id as id, name, type, hourly_rate as "hourlyRate", surface, open_time as "openTime", close_time as "closeTime", is_active as "isActive"`,
        [facilityId, tenantId, name || null, type || null, hourlyRate || null, surface || null, openTime || null, closeTime || null, isActive !== undefined ? isActive : null]
      );
      return rows[0] || null;
    }
    return null;
  },

  async deleteFacility(facilityId, tenantId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM facilities WHERE facility_id = $1 AND tenant_id = $2`,
        [facilityId, tenantId]
      );
      return rowCount > 0;
    }
    return false;
  },

  /**
   * BOOKINGS MODULE
   */
  async getBookingsByTenant(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT b.booking_id as id, b.facility_id as "facilityId", f.name as "facilityName",
                f.type as "facilityType", b.user_id as "userId",
                COALESCE(u.name, 'Club Guest') as "memberName",
                COALESCE(u.email, '') as "memberEmail",
                b.booking_date::text as "bookingDate",
                b.start_time as "startTime", b.end_time as "endTime",
                b.status, b.payment_status as "paymentStatus",
                b.total_amount as "totalAmount", b.created_at as "createdAt"
         FROM bookings b
         JOIN facilities f ON b.facility_id = f.facility_id
         LEFT JOIN users u ON b.user_id = u.user_id
         WHERE b.tenant_id = $1
         ORDER BY b.booking_date DESC, b.start_time DESC`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async createBooking({ bookingId, tenantId, facilityId, userId, memberName, bookingDate, startTime, endTime, totalAmount, status, paymentStatus }) {
    if (await checkPg()) {
      // Anti-double booking: two bookings cannot overlap on the same facility and date
      const overlapCheck = await pool.query(
        `SELECT booking_id FROM bookings
         WHERE facility_id = $1 AND booking_date = $2 AND status != 'cancelled'
           AND (start_time < $4 AND end_time > $3)
         LIMIT 1`,
        [facilityId, bookingDate, startTime, endTime]
      );
      if (overlapCheck.rows.length > 0) {
        throw new Error('Court is already booked for this time slot. Double booking is not permitted.');
      }

      // If userId is missing, fallback or find/create guest
      let assignedUserId = userId;
      if (!assignedUserId) {
        const owner = await pool.query('SELECT user_id FROM users WHERE tenant_id = $1 AND system_role = $2 LIMIT 1', [tenantId, 'CLUB_OWNER']);
        assignedUserId = owner.rows[0]?.user_id || 'usr_guest';
      }
      const { rows } = await pool.query(
        `INSERT INTO bookings (booking_id, tenant_id, facility_id, user_id, booking_date, start_time, end_time, total_amount, status, payment_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING booking_id as id, facility_id as "facilityId", booking_date::text as "bookingDate", start_time as "startTime", end_time as "endTime", total_amount as "totalAmount", status, payment_status as "paymentStatus"`,
        [bookingId, tenantId, facilityId, assignedUserId, bookingDate, startTime, endTime, totalAmount || 0, status || 'confirmed', paymentStatus || 'paid']
      );
      return rows[0];
    }
    return null;
  },

  async updateBooking(bookingId, tenantId, { status, paymentStatus, startTime, endTime }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE bookings
         SET status = COALESCE($3, status),
             payment_status = COALESCE($4, payment_status),
             start_time = COALESCE($5, start_time),
             end_time = COALESCE($6, end_time)
         WHERE booking_id = $1 AND tenant_id = $2
         RETURNING booking_id as id, status, payment_status as "paymentStatus"`,
        [bookingId, tenantId, status || null, paymentStatus || null, startTime || null, endTime || null]
      );
      return rows[0] || null;
    }
    return null;
  },

  async deleteBooking(bookingId, tenantId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM bookings WHERE booking_id = $1 AND tenant_id = $2`,
        [bookingId, tenantId]
      );
      return rowCount > 0;
    }
    return false;
  },

  /**
   * MEMBERS MODULE
   */
  async getMembersByTenant(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT user_id as id, name, email, phone, COALESCE(tier, 'Standard') as tier,
                COALESCE(status, 'active') as status, is_active as "isActive", created_at as "joinedAt"
         FROM users
         WHERE tenant_id = $1 AND system_role = 'MEMBER'
         ORDER BY created_at DESC`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async createMember({ userId, tenantId, name, email, phone, tier, passwordHash }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO users (user_id, tenant_id, name, email, phone, tier, password_hash, system_role, is_active, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'MEMBER', TRUE, 'active')
         RETURNING user_id as id, name, email, phone, tier, status, created_at as "joinedAt"`,
        [userId, tenantId, name, email, phone || null, tier || 'Standard', passwordHash]
      );
      return rows[0];
    }
    return null;
  },

  async updateMember(userId, tenantId, { name, phone, tier, status }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE users
         SET name = COALESCE($3, name),
             phone = COALESCE($4, phone),
             tier = COALESCE($5, tier),
             status = COALESCE($6, status)
         WHERE user_id = $1 AND tenant_id = $2 AND system_role = 'MEMBER'
         RETURNING user_id as id, name, email, phone, tier, status`,
        [userId, tenantId, name || null, phone || null, tier || null, status || null]
      );
      return rows[0] || null;
    }
    return null;
  },

  async deleteMember(userId, tenantId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM users WHERE user_id = $1 AND tenant_id = $2 AND system_role = 'MEMBER'`,
        [userId, tenantId]
      );
      return rowCount > 0;
    }
    return false;
  },

  /**
   * STAFF MANAGEMENT MODULE
   */
  async getStaffByTenant(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT u.user_id as id, u.name, u.email, u.phone,
                COALESCE(u.status, 'active') as status, u.system_role as "systemRole",
                COALESCE(d.name, 'Operations') as department,
                COALESCE(r.name, 'Staff Member') as "roleName",
                COALESCE(r.role_id, '') as "roleId",
                COALESCE(r.target_module, 'Pro Shop & Inventory') as "targetModule",
                COALESCE(r.permissions, '[]'::jsonb) as permissions,
                u.created_at as "createdAt"
         FROM users u
         LEFT JOIN departments d ON u.department_id = d.department_id
         LEFT JOIN user_roles ur ON u.user_id = ur.user_id
         LEFT JOIN roles r ON ur.role_id = r.role_id
         WHERE u.tenant_id = $1 AND u.system_role = 'STAFF'
         ORDER BY u.created_at ASC`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async getRoles(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT role_id as "id", role_id as "roleId", tenant_id as "tenantId", name, description,
                COALESCE(target_module, 'Pro Shop & Inventory') as "targetModule",
                COALESCE(permissions, '[]'::jsonb) as permissions,
                is_active as "isActive", created_at as "createdAt"
         FROM roles
         WHERE tenant_id = $1
         ORDER BY created_at ASC`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async createRole({ roleId, tenantId, departmentId, name, description, targetModule, permissions }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO roles (role_id, tenant_id, department_id, name, description, target_module, permissions)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING role_id as "id", role_id as "roleId", tenant_id as "tenantId", name, description,
                   target_module as "targetModule", permissions, is_active as "isActive"`,
        [
          roleId,
          tenantId,
          departmentId || null,
          name,
          description || '',
          targetModule || 'Pro Shop & Inventory',
          JSON.stringify(Array.isArray(permissions) ? permissions : []),
        ]
      );
      return rows[0];
    }
    return null;
  },

  async deleteRole(roleId, tenantId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM roles WHERE role_id = $1 AND tenant_id = $2`,
        [roleId, tenantId]
      );
      return rowCount > 0;
    }
    return false;
  },

  async createStaff({ userId, tenantId, name, email, phone, departmentId, roleId, passwordHash }) {
    if (await checkPg()) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const { rows } = await client.query(
          `INSERT INTO users (user_id, tenant_id, department_id, name, email, phone, password_hash, system_role, is_active, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'STAFF', TRUE, 'active')
           RETURNING user_id as id, name, email, phone, system_role as "systemRole"`,
          [userId, tenantId, departmentId || null, name, email, phone || null, passwordHash]
        );
        if (roleId) {
          await client.query(
            `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [userId, roleId]
          );
        }
        await client.query('COMMIT');
        return rows[0];
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }
    return null;
  },

  async updateStaff(userId, tenantId, { name, phone, departmentId, status }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE users
         SET name = COALESCE($3, name),
             phone = COALESCE($4, phone),
             department_id = COALESCE($5, department_id),
             status = COALESCE($6, status)
         WHERE user_id = $1 AND tenant_id = $2
         RETURNING user_id as id, name, email, phone, status`,
        [userId, tenantId, name || null, phone || null, departmentId || null, status || null]
      );
      return rows[0] || null;
    }
    return null;
  },

  async deleteStaff(userId, tenantId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM users WHERE user_id = $1 AND tenant_id = $2 AND system_role = 'STAFF'`,
        [userId, tenantId]
      );
      return rowCount > 0;
    }
    return false;
  },

  /**
   * EVENTS & TOURNAMENTS MODULE
   */
  async getAllEvents() {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT e.event_id as id, e.title, e.description, e.sport,
                e.event_date::text as "eventDate", e.start_time as "startTime", e.end_time as "endTime",
                e.entry_fee as "entryFee", e.max_participants as "maxParticipants",
                e.registered_count as "registeredCount", e.status, e.created_at as "createdAt",
                t.club_name as club
         FROM club_events e
         JOIN tenants t ON e.tenant_id = t.tenant_id
         ORDER BY e.event_date ASC`
      );
      return rows;
    }
    return [];
  },

  async getEventsByTenant(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT event_id as id, title, description, sport,
                event_date::text as "eventDate", start_time as "startTime", end_time as "endTime",
                entry_fee as "entryFee", max_participants as "maxParticipants",
                registered_count as "registeredCount", status, created_at as "createdAt"
         FROM club_events
         WHERE tenant_id = $1
         ORDER BY event_date ASC`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async createEvent({ eventId, tenantId, title, description, sport, eventDate, startTime, endTime, entryFee, maxParticipants }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO club_events (event_id, tenant_id, title, description, sport, event_date, start_time, end_time, entry_fee, max_participants, registered_count, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, 'upcoming')
         RETURNING event_id as id, title, description, sport, event_date::text as "eventDate", start_time as "startTime", end_time as "endTime", entry_fee as "entryFee", max_participants as "maxParticipants", registered_count as "registeredCount", status`,
        [eventId, tenantId, title, description || '', sport || 'Multi-Sport', eventDate, startTime, endTime, entryFee || 0, maxParticipants || 32]
      );
      return rows[0];
    }
    return null;
  },

  async updateEvent(eventId, tenantId, { title, description, sport, eventDate, startTime, endTime, entryFee, maxParticipants, status }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE club_events
         SET title = COALESCE($3, title),
             description = COALESCE($4, description),
             sport = COALESCE($5, sport),
             event_date = COALESCE($6, event_date),
             start_time = COALESCE($7, start_time),
             end_time = COALESCE($8, end_time),
             entry_fee = COALESCE($9, entry_fee),
             max_participants = COALESCE($10, max_participants),
             status = COALESCE($11, status)
         WHERE event_id = $1 AND tenant_id = $2
         RETURNING event_id as id, title, sport, event_date::text as "eventDate", status`,
        [eventId, tenantId, title || null, description || null, sport || null, eventDate || null, startTime || null, endTime || null, entryFee || null, maxParticipants || null, status || null]
      );
      return rows[0] || null;
    }
    return null;
  },

  async deleteEvent(eventId, tenantId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM club_events WHERE event_id = $1 AND tenant_id = $2`,
        [eventId, tenantId]
      );
      return rowCount > 0;
    }
    return false;
  },

  /**
   * MEMBERSHIP PLANS MODULE
   */
  async getPlansByTenant(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT plan_id as id, name, price, billing_cycle as "billingCycle",
                tier, features, is_active as "isActive", created_at as "createdAt"
         FROM membership_plans
         WHERE tenant_id = $1
         ORDER BY price ASC`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async getAllMembershipPlans(clubId) {
    if (await checkPg()) {
      let query = `
        SELECT p.plan_id as id, p.tenant_id as "clubId", p.name, p.price::numeric as price,
               p.billing_cycle as "billingCycle", p.tier, p.features,
               p.is_active as "isActive", p.created_at as "createdAt",
               t.club_name as "clubName", t.location as "clubLocation"
        FROM membership_plans p
        JOIN tenants t ON p.tenant_id = t.tenant_id
        WHERE p.is_active = TRUE
      `;
      const params = [];
      if (clubId && clubId !== 'All') {
        params.push(clubId);
        query += ` AND p.tenant_id = $${params.length}`;
      }
      query += ` ORDER BY p.price ASC`;
      const { rows } = await pool.query(query, params);
      return rows;
    }
    return [];
  },

  async createPlan({ planId, tenantId, name, price, billingCycle, tier, features }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO membership_plans (plan_id, tenant_id, name, price, billing_cycle, tier, features, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
         RETURNING plan_id as id, name, price, billing_cycle as "billingCycle", tier, features, is_active as "isActive"`,
        [planId, tenantId, name, price || 0, billingCycle || 'monthly', tier || 'Standard', JSON.stringify(features || [])]
      );
      return rows[0];
    }
    return null;
  },

  async updatePlan(planId, tenantId, { name, price, billingCycle, tier, features, isActive }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE membership_plans
         SET name = COALESCE($3, name),
             price = COALESCE($4, price),
             billing_cycle = COALESCE($5, billing_cycle),
             tier = COALESCE($6, tier),
             features = COALESCE($7, features),
             is_active = COALESCE($8, is_active)
         WHERE plan_id = $1 AND tenant_id = $2
         RETURNING plan_id as id, name, price, billing_cycle as "billingCycle", tier, is_active as "isActive"`,
        [planId, tenantId, name || null, price || null, billingCycle || null, tier || null, features ? JSON.stringify(features) : null, isActive !== undefined ? isActive : null]
      );
      return rows[0] || null;
    }
    return null;
  },

  async deletePlan(planId, tenantId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM membership_plans WHERE plan_id = $1 AND tenant_id = $2`,
        [planId, tenantId]
      );
      return rowCount > 0;
    }
    return false;
  },

  /**
   * RESTAURANT & BAR MODULE
   */
  async getRestaurantMenu(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT item_id as id, name, category, price, is_available as "isAvailable"
         FROM restaurant_items
         WHERE tenant_id = $1
         ORDER BY category, name`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async createMenuItem({ itemId, tenantId, name, category, price, isAvailable }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO restaurant_items (item_id, tenant_id, name, category, price, is_available)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING item_id as id, name, category, price, is_available as "isAvailable"`,
        [itemId, tenantId, name, category || 'Food', price || 0, isAvailable !== undefined ? isAvailable : true]
      );
      return rows[0];
    }
    return null;
  },

  async updateMenuItem(itemId, tenantId, { name, category, price, isAvailable }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE restaurant_items
         SET name = COALESCE($3, name),
             category = COALESCE($4, category),
             price = COALESCE($5, price),
             is_available = COALESCE($6, is_available)
         WHERE item_id = $1 AND tenant_id = $2
         RETURNING item_id as id, name, category, price, is_available as "isAvailable"`,
        [itemId, tenantId, name || null, category || null, price || null, isAvailable !== undefined ? isAvailable : null]
      );
      return rows[0] || null;
    }
    return null;
  },

  async deleteMenuItem(itemId, tenantId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM restaurant_items WHERE item_id = $1 AND tenant_id = $2`,
        [itemId, tenantId]
      );
      return rowCount > 0;
    }
    return false;
  },

  async getRestaurantOrders(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT order_id as id, member_name as "memberName", table_number as "tableNumber",
                items, total_amount as "totalAmount", status, created_at as "createdAt"
         FROM restaurant_orders
         WHERE tenant_id = $1
         ORDER BY created_at DESC`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async createRestaurantOrder({ orderId, tenantId, userId, memberName, tableNumber, items, totalAmount, status }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO restaurant_orders (order_id, tenant_id, user_id, member_name, table_number, items, total_amount, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING order_id as id, member_name as "memberName", table_number as "tableNumber", items, total_amount as "totalAmount", status, created_at as "createdAt"`,
        [orderId, tenantId, userId || null, memberName, tableNumber || 'Counter', JSON.stringify(items || []), totalAmount || 0, status || 'completed']
      );
      return rows[0];
    }
    return null;
  },

  /**
   * APPROVALS MODULE
   */
  async getApprovalsByTenant(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT approval_id as id, type, title, requester, details, amount, status, created_at as "createdAt"
         FROM approvals
         WHERE tenant_id = $1
         ORDER BY created_at DESC`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async createApproval({ approvalId, tenantId, type, title, requester, details, amount }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO approvals (approval_id, tenant_id, type, title, requester, details, amount, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
         RETURNING approval_id as id, type, title, requester, details, amount, status, created_at as "createdAt"`,
        [approvalId, tenantId, type || 'Membership', title, requester, details || '', amount || 0]
      );
      return rows[0];
    }
    return null;
  },

  async updateApprovalStatus(approvalId, tenantId, status) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE approvals
         SET status = $3
         WHERE approval_id = $1 AND tenant_id = $2
         RETURNING approval_id as id, type, title, requester, status`,
        [approvalId, tenantId, status]
      );
      return rows[0] || null;
    }
    return null;
  },

  /**
   * COMMUNICATIONS MODULE
   */
  async getAnnouncementsByTenant(tenantId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT announcement_id as id, title, message, target_audience as "targetAudience", created_at as "createdAt"
         FROM announcements
         WHERE tenant_id = $1
         ORDER BY created_at DESC`,
        [tenantId]
      );
      return rows;
    }
    return [];
  },

  async createAnnouncement({ announcementId, tenantId, title, message, targetAudience }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO announcements (announcement_id, tenant_id, title, message, target_audience)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING announcement_id as id, title, message, target_audience as "targetAudience", created_at as "createdAt"`,
        [announcementId, tenantId, title, message, targetAudience || 'all']
      );
      return rows[0];
    }
    return null;
  },

  async deleteAnnouncement(announcementId, tenantId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM announcements WHERE announcement_id = $1 AND tenant_id = $2`,
        [announcementId, tenantId]
      );
      return rowCount > 0;
    }
    return false;
  },

  /**
   * CLUB SETTINGS MODULE
   */
  async updateClubSettings(tenantId, { clubName, sport, location, address, phone }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE tenants
         SET club_name = COALESCE($2, club_name),
             sport = COALESCE($3, sport),
             location = COALESCE($4, location),
             address = COALESCE($5, address),
             phone = COALESCE($6, phone)
         WHERE tenant_id = $1
         RETURNING tenant_id as id, club_name as name, sport, location, address, phone`,
        [tenantId, clubName || null, sport || null, location || null, address || null, phone || null]
      );
      return rows[0] || null;
    }
    return null;
  },

  /**
   * FINANCE & SETTLEMENTS MODULE
   */
  async getFinanceData(tenantId) {
    if (await checkPg()) {
      const targetTenantId = tenantId || (await pool.query('SELECT tenant_id FROM tenants ORDER BY created_at DESC LIMIT 1')).rows[0]?.tenant_id;

      const bookingsQuery = pool.query(
        `SELECT booking_id as id,
                created_at as "date",
                COALESCE(member_name, 'Club Member') as member,
                'Court & Pitch Bookings' as category,
                'UPI (Online)' as mode,
                COALESCE(total_price, total_amount, 0)::numeric as amount,
                ROUND((COALESCE(total_price, total_amount, 0) * 0.18)::numeric, 2) as gst,
                CASE WHEN status = 'cancelled' THEN 'Refunded' ELSE 'Settled' END as status
         FROM bookings
         WHERE ($1::varchar IS NULL OR tenant_id = $1)
         ORDER BY created_at DESC
         LIMIT 50`,
        [targetTenantId || null]
      );

      const ordersQuery = pool.query(
        `SELECT order_id as id,
                created_at as "date",
                COALESCE(member_name, 'Club Patron') as member,
                'Restaurant & Dining' as category,
                'Member Tab' as mode,
                COALESCE(total_amount, 0)::numeric as amount,
                ROUND((COALESCE(total_amount, 0) * 0.05)::numeric, 2) as gst,
                CASE WHEN status = 'settled' THEN 'Settled' ELSE 'Pending' END as status
         FROM restaurant_orders
         WHERE ($1::varchar IS NULL OR tenant_id = $1)
         ORDER BY created_at DESC
         LIMIT 50`,
        [targetTenantId || null]
      );

      const membersQuery = pool.query(
        `SELECT COALESCE(tier, 'Annual Member') as type, COUNT(*)::int as count
         FROM users
         WHERE system_role = 'MEMBER' AND ($1::varchar IS NULL OR tenant_id = $1 OR tenant_id IS NULL)
         GROUP BY tier`,
        [targetTenantId || null]
      );

      const [bRes, oRes, mRes] = await Promise.all([bookingsQuery, ordersQuery, membersQuery]);
      const txns = [...bRes.rows, ...oRes.rows].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      const gstLiability = txns.reduce((acc, t) => acc + (parseFloat(t.gst) || 0), 0);
      const pendingSettlement = txns
        .filter((t) => t.status === 'Pending')
        .reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0);

      const courtRev = bRes.rows.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
      const diningRev = oRes.rows.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
      const memberCount = mRes.rows.reduce((s, r) => s + parseInt(r.count || 0), 0) || 1;
      const membershipRev = memberCount * 12500;

      const totalRevenue = courtRev + diningRev + membershipRev;
      const arpu = Math.round(totalRevenue / Math.max(memberCount, 1));

      const revenueSources = [
        { source: 'Membership Subscription', amount: membershipRev, growth: 12.5, share: totalRevenue ? Math.round((membershipRev / totalRevenue) * 1000) / 10 : 35, dept: 'Membership' },
        { source: 'Court & Pitch Bookings', amount: courtRev, growth: 9.8, share: totalRevenue ? Math.round((courtRev / totalRevenue) * 1000) / 10 : 30, dept: 'Court Booking' },
        { source: 'Restaurant & Dining', amount: diningRev, growth: 14.0, share: totalRevenue ? Math.round((diningRev / totalRevenue) * 1000) / 10 : 20, dept: 'Restaurant' },
        { source: 'Pro Sports Shop Sales', amount: Math.round(courtRev * 0.4), growth: 8.2, share: 10, dept: 'Shop' },
        { source: 'Events & Tournament Entry', amount: Math.round(courtRev * 0.25), growth: 18.0, share: 5, dept: 'Events' },
      ];

      const membershipTypes = mRes.rows.map((m, idx) => {
        const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
        return {
          type: m.type,
          count: m.count,
          revenue: m.count * 12500,
          color: colors[idx % colors.length],
        };
      });

      const monthlyTrend = [
        { month: 'May', revenue: Math.round(totalRevenue * 0.75), target: Math.round(totalRevenue * 0.7) },
        { month: 'Jun', revenue: Math.round(totalRevenue * 0.82), target: Math.round(totalRevenue * 0.78) },
        { month: 'Jul', revenue: Math.round(totalRevenue * 0.89), target: Math.round(totalRevenue * 0.85) },
        { month: 'Aug', revenue: Math.round(totalRevenue * 0.93), target: Math.round(totalRevenue * 0.90) },
        { month: 'Sep', revenue: Math.round(totalRevenue * 0.97), target: Math.round(totalRevenue * 0.95) },
        { month: 'Oct', revenue: totalRevenue, target: Math.round(totalRevenue * 0.95) },
      ];

      return {
        summary: {
          grossRevenue: totalRevenue,
          pendingSettlement,
          gstLiability,
          totalMonthlyRevenue: totalRevenue,
          arpu,
          activeMembers: memberCount,
        },
        revenueSources,
        membershipTypes: membershipTypes.length ? membershipTypes : [
          { type: 'Annual Patron', count: memberCount, revenue: membershipRev, color: '#3B82F6' },
        ],
        monthlyTrend,
        transactions: txns,
      };
    }
    return {
      summary: { grossRevenue: 0, pendingSettlement: 0, gstLiability: 0, totalMonthlyRevenue: 0, arpu: 0, activeMembers: 0 },
      revenueSources: [],
      membershipTypes: [],
      monthlyTrend: [],
      transactions: [],
    };
  },

  /**
   * USER PORTAL MODULES
   */
  async getUserClubs({ city, sport, search } = {}) {
    if (await checkPg()) {
      let query = `
        SELECT t.tenant_id as id,
               t.club_name as name,
               t.sport,
               t.location,
               t.address,
               t.phone,
               t.subscription_plan as "subscriptionPlan",
               t.status,
               COALESCE((SELECT COUNT(*) FROM facilities WHERE tenant_id = t.tenant_id AND is_active = TRUE), 0)::int as "facilitiesCount",
               COALESCE((SELECT MIN(hourly_rate) FROM facilities WHERE tenant_id = t.tenant_id AND is_active = TRUE), 500)::numeric as "startingPrice",
               COALESCE((SELECT AVG(rating) FROM club_reviews WHERE tenant_id = t.tenant_id), 4.8)::numeric as rating,
               COALESCE((SELECT COUNT(*) FROM club_reviews WHERE tenant_id = t.tenant_id), 0)::int as "reviewCount"
        FROM tenants t
        WHERE LOWER(t.status) = 'active'
      `;
      const params = [];
      if (city && city !== 'All') {
        params.push(`%${city}%`);
        query += ` AND (t.location ILIKE $${params.length} OR t.address ILIKE $${params.length})`;
      }
      if (sport && sport !== 'All') {
        params.push(`%${sport}%`);
        query += ` AND t.sport ILIKE $${params.length}`;
      }
      if (search) {
        params.push(`%${search}%`);
        query += ` AND (t.club_name ILIKE $${params.length} OR t.location ILIKE $${params.length} OR t.sport ILIKE $${params.length})`;
      }
      query += ` ORDER BY t.created_at DESC`;
      const { rows } = await pool.query(query, params);
      return rows;
    }
    return [];
  },

  async getUserClubDetails(clubId) {
    if (await checkPg()) {
      const clubRes = await pool.query(
        `SELECT t.tenant_id as id, t.club_name as name, t.sport, t.location, t.address, t.phone,
                t.subscription_plan as "subscriptionPlan", t.status,
                COALESCE((SELECT AVG(rating) FROM club_reviews WHERE tenant_id = t.tenant_id), 4.8)::numeric as rating,
                COALESCE((SELECT COUNT(*) FROM club_reviews WHERE tenant_id = t.tenant_id), 0)::int as "reviewCount"
         FROM tenants t
         WHERE t.tenant_id = $1`,
        [clubId]
      );
      if (clubRes.rows.length === 0) return null;

      const [facRes, planRes, evtRes, revRes] = await Promise.all([
        pool.query(
          `SELECT facility_id as id, name, type, hourly_rate as "hourlyRate", surface, open_time as "openTime", close_time as "closeTime", is_active as "isActive"
           FROM facilities WHERE tenant_id = $1 AND is_active = TRUE`,
          [clubId]
        ),
        pool.query(
          `SELECT plan_id as id, name, price, billing_cycle as "billingCycle", tier, features, is_active as "isActive"
           FROM membership_plans WHERE tenant_id = $1 AND is_active = TRUE`,
          [clubId]
        ),
        pool.query(
          `SELECT event_id as id, title, description, sport, event_date::text as "eventDate", start_time as "startTime", end_time as "endTime", entry_fee as "entryFee", max_participants as "maxParticipants", registered_count as "registeredCount", status
           FROM club_events WHERE tenant_id = $1 AND status != 'cancelled' ORDER BY event_date ASC`,
          [clubId]
        ),
        pool.query(
          `SELECT id, user_name as "userName", rating, comment, created_at as "createdAt"
           FROM club_reviews WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 20`,
          [clubId]
        ),
      ]);

      return {
        ...clubRes.rows[0],
        facilities: facRes.rows,
        plans: planRes.rows,
        events: evtRes.rows,
        reviews: revRes.rows,
      };
    }
    return null;
  },

  async getUserFacilities({ clubId, sport } = {}) {
    if (await checkPg()) {
      let query = `
        SELECT f.facility_id as id, f.name, f.type, f.hourly_rate as "hourlyRate",
               f.surface, f.open_time as "openTime", f.close_time as "closeTime",
               f.is_active as "isActive", f.tenant_id as "clubId",
               t.club_name as "clubName", t.location as "clubLocation"
        FROM facilities f
        JOIN tenants t ON f.tenant_id = t.tenant_id
        WHERE f.is_active = TRUE
      `;
      const params = [];
      if (clubId) {
        params.push(clubId);
        query += ` AND f.tenant_id = $${params.length}`;
      }
      if (sport && sport !== 'All') {
        params.push(`%${sport}%`);
        query += ` AND f.type ILIKE $${params.length}`;
      }
      query += ` ORDER BY f.name ASC`;
      const { rows } = await pool.query(query, params);
      return rows;
    }
    return [];
  },

  async createUserBooking({ bookingId, tenantId, facilityId, userId, memberName, bookingDate, startTime, endTime, totalPrice, paymentStatus, courtName }) {
    if (await checkPg()) {
      // 1. Anti-double booking: Check overlapping confirmed booking on same facility and date
      const overlapCheck = await pool.query(
        `SELECT booking_id FROM bookings
         WHERE facility_id = $1 AND booking_date = $2 AND status != 'cancelled'
           AND (start_time < $4 AND end_time > $3)
         LIMIT 1`,
        [facilityId, bookingDate, startTime, endTime]
      );
      if (overlapCheck.rows.length > 0) {
        throw new Error('Court is already booked for this time slot. Double booking is not permitted.');
      }

      // 2. Member daily play limit (at most twice a day)
      if (userId && !String(userId).startsWith('usr_guest')) {
        const countRes = await pool.query(
          `SELECT COUNT(*) as count FROM bookings
           WHERE user_id = $1 AND booking_date = $2 AND status != 'cancelled'`,
          [userId, bookingDate]
        );
        if (parseInt(countRes.rows[0]?.count || '0', 10) >= 2) {
          throw new Error('Daily booking limit reached. Each member can book at most twice a day.');
        }
      }

      if (userId) {
        try {
          const cleanId = String(userId).toLowerCase().replace(/[^a-z0-9]/g, '');
          await pool.query(
            `INSERT INTO users (user_id, email, name, system_role, password_hash)
             VALUES ($1, $2, $3, 'MEMBER', '$2b$10$dummyhashformembers12345')
             ON CONFLICT (user_id) DO NOTHING`,
            [userId, `${cleanId || 'customer'}@playnex.com`, memberName || 'Customer']
          );
        } catch (_) {}
      }
      const { rows } = await pool.query(
        `INSERT INTO bookings (booking_id, tenant_id, facility_id, user_id, member_name, booking_date, start_time, end_time, total_amount, total_price, status, payment_status, court_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, 'confirmed', $10, $11)
         RETURNING booking_id as id, tenant_id as "clubId", facility_id as "facilityId", user_id as "userId", member_name as "memberName", booking_date::text as "bookingDate", start_time as "startTime", end_time as "endTime", total_price as "totalPrice", status, payment_status as "paymentStatus", court_name as "courtName", created_at as "createdAt"`,
        [bookingId, tenantId, facilityId, userId, memberName || 'Customer', bookingDate, startTime, endTime, totalPrice || 500, paymentStatus || 'paid', courtName || 'Court 1']
      );
      return rows[0];
    }
    return null;
  },

  async getUserBookings(userId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT b.booking_id as id, b.tenant_id as "clubId", b.facility_id as "facilityId",
                b.member_name as "memberName", b.booking_date::text as "bookingDate",
                b.start_time as "startTime", b.end_time as "endTime",
                COALESCE(b.total_price, b.total_amount) as "totalPrice",
                b.status, b.payment_status as "paymentStatus",
                COALESCE(b.court_name, f.name) as "courtName",
                t.club_name as "clubName", t.location as "clubLocation",
                f.type as "sport", b.created_at as "createdAt"
         FROM bookings b
         JOIN tenants t ON b.tenant_id = t.tenant_id
         LEFT JOIN facilities f ON b.facility_id = f.facility_id
         WHERE b.user_id = $1
         ORDER BY b.booking_date DESC, b.start_time DESC`,
        [userId]
      );
      return rows;
    }
    return [];
  },

  async cancelUserBooking(bookingId, userId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE bookings
         SET status = 'cancelled'
         WHERE booking_id = $1 AND user_id = $2
         RETURNING booking_id as id, status`,
        [bookingId, userId]
      );
      return rows[0] || null;
    }
    return null;
  },

  async purchaseUserMembership({ id, userId, tenantId, planId, planName, tier, durationMonths, paymentMethod, amount }) {
    if (await checkPg()) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (Number(durationMonths) || 12));
      const sDateStr = startDate.toISOString().split('T')[0];
      const eDateStr = endDate.toISOString().split('T')[0];

      const { rows } = await pool.query(
        `INSERT INTO user_memberships (id, user_id, tenant_id, plan_id, plan_name, tier, start_date, end_date, status, payment_method, amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Active', $9, $10)
         RETURNING id, user_id as "userId", tenant_id as "clubId", plan_id as "planId", plan_name as "planName", tier, start_date::text as "startDate", end_date::text as "endDate", status, payment_method as "paymentMethod", amount, created_at as "createdAt"`,
        [id, userId, tenantId, planId, planName, tier || 'Standard', sDateStr, eDateStr, paymentMethod || 'UPI', amount || 0]
      );
      return rows[0];
    }
    return null;
  },

  async getUserMemberships(userId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT um.id, um.user_id as "userId", um.tenant_id as "clubId",
                um.plan_id as "planId", um.plan_name as "planName", um.tier,
                um.start_date::text as "startDate", um.end_date::text as "endDate",
                um.status, um.payment_method as "paymentMethod", um.amount,
                t.club_name as "clubName", t.location as "clubLocation",
                um.created_at as "createdAt"
         FROM user_memberships um
         JOIN tenants t ON um.tenant_id = t.tenant_id
         WHERE um.user_id = $1
         ORDER BY um.created_at DESC`,
        [userId]
      );
      return rows;
    }
    return [];
  },

  async getFamilyMembers(userId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT id, user_id as "userId", name, relation, age, created_at as "createdAt"
         FROM family_members
         WHERE user_id = $1
         ORDER BY created_at ASC`,
        [userId]
      );
      return rows;
    }
    return [];
  },

  async addFamilyMember({ id, userId, name, relation, age }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO family_members (id, user_id, name, relation, age)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, user_id as "userId", name, relation, age, created_at as "createdAt"`,
        [id, userId, name, relation, age || null]
      );
      return rows[0];
    }
    return null;
  },

  async deleteFamilyMember(id, userId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM family_members WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
      return rowCount > 0;
    }
    return false;
  },

  async addClubReview({ id, tenantId, userId, userName, rating, comment }) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO club_reviews (id, tenant_id, user_id, user_name, rating, comment)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, tenant_id as "clubId", user_id as "userId", user_name as "userName", rating, comment, created_at as "createdAt"`,
        [id, tenantId, userId || null, userName, rating, comment]
      );
      return rows[0];
    }
    return null;
  },

  async registerEventParticipant(eventId) {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE club_events
         SET registered_count = registered_count + 1
         WHERE event_id = $1
         RETURNING event_id as id, title, registered_count as "registeredCount", max_participants as "maxParticipants"`,
        [eventId]
      );
      return rows[0] || null;
    }
    return null;
  },

  /**
   * ==========================================
   * PLATFORM PLANS & RAZORPAY SUBSCRIPTIONS
   * ==========================================
   */
  async getPlatformPlans() {
    if (await checkPg()) {
      const { rows } = await pool.query(
        `SELECT 
           plan_id as "id",
           plan_id as "planId",
           name,
           tagline,
           monthly_price::numeric as "monthlyPrice",
           annual_price::numeric as "annualPrice",
           currency,
           features,
           is_popular as "isPopular",
           is_active as "isActive",
           max_courts as "maxCourts",
           max_members as "maxMembers",
           sort_order as "sortOrder",
           created_at as "createdAt"
         FROM platform_plans
         ORDER BY sort_order ASC, created_at ASC`
      );
      return rows;
    }
    return [];
  },

  async createPlatformPlan({ name, tagline, monthlyPrice, annualPrice, features, isPopular, maxCourts, maxMembers }) {
    const planId = 'plan_' + (name ? name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'custom') + '_' + Date.now().toString().slice(-4);
    const parsedFeatures = Array.isArray(features) ? features : [];
    if (await checkPg()) {
      const { rows } = await pool.query(
        `INSERT INTO platform_plans (
           plan_id, name, tagline, monthly_price, annual_price, features, is_popular, is_active, max_courts, max_members
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8, $9)
         RETURNING 
           plan_id as "id",
           plan_id as "planId",
           name,
           tagline,
           monthly_price::numeric as "monthlyPrice",
           annual_price::numeric as "annualPrice",
           features,
           is_popular as "isPopular",
           is_active as "isActive",
           max_courts as "maxCourts",
           max_members as "maxMembers"`,
        [
          planId,
          name,
          tagline || '',
          parseFloat(monthlyPrice) || 0,
          parseFloat(annualPrice) || 0,
          JSON.stringify(parsedFeatures),
          Boolean(isPopular),
          parseInt(maxCourts, 10) || 5,
          parseInt(maxMembers, 10) || 500,
        ]
      );
      return rows[0];
    }
    return null;
  },

  async updatePlatformPlan(planId, updates) {
    const { name, tagline, monthlyPrice, annualPrice, features, isPopular, isActive, maxCourts, maxMembers } = updates;
    if (await checkPg()) {
      const { rows } = await pool.query(
        `UPDATE platform_plans
         SET name = COALESCE($2, name),
             tagline = COALESCE($3, tagline),
             monthly_price = COALESCE($4, monthly_price),
             annual_price = COALESCE($5, annual_price),
             features = COALESCE($6, features),
             is_popular = COALESCE($7, is_popular),
             is_active = COALESCE($8, is_active),
             max_courts = COALESCE($9, max_courts),
             max_members = COALESCE($10, max_members),
             updated_at = CURRENT_TIMESTAMP
         WHERE plan_id = $1
         RETURNING 
           plan_id as "id",
           plan_id as "planId",
           name,
           tagline,
           monthly_price::numeric as "monthlyPrice",
           annual_price::numeric as "annualPrice",
           features,
           is_popular as "isPopular",
           is_active as "isActive",
           max_courts as "maxCourts",
           max_members as "maxMembers"`,
        [
          planId,
          name || null,
          tagline !== undefined ? tagline : null,
          monthlyPrice ? parseFloat(monthlyPrice) : null,
          annualPrice ? parseFloat(annualPrice) : null,
          features ? JSON.stringify(features) : null,
          isPopular !== undefined ? Boolean(isPopular) : null,
          isActive !== undefined ? Boolean(isActive) : null,
          maxCourts ? parseInt(maxCourts, 10) : null,
          maxMembers ? parseInt(maxMembers, 10) : null,
        ]
      );
      return rows[0] || null;
    }
    return null;
  },

  async deletePlatformPlan(planId) {
    if (await checkPg()) {
      const { rowCount } = await pool.query(
        `DELETE FROM platform_plans WHERE plan_id = $1`,
        [planId]
      );
      return rowCount > 0;
    }
    return false;
  },

  async processPlanPayment({ tenantId, planId, billingCycle, razorpayPaymentId, razorpayOrderId }) {
    if (await checkPg()) {
      // 1. Get plan details
      const planRes = await pool.query(
        `SELECT * FROM platform_plans WHERE plan_id = $1`,
        [planId]
      );
      if (planRes.rows.length === 0) {
        throw new Error('Selected platform plan not found');
      }
      const plan = planRes.rows[0];

      // 2. Get tenant details
      const tenantRes = await pool.query(
        `SELECT * FROM tenants WHERE tenant_id = $1`,
        [tenantId]
      );
      if (tenantRes.rows.length === 0) {
        throw new Error('Club tenant record not found');
      }
      const tenant = tenantRes.rows[0];

      const isAnnual = (billingCycle || '').toLowerCase() === 'annual' || (billingCycle || '').toLowerCase() === 'annually';
      const baseAmount = isAnnual ? parseFloat(plan.annual_price) : parseFloat(plan.monthly_price);
      const gstRate = 18.00;
      const gstAmount = Math.round(baseAmount * 0.18 * 100) / 100;
      const totalAmount = Math.round((baseAmount + gstAmount) * 100) / 100;

      // 3. Update tenant subscription
      await pool.query(
        `UPDATE tenants
         SET subscription_plan = $2,
             status = 'Active'
         WHERE tenant_id = $1`,
        [tenantId, plan.name]
      );

      // 4. Record new paid invoice in platform_invoices
      const invoiceId = 'inv_' + Date.now();
      const invoiceNumber = 'INV-PNX-' + Math.floor(100000 + Math.random() * 900000);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const currentMonth = months[new Date().getMonth()] + ' ' + new Date().getFullYear();

      const { rows: invRows } = await pool.query(
        `INSERT INTO platform_invoices (
           invoice_id, tenant_id, invoice_number, billing_month, plan_name, subdomain,
           base_amount, gst_rate, gst_amount, total_amount, billing_cycle, payment_status,
           payment_method, invoice_date, due_date, paid_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Paid', $12, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', CURRENT_TIMESTAMP)
         RETURNING *`,
        [
          invoiceId,
          tenantId,
          invoiceNumber,
          currentMonth,
          plan.name,
          tenant.subdomain || tenant.club_name.toLowerCase().replace(/\s+/g, '-'),
          baseAmount,
          gstRate,
          gstAmount,
          totalAmount,
          isAnnual ? 'Annual' : 'Monthly',
          `Razorpay (${razorpayPaymentId || 'rzp_paid_' + Date.now().toString().slice(-6)})`,
        ]
      );

      return {
        invoice: invRows[0],
        plan: plan.name,
        tenantId,
        billingCycle: isAnnual ? 'Annual' : 'Monthly',
        amount: totalAmount,
      };
    }
    return null;
  },
};

export default dbService;
