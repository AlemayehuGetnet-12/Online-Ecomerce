import api from './client'

// Register a new user
export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData)
  return data
}

// Login user
export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

// Get current user
export const getMe = async () => {
  const { data } = await api.get('/auth/me')
  return data.user
}

// Update profile
export const updateProfile = async (profileData) => {
  const { data } = await api.put('/auth/profile', profileData)
  return data.user
}

// Change password
export const changePassword = async (passwordData) => {
  const { data } = await api.put('/auth/change-password', passwordData)
  return data
}

// Get wishlist
export const getWishlist = async () => {
  const { data } = await api.get('/auth/wishlist')
  return data.wishlist
}

// Add to wishlist
export const addToWishlist = async (productId) => {
  const { data } = await api.post(`/auth/wishlist/${productId}`)
  return data.wishlist
}

// Remove from wishlist
export const removeFromWishlist = async (productId) => {
  const { data } = await api.delete(`/auth/wishlist/${productId}`)
  return data.wishlist
}