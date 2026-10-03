import express from 'express';
import {
  getProShopOverview,
  getProShopItems,
  createProShopItem,
  updateProShopStock,
  createProShopSale,
} from '../controllers/pro_shop.controller.js';

const router = express.Router();

router.get('/overview', getProShopOverview);
router.get('/items', getProShopItems);
router.post('/items', createProShopItem);
router.put('/items/:id/stock', updateProShopStock);
router.post('/pos/checkout', createProShopSale);

export default router;
