import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import {
  MdDashboard, MdInventory, MdCategory, MdShoppingCart,
  MdPeople, MdWarehouse, MdPayment, MdBarChart, MdMenu,
  MdClose, MdLogout, MdLightMode, MdDarkMode, MdStore,
  MdArrowForwardIos, MdHome, MdMail,
} from 'react-icons/md'

const links = [
  { to: '/admin',            icon: MdDashboard,   label: 'admin.dashboard', exact: true, color: '#6366f1' },
  { to: '/admin/products',   icon: MdInventory,   label: 'admin.products',              color: '#f59e0b' },
  { to: '/admin/categories', icon: MdCategory,    label: 'admin.categories',            color: '#10b981' },
  { to: '/admin/orders',     icon: MdShoppingCart,label: 'admin.orders',                color: '#3b82f6' },
  { to: '/admin/customers',  icon: MdPeople,      label: 'admin.customers',             color: '#8b5cf6' },
  { to: '/admin/inventory',  icon: MdWarehouse,   label: 'admin.inventory',             color: '#ef4444' },
  { to: '/admin/payments',   icon: MdPayment,     label: 'admin.payments',              color: '#06b6d4' },
  { to: '/admin/reports',    icon: MdBarChart,    label: 'admin.reports',               color: '#ec4899' },
  { to: '/admin/messages',   icon: MdMail,         label: 'admin.messages',              color: '#0ea5e9' },
]

/* ── Badge for quick stats (optional) ───────────────── */
const AdminLayout = ({ children, title }) => {
  const { t }                   = useTranslation()
  const { logout, user }        = useAuth()
  const { theme, toggleTheme }  = useTheme()
  const navigate                = useNavigate()
  const location                = useLocation()
  const [open, setOpen]         = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const close        = () => setOpen(false)

  /* current page label */
  const currentLink = links.find(l =>
    l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to)
  )

  /* ── Sidebar content ─────────────────────────────── */
  const renderSidebar = (isMobile) => (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width:      isMobile ? '260px' : collapsed ? '72px' : '240px',
        background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)',
        boxShadow:  '4px 0 24px rgba(0,0,0,0.25)',
      }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
          <MdStore className="text-white text-xl" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="min-w-0">
            <p className="font-extrabold text-white text-base leading-none">Alex Store</p>
            <p className="text-indigo-300 text-[11px] mt-0.5">Admin Panel</p>
          </div>
        )}
        {/* collapse toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(v => !v)}
            className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-indigo-300 hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <MdArrowForwardIos className={`text-sm transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        )}
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {/* go to store link */}
        <a
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-indigo-300 hover:bg-white/10 hover:text-white transition-all group mb-3"
        >
          <MdHome className="text-xl flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="text-sm font-medium">View Store</span>
          )}
        </a>

        {/* divider */}
        <div className="border-t border-white/10 mb-3" />

        {links.map(({ to, icon: Icon, label, exact, color }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={isMobile ? close : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
               ${isActive
                 ? 'bg-white/15 text-white shadow-sm'
                 : 'text-indigo-200 hover:bg-white/10 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                {/* active left bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full" style={{ background: color }} />
                )}

                {/* icon bubble */}
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: isActive ? color : 'rgba(255,255,255,0.07)' }}
                >
                  <Icon className="text-lg text-white" />
                </span>

                {(!collapsed || isMobile) && (
                  <span className="text-sm font-medium truncate">{t(label)}</span>
                )}

                {/* collapsed tooltip */}
                {collapsed && !isMobile && (
                  <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {t(label)}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User profile ── */}
      <div className="px-3 py-4 border-t border-white/10 flex-shrink-0">
        <div className={`flex items-center gap-3 mb-3 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow"
            style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}
          >
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-indigo-300 truncate">{user?.email}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors text-sm font-medium ${collapsed && !isMobile ? 'justify-center' : ''}`}
        >
          <MdLogout className="text-lg flex-shrink-0" />
          {(!collapsed || isMobile) && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </aside>
  )

  /* ── Breadcrumb ── */
  const renderBreadcrumb = () => (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#64748b]">
      <span className="text-[#ea580c] font-medium">Admin</span>
      {currentLink && (
        <>
          <MdArrowForwardIos className="text-[10px]" />
          <span className="text-gray-700 dark:text-[#94a3b8] font-medium">{t(currentLink.label)}</span>
        </>
      )}
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f1f5f9' }}
      data-theme={theme}>
      <style>{`
        [data-theme="dark"] { background: #0f172a !important; }
        [data-theme="dark"] .admin-topbar  { background: #1e293b !important; border-color: #334155 !important; }
        [data-theme="dark"] .admin-content { background: #0f172a !important; }
        [data-theme="dark"] .admin-title   { color: #e2e8f0 !important; }
        [data-theme="dark"] .admin-bread   { color: #94a3b8 !important; }
      `}</style>

      {/* Desktop sidebar */}
      {renderSidebar(false)}

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="relative z-10 h-full">
            {renderSidebar(true)}
          </div>
          <button onClick={close} className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white">
            <MdClose className="text-xl" />
          </button>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Topbar ── */}
        <header
          className="admin-topbar flex items-center justify-between h-16 px-4 md:px-6 flex-shrink-0"
          style={{
            background:   '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow:    '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile burger */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <MdMenu className="text-xl text-gray-600" />
            </button>

            <div>
              <h1 className="admin-title font-bold text-lg text-gray-900 leading-none">{title}</h1>
              <div className="admin-bread mt-0.5">{renderBreadcrumb()}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors"
            >
              {theme === 'light'
                ? <MdDarkMode  className="text-xl text-gray-600" />
                : <MdLightMode className="text-xl text-[#e2e8f0]" />}
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="admin-content flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
