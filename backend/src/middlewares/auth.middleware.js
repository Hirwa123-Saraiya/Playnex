import jwt from 'jsonwebtoken';
import { config } from '../config/appConfig.js';
import { db } from '../data/db.js';
import { dbService } from '../data/dbService.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Authentication Middleware:
 * Validates accessToken from HTTP-only cookies (or Bearer header fallback)
 * and attaches user context (tenant, dynamic role, permissions) to req.user.
 */
export async function authenticate(req, res, next) {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return errorResponse(res, 'Authentication required. No access token provided in cookies.', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = (await dbService.findUserById(decoded.userId)) || db.users.find((u) => u.user_id === decoded.userId && u.is_active);
    if (!user) {
      return errorResponse(res, 'User session invalid or deactivated.', 401);
    }

    // Resolve tenant details
    const tenantName = user.tenant_name || (user.tenant_id ? (db.tenants.find((t) => t.tenant_id === user.tenant_id)?.club_name || 'Sports Club') : 'Platform Wide');

    // Resolve dynamic role & permissions
    let roleName = user.system_role;
    let permissions = [];

    if (user.system_role === 'SUPER_ADMIN') {
      permissions = db.permissions.map((p) => p.permission_id);
      roleName = 'Super Administrator';
    } else if (user.system_role === 'CLUB_OWNER') {
      permissions = db.permissions.map((p) => p.permission_id);
      roleName = 'Club Owner';
    } else if (user.system_role === 'STAFF' && user.role_id) {
      const dynamicRole = db.roles.find((r) => r.role_id === user.role_id && r.is_active);
      if (dynamicRole) {
        roleName = dynamicRole.name;
        permissions = dynamicRole.permissions || [];
      }
    } else if (user.system_role === 'MEMBER') {
      permissions = ['courts:view', 'courts:book', 'shop:view', 'bar:view'];
      roleName = `Club Member (${user.tier || 'Standard'})`;
    }

    req.user = {
      userId: user.user_id,
      email: user.email,
      name: user.name,
      systemRole: user.system_role,
      roleName,
      tenantId: user.tenant_id,
      tenantName,
      roleId: user.role_id,
      tier: user.tier,
      permissions,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Access token expired.', 401, ['TOKEN_EXPIRED']);
    }
    return errorResponse(res, 'Invalid authentication token.', 401);
  }
}

/**
 * Optional Authentication Middleware:
 * Inspects accessToken if provided, attaches req.user if valid, but does not block guests.
 */
export async function optionalAuthenticate(req, res, next) {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = (await dbService.findUserById(decoded.userId)) || (db.users && db.users.find((u) => u.user_id === decoded.userId && u.is_active));
    if (user) {
      const tenantName = user.tenant_name || (user.tenant_id ? (db.tenants?.find((t) => t.tenant_id === user.tenant_id)?.club_name || 'Sports Club') : 'Platform Wide');
      let roleName = user.system_role;
      let permissions = [];

      if (user.system_role === 'SUPER_ADMIN') {
        permissions = db.permissions ? db.permissions.map((p) => p.permission_id) : [];
        roleName = 'Super Administrator';
      } else if (user.system_role === 'CLUB_OWNER') {
        permissions = db.permissions ? db.permissions.map((p) => p.permission_id) : [];
        roleName = 'Club Owner';
      } else if (user.system_role === 'MEMBER') {
        permissions = ['courts:view', 'courts:book', 'shop:view', 'bar:view'];
        roleName = `Club Member (${user.tier || 'Standard'})`;
      }

      req.user = {
        userId: user.user_id,
        email: user.email,
        name: user.name,
        systemRole: user.system_role,
        roleName,
        tenantId: user.tenant_id,
        tenantName,
        roleId: user.role_id,
        tier: user.tier,
        permissions,
      };
    }
    next();
  } catch (err) {
    // Silent next for optional auth
    next();
  }
}

/**
 * Role-Based Access Guard
 */
export function requireSystemRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }
    if (!allowedRoles.includes(req.user.systemRole)) {
      return errorResponse(
        res,
        `Access denied. Requires one of [${allowedRoles.join(', ')}] role.`,
        403
      );
    }
    next();
  };
}

/**
 * Dynamic Permission Guard
 */
export function requirePermission(permissionId) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }
    if (req.user.systemRole === 'SUPER_ADMIN' || req.user.systemRole === 'CLUB_OWNER') {
      return next();
    }
    if (!req.user.permissions || !req.user.permissions.includes(permissionId)) {
      return errorResponse(
        res,
        `Forbidden. Missing required dynamic permission: ${permissionId}`,
        403
      );
    }
    next();
  };
}
