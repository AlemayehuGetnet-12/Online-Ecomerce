import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import LanguageSwitcher from './LanguageSwitcher'
import {
  MdShoppingCart, MdFavorite, MdPerson, MdMenu, MdClose,
  MdLightMode, MdDarkMode, MdLogout, MdDashboard, MdSearch,
  MdCalendarToday, MdChevronLeft, MdChevronRight,
} from 'react-icons/md'

/* ─── Live Clock + Date Display ─────────────────────────── */
const NavClock = () => {
  const [now, setNow] = useState(new Date())
  const [showCal, setShowCal] = useState(false)
  const [calMonth, setCalMonth] = useState(() => new Date())
  const ref = useRef(null)

  // tick every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // close calendar on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowCal(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  /* ── mini calendar helpers ── */
  const year  = calMonth.getFullYear()
  const month = calMonth.getMonth()
  const monthName = calMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const firstDay  = new Date(year, month, 1).getDay()          // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const today = new Date()
  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const prevMonth = () => setCalMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCalMonth(new Date(year, month + 1, 1))
  const goToday   = () => { setCalMonth(new Date()); setShowCal(false) }

  // build grid cells: leading blanks + day numbers
  const cells = []
  for (let i = 0; i < firstDay; i++)      cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="relative" ref={ref}>
      {/* trigger button */}
      <button
        onClick={() => setShowCal(v => !v)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl nav-clock-btn border transition-colors group"
        aria-label="Show calendar"
      >
        <MdCalendarToday className="text-[#ea580c] text-base flex-shrink-0" />
        <div className="text-left leading-none">
          <p className="text-[11px] font-medium nav-text" style={{opacity:0.7}}>{dateStr}</p>
          <p className="text-sm font-bold nav-text tabular-nums tracking-wide mt-0.5">{timeStr}</p>
        </div>
      </button>

      {/* calendar dropdown */}
      {showCal && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-2xl shadow-modal z-50 overflow-hidden animate-fade-in">
          {/* header */}
          <div className="bg-gradient-to-r from-[#ea580c] to-[#c2410c] px-4 py-3 flex items-center justify-between">
            <button onClick={prevMonth} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
              <MdChevronLeft className="text-lg" />
            </button>
            <span className="text-white font-bold text-sm">{monthName}</span>
            <button onClick={nextMonth} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
              <MdChevronRight className="text-lg" />
            </button>
          </div>

          {/* day labels */}
          <div className="grid grid-cols-7 px-3 pt-3">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-400 dark:text-[#94a3b8] py-1">{d}</div>
            ))}
          </div>

          {/* day cells */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {cells.map((d, i) => (
              <div key={i} className="flex items-center justify-center">
                {d ? (
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium cursor-default transition-colors
                    ${isToday(d)
                      ? 'bg-[#ea580c] text-white font-bold shadow'
                      : 'text-gray-700 dark:text-[#e2e8f0] hover:bg-orange-50 dark:hover:bg-[#334155]'
                    }`}>
                    {d}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          {/* footer */}
          <div className="border-t border-gray-200 dark:border-[#334155] px-4 py-2.5 flex items-center justify-between">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-[#94a3b8]">Current time</p>
              <p className="text-base font-bold text-gray-900 dark:text-[#e2e8f0] tabular-nums">{timeStr}</p>
            </div>
            <button onClick={goToday} className="btn btn-primary text-xs py-1.5 px-4">Today</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Navbar ────────────────────────────────────────── */
const Navbar = () => {
  const { t } = useTranslation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { getCartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery,    setSearchQuery]    = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setMobileMenuOpen(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/'); setMobileMenuOpen(false) }

  return (
    <nav className="sticky top-0 z-40 border-b shadow-sm alex-nav"
      style={{
        background: 'linear-gradient(135deg, #d1d5db 0%, #c0c0c0 50%, #b8bec7 100%)',
        borderBottomColor: '#a0a8b4',
      }}
    >
      <style>{`
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
        nav.alex-nav .nav-clock-btn {
          background: rgba(0,0,0,0.09);
          border-color: rgba(0,0,0,0.13);
        }
        nav.alex-nav .nav-clock-btn:hover { background: rgba(234,88,12,0.10); }
        .dark nav.alex-nav .nav-clock-btn {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }
        .dark nav.alex-nav .nav-clock-btn:hover { background: rgba(249,115,22,0.12); }
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
        nav.alex-nav .nav-datebar-bg { background: rgba(0,0,0,0.08); }
        .dark nav.alex-nav .nav-datebar-bg { background: rgba(255,255,255,0.05); }
      `}</style>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-[#ea580c] rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="hidden sm:block text-xl font-bold nav-text">
              Alex Store
            </span>
          </Link>

          {/* ── Desktop Search ── */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className="input pr-10 text-sm"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ea580c]">
                <MdSearch className="text-xl" />
              </button>
            </div>
          </form>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-2">
            {/* nav links */}
            {[
              { to: '/products', label: t('nav.products') },
              { to: '/about',    label: 'About' },
              { to: '/contact',  label: 'Contact' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="nav-link px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                {label}
              </Link>
            ))}

            {/* date/clock/calendar */}
            <NavClock />

            <LanguageSwitcher />

            {/* theme toggle */}
            <button onClick={toggleTheme}
              className="nav-icon-btn w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Toggle theme">
              {theme === 'light'
                ? <MdDarkMode  className="text-xl nav-text" />
                : <MdLightMode className="text-xl nav-text" />}
            </button>

            {isAuthenticated && (
              <>
                <Link to="/wishlist"
                  className="nav-icon-btn relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
                  <MdFavorite className="text-xl nav-text" />
                </Link>
                <Link to="/cart"
                  className="nav-icon-btn relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
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
                  <Link to="/admin" className="btn btn-secondary py-1.5 px-3 text-sm gap-1.5" style={{background:'rgba(0,0,0,0.10)',color:'inherit'}}>
                    <MdDashboard className="text-base" /> Admin
                  </Link>
                )}
                <Link to="/profile" className="btn btn-secondary py-1.5 px-3 text-sm gap-1.5 nav-link" style={{background:'rgba(0,0,0,0.10)'}}>
                  <MdPerson className="text-base" />
                  <span className="nav-text">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline py-1.5 px-3 text-sm gap-1.5">
                  <MdLogout className="text-base" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link to="/login"    className="btn py-1.5 px-4 text-sm font-medium rounded-lg" style={{background:'rgba(0,0,0,0.10)',color:'inherit'}}>{t('nav.login')}</Link>
                <Link to="/register" className="btn btn-primary  py-1.5 px-4 text-sm">{t('nav.register')}</Link>
              </div>
            )}
          </div>

          {/* ── Mobile: cart count + burger ── */}
          <div className="md:hidden flex items-center gap-2">
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
              className="nav-icon-btn w-9 h-9 rounded-lg flex items-center justify-center">
              {mobileMenuOpen
                ? <MdClose className="text-2xl nav-text" />
                : <MdMenu  className="text-2xl nav-text" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-down space-y-1 mobile-menu-bg">
            {/* mobile search */}
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('common.search')} className="input pr-10 text-sm" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <MdSearch className="text-xl text-gray-500" />
                </button>
              </div>
            </form>

            {/* mobile date */}
            <div className="px-2 py-2 mb-2">
              <MobileDateBar />
            </div>

            {/* nav links */}
            {[
              { to: '/products', label: t('nav.products') },
              { to: '/about',    label: 'About Us' },
              { to: '/contact',  label: 'Contact Us' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)}
                className="nav-mobile-item flex px-4 py-2.5 text-sm font-medium nav-text rounded-xl transition-colors">
                {label}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="nav-mobile-item flex px-4 py-2.5 text-sm font-medium nav-text rounded-xl transition-colors">{t('nav.wishlist')}</Link>
                <Link to="/orders"   onClick={() => setMobileMenuOpen(false)} className="nav-mobile-item flex px-4 py-2.5 text-sm font-medium nav-text rounded-xl transition-colors">{t('nav.orders')}</Link>
                <Link to="/profile"  onClick={() => setMobileMenuOpen(false)} className="nav-mobile-item flex px-4 py-2.5 text-sm font-medium nav-text rounded-xl transition-colors">{t('nav.profile')}</Link>
                {isAdmin && (
                  <Link to="/admin"  onClick={() => setMobileMenuOpen(false)} className="nav-mobile-item flex px-4 py-2.5 text-sm font-medium text-[#ea580c] rounded-xl transition-colors">{t('nav.admin')}</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50/30 rounded-xl transition-colors">
                  {t('nav.logout')}
                </button>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex gap-2 px-2 pt-2">
                <Link to="/login"    onClick={() => setMobileMenuOpen(false)} className="btn flex-1 py-2.5 text-sm font-medium rounded-xl nav-text" style={{background:'rgba(0,0,0,0.10)'}}>{t('nav.login')}</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary flex-1 py-2.5 text-sm">{t('nav.register')}</Link>
              </div>
            )}

            <div className="flex items-center justify-between px-4 pt-2">
              <LanguageSwitcher />
              <button onClick={toggleTheme} className="nav-icon-btn w-9 h-9 rounded-lg flex items-center justify-center">
                {theme === 'light' ? <MdDarkMode className="text-xl nav-text" /> : <MdLightMode className="text-xl nav-text" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

/* mobile-only date strip (no clock seconds — saves space) */
const MobileDateBar = () => {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])
  const pad = n => String(n).padStart(2, '0')
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1e293b] rounded-xl px-3 py-2">
      <MdCalendarToday className="text-[#ea580c] text-lg flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-500 dark:text-[#94a3b8]">
          {now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <p className="text-sm font-bold text-gray-800 dark:text-[#e2e8f0] tabular-nums">
          {pad(now.getHours())}:{pad(now.getMinutes())}
        </p>
      </div>
    </div>
  )
}

export default Navbar
