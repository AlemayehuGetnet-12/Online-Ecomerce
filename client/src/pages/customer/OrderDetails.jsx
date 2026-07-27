import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Loader from '../../components/common/Loader'
import { orderAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdArrowBack, MdLocationOn, MdPayment, MdTimeline } from 'react-icons/md'

const statusColors = { pending:'badge-warning', confirmed:'badge-info', processing:'badge-info', shipped:'badge-info', delivered:'badge-success', cancelled:'badge-danger' }

const OrderDetails = () => {
  const { id } = useParams()
  const { t }  = useTranslation()
  const [order,    setOrder]    = useState(null)
  const [payment,  setPayment]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    orderAPI.getOne(id).then(r => { setOrder(r.data.order); setPayment(r.data.payment) }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return
    setCancelling(true)
    try {
      const { data } = await orderAPI.cancel(id, 'Cancelled by customer')
      setOrder(data.order)
      toast.success('Order cancelled')
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel') }
    setCancelling(false)
  }

  if (loading) return <div className="flex flex-col min-h-screen"><Navbar /><div className="flex-1 flex items-center justify-center"><Loader size="xl" /></div><Footer /></div>
  if (!order)  return <div className="flex flex-col min-h-screen"><Navbar /><div className="flex-1 flex items-center justify-center text-gray-500">Order not found</div><Footer /></div>

  const canCancel = ['pending','confirmed'].includes(order.orderStatus)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 container-custom py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/orders" className="p-2 hover:bg-gray-200 dark:hover:bg-[#334155] rounded-lg"><MdArrowBack className="text-xl text-gray-700 dark:text-[#e2e8f0]" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0]">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 dark:text-[#94a3b8]">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
          </div>
          <div className="ml-auto flex gap-3">
            <span className={`badge ${statusColors[order.orderStatus] || 'badge-gray'} capitalize`}>{order.orderStatus}</span>
            {canCancel && (
              <button onClick={handleCancel} disabled={cancelling} className="btn btn-danger text-sm py-2">
                {cancelling ? <span className="spinner" /> : t('orders.cancelOrder')}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">Items ({order.items?.length})</h2>
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <img src={item.image || 'https://placehold.co/64x64?text=?'} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-[#e2e8f0]">{item.name}</p>
                      <p className="text-sm text-gray-500 dark:text-[#94a3b8]">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#ea580c] whitespace-nowrap">{item.subtotal?.toFixed(2)} ETB</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-[#334155] mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-[#94a3b8]">
                  <span>Items Total</span><span>{order.itemsTotal?.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-[#94a3b8]">
                  <span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `${order.shippingCost?.toFixed(2)} ETB`}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-[#e2e8f0] text-base">
                  <span>Total</span><span className="text-[#ea580c]">{order.totalAmount?.toFixed(2)} ETB</span>
                </div>
              </div>
            </div>

            {/* Status history */}
            {order.statusHistory?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-4 flex items-center gap-2"><MdTimeline className="text-[#ea580c]" /> Order Timeline</h2>
                <div className="space-y-3">
                  {[...order.statusHistory].reverse().map((s, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-[#ea580c] rounded-full flex-shrink-0 mt-1" />
                        {i < order.statusHistory.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-[#334155] mt-1" />}
                      </div>
                      <div className="pb-3">
                        <p className="font-medium text-gray-900 dark:text-[#e2e8f0] capitalize">{s.status}</p>
                        {s.note && <p className="text-xs text-gray-500 dark:text-[#94a3b8]">{s.note}</p>}
                        <p className="text-xs text-gray-400 dark:text-[#94a3b8] mt-0.5">{new Date(s.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Shipping */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-4 flex items-center gap-2"><MdLocationOn className="text-[#ea580c]" /> {t('orders.shippingAddress')}</h2>
              {order.shippingAddress && (
                <div className="text-sm text-gray-600 dark:text-[#94a3b8] space-y-1">
                  <p className="font-medium text-gray-800 dark:text-[#e2e8f0]">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-4 flex items-center gap-2"><MdPayment className="text-[#ea580c]" /> {t('orders.paymentMethod')}</h2>
              <div className="text-sm text-gray-600 dark:text-[#94a3b8] space-y-2">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium capitalize">{order.paymentMethod?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'} capitalize`}>{order.paymentStatus}</span>
                </div>
                {payment?.transactionId && (
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="font-medium text-xs">{payment.transactionId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrderDetails
