import express from 'express';
import { authenticate, protectStation } from '../middlewares/auth.middleware.js';
import {
  getProShopOverview,
  getProShopItems,
  createProShopItem,
  updateProShopItem,
  deleteProShopItem,
  updateProShopStock,
  createProShopSale,
  getProShopSales,
} from '../controllers/pro_shop.controller.js';

const router = express.Router();

// All Pro Shop routes require authentication
router.use(authenticate);

// Overview available to authenticated club managers/owners & pro shop staff
router.get('/overview', getProShopOverview);

// Catalog items management
router.get('/items', protectStation('Pro Shop', 'Inventory', 'shop'), getProShopItems);
router.post('/items', protectStation('Pro Shop', 'Inventory', 'shop'), createProShopItem);
router.put('/items/:id', protectStation('Pro Shop', 'Inventory', 'shop'), updateProShopItem);
router.delete('/items/:id', protectStation('Pro Shop', 'Inventory', 'shop'), deleteProShopItem);
router.put('/items/:id/stock', protectStation('Pro Shop', 'Inventory', 'shop'), updateProShopStock);

// POS & Sales audit
router.post('/pos/checkout', protectStation('Pro Shop', 'Inventory', 'shop'), createProShopSale);
router.get('/sales', protectStation('Pro Shop', 'Inventory', 'shop'), getProShopSales);

export default router;
