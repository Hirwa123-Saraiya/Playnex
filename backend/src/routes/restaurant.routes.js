import express from 'express';
import { authenticate, protectStation } from '../middlewares/auth.middleware.js';
import {
  getRestaurantOverview,
  getRestaurantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getRestaurantOrders,
  createRestaurantOrder,
  updateOrderStatus,
  getRestaurantTables,
} from '../controllers/restaurant.controller.js';

const router = express.Router();

// All restaurant & bar routes require authentication
router.use(authenticate);

// Overview available to authenticated club managers/owners & F&B staff
router.get('/overview', getRestaurantOverview);
router.get('/menu', getRestaurantMenu);
router.get('/tables', protectStation('Bar & Kitchen', 'Restaurant & Bar', 'bar', 'kitchen'), getRestaurantTables);

// Actions require authentication and F&B station permissions
router.post('/menu', protectStation('Bar & Kitchen', 'Restaurant & Bar', 'bar', 'kitchen'), createMenuItem);
router.put('/menu/:id', protectStation('Bar & Kitchen', 'Restaurant & Bar', 'bar', 'kitchen'), updateMenuItem);
router.delete('/menu/:id', protectStation('Bar & Kitchen', 'Restaurant & Bar', 'bar', 'kitchen'), deleteMenuItem);

router.get('/orders', protectStation('Bar & Kitchen', 'Restaurant & Bar', 'bar', 'kitchen'), getRestaurantOrders);
router.post('/orders', protectStation('Bar & Kitchen', 'Restaurant & Bar', 'bar', 'kitchen'), createRestaurantOrder);
router.put('/orders/:id/status', protectStation('Bar & Kitchen', 'Restaurant & Bar', 'bar', 'kitchen'), updateOrderStatus);

export default router;
