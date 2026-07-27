import express from 'express'
import {
  getSalesReport,
  getRevenueReport,
  getProductReport,
  getCustomerReport,
  getDashboardSummary,
} from '../controllers/reportController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// All report routes are admin-only
router.use(protect, adminOnly)

router.get('/dashboard', getDashboardSummary)
router.get('/sales',     getSalesReport)
router.get('/revenue',   getRevenueReport)
router.get('/products',  getProductReport)
router.get('/customers', getCustomerReport)

export default router
