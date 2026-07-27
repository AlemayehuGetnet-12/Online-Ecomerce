import express from 'express'
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
} from '../controllers/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/product/:productId', getProductReviews)

// Protected routes
router.post('/', protect, createReview)
router.get('/my-reviews', protect, getMyReviews)
router.put('/:id', protect, updateReview)
router.delete('/:id', protect, deleteReview)

export default router
