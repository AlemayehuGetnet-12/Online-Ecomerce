import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)

  const loadWishlist = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/auth/wishlist')
      setWishlist(data.wishlist || [])
    } catch (error) {
      console.error('Failed to load wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist()
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWishlist([])
    }
  }, [isAuthenticated])

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist')
      return
    }

    try {
      const { data } = await axios.post(`/api/auth/wishlist/${productId}`)
      setWishlist(data.wishlist || [])
      toast.success('Added to wishlist')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist')
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/auth/wishlist/${productId}`)
      setWishlist(data.wishlist || [])
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist')
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId)
  }

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}