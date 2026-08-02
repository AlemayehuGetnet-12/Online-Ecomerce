import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth }    from '../../context/AuthContext'
import { useCart }    from '../../context/CartContext'
import { useTheme }   from '../../context/ThemeContext'
import LanguageSwitcher from './LanguageSwitcher'
import {
  MdShoppingCart, MdFavorite, MdPerson, MdMenu, MdClose,
  MdLightMode, MdDarkMode, MdLogout, MdDashboard, MdSearch,
  MdKeyboardArrowDown,
} from 'react-icons/md'

/* ──────────────────────────────────────────────────────────
   MEGA-MENU DROPDOWN  (About · Customer Service · Shop)
   ────────────────────────────────────────────────────────── */
const MENUS = [
  {
    label: 'Products',
    sections: [
      {
        heading: 'All Products', to: '/products',
        items: [
          { label: 'All Products',  to: '/products',                       icon: '🛍️' },
          { label: 'Best Sellers',  to: '/products?sort=-soldCount',        icon: '🔥' },
          { label: 'New Arrivals',  to: '/products?sort=-createdAt',        icon: '✨' },
          { label: 'On Sale',       to: '/products?discount=true',          icon: '🏷️' },
          { label: 'Electronics',   to: '/products?category=electronics',   icon: '📱' },
          { label: 'Fashion',       to: '/products?category=fashion',       icon: '👗' },
          { label: 'Beauty',        to: '/products?category=beauty',        icon: '💄' },
          { label: 'Food',          to: '/products?category=food',          icon: '☕' },
        ],
      },
    ],
  },
  {
    label: 'About Us',
    sections: [
      {
        heading: 'About Alex Store',
        items: [
          { label: 'About Us',      to: '/about',            icon: '🏢' },
          { label: 'Our Story',     to: '/about/story',      icon: '📖' },
          { label: 'Careers',       to: '/about/careers',    icon: '💼' },
          { label: 'Our Brands',    to: '/about/brands',     icon: '🏷️' },
          { label: 'Press & Media', to: '/about/press',      icon: '📰' },
          { label: 'The Developer', to: '/about/developer',  icon: '👤' },
        ],
      },
    ],
  },
  {
    label: 'Customer Service',
    sections: [
      {
        heading: 'Customer Service',
        items: [
          { label: 'Help Center',       to: '/help',     icon: '❓' },
          { label: 'Shipping Info',     to: '/shipping', icon: '🚚' },
          { label: 'Returns & Refunds', to: '/returns',  icon: '↩️' },
          { label: 'Contact Us',        to: '/contact',  icon: '💬' },
          { label: 'Track My Order',    to: '/orders',   icon: '📦' },
        ],
      },
    ],
  },
  {
    label: 'Shop',
    sections: [
      {
        heading: 'Shop', to: '/products',
        items: [
     { label: 'Best Sellers',  to: '/products?sort=-soldCount', icon: '🔥' },
     { label: 'New Arrivals', to: '/products?sort=-createdAt',  icon: '✨' },
    { label: 'Fashion',    to: '/products?category=fashion', icon: '👗' },
   { label: 'Electronics', to: '/products?category=electronics', icon: '📱' },
   { label: 'On Sale',  to: '/products?discount=true',    icon: '🏷️' },
  { label: 'Featured',  to: '/products?isFeatured=true',  icon: '⭐' },
        ],
      },
    ],
  },
]

const MegaDropdown = ({ menu, onClose }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const close = () => { setOpen(false); if (onClose) onClose() }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium nav-link transition-colors whitespace-nowrap"
      >
        {menu.label}
        <MdKeyboardArrowDown className={`text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 animate-fade-in"
          style={{ minWidth: '200px' }}>
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* header strip */}
            <Link to={menu.sections[0].to} onClick={close}
              className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(90deg,#ea580c,#c2410c)' }}>
              {menu.sections[0].heading}
            </Link>
            <div className="py-1">
              {menu.sections[0].items.map(item => (
                <Link key={item.label} to={item.to} onClick={close}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-[#e2e8f0] hover:bg-orange-50 dark:hover:bg-[#334155] hover:text-[#ea580c] transition-colors">
                  <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   SMART SEARCH BAR with live suggestions
   ────────────────────────────────────────────────────────── */
const SearchBar = ({ onSearch, className = '' }) => {
  const navigate    = useNavigate()
  const [query,     setQuery]    = useState('')
  const [open,      setOpen]     = useState(false)
  const [results,   setResults]  = useState([])
  const [loading,   setLoading]  = useState(false)
  const ref         = useRef(null)
  const timer       = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(timer.current)
    if (val.trim().length < 2) { setResults([]); setOpen(false); return }
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const r = await fetch(`/api/products?search=${encodeURIComponent(val)}&limit=6&sort=-soldCount`)
        const d = await r.json()
        setResults(d.products || [])
        setOpen(true)
      } catch { setResults([]) }
      setLoading(false)
    }, 280)
  }

  const go = (e) => {
    if (e) e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    if (onSearch) onSearch()
    navigate(`/products?search=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  const pick = (p) => {
    setOpen(false); setQuery('')
    if (onSearch) onSearch()
    navigate(`/products/${p._id}`)
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      <form onSubmit={go} className="flex w-full h-9">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search products, brands..."
          autoComplete="off"
          className="flex-1 min-w-0 px-3 py-1.5 text-sm border-0 outline-none"
          style={{
            background: 'rgba(255,255,255,0.90)',
            color: '#1f2937',
            borderRadius: '0.5rem 0 0 0.5rem',
          }}
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 text-white text-sm font-semibold flex-shrink-0 transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg,#ea580c,#c2410c)',
            borderRadius: '0 0.5rem 0.5rem 0',
          }}
        >
          {loading
            ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <MdSearch className="text-lg" />
          }
          <span className="hidden lg:inline text-xs font-bold">Search</span>
        </button>
      </form>

      {/* Live suggestions dropdown */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] z-50 overflow-hidden animate-fade-in">
          {results.map(p => {
            const price = p.discountedPrice ?? p.price
            return (
              <button key={p._id} onClick={() => pick(p)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-orange-50 dark:hover:bg-[#334155] transition-colors text-left">
                <img src={p.images?.[0]?.url || 'https://placehold.co/36x36?text=?'} alt={p.name}
                  className="w-8 h-8 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-[#e2e8f0] truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 dark:text-[#94a3b8] truncate">{p.category?.name}</p>
                </div>
                <span className="text-sm font-bold text-[#ea580c] flex-shrink-0">{price?.toFixed(0)} ETB</span>
              </button>
            )
          })}
          <button onClick={go}
            className="w-full px-3 py-2 text-center text-xs font-semibold text-[#ea580c] border-t border-gray-100 dark:border-[#334155] hover:bg-orange-50 dark:hover:bg-[#334155] transition-colors">
            See all results for "{query}" →
          </button>
        </div>
      )}

      {/* No results hint */}
      {open && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-xl shadow z-50 px-4 py-3 text-sm text-gray-500 dark:text-[#94a3b8] animate-fade-in">
          No products found for "<strong>{query}</strong>". Press Enter to search.
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   MAIN NAVBAR
   ────────────────────────────────────────────────────────── */
const Navbar = () => {
  const { t }                                    = useTranslation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { getCartCount }                          = useCart()
  const { theme, toggleTheme }                    = useTheme()
  const navigate                                  = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false) // 'menu' | 'search' | false

  const handleLogout = () => { logout(); navigate('/'); setMobileOpen(false) }
  const close        = () => setMobileOpen(false)

  const navStyles = `
    nav.alex-nav {
      background: linear-gradient(135deg,#d1d5db 0%,#c0c0c0 50%,#b8bec7 100%);
      border-bottom-color: #a0a8b4;
    }
    .dark nav.alex-nav {
      background: linear-gradient(135deg,#1c2333 0%,#232d3f 50%,#1a2540 100%) !important;
      border-bottom-color: #2e3a50 !important;
    }
    nav.alex-nav .nav-text        { color:#1f2937; }
    .dark nav.alex-nav .nav-text  { color:#e2e8f0; }
    nav.alex-nav .nav-link        { color:#374151; }
    nav.alex-nav .nav-link:hover  { color:#ea580c; background:rgba(234,88,12,0.08); }
    .dark nav.alex-nav .nav-link        { color:#cbd5e1; }
    .dark nav.alex-nav .nav-link:hover  { color:#f97316; background:rgba(249,115,22,0.10); }
    nav.alex-nav .nav-icon-btn       { background:rgba(0,0,0,0.07); }
    nav.alex-nav .nav-icon-btn:hover { background:rgba(234,88,12,0.12); }
    .dark nav.alex-nav .nav-icon-btn       { background:rgba(255,255,255,0.05); }
    .dark nav.alex-nav .nav-icon-btn:hover { background:rgba(249,115,22,0.15); }
    nav.alex-nav .mob-bg {
      background:linear-gradient(135deg,#d1d5db 0%,#c0c0c0 100%);
      border-top-color:#a0a8b4;
    }
    .dark nav.alex-nav .mob-bg {
      background:linear-gradient(135deg,#1c2333 0%,#1a2540 100%);
      border-top-color:#2e3a50;
    }
    nav.alex-nav .mob-item:hover { background:rgba(0,0,0,0.07); }
    .dark nav.alex-nav .mob-item:hover { background:rgba(255,255,255,0.05); }
  `

  return (
    <nav className="sticky top-0 z-40 border-b shadow-sm alex-nav">
      <style>{navStyles}</style>

      <div className="container-custom">
        {/* ── Main bar ── */}
        <div className="flex items-center h-13 gap-2 py-2">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0 mr-1">
            <div className="w-8 h-8 bg-[#ea580c] rounded-lg flex items-center justify-center shadow flex-shrink-0">
              <span className="text-white font-bold text-base">A</span>
            </div>
            <span className="hidden sm:block text-base font-bold nav-text leading-none">Alex Store</span>
          </Link>

          {/* Mega menu dropdowns — desktop only */}
          <div className="hidden lg:flex items-center gap-0.5 flex-shrink-0">
            {MENUS.map(m => <MegaDropdown key={m.label} menu={m} />)}
          </div>

          {/* Search — takes remaining space */}
          <div className="hidden md:flex flex-1 min-w-0 max-w-xl mx-2">
            <SearchBar className="w-full" />
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0 ml-auto">
            <LanguageSwitcher />

            <button onClick={toggleTheme}
              className="nav-icon-btn w-8 h-8 rounded-lg flex items-center justify-center"
              aria-label="Toggle theme">
              {theme === 'light'
                ? <MdDarkMode  className="text-lg nav-text" />
                : <MdLightMode className="text-lg nav-text" />}
            </button>

            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="nav-icon-btn w-8 h-8 rounded-lg flex items-center justify-center">
                  <MdFavorite className="text-lg nav-text" />
                </Link>
                <Link to="/cart" className="nav-icon-btn relative w-8 h-8 rounded-lg flex items-center justify-center">
                  <MdShoppingCart className="text-lg nav-text" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#ea580c] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Link to="/admin"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium nav-link transition-colors"
                    style={{ background: 'rgba(0,0,0,0.08)' }}>
                    <MdDashboard className="text-sm" />
                    <span className="nav-text">Admin</span>
                  </Link>
                )}
                <Link to="/profile"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium nav-link transition-colors"
                  style={{ background: 'rgba(0,0,0,0.08)' }}>
                  <MdPerson className="text-sm" />
                  <span className="nav-text hidden lg:inline">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[#ea580c] text-[#ea580c] hover:bg-orange-50 dark:hover:bg-[#1e293b] transition-colors">
                  <MdLogout className="text-sm" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium nav-link transition-colors"
                  style={{ background: 'rgba(0,0,0,0.08)' }}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-primary py-1.5 px-3 text-xs">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile top bar: search icon + wishlist + cart + burger */}
          <div className="md:hidden flex items-center gap-1 ml-auto">
            {/* Mobile search trigger — opens inline search */}
            <button
              onClick={() => setMobileOpen(v => v === 'search' ? false : 'search')}
              className="nav-icon-btn w-9 h-9 rounded-lg flex items-center justify-center"
              aria-label="Search"
            >
              <MdSearch className="text-xl nav-text" />
            </button>

            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="nav-icon-btn w-9 h-9 rounded-lg flex items-center justify-center">
                  <MdFavorite className="text-lg nav-text" />
                </Link>
                <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center nav-icon-btn rounded-lg">
                  <MdShoppingCart className="text-lg nav-text" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#ea580c] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              </>
            )}

            <button onClick={() => setMobileOpen(v => v === 'menu' ? false : 'menu')}
              className="nav-icon-btn w-9 h-9 rounded-lg flex items-center justify-center">
              {mobileOpen
                ? <MdClose  className="text-xl nav-text" />
                : <MdMenu   className="text-xl nav-text" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Search Bar (inline, full width) ── */}
        {mobileOpen === 'search' && (
          <div className="md:hidden py-2 border-t mob-bg animate-slide-down">
            <SearchBar onSearch={close} className="w-full" />
          </div>
        )}

        {/* ── Mobile Menu ── */}
        {mobileOpen === 'menu' && (
          <div className="md:hidden pb-3 border-t animate-slide-down mob-bg">
            {/* Quick search inside menu too */}
            <div className="pt-3 pb-2">
              <SearchBar onSearch={close} className="w-full" />
            </div>

            {/* All mega-menu items flat list */}
            {MENUS.map(m => (
              <div key={m.label} className="mb-2">
                <Link to={m.sections[0].to} onClick={close}
                  className="block px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#ea580c] hover:underline">
                  {m.sections[0].heading}
                </Link>
                {m.sections[0].items.map(item => (
                  <Link key={item.label} to={item.to} onClick={close}
                    className="mob-item flex items-center gap-2.5 px-5 py-2 text-sm nav-text rounded-lg transition-colors">
                    <span className="w-5 text-center">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}

            <div className="border-t border-gray-200/50 dark:border-[#334155]/50 pt-2 mt-1">
              {isAuthenticated ? (
                <>
                  <Link to="/wishlist" onClick={close} className="mob-item flex px-4 py-2 text-sm nav-text rounded-lg">{t('nav.wishlist')}</Link>
                  <Link to="/orders"   onClick={close} className="mob-item flex px-4 py-2 text-sm nav-text rounded-lg">{t('nav.orders')}</Link>
                  <Link to="/profile"  onClick={close} className="mob-item flex px-4 py-2 text-sm nav-text rounded-lg">{t('nav.profile')}</Link>
                  {isAdmin && <Link to="/admin" onClick={close} className="mob-item flex px-4 py-2 text-sm text-[#ea580c] rounded-lg">Admin Dashboard</Link>}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50/30 rounded-lg">{t('nav.logout')}</button>
                </>
              ) : (
                <div className="flex gap-2 px-4 py-2">
                  <Link to="/login"    onClick={close} className="btn flex-1 py-2 text-sm nav-text text-center" style={{ background: 'rgba(0,0,0,0.10)' }}>{t('nav.login')}</Link>
                  <Link to="/register" onClick={close} className="btn btn-primary flex-1 py-2 text-sm text-center">{t('nav.register')}</Link>
                </div>
              )}
              <div className="flex items-center justify-between px-4 pt-2">
                <LanguageSwitcher />
                <button onClick={toggleTheme} className="nav-icon-btn w-8 h-8 rounded-lg flex items-center justify-center">
                  {theme === 'light' ? <MdDarkMode className="text-lg nav-text" /> : <MdLightMode className="text-lg nav-text" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
