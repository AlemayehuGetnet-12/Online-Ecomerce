import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  getWishlist: () => api.get('/auth/wishlist'),
  addToWishlist: (productId) => api.post(`/auth/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/auth/wishlist/${productId}`),
}

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getBestSelling: () => api.get('/products/best-selling'),
  getOnSale: () => api.get('/products/on-sale'),
  getRelated: (id) => api.get(`/products/${id}/related`),
  // Admin
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  updateStock: (id, stock) => api.put(`/products/${id}/stock`, { stock }),
  getLowStock: (threshold) => api.get('/products/admin/low-stock', { params: { threshold } }),
  getAllAdmin: (params) => api.get('/products/admin/all', { params }),
}

// Category APIs
export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getOne: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { cancelReason: reason }),
  // Admin
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getStats: () => api.get('/orders/stats'),
}

// Payment APIs
export const paymentAPI = {
  createTelebirr: (data) => api.post('/payments/telebirr/create', data),
  verifyTelebirr: (transactionId) => api.post('/payments/telebirr/verify', { transactionId }),
  createCBEBirr: (data) => api.post('/payments/cbebirr/create', data),
  verifyCBEBirr: (transactionId) => api.post('/payments/cbebirr/verify', { transactionId }),
  getHistory: () => api.get('/payments/history'),
  // Admin
  getAll: (params) => api.get('/payments', { params }),
  updateStatus: (id, data) => api.put(`/payments/${id}`, data),
}

// Review APIs
export const reviewAPI = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  create:     (data)  => api.post('/reviews', data),
  update:     (id, data) => api.put(`/reviews/${id}`, data),
  delete:     (id)    => api.delete(`/reviews/${id}`),
  getMyReviews: ()    => api.get('/reviews/my-reviews'),
  getAllAdmin: (params) => api.get('/reviews/admin/all', { params }),
}

// Report APIs
export const reportAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getSales: (params) => api.get('/reports/sales', { params }),
  getRevenue: () => api.get('/reports/revenue'),
  getProducts: () => api.get('/reports/products'),
  getCustomers: () => api.get('/reports/customers'),
}

export default api
