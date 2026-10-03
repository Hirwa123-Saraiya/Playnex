import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getRestaurantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getRestaurantOrders,
  createRestaurantOrder,
} from '../controllers/restaurant.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/menu', getRestaurantMenu);
router.post('/menu', createMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

router.get('/orders', getRestaurantOrders);
router.post('/orders', createRestaurantOrder);

export default router;
