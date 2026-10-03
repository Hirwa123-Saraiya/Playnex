import bcrypt from 'bcryptjs';
import { dbService } from '../data/dbService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * List all Clubs/Tenants directly from database
 */
export async function getClubs(req, res) {
  try {
    const clubs = await dbService.getTenants();
    return successResponse(res, clubs, 'Clubs fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * Platform-wide aggregated stats for Super Admin directly from database
 */
export async function getPlatformStats(req, res) {
  try {
    const stats = await dbService.getPlatformStats();
    return successResponse(res, stats, 'Platform stats fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * List all Club Admins directly from database
 */
export async function getClubAdmins(req, res) {
  try {
    const admins = await dbService.getAdmins();
    return successResponse(res, admins, 'Admins fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * List all Members / End Users directly from database
 */
export async function getClubUsers(req, res) {
  try {
    const users = await dbService.getClubUsers();
    return successResponse(res, users, 'Users fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * Platform Revenue breakdown directly from database
 */
export async function getRevenue(req, res) {
  try {
    const revenueByClub = await dbService.getRevenueData();
    return successResponse(res, { revenueByClub }, 'Revenue data fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * Single Club details by Tenant ID directly from database
 */
export async function getClubById(req, res) {
  try {
    const { id } = req.params;
    const club = await dbService.getClubDetails(id);
    if (!club) {
      return errorResponse(res, 'Club not found', 404);
    }
    return successResponse(res, club, 'Club details fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * Update an existing Club/Tenant (Super Admin)
 */
export async function updateClub(req, res) {
  try {
    const { id } = req.params;
    const { clubName, sport, location, address, phone, status, subscriptionPlan } = req.body;

    const updated = await dbService.updateTenant(id, {
      clubName,
      sport,
      location,
      address,
      phone,
      status,
      subscriptionPlan,
    });

    if (!updated) {
      return errorResponse(res, 'Club not found or update failed', 404);
    }

    return successResponse(res, updated, 'Club updated successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * Delete a Club/Tenant along with all associated resources (Super Admin)
 */
export async function deleteClub(req, res) {
  try {
    const { id } = req.params;
    const deleted = await dbService.deleteTenant(id);

    if (!deleted) {
      return errorResponse(res, 'Club not found or delete failed', 404);
    }

    return successResponse(res, { id }, 'Club deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}

/**
 * Create a new Club along with its Main Admin Account (Super Admin only)
 * Saves to PostgreSQL database
 */
export async function createClub(req, res) {
  try {
    const {
      clubName,
      subdomain,
      sport,
      location,
      address,
      subscriptionPlan,
      adminName,
      adminEmail,
      adminPassword,
      adminPhone,
    } = req.body;

    if (!clubName || !adminName || !adminEmail || !adminPassword) {
      return errorResponse(
        res,
        'Club name, admin name, admin work email, and admin password are required',
        400
      );
    }

    // Check if user email already taken
    const existingUser = await dbService.findUserByEmail(adminEmail);
    if (existingUser) {
      return errorResponse(res, 'An account with this admin email already exists', 409);
    }

    const tenantId = `tenant_${Date.now()}`;
    const userId = `user_${Date.now()}`;
    const cleanSubdomain = (subdomain || clubName)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // 1. Create the tenant in PostgreSQL
    await dbService.createTenant({
      tenantId,
      clubName,
      subdomain: cleanSubdomain,
      subscriptionPlan: subscriptionPlan || 'Standard',
      sport: sport || 'Multi-Sport',
      location: location || 'India',
      address: address || null,
      phone: adminPhone || null,
    });

    // 2. Hash admin password
    const passwordHash = bcrypt.hashSync(adminPassword, 10);

    // 3. Create Main Admin User with systemRole = 'CLUB_OWNER'
    await dbService.createUser({
      userId,
      tenantId,
      name: adminName,
      email: adminEmail,
      passwordHash,
      systemRole: 'CLUB_OWNER',
      tier: null,
    });

    // 4. Create standard initial departments for the club so it works dynamically
    const defaultDepts = [
      { name: 'Courts & Turf Arena', description: 'Court slots and bookings management' },
      { name: 'Bar & Restaurant', description: 'Food, beverages and member tabs' },
      { name: 'Pro Shop', description: 'Sports gear and retail' },
      { name: 'Finance & Memberships', description: 'Billing and member tiers' },
    ];

    for (const d of defaultDepts) {
      await dbService.createDepartment({
        departmentId: `dept_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        tenantId,
        name: d.name,
        description: d.description,
      });
    }

    const createdClub = {
      id: tenantId,
      name: clubName,
      subdomain: cleanSubdomain,
      sport: sport || 'Multi-Sport',
      location: location || 'India',
      status: 'Active',
      subscriptionPlan: subscriptionPlan || 'Standard',
      admin: {
        userId,
        name: adminName,
        email: adminEmail,
        phone: adminPhone || null,
        systemRole: 'CLUB_OWNER',
        roleName: 'Club Owner (Primary Admin)',
      },
      createdAt: new Date().toISOString(),
    };

    return successResponse(
      res,
      createdClub,
      'Club created successfully with main admin account',
      201
    );
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
