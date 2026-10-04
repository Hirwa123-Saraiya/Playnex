import { dbService } from '../data/dbService.js';
import { errorResponse } from '../utils/apiResponse.js';
import { hasActiveAccess } from '../services/trialService.js';

/**
 * Blocks the request if the user's trial has ended AND they have no paid plan.
 * Attach this to any endpoint that consumes a paid service:
 *   - POST /user/bookings
 *   - POST /user/memberships/purchase (should be allowed — they're buying)
 *   - POST /front-desk/walk-in (front-desk staff bypass via role)
 *
 * Super-admin / club-owner / staff always pass.
 */
export async function requireActiveMembership(req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    /* Staff bypass */
    if (['SUPER_ADMIN', 'CLUB_OWNER', 'STAFF', 'SUPPORT_ADMIN'].includes(user.system_role)) {
      return next();
    }

    /* Count paid memberships — teammate will provide this method */
    let paidPlanCount = 0;
    if (typeof dbService.countActiveMembershipsByUser === 'function') {
      paidPlanCount = await dbService.countActiveMembershipsByUser(user.userId);
    }

    /* Fetch the full user row so we can read trial_ends_at */
    const dbUser = await dbService.findUserById(user.userId);
    const allowed = hasActiveAccess(dbUser, paidPlanCount);

    if (!allowed) {
      return errorResponse(
        res,
        'Your free trial has ended. Choose a plan to continue booking.',
        403,
        { code: 'TRIAL_EXPIRED' }
      );
    }

    next();
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}
