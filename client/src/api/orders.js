import api from './client'

// Create a new order
export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData)
  return data.order || data
}

// Get current user's orders
export const getOrders = async (params) => {
  const { data } = await api.get('/orders/my-orders', { params })
  return data.orders || data || []
}

// Get a single order by ID
export const getOrder = async (id) => {
  const { data } = await api.get(`/orders/${id}`)
  return data.order || data
}

// Cancel an order
export const cancelOrder = async (id, reason) => {
  const { data } = await api.put(`/orders/${id}/cancel`, { cancelReason: reason })
  return data.order || data
}

// Admin: Get all orders
export const getAllOrders = async (params) => {
  const { data } = await api.get('/orders', { params })
  return data.orders || data || []
}

// Admin: Update order status
export const updateOrderStatus = async (id, statusData) => {
  const { data } = await api.put(`/orders/${id}/status`, statusData)
  return data.order || data
}

// Admin: Get order statistics
export const getOrderStats = async () => {
  const { data } = await api.get('/orders/stats')
  return data
}