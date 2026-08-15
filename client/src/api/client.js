import axios from 'axios'

// Use VITE_API_URL in production (Vercel → Render), fall back to localhost in dev
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token automatically
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

// Handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
    }
    if (error.response) {
      console.error('API Error:', error.response.data)
    } else {
      console.error('Network Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
