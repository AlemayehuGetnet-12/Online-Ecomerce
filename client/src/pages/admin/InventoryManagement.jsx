import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/common/Loader'
import { productAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdWarning, MdEdit, MdSave } from 'react-icons/md'

const InventoryManagement = () => {
  const { t } = useTranslation()
  const [products,   setProducts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [editId,     setEditId]     = useState(null)
  const [newStock,   setNewStock]   = useState('')
  const [saving,     setSaving]     = useState(false)
  const [threshold,  setThreshold]  = useState(10)

  const load = () => {
    setLoading(true)
    productAPI.getLowStock(100).then(r => setProducts(r.data.products || [])).catch(()=>{}).finally(()=>setLoading(false))
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [])

  const handleSaveStock = async id => {
    if (newStock === '' || isNaN(newStock) || Number(newStock) < 0) { toast.error('Invalid stock value'); return }
    setSaving(true)
    try {
      await productAPI.updateStock(id, Number(newStock))
      toast.success('Stock updated')
      setEditId(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    setSaving(false)
  }

  const lowStock   = products.filter(p => p.stock > 0 && p.stock <= threshold)
  const outOfStock = products.filter(p => p.stock === 0)

  return (
    <AdminLayout title={t('admin.inventory')}>
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
            <MdWarning className="text-red-600 text-2xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8]">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{outOfStock.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
            <MdWarning className="text-yellow-600 text-2xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8]">Low Stock (≤{threshold})</p>
            <p className="text-2xl font-bold text-yellow-600">{lowStock.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div>
            <label className="label mb-1 text-xs">Alert Threshold</label>
            <input type="number" className="input text-sm w-24" value={threshold} onChange={e => setThreshold(Number(e.target.value))} min="1" />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#334155]">
          <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0]">Product Stock Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#0f172a] text-xs text-gray-600 dark:text-[#94a3b8] uppercase">
              <tr>{['Product','Category','Current Stock','Status','Update Stock'].map(h=><th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="text-center py-10"><Loader /></td></tr>
              : products.map(p => (
                <tr key={p._id} className="border-t border-gray-100 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1e293b]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || 'https://placehold.co/40x40?text=?'} alt={p.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                      <span className="font-medium text-gray-900 dark:text-[#e2e8f0] line-clamp-1 max-w-[160px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-[#94a3b8]">{p.category?.name || '—'}</td>
                  <td className="px-5 py-3 font-bold text-gray-900 dark:text-[#e2e8f0]">{p.stock}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${p.stock===0?'badge-danger':p.stock<=threshold?'badge-warning':'badge-success'}`}>
                      {p.stock===0 ? 'Out of Stock' : p.stock<=threshold ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {editId === p._id ? (
                      <div className="flex gap-2 items-center">
                        <input type="number" className="input text-sm w-20" min="0" value={newStock} onChange={e => setNewStock(e.target.value)} />
                        <button onClick={() => handleSaveStock(p._id)} disabled={saving} className="btn btn-primary text-xs py-1.5 px-3">
                          {saving ? <span className="spinner" /> : <MdSave />}
                        </button>
                        <button onClick={() => setEditId(null)} className="btn btn-secondary text-xs py-1.5 px-3">×</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditId(p._id); setNewStock(p.stock) }} className="btn btn-secondary text-xs py-1.5 gap-1">
                        <MdEdit className="text-sm" /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && !products.length && <tr><td colSpan={5} className="text-center py-10 text-gray-400">All products are well stocked!</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default InventoryManagement
