import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/common/Loader'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdSearch } from 'react-icons/md'

const CustomerManagement = () => {
  const { t } = useTranslation()
  const [customers, setCustomers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [total,     setTotal]     = useState(0)
  const [toggling,  setToggling]  = useState(null)

  const load = async (q = '') => {
    setLoading(true)
    try {
      const { data } = await authAPI.getAllUsers({ limit: 100, ...(q && { search: q }) })
      setCustomers(data.users || [])
      setTotal(data.total || 0)
    } catch {
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleToggleStatus = async (user) => {
    setToggling(user._id)
    try {
      await authAPI.setUserStatus(user._id, { isActive: !user.isActive })
      toast.success(`${user.name} ${user.isActive ? 'deactivated' : 'activated'}`)
      load(search)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setToggling(null)
    }
  }

  const filtered = search
    ? customers.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
      )
    : customers

  return (
    <AdminLayout title={t('admin.customers')}>
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <form onSubmit={e => { e.preventDefault(); load(search) }} className="flex gap-2">
          <input
            className="input text-sm w-64"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary px-4">
            <MdSearch className="text-xl" />
          </button>
        </form>
        <span className="text-sm text-gray-500 dark:text-[#94a3b8]">{total} users total</span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#0f172a] text-xs text-gray-600 dark:text-[#94a3b8] uppercase">
              <tr>
                {['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={7} className="text-center py-10"><Loader /></td></tr>
                : filtered.map(c => (
                  <tr key={c._id} className="border-t border-gray-100 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1e293b]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#ea580c] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {c.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-[#e2e8f0] line-clamp-1">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-[#94a3b8]">{c.email}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-[#94a3b8]">{c.phone || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${c.role === 'admin' ? 'badge-danger' : 'badge-info'} capitalize`}>{c.role}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge ${c.isActive ? 'badge-success' : 'badge-gray'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-[#94a3b8]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      {c.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(c)}
                          disabled={toggling === c._id}
                          className={`btn text-xs py-1.5 px-3 ${c.isActive ? 'btn-danger' : 'btn-primary'}`}
                        >
                          {toggling === c._id ? <span className="spinner w-3 h-3" /> : c.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              }
              {!loading && !filtered.length && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CustomerManagement
