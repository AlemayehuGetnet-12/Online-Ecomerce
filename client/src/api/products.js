import api from './client'

// Get all products (with optional query params for filtering/pagination)
export const getProducts = async (params) => {
  const { data } = await api.get('/products', { params })
  return data.products || data || []
}

// Get a single product by ID
export const getProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data.product || data
}

// Get featured products
export const getFeaturedProducts = async () => {
  const { data } = await api.get('/products/featured')
  return data.products || data || []
}

// Get best-selling products
export const getBestSellingProducts = async () => {
  const { data } = await api.get('/products/best-selling')
  return data.products || data || []
}

// Get products on sale
export const getOnSaleProducts = async () => {
  const { data } = await api.get('/products/on-sale')
  return data.products || data || []
}

// Get related products
export const getRelatedProducts = async (id) => {
  const { data } = await api.get(`/products/${id}/related`)
  return data.products || data || []
}

// Admin: Create product
export const createProduct = async (productData) => {
  const { data } = await api.post('/products', productData)
  return data.product || data
}

// Admin: Update product
export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData)
  return data.product || data
}

// Admin: Delete product
export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`)
  return data
}

// Admin: Update stock
export const updateProductStock = async (id, stock) => {
  const { data } = await api.put(`/products/${id}/stock`, { stock })
  return data
}

// Admin: Get low-stock products
export const getLowStockProducts = async (threshold) => {
  const { data } = await api.get('/products/admin/low-stock', { params: { threshold } })
  return data.products || data || []
}