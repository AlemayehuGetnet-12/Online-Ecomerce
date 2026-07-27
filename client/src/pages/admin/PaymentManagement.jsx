import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/common/Loader'
import { paymentAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdClose } from 'react-icons/md'

const STATUSES = ['pending','paid','failed','cancelled','refunded']
const statusColors = { pending:'badge-warning', paid:'badge-success', failed:'badge-danger', cancelled:'badge-gray', refunded:'badge-info' }

const PaymentManagement = () => {
  const { t } = useTranslation()
  const [payments,  setPayments]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('')
  const [selected,  setSelected]  = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [updating,  setUpdating]  = useState(false)

  const load = (st='') => {
    setLoading(true)
    const params = { limit: 50, ...(st && { status: st }) }
    paymentAPI.getAll(params).then(r => setPayments(r.data.payments || [])).catch(()=>{}).finally(()=>setLoading(false))
  }

  useEffect(load, [])

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      await paymentAPI.updateStatus(selected._id, { paymentStatus: newStatus })
      toast.success('Payment status updated')
      setSelected(null); load(filter)
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    setUpdating(false)
  }

  return (
    <AdminLayout title={t('admin.payments')}>
      <div className="flex gap-3 mb-5">
        <select className="select text-sm w-48" value={filter} onChange={e => { setFilter(e.target.value); load(e.target.value) }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <span className="text-sm text-gray-500 dark:text-[#94a3b8] self-center">{payments.length} payments</span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#0f172a] text-xs text-gray-600 dark:text-[#94a3b8] uppercase">
              <tr>{['Customer','Order','Amount','Method','Status','Date','Action'].map(h=><th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-10"><Loader /></td></tr>
              : payments.map(p => (
                <tr key={p._id} className="border-t border-gray-100 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1e293b]">
                  <td className="px-5 py-3 text-gray-700 dark:text-[#94a3b8]">{p.user?.name || '—'}</td>
                  <td className="px-5 py-3 text-[#ea580c]">{p.order?.orderNumber || '—'}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900 dark:text-[#e2e8f0]">{p.amount?.toFixed(2)} ETB</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-[#94a3b8] capitalize">{p.paymentMethod?.replace('_',' ')}</td>
                  <td className="px-5 py-3"><span className={`badge ${statusColors[p.paymentStatus]||'badge-gray'} capitalize`}>{p.paymentStatus}</span></td>
                  <td className="px-5 py-3 text-gray-500 dark:text-[#94a3b8]">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => { setSelected(p); setNewStatus(p.paymentStatus) }} className="btn btn-secondary text-xs py-1.5 px-3">Update</button>
                  </td>
                </tr>
              ))}
              {!loading && !payments.length && <tr><td colSpan={7} className="text-center py-10 text-gray-400">No payments found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="card w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0]">Update Payment</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg"><MdClose /></button>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-[#94a3b8] space-y-1">
                <p><strong>Customer:</strong> {selected.user?.name}</p>
                <p><strong>Amount:</strong> {selected.amount?.toFixed(2)} ETB</p>
                <p><strong>Method:</strong> {selected.paymentMethod?.replace('_',' ')}</p>
              </div>
              <div>
                <label className="label">{t('payment.paymentStatus')}</label>
                <select className="select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
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

export default PaymentManagement
