import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Loader from '../../components/common/Loader'
import { orderAPI } from '../../services/api'
import { MdShoppingBag } from 'react-icons/md'

const statusColors = {
  pending:    'badge-warning',
  confirmed:  'badge-info',
  processing: 'badge-info',
  shipped:    'badge-info',
  delivered:  'badge-success',
  cancelled:  'badge-danger',
}

const Orders = () => {
  const { t } = useTranslation()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getMyOrders().then(r => setOrders(r.data.orders || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex flex-col min-h-screen"><Navbar /><div className="flex-1 flex items-center justify-center"><Loader size="xl" /></div><Footer /></div>

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 container-custom py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6">{t('orders.title')}</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <MdShoppingBag className="text-7xl text-gray-300 dark:text-[#334155] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 dark:text-[#e2e8f0] mb-2">{t('orders.noOrders')}</h2>
            <Link to="/products" className="btn btn-primary mt-6 px-8 py-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-[#e2e8f0]">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500 dark:text-[#94a3b8]">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className={`badge ${statusColors[order.orderStatus] || 'badge-gray'} capitalize`}>{order.orderStatus}</span>
                    <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'} capitalize`}>{order.paymentStatus}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#94a3b8]">
                      <img src={item.image || 'https://placehold.co/40x40?text=?'} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                      <span className="line-clamp-1 max-w-[100px]">{item.name} ×{item.quantity}</span>
                    </div>
                  ))}
                  {order.items?.length > 3 && <span className="text-sm text-gray-400 dark:text-[#94a3b8] self-end">+{order.items.length - 3} more</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#ea580c] text-lg">{order.totalAmount?.toFixed(2)} ETB</span>
                  <Link to={`/orders/${order._id}`} className="btn btn-secondary text-sm py-2">{t('orders.viewOrder')}</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Orders
