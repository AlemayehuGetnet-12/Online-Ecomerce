import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/common/Loader'
import { reportAPI } from '../../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#ea580c','#3b82f6','#22c55e','#f59e0b','#8b5cf6','#ec4899']

const SalesReports = () => {
  const { t }  = useTranslation()
  const [revenue,  setRevenue]  = useState(null)
  const [products, setProducts] = useState(null)
  const [customers,setCustomers]= useState(null)
  const [sales,    setSales]    = useState([])
  const [period,   setPeriod]   = useState('monthly')
  const [loading,  setLoading]  = useState(true)

  const loadSales = async (p='monthly') => {
    try {
      const { data } = await reportAPI.getSales({ period: p })
      const labels = p === 'monthly'
        ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        : null
      if (labels) {
        setSales(labels.map((label,i) => {
          const d = data.data?.find(x => x._id === i+1)
          return { label, sales: d?.totalSales||0, orders: d?.orderCount||0 }
        }))
      } else {
        setSales((data.data||[]).map(d => ({ label: `Week ${d._id}`, sales: d.totalSales||0, orders: d.orderCount||0 })))
      }
    } catch { setSales([]) }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      reportAPI.getRevenue(),
      reportAPI.getProducts(),
      reportAPI.getCustomers(),
      loadSales(period),
    ]).then(([r, pr, cu]) => {
      setRevenue(r.data.revenue)
      setProducts(pr.data)
      setCustomers(cu.data)
    }).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  useEffect(() => { loadSales(period) }, [period])

  if (loading) return <AdminLayout title={t('admin.reports')}><div className="flex justify-center py-20"><Loader size="xl" /></div></AdminLayout>

  const paymentMethodData = [
    { name: 'Telebirr',        value: 40 },
    { name: 'CBE Birr',        value: 25 },
    { name: 'Cash on Delivery', value: 35 },
  ]

  return (
    <AdminLayout title={t('admin.reports')}>
      {/* Revenue summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue',     value: `${(revenue?.total||0).toFixed(2)} ETB`, color: 'text-green-600' },
          { label: 'Last 30 Days',      value: `${(revenue?.last30Days||0).toFixed(2)} ETB`, color: 'text-blue-600' },
          { label: 'Paid Orders',       value: revenue?.orders || 0, color: 'text-orange-600' },
          { label: 'Pending Revenue',   value: `${(revenue?.pending||0).toFixed(2)} ETB`, color: 'text-yellow-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-gray-500 dark:text-[#94a3b8] mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Sales chart */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0]">Sales Overview</h2>
          <div className="flex gap-2">
            {['monthly','weekly','yearly'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${period===p ? 'bg-[#ea580c] text-white' : 'bg-gray-100 dark:bg-[#334155] text-gray-600 dark:text-[#94a3b8]'}`}>{p}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={sales} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => [`${Number(v).toFixed(2)} ETB`]} />
            <Bar dataKey="sales" fill="#ea580c" radius={[4,4,0,0]} name="Revenue" />
            <Bar dataKey="orders" fill="#3b82f6" radius={[4,4,0,0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top selling products */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">{t('admin.topSelling')}</h2>
          <div className="space-y-3">
            {(products?.topSelling || []).slice(0, 6).map((p,i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="w-6 text-center text-sm font-bold text-gray-500 dark:text-[#94a3b8]">{i+1}</span>
                <img src={p.images?.[0]?.url || 'https://placehold.co/36x36?text=?'} alt={p.name} className="w-9 h-9 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-[#e2e8f0] line-clamp-1">{p.name}</p>
                </div>
                <span className="text-sm font-bold text-[#ea580c]">{p.soldCount} sold</span>
              </div>
            ))}
            {!products?.topSelling?.length && <p className="text-gray-400 text-sm">No data yet</p>}
          </div>
        </div>

        {/* Payment methods pie */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">Payment Methods</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={paymentMethodData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                {paymentMethodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer stats */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-5">Customer Analytics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Customers',    value: customers?.totalCustomers   || 0 },
            { label: 'New (Last 30 Days)', value: customers?.newCustomers     || 0 },
            { label: 'Customers with Orders', value: customers?.customersWithOrders || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 dark:bg-[#1e293b] rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#ea580c]">{value}</p>
              <p className="text-xs text-gray-500 dark:text-[#94a3b8] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default SalesReports
