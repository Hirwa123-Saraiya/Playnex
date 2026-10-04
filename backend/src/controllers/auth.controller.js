import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dbService } from '../data/dbService.js';
import { buildDefaultStaff } from '../data/defaultWorkstations.js';
import { config, cookieOptions } from '../config/appConfig.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
//trail
import { computeTrialWindow, buildTrialProfile } from '../services/trialService.js';

// Helper to generate access and refresh tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    {
      userId: user.user_id,
      email: user.email,
      systemRole: user.system_role,
      tenantId: user.tenant_id,
    },
    config.jwtSecret,
    { expiresIn: config.accessExpiresIn }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.user_id,
    },
    config.jwtRefreshSecret,
    { expiresIn: config.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
}

// Helper to set HTTP-only cookies
function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// Helper to clear HTTP-only cookies
function clearAuthCookies(res) {
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
}

// Helper to build sanitized user profile
// async function buildUserProfile(user) {
//   const permissions = await dbService.getUserPermissions(user.user_id, user.system_role);

//   return {
//     userId: user.user_id,
//     email: user.email,
//     name: user.name,
//     systemRole: user.system_role,
//     tenantId: user.tenant_id,
//     tenantName: user.tenant_name || (user.tenant_id ? 'Sports Club' : 'Platform Wide'),
//     roleId: user.dynamic_role_id || user.role_id || null,
//     roleName: user.role_name || (user.system_role === 'SUPER_ADMIN' ? 'Super Administrator' : user.system_role === 'CLUB_OWNER' ? 'Club Owner' : user.system_role),
//     tier: user.tier,
//     permissions,
//   };
// }

//with trial
async function buildUserProfile(user) {
  const permissions = await dbService.getUserPermissions(user.user_id, user.system_role);
  const trial = buildTrialProfile(user);
  const effectivePermissions = Array.isArray(user.role_permissions) && user.role_permissions.length > 0
    ? user.role_permissions
    : permissions;

  return {
    userId: user.user_id,
    email: user.email,
    name: user.name,
    systemRole: user.system_role,
    tenantId: user.tenant_id,
    tenantName: user.tenant_name || (user.tenant_id ? 'Sports Club' : 'Platform Wide'),
    roleId: user.dynamic_role_id || user.role_id || null,
    roleName: user.role_name || (user.system_role === 'SUPER_ADMIN' ? 'Super Administrator' : user.system_role === 'CLUB_OWNER' ? 'Club Owner' : user.system_role),
    targetModule: user.target_module || null,
    tier: user.tier,
    age: user.age ?? null,
    membershipPlan: user.system_role === 'MEMBER' ? `${user.tier || 'Silver'} Trial` : null,
    permissions: effectivePermissions,

    /* Trial fields */
    trialStartedAt: trial.trialStartedAt,
    trialEndsAt:    trial.trialEndsAt,
    trialUsed:      trial.trialUsed,
    trialActive:    trial.trialActive,
    trialDaysLeft:  trial.trialDaysLeft,
  };
}

/**
 * Register User (Club Owner Tenant OR Member User) - 100% Dynamic
 */
export async function register(req, res) {
  try {
    const { email, password, name, type, clubName, tier, age, phone } = req.body;

    if (!email || !password || !name) {
      return errorResponse(res, 'Email, password, and name are required', 400);
    }

    const existing = await dbService.findUserByEmail(email);
    if (existing) {
      return errorResponse(res, 'An account with this email already exists', 409);
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = `user_${Date.now()}`;
    let tenantId = null;

    if (type === 'CLUB_OWNER') {
      tenantId = `tenant_${Date.now()}`;
      const resolvedClubName = clubName || `${name}'s Sports Club`;
      await dbService.createTenant({
        tenantId,
        clubName: resolvedClubName,
        subdomain: (clubName || name).toLowerCase().replace(/[^a-z0-9]/g, '-'),
        subscriptionPlan: 'Free Trial',
      });

      await dbService.createUser({
        userId,
        tenantId,
        name,
        email,
        passwordHash,
        systemRole: 'CLUB_OWNER',
        tier: null,
      });

      await dbService.provisionDefaultStaff({
        tenantId,
        passwordHash: bcrypt.hashSync('Playnex@2026', 10),
        staff: buildDefaultStaff(resolvedClubName),
      });
    } else {
      // Member registration
      const memberAge = Number(age);
      if (!Number.isInteger(memberAge) || memberAge < 5 || memberAge > 99) {
        return errorResponse(res, 'A valid age between 5 and 99 is required for member registration', 400);
      }
      const memberTier = memberAge < 18 ? 'Junior' : memberAge < 40 ? 'Silver' : 'Gold';
      // await dbService.createUser({
      //   userId,
      //   tenantId: null,
      //   name,
      //   email,
      //   passwordHash,
      //   systemRole: 'MEMBER',
      //   tier: tier || 'Silver',
      // });
      //trail
      const { startedAt, endsAt } = computeTrialWindow();

      await dbService.createUser({
        userId,
        tenantId: null,
        name,
        email,
        passwordHash,
        systemRole: 'MEMBER',
        tier: memberTier,
        age: memberAge,
        phone: phone?.trim() || null,
        trialStartedAt: startedAt,
        trialEndsAt: endsAt,
        trialUsed: true,
      });
    }

    const user = await dbService.findUserById(userId);
    const { accessToken, refreshToken } = generateTokens(user);
    setAuthCookies(res, accessToken, refreshToken);

    const userProfile = await buildUserProfile(user);
    return successResponse(
      res,
      {
        user: userProfile,
        accessToken,
        refreshToken,
      },
      'Registration successful',
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

/**
 * Login with Email and Password - 100% Dynamic
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const user = await dbService.findUserByEmail(email);
    if (!user || !user.is_active) {
      return errorResponse(res, 'Invalid email or password credentials', 401);
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return errorResponse(res, 'Invalid email or password credentials', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user);
    setAuthCookies(res, accessToken, refreshToken);

    const userProfile = await buildUserProfile(user);
    return successResponse(
      res,
      {
        user: userProfile,
        accessToken,
        refreshToken,
      },
      'Login successful'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
}

/**
 * Refresh Access Token using Refresh Token from Cookies or Request Body/Header
 */
export async function refresh(req, res) {
  try {
    let refreshToken =
      req.body?.refreshToken ||
      req.cookies?.refreshToken ||
      req.headers['x-refresh-token'];

    if (!refreshToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const candidate = authHeader.split(' ')[1];
        try {
          jwt.verify(candidate, config.jwtRefreshSecret);
          refreshToken = candidate;
        } catch {
          // Candidate in Authorization header was not a refresh token
        }
      }
    }

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token not found in request body, cookies, or headers', 401);
    }

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    const user = await dbService.findUserById(decoded.userId);

    if (!user || !user.is_active) {
      clearAuthCookies(res);
      return errorResponse(res, 'User session invalid', 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    setAuthCookies(res, accessToken, newRefreshToken);

    const userProfile = await buildUserProfile(user);
    return successResponse(
      res,
      {
        user: userProfile,
        accessToken,
        refreshToken: newRefreshToken,
      },
      'Token refreshed successfully'
    );
  } catch (error) {
    clearAuthCookies(res);
    return errorResponse(res, 'Invalid or expired refresh token', 401);
  }
}

/**
 * Logout and clear cookies
 */
export async function logout(req, res) {
  clearAuthCookies(res);
  return successResponse(res, null, 'Logged out successfully');
}

/**
 * Get Current Authenticated Profile
 */
export async function getMe(req, res) {
  return successResponse(res, req.user, 'Profile retrieved');
}
