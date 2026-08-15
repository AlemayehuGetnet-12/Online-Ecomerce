import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [loading,  setLoading]  = useState(false)

  const loadWishlist = async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const { data } = await api.get('/auth/wishlist')
      setWishlist(data.wishlist || [])
    } catch {
      // silent — wishlist is non-critical
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist()
    } else {
      setWishlist([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save items to your wishlist')
      return
    }
    try {
      const { data } = await api.post(`/auth/wishlist/${productId}`)
      setWishlist(data.wishlist || [])
      toast.success('Added to wishlist')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist')
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await api.delete(`/auth/wishlist/${productId}`)
      setWishlist(data.wishlist || [])
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist')
    }
  }

  const isInWishlist = (productId) =>
    wishlist.some(item =>
      (item._id || item) === productId ||
      (item._id?.toString?.() || item?.toString?.()) === productId?.toString?.()
    )

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}
