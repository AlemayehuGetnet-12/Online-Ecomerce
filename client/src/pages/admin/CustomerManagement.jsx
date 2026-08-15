import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/common/Loader'
import axios from 'axios'

const CustomerManagement = () => {
  const { t } = useTranslation()
  const [customers, setCustomers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    axios.get('/api/reports/customers').then(() => {
      // Show all users via a separate admin endpoint — we display the top customers + fallback
      setCustomers([])
    }).catch(()=>{})
    // Fetch users list
    axios.get('/api/auth/me').then(()=>{}).catch(()=>{})
    // Use a workaround: we fetch orders to get unique customers
    axios.get('/api/orders', { params: { limit: 100 } }).then(r => {
      const seen = new Set()
      const custs = []
      ;(r.data.orders || []).forEach(o => {
        if (!seen.has(o.user?._id)) {
          seen.add(o.user?._id)
          custs.push(o.user)
        }
      })
      setCustomers(custs.filter(Boolean))
    }).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const filtered = customers.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminLayout title={t('admin.customers')}>
      <div className="flex gap-3 items-center mb-5">
        <input className="input text-sm max-w-xs" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
        <span className="text-sm text-gray-500 dark:text-[#94a3b8]">{filtered.length} customers</span>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#0f172a] text-xs text-gray-600 dark:text-[#94a3b8] uppercase">
              <tr>{['Name','Email','Phone','Role'].map(h=><th key={h} className="px-6 py-3 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={4} className="text-center py-10"><Loader /></td></tr>
              : filtered.map((c,i) => (
                <tr key={c._id || i} className="border-t border-gray-100 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1e293b]">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#ea580c] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {c.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-[#e2e8f0]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-[#94a3b8]">{c.email}</td>
                  <td className="px-6 py-3 text-gray-600 dark:text-[#94a3b8]">{c.phone || '—'}</td>
                  <td className="px-6 py-3"><span className={`badge ${c.role==='admin'?'badge-danger':'badge-info'} capitalize`}>{c.role}</span></td>
                </tr>
              ))}
              {!loading && !filtered.length && <tr><td colSpan={4} className="text-center py-10 text-gray-400">No customers found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CustomerManagement
