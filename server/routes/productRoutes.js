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

// Public routes
router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/best-selling', getBestSelling)
router.get('/on-sale', getOnSaleProducts)
router.get('/:id', getProduct)
router.get('/:id/related', getRelatedProducts)

// Admin routes
router.get('/admin/all',       protect, adminOnly, getAllProductsAdmin)
router.get('/admin/low-stock', protect, adminOnly, getLowStock)
router.post('/',               protect, adminOnly, createProduct)
router.put('/:id',             protect, adminOnly, updateProduct)
router.put('/:id/stock',       protect, adminOnly, updateStock)
router.delete('/:id',          protect, adminOnly, deleteProduct)

export default router
