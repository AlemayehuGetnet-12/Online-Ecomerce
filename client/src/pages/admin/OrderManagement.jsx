import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/common/Loader'
import { orderAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdClose } from 'react-icons/md'

const statusColors = { pending:'badge-warning', confirmed:'badge-info', processing:'badge-info', shipped:'badge-info', delivered:'badge-success', cancelled:'badge-danger' }
const ORDER_STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled']

const OrderManagement = () => {
  const { t } = useTranslation()
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('')
  const [selected, setSelected] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [note,      setNote]      = useState('')
  const [updating,  setUpdating]  = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  const load = (pg=1, st='') => {
    setLoading(true)
    const params = { page: pg, limit, ...(st && { status: st }) }
    orderAPI.getAll(params).then(r => { setOrders(r.data.orders || []); setTotal(r.data.total || 0) }).catch(()=>{}).finally(()=>setLoading(false))
  }

  useEffect(() => load(), [])

  const openUpdate = o => { setSelected(o); setNewStatus(o.orderStatus); setNote('') }

  const handleUpdate = async () => {
    if (!newStatus) return
    setUpdating(true)
    try {
      await orderAPI.updateStatus(selected._id, { orderStatus: newStatus, note })
      toast.success('Order status updated')
      setSelected(null)
      load(page, filter)
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    setUpdating(false)
  }

  const pages = Math.ceil(total / limit)

  return (
    <AdminLayout title={t('admin.orders')}>
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <select className="select text-sm w-48" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); load(1, e.target.value) }}>
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <span className="text-sm text-gray-500 dark:text-[#94a3b8]">{total} orders</span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#0f172a] text-xs text-gray-600 dark:text-[#94a3b8] uppercase">
              <tr>{['Order #','Customer','Amount','Payment','Status','Date','Action'].map(h=><th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-10"><Loader /></td></tr>
              : orders.map(o => (
                <tr key={o._id} className="border-t border-gray-100 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1e293b]">
                  <td className="px-5 py-3 font-medium text-[#ea580c]">{o.orderNumber}</td>
                  <td className="px-5 py-3 text-gray-700 dark:text-[#94a3b8]">{o.user?.name || '—'}<br/><span className="text-xs text-gray-400">{o.user?.phone}</span></td>
                  <td className="px-5 py-3 font-semibold text-gray-900 dark:text-[#e2e8f0]">{o.totalAmount?.toFixed(2)} ETB</td>
                  <td className="px-5 py-3"><span className={`badge ${o.paymentStatus==='paid'?'badge-success':'badge-warning'} capitalize`}>{o.paymentStatus}</span></td>
                  <td className="px-5 py-3"><span className={`badge ${statusColors[o.orderStatus]||'badge-gray'} capitalize`}>{o.orderStatus}</span></td>
                  <td className="px-5 py-3 text-gray-500 dark:text-[#94a3b8]">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => openUpdate(o)} className="btn btn-secondary text-xs py-1.5 px-3">Update</button>
                  </td>
                </tr>
              ))}
              {!loading && !orders.length && <tr><td colSpan={7} className="text-center py-10 text-gray-400">No orders found</td></tr>}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="p-4 flex gap-2 justify-center border-t border-gray-200 dark:border-[#334155]">
            {Array.from({length:pages},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>{setPage(p);load(p,filter)}} className={`w-8 h-8 rounded-lg text-xs font-medium ${page===p?'bg-[#ea580c] text-white':'bg-gray-100 dark:bg-[#1e293b] text-gray-600'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="card w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0]">Update Order: {selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg"><MdClose /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">{t('admin.updateOrderStatus')}</label>
                <select className="select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Note (optional)</label>
                <input className="input" placeholder="Add a note..." value={note} onChange={e => setNote(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setSelected(null)} className="btn btn-secondary">{t('common.cancel')}</button>
                <button onClick={handleUpdate} disabled={updating} className="btn btn-primary">
                  {updating ? <span className="spinner" /> : t('common.update')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default OrderManagement
