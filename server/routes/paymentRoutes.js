import express from 'express'
import {
  createTelebirrPaymentController,
  verifyTelebirrPaymentController,
  createCBEBirrPaymentController,
  verifyCBEBirrPaymentController,
  getPaymentHistory,
  getAllPayments,
  updatePaymentStatus,
} from '../controllers/paymentController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// Telebirr payment routes
router.post('/telebirr/create', protect, createTelebirrPaymentController)
router.post('/telebirr/verify', protect, verifyTelebirrPaymentController)

// CBE Birr payment routes
router.post('/cbebirr/create', protect, createCBEBirrPaymentController)
router.post('/cbebirr/verify', protect, verifyCBEBirrPaymentController)

// Payment history
router.get('/history', protect, getPaymentHistory)

// Admin routes
router.get('/', protect, adminOnly, getAllPayments)
router.put('/:id', protect, adminOnly, updatePaymentStatus)

export default router
