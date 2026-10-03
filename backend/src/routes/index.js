import express from 'express';
import authRoutes from './auth.routes.js';
import rolesRoutes from './roles.routes.js';
import clubsRoutes from './clubs.routes.js';

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

// Mount Authentication, RBAC, and Clubs Routes
router.use('/auth', authRoutes);
router.use('/rbac', rolesRoutes);
router.use('/clubs', clubsRoutes);

export default router;
