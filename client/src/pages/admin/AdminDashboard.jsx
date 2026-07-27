import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/common/Loader'
import { reportAPI } from '../../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { MdPeople, MdInventory, MdShoppingCart, MdAttachMoney, MdPendingActions, MdWarning } from 'react-icons/md'

const StatCard = ({ icon: Icon, label, value, color, href }) => (
  <Link to={href || '#'} className="card p-5 flex items-center gap-4 card-hover">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="text-2xl text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-[#94a3b8]">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0]">{value}</p>
    </div>
  </Link>
)

const statusColors = { pending:'badge-warning', confirmed:'badge-info', processing:'badge-info', shipped:'badge-info', delivered:'badge-success', cancelled:'badge-danger' }

const AdminDashboard = () => {
  const { t } = useTranslation()
  const [data,     setData]     = useState(null)
  const [sales,    setSales]    = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      reportAPI.getDashboard(),
      reportAPI.getSales({ period: 'monthly' }),
    ]).then(([d, s]) => {
      setData(d.data)
      // Fill all 12 months
      const filled = Array.from({ length: 12 }, (_, i) => {
        const month = s.data.data?.find(m => m._id === i + 1)
        return { month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], sales: month?.totalSales || 0, orders: month?.orderCount || 0 }
      })
      setSales(filled)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <AdminLayout title={t('admin.dashboard')}><div className="flex justify-center py-20"><Loader size="xl" /></div></AdminLayout>

  const s = data?.summary || {}

  return (
    <AdminLayout title={t('admin.dashboard')}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard icon={MdPeople}         label={t('admin.totalUsers')}        value={s.totalCustomers  || 0} color="bg-blue-500"    href="/admin/customers" />
        <StatCard icon={MdInventory}      label={t('admin.totalProducts')}     value={s.totalProducts   || 0} color="bg-purple-500"  href="/admin/products" />
        <StatCard icon={MdShoppingCart}   label={t('admin.totalOrders')}       value={s.totalOrders     || 0} color="bg-orange-500"  href="/admin/orders" />
        <StatCard icon={MdAttachMoney}    label={t('admin.totalRevenue')}      value={`${(s.totalRevenue || 0).toFixed(0)} ETB`}  color="bg-green-500"   href="/admin/reports" />
        <StatCard icon={MdPendingActions} label={t('admin.pendingOrders')}     value={s.pendingOrders   || 0} color="bg-yellow-500"  href="/admin/orders" />
        <StatCard icon={MdWarning}        label={t('admin.lowStockProducts')}  value={s.lowStockProducts|| 0} color="bg-red-500"     href="/admin/inventory" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Sales chart */}
        <div className="xl:col-span-2 card p-6">
          <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">{t('admin.monthlySales')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sales} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => [`${v.toFixed(2)} ETB`]} />
              <Bar dataKey="sales" fill="#ea580c" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders chart */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">Monthly Orders</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={sales} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#334155] flex justify-between items-center">
          <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0]">{t('admin.recentOrders')}</h2>
          <Link to="/admin/orders" className="text-sm text-[#ea580c] hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#0f172a] text-xs text-gray-600 dark:text-[#94a3b8] uppercase">
              <tr>
                {['Order #', 'Customer', 'Amount', 'Payment', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders || []).map(o => (
                <tr key={o._id} className="border-t border-gray-100 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1e293b]">
                  <td className="px-6 py-3 font-medium text-[#ea580c]">
                    <Link to={`/admin/orders`} className="hover:underline">{o.orderNumber}</Link>
                  </td>
                  <td className="px-6 py-3 text-gray-700 dark:text-[#94a3b8]">{o.user?.name || 'Unknown'}</td>
                  <td className="px-6 py-3 font-semibold text-gray-900 dark:text-[#e2e8f0]">{o.totalAmount?.toFixed(2)} ETB</td>
                  <td className="px-6 py-3">
                    <span className={`badge ${o.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'} capitalize`}>{o.paymentStatus}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`badge ${statusColors[o.orderStatus] || 'badge-gray'} capitalize`}>{o.orderStatus}</span>
                  </td>
                  <td className="px-6 py-3 text-gray-500 dark:text-[#94a3b8]">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {!data?.recentOrders?.length && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
