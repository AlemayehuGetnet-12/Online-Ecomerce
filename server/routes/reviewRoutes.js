import express from 'express'
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getAllReviewsAdmin,
} from '../controllers/reviewController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/product/:productId', getProductReviews)
router.post('/',           protect, createReview)
router.get('/my-reviews',  protect, getMyReviews)
router.put('/:id',         protect, updateReview)
router.delete('/:id',      protect, deleteReview)
// Admin
router.get('/admin/all',   protect, adminOnly, getAllReviewsAdmin)

export default router
