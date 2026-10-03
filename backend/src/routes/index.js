import express from 'express';
import authRoutes from './auth.routes.js';
import rolesRoutes from './roles.routes.js';
import clubsRoutes from './clubs.routes.js';
import plansRoutes from './plans.routes.js';
import facilitiesRoutes from './facilities.routes.js';
import bookingsRoutes from './bookings.routes.js';
import membersRoutes from './members.routes.js';
import staffRoutes from './staff.routes.js';
import eventsRoutes from './events.routes.js';
import membershipPlansRoutes from './membershipPlans.routes.js';
import restaurantRoutes from './restaurant.routes.js';
import approvalsRoutes from './approvals.routes.js';
import communicationsRoutes from './communications.routes.js';
import clubSettingsRoutes from './clubSettings.routes.js';
import financeRoutes from './finance.routes.js';
import proShopRoutes from './pro_shop.routes.js';

// User Portal Modular Sections
import userClubsRoutes from './userClubs.routes.js';
import userFacilitiesRoutes from './userFacilities.routes.js';
import userBookingsRoutes from './userBookings.routes.js';
import userMembershipsRoutes from './userMemberships.routes.js';
import userEventsRoutes from './userEvents.routes.js';
import userProfileRoutes from './userProfile.routes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      service: 'The Champions Club Multi-Tenant API',
      timestamp: new Date().toISOString(),
    },
    message: 'Backend API is operational',
  });
});

// Authentication & Super Admin RBAC
router.use('/auth', authRoutes);
router.use('/rbac', rolesRoutes);
router.use('/clubs', clubsRoutes);
router.use('/plans', plansRoutes);

// Club Modular Sections
router.use('/club/facilities', facilitiesRoutes);
router.use('/club/bookings', bookingsRoutes);
router.use('/club/members', membersRoutes);
router.use('/club/staff', staffRoutes);
router.use('/club/events', eventsRoutes);
router.use('/club/plans', membershipPlansRoutes);
router.use('/club/restaurant', restaurantRoutes);
router.use('/club/approvals', approvalsRoutes);
router.use('/club/communications', communicationsRoutes);
router.use('/club/settings', clubSettingsRoutes);
router.use('/club/finance', financeRoutes);
router.use('/finance', financeRoutes);
router.use('/club/pro-shop', proShopRoutes);
router.use('/pro-shop', proShopRoutes);
router.use('/restaurant', restaurantRoutes);

// User / Customer Portal Modular Sections
router.use('/user/clubs', userClubsRoutes);
router.use('/user/facilities', userFacilitiesRoutes);
router.use('/user/bookings', userBookingsRoutes);
router.use('/user/memberships', userMembershipsRoutes);
router.use('/user/events', userEventsRoutes);
router.use('/user/profile', userProfileRoutes);

export default router;
