import { Link, useLocation } from 'react-router-dom'
import { useEffect }          from 'react'
import { useCart }            from '../../context/CartContext'
import { useAuth }            from '../../context/AuthContext'
import {
  MdHome, MdSearch, MdShoppingCart, MdFavorite, MdPerson,
} from 'react-icons/md'

const MobileBottomNav = () => {
  const location     = useLocation()
  const { getCartCount } = useCart()
  const { isAuthenticated } = useAuth()

  // Add padding to body so content isn't hidden behind nav
  useEffect(() => {
    document.body.classList.add('has-bottom-nav')
    return () => document.body.classList.remove('has-bottom-nav')
  }, [])

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) return null

  const active = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const renderItem = (to, Icon, label, badge) => {
    const isActive = active(to)
    return (
      <Link
        key={to}
        to={to}
        className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors"
        style={{ color: isActive ? '#ea580c' : '#9ca3af' }}
      >
        <div className="relative">
          <Icon className="text-xl" />
          {badge > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-[#ea580c] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium leading-none">{label}</span>
      </Link>
    )
  }

  return (
    <nav className="mobile-bottom-nav md:hidden">
      {renderItem('/', MdHome, 'Home')}
      {renderItem('/products', MdSearch, 'Search')}
      {renderItem('/cart', MdShoppingCart, 'Cart', getCartCount())}
      {renderItem('/wishlist', MdFavorite, 'Wishlist')}
      {renderItem(
        isAuthenticated ? '/profile' : '/login',
        MdPerson,
        isAuthenticated ? 'Profile' : 'Login'
      )}
    </nav>
  )
}

export default MobileBottomNav
