import express from 'express'
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)

// Wishlist routes
router.get('/wishlist', protect, getWishlist)
router.post('/wishlist/:productId', protect, addToWishlist)
router.delete('/wishlist/:productId', protect, removeFromWishlist)

export default router
