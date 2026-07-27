import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import {
  MdDashboard, MdInventory, MdCategory, MdShoppingCart,
  MdPeople, MdWarehouse, MdPayment, MdBarChart, MdMenu,
  MdClose, MdLogout, MdLightMode, MdDarkMode, MdStore,
} from 'react-icons/md'

const links = [
  { to: '/admin',             icon: MdDashboard, label: 'admin.dashboard',  exact: true },
  { to: '/admin/products',    icon: MdInventory, label: 'admin.products' },
  { to: '/admin/categories',  icon: MdCategory,  label: 'admin.categories' },
  { to: '/admin/orders',      icon: MdShoppingCart, label: 'admin.orders' },
  { to: '/admin/customers',   icon: MdPeople,    label: 'admin.customers' },
  { to: '/admin/inventory',   icon: MdWarehouse, label: 'admin.inventory' },
  { to: '/admin/payments',    icon: MdPayment,   label: 'admin.payments' },
  { to: '/admin/reports',     icon: MdBarChart,  label: 'admin.reports' },
]

const AdminLayout = ({ children, title }) => {
  const { t }            = useTranslation()
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate          = useNavigate()
  const [open, setOpen]   = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = ({ mobile }) => (
    <aside className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col h-full bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-[#334155] w-60 flex-shrink-0`}>
      <div className="p-4 border-b border-gray-200 dark:border-[#334155] flex items-center gap-3">
        <div className="w-9 h-9 bg-[#ea580c] rounded-lg flex items-center justify-center flex-shrink-0">
          <MdStore className="text-white text-xl" />
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-[#e2e8f0] text-sm">Alex Store</p>
          <p className="text-xs text-gray-500 dark:text-[#94a3b8]">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={() => setOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon className="text-xl flex-shrink-0" />
            <span>{t(label)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-[#334155]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#ea580c] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-[#e2e8f0] truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8] truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
          <MdLogout className="text-xl" /> <span>Logout</span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0f172a] overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-10"><Sidebar mobile /></div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-[#334155] flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg">
              <MdMenu className="text-xl text-gray-700 dark:text-[#e2e8f0]" />
            </button>
            <h1 className="font-bold text-lg text-gray-900 dark:text-[#e2e8f0]">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg">
              {theme === 'light' ? <MdDarkMode className="text-xl text-gray-700" /> : <MdLightMode className="text-xl text-[#e2e8f0]" />}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
