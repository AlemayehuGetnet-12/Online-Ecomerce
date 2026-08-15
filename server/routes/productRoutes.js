import express from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestSelling,
  getOnSaleProducts,
  getRelatedProducts,
  getLowStock,
  updateStock,
  getAllProductsAdmin,
} from '../controllers/productController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── Static / admin routes MUST come before /:id to avoid being swallowed ──
router.get('/admin/all',       protect, adminOnly, getAllProductsAdmin)
router.get('/admin/low-stock', protect, adminOnly, getLowStock)

// Public routes
router.get('/',              getProducts)
router.get('/featured',      getFeaturedProducts)
router.get('/best-selling',  getBestSelling)
router.get('/on-sale',       getOnSaleProducts)

// Parameterized routes AFTER static ones
router.get('/:id',         getProduct)
router.get('/:id/related', getRelatedProducts)

// Admin write routes
router.post('/',           protect, adminOnly, createProduct)
router.put('/:id/stock',   protect, adminOnly, updateStock)
router.put('/:id',         protect, adminOnly, updateProduct)
router.delete('/:id',      protect, adminOnly, deleteProduct)

export default router
