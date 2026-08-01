import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import { categoryAPI } from '../../services/api'
import LanguageSwitcher from './LanguageSwitcher'
import {
  MdShoppingCart, MdFavorite, MdPerson, MdMenu, MdClose,
  MdLightMode, MdDarkMode, MdLogout, MdDashboard, MdSearch,
  MdStorefront, MdKeyboardArrowDown, MdCategory,
} from 'react-icons/md'

/* ─── Shop Category Dropdown ─────────────────────────────── */
const ShopCategoryDropdown = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    categoryAPI.getAll({ isActive: true })
      .then(r => setCategories(r.data.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl nav-cat-btn border transition-colors"
        aria-label="Shop by category"
      >
        <MdStorefront className="text-[#ea580c] text-base flex-shrink-0" />
        <span className="text-sm font-medium nav-text">{t('home.categories')}</span>
        <MdKeyboardArrowDown className={`text-base nav-text transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-fade-in">
          {/* header */}
          <div className="bg-gradient-to-r from-[#ea580c] to-[#c2410c] px-4 py-3 flex items-center gap-2">
            <MdCategory className="text-white text-lg" />
            <span className="text-white font-bold text-sm">{t('home.categories')}</span>
          </div>

          {/* category list */}
          <div className="py-2 max-h-72 overflow-y-auto">
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#e2e8f0] hover:bg-orange-50 dark:hover:bg-[#334155] hover:text-[#ea580c] transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-orange-100 dark:bg-[#334155] flex items-center justify-center flex-shrink-0">
                <MdStorefront className="text-[#ea580c] text-sm" />
              </span>
              <span className="font-medium">{t('products.allCategories')}</span>
            </Link>

            {categories.length === 0 && (
              <p className="px-4 py-3 text-xs text-gray-400 dark:text-[#94a3b8]">{t('common.loading')}</p>
            )}

            {categories.map(cat => (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#e2e8f0] hover:bg-orange-50 dark:hover:bg-[#334155] hover:text-[#ea580c] transition-colors"
              >
                {cat.image?.url ? (
                  <img src={cat.image.url} alt={cat.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-orange-100 dark:bg-[#334155] flex items-center justify-center flex-shrink-0 text-[#ea580c] font-bold text-xs">
                    {cat.name[0]}
                  </span>
                )}
                <span>{cat.name}</span>
                {cat.productCount > 0 && (
                  <span className="ml-auto text-xs text-gray-400 dark:text-[#94a3b8]">{cat.productCount}</span>
                )}
              </Link>
            ))}
          </div>

          {/* footer */}
          <div className="border-t border-gray-200 dark:border-[#334155] px-4 py-2.5">
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#ea580c] hover:underline"
            >
              {t('common.seeAll')} →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Mobile Category List ───────────────────────────────── */
const MobileCategoryList = ({ onClose }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    categoryAPI.getAll({ isActive: true })
      .then(r => setCategories(r.data.categories || []))
      .catch(() => {})
  }, [])

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="nav-mobile-item w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium nav-text rounded-xl transition-colors"
      >
        <span className="flex items-center gap-2">
          <MdStorefront className="text-[#ea580c]" />
          {t('home.categories')}
        </span>
        <MdKeyboardArrowDown className={`text-base transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-orange-200 dark:border-[#334155] pl-3">
          <Link
            to="/products"
            onClick={onClose}
            className="block px-3 py-2 text-sm text-gray-600 dark:text-[#94a3b8] hover:text-[#ea580c] rounded-lg transition-colors"
          >
            {t('products.allCategories')}
          </Link>
          {categories.map(cat => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug}`}
              onClick={onClose}
              className="block px-3 py-2 text-sm text-gray-600 dark:text-[#94a3b8] hover:text-[#ea580c] rounded-lg transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Smart Search Bar ───────────────────────────────────── */
const SearchBar = ({ onSearch, className = '' }) => {
  const { t }        = useTranslation()
  const navigate     = useNavigate()
  const [query,      setQuery]      = useState('')
  const [open,       setOpen]       = useState(false)
  const [results,    setResults]    = useState([])
  const [searching,  setSearching]  = useState(false)
  const ref = useRef(null)
  const debounceRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Live suggestions while typing
  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (val.trim().length < 2) { setResults([]); setOpen(false); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(val)}&limit=5`)
        const data = await res.json()
        setResults(data.products || [])
        setOpen(true)
      } catch { setResults([]) }
      setSearching(false)
    }, 300)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    if (onSearch) onSearch()
    navigate(`/products?search=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  const selectResult = (product) => {
    setOpen(false); setQuery('')
    if (onSearch) onSearch()
    navigate(`/products/${product._id}`)
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      <form onSubmit={handleSubmit} className="flex items-stretch w-full">
        {/* input — no icon inside, button is on the right */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search products..."
          className="flex-1 min-w-0 px-4 py-2 text-sm border-0 outline-none"
          style={{
            background: 'rgba(255,255,255,0.88)',
            color: '#1f2937',
            borderRadius: '0.75rem 0 0 0.75rem',
          }}
          autoComplete="off"
        />
        {/* orange search button — only ONE */}
        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2 text-white text-sm font-semibold flex-shrink-0 transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'linear-gradient(135deg,#ea580c,#c2410c)',
            borderRadius: '0 0.75rem 0.75rem 0',
          }}
        >
          {searching
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <MdSearch className="text-xl" />
          }
          <span className="hidden sm:inline font-semibold">Search</span>
        </button>
      </form>

      {/* Dropdown suggestions */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-fade-in">
          {results.map(p => {
            const price = p.discountedPrice ?? p.price
            return (
              <button
                key={p._id}
                onClick={() => selectResult(p)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-[#334155] transition-colors text-left"
              >
                <img
                  src={p.images?.[0]?.url || 'https://placehold.co/40x40?text=?'}
                  alt={p.name}
                  className="w-9 h-9 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-[#e2e8f0] truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 dark:text-[#94a3b8]">{p.category?.name}</p>
                </div>
                <span className="text-sm font-bold text-[#ea580c] flex-shrink-0">{price?.toFixed(0)} ETB</span>
              </button>
            )
          })}
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2.5 text-center text-xs font-semibold text-[#ea580c] border-t border-gray-100 dark:border-[#334155] hover:bg-orange-50 dark:hover:bg-[#334155] transition-colors"
          >
            {t('common.seeAll')} results for "{query}" →
          </button>
        </div>
      )}
    </div>
  )
}
const Navbar = () => {
  const { t } = useTranslation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { getCartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleLogout = () => { logout(); navigate('/'); setMobileMenuOpen(false) }
  const closeMobile = () => setMobileMenuOpen(false)

  return (
    <nav className="sticky top-0 z-40 border-b shadow-sm alex-nav">
      <style>{`
        nav.alex-nav {
          background: linear-gradient(135deg, #d1d5db 0%, #c0c0c0 50%, #b8bec7 100%);
          border-bottom-color: #a0a8b4;
        }
        .dark nav.alex-nav {
          background: linear-gradient(135deg, #1c2333 0%, #232d3f 50%, #1a2540 100%) !important;
          border-bottom-color: #2e3a50 !important;
        }
        nav.alex-nav .nav-text        { color: #1f2937; }
        .dark nav.alex-nav .nav-text  { color: #e2e8f0; }
        nav.alex-nav .nav-link        { color: #374151; }
        nav.alex-nav .nav-link:hover  { color: #ea580c; background: rgba(234,88,12,0.08); }
        .dark nav.alex-nav .nav-link        { color: #cbd5e1; }
        .dark nav.alex-nav .nav-link:hover  { color: #f97316; background: rgba(249,115,22,0.10); }
        nav.alex-nav .nav-icon-btn        { background: rgba(0,0,0,0.07); }
        nav.alex-nav .nav-icon-btn:hover  { background: rgba(234,88,12,0.12); }
        .dark nav.alex-nav .nav-icon-btn        { background: rgba(255,255,255,0.05); }
        .dark nav.alex-nav .nav-icon-btn:hover  { background: rgba(249,115,22,0.15); }
        nav.alex-nav .nav-cat-btn {
          background: rgba(0,0,0,0.09);
          border-color: rgba(0,0,0,0.13);
        }
        nav.alex-nav .nav-cat-btn:hover { background: rgba(234,88,12,0.10); }
        .dark nav.alex-nav .nav-cat-btn {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }
        .dark nav.alex-nav .nav-cat-btn:hover { background: rgba(249,115,22,0.12); }
        nav.alex-nav .mobile-menu-bg {
          background: linear-gradient(135deg, #d1d5db 0%, #c0c0c0 100%);
          border-top-color: #a0a8b4;
        }
        .dark nav.alex-nav .mobile-menu-bg {
          background: linear-gradient(135deg, #1c2333 0%, #1a2540 100%);
          border-top-color: #2e3a50;
        }
        nav.alex-nav .nav-mobile-item:hover  { background: rgba(0,0,0,0.07); }
        .dark nav.alex-nav .nav-mobile-item:hover { background: rgba(255,255,255,0.05); }
      `}</style>

      <div className="container-custom">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-[#ea580c] rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="hidden sm:block text-xl font-bold nav-text">Alex Store</span>
          </Link>

          {/* Desktop Search — full styled bar with button + suggestions */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <SearchBar className="w-full" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { to: '/products', label: t('nav.products') },
              { to: '/about',    label: 'About' },
              { to: '/contact',  label: 'Contact' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="nav-link px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                {label}
              </Link>
            ))}

            {/* Shop by Category dropdown — replaces calendar */}
            <ShopCategoryDropdown />

            <LanguageSwitcher />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="nav-icon-btn w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light'
                ? <MdDarkMode  className="text-xl nav-text" />
                : <MdLightMode className="text-xl nav-text" />}
            </button>

            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="nav-icon-btn relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
                  <MdFavorite className="text-xl nav-text" />
                </Link>
                <Link to="/cart" className="nav-icon-btn relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
                  <MdShoppingCart className="text-xl nav-text" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ea580c] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                {isAdmin && (
                  <Link to="/admin" className="btn btn-secondary py-1.5 px-3 text-sm gap-1.5" style={{ background: 'rgba(0,0,0,0.10)', color: 'inherit' }}>
                    <MdDashboard className="text-base" /> Admin
                  </Link>
                )}
                <Link to="/profile" className="btn btn-secondary py-1.5 px-3 text-sm gap-1.5 nav-link" style={{ background: 'rgba(0,0,0,0.10)' }}>
                  <MdPerson className="text-base" />
                  <span className="nav-text">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline py-1.5 px-3 text-sm gap-1.5">
                  <MdLogout className="text-base" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link to="/login"    className="btn py-1.5 px-4 text-sm font-medium rounded-lg" style={{ background: 'rgba(0,0,0,0.10)', color: 'inherit' }}>{t('nav.login')}</Link>
                <Link to="/register" className="btn btn-primary py-1.5 px-4 text-sm">{t('nav.register')}</Link>
              </div>
            )}
          </div>

          {/* Mobile: search icon + cart + burger */}
          <div className="md:hidden flex items-center gap-1.5">
            {isAuthenticated && (
              <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center">
                <MdShoppingCart className="text-xl nav-text" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ea580c] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-icon-btn w-9 h-9 rounded-lg flex items-center justify-center"
            >
              {mobileMenuOpen
                ? <MdClose className="text-2xl nav-text" />
                : <MdMenu  className="text-2xl nav-text" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-down space-y-1 mobile-menu-bg">
            {/* Mobile search — full bar with button */}
            <div className="mb-3">
              <SearchBar onSearch={closeMobile} className="w-full" />
            </div>

            {/* Nav links */}
            {[
              { to: '/products', label: t('nav.products') },
              { to: '/about',    label: 'About Us' },
              { to: '/contact',  label: 'Contact Us' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} onClick={closeMobile}
                className="nav-mobile-item flex px-4 py-2.5 text-sm font-medium nav-text rounded-xl transition-colors">
                {label}
              </Link>
            ))}

            {/* Shop by Category — mobile accordion */}
            <MobileCategoryList onClose={closeMobile} />

            {isAuthenticated && (
              <>
                <Link to="/wishlist" onClick={closeMobile} className="nav-mobile-item flex px-4 py-2.5 text-sm font-medium nav-text rounded-xl transition-colors">{t('nav.wishlist')}</Link>
                <Link to="/orders"   onClick={closeMobile} className="nav-mobile-item flex px-4 py-2.5 text-sm font-medium nav-text rounded-xl transition-colors">{t('nav.orders')}</Link>
                <Link to="/profile"  onClick={closeMobile} className="nav-mobile-item flex px-4 py-2.5 text-sm font-medium nav-text rounded-xl transition-colors">{t('nav.profile')}</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={closeMobile} className="nav-mobile-item flex px-4 py-2.5 text-sm font-medium text-[#ea580c] rounded-xl transition-colors">{t('nav.admin')}</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50/30 rounded-xl transition-colors">
                  {t('nav.logout')}
                </button>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex gap-2 px-2 pt-2">
                <Link to="/login"    onClick={closeMobile} className="btn flex-1 py-2.5 text-sm font-medium rounded-xl nav-text" style={{ background: 'rgba(0,0,0,0.10)' }}>{t('nav.login')}</Link>
                <Link to="/register" onClick={closeMobile} className="btn btn-primary flex-1 py-2.5 text-sm">{t('nav.register')}</Link>
              </div>
            )}

            <div className="flex items-center justify-between px-4 pt-2">
              <LanguageSwitcher />
              <button onClick={toggleTheme} className="nav-icon-btn w-9 h-9 rounded-lg flex items-center justify-center">
                {theme === 'light'
                  ? <MdDarkMode  className="text-xl nav-text" />
                  : <MdLightMode className="text-xl nav-text" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
