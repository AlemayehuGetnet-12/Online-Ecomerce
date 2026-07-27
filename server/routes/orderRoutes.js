import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} from '../controllers/orderController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// Customer routes
router.post('/', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/stats', protect, adminOnly, getOrderStats)
router.get('/:id', protect, getOrder)
router.put('/:id/cancel', protect, cancelOrder)

// Admin routes
router.get('/', protect, adminOnly, getAllOrders)
router.put('/:id/status', protect, adminOnly, updateOrderStatus)

export default router
