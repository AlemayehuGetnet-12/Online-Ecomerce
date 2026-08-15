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
  getAllUsers,
  setUserStatus,
} from '../controllers/authController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public
router.post('/register', register)
router.post('/login',    login)

// Protected
router.get('/me',              protect, getMe)
router.put('/profile',         protect, updateProfile)
router.put('/change-password', protect, changePassword)

// Wishlist
router.get('/wishlist',               protect, getWishlist)
router.post('/wishlist/:productId',   protect, addToWishlist)
router.delete('/wishlist/:productId', protect, removeFromWishlist)

// Admin — user management
router.get('/users',            protect, adminOnly, getAllUsers)
router.put('/users/:id/status', protect, adminOnly, setUserStatus)

export default router
