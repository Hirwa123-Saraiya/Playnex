import express from 'express';
import { authenticate, protectStation } from '../middlewares/auth.middleware.js';
import {
  getFinanceData,
  getFinanceInvoices,
  createFinanceInvoice,
  getGstReport,
  getFinanceExpenses,
  createFinanceExpense,
} from '../controllers/finance.controller.js';

const router = express.Router();

// All finance routes require authentication
router.use(authenticate);

// Overview available to authenticated club managers/owners & finance staff
router.get('/', getFinanceData);
router.get('/overview', getFinanceData);

// Operational workstation endpoints protected by Finance station
router.get('/invoices', protectStation('Finance', 'Accounting', 'finance'), getFinanceInvoices);
router.post('/invoices', protectStation('Finance', 'Accounting', 'finance'), createFinanceInvoice);
router.get('/gst-report', protectStation('Finance', 'Accounting', 'finance'), getGstReport);
router.get('/expenses', protectStation('Finance', 'Accounting', 'finance'), getFinanceExpenses);
router.post('/expenses', protectStation('Finance', 'Accounting', 'finance'), createFinanceExpense);

export default router;
