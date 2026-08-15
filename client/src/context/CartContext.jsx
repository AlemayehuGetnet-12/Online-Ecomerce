import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id)
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > product.stock) {
          toast.error('Not enough stock available')
          return prevCart
        }
        toast.success('Cart updated')
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        )
      }

      if (quantity > product.stock) {
        toast.error('Not enough stock available')
        return prevCart
      }

      toast.success('Added to cart')
      return [...prevCart, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId))
    toast.success('Removed from cart')
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (item._id === productId) {
          if (quantity > item.stock) {
            toast.error('Not enough stock available')
            return item
          }
          return { ...item, quantity }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCart([])
    toast.success('Cart cleared')
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountedPrice || item.price
      return total + price * item.quantity
    }, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const isInCart = (productId) => {
    return cart.some(item => item._id === productId)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
