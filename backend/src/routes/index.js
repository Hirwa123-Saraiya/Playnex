import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      service: 'The Champions Club API',
      timestamp: new Date().toISOString()
    },
    message: 'Backend API is operational'
  });
});

export default router;
