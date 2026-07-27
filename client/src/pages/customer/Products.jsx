import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import ProductCard from '../../components/customer/ProductCard'
import Loader from '../../components/common/Loader'
import { productAPI, categoryAPI } from '../../services/api'
import { MdFilterList, MdSearch, MdClose } from 'react-icons/md'

const Products = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [showFilter, setShowFilter] = useState(false)

  const [filters, setFilters] = useState({
    search:   searchParams.get('search')   || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: '',
    sort:     searchParams.get('sort')     || '-createdAt',
  })

  const limit = 12

  const loadProducts = useCallback(async (pg = 1, f = filters) => {
    setLoading(true)
    try {
      const params = { page: pg, limit, ...f }
      Object.keys(params).forEach(k => !params[k] && delete params[k])
      const { data } = await productAPI.getAll(params)
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => { categoryAPI.getAll({ isActive: true }).then(r => setCategories(r.data.categories || [])).catch(() => {}) }, [])
  useEffect(() => { loadProducts(1, filters); setPage(1) }, [filters.category, filters.sort, filters.minPrice, filters.maxPrice, filters.minRating])

  const handleSearchSubmit = e => { e.preventDefault(); loadProducts(1, filters); setPage(1) }
  const handlePageChange   = p => { setPage(p); loadProducts(p, filters) }

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }))

  const sortOptions = [
    { value: '-createdAt', label: t('products.sortNewest') },
    { value: 'price',      label: t('products.sortPriceAsc') },
    { value: '-price',     label: t('products.sortPriceDesc') },
    { value: '-rating',    label: t('products.sortRating') },
    { value: '-soldCount', label: t('products.sortPopular') },
  ]

  const pages = Math.ceil(total / limit)

  const FilterPanel = () => (
    <div className="space-y-5">
      {/* Category */}
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">{t('products.category')}</h4>
        <div className="space-y-2">
          <button
            onClick={() => setFilter('category', '')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-orange-50 text-[#ea580c] font-medium dark:bg-[#334155]' : 'hover:bg-gray-100 dark:hover:bg-[#334155] text-gray-600 dark:text-[#94a3b8]'}`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setFilter('category', cat.slug)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat.slug ? 'bg-orange-50 text-[#ea580c] font-medium dark:bg-[#334155]' : 'hover:bg-gray-100 dark:hover:bg-[#334155] text-gray-600 dark:text-[#94a3b8]'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">{t('products.priceRange')}</h4>
        <div className="flex gap-2">
          <input type="number" className="input text-sm" placeholder="Min" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} />
          <input type="number" className="input text-sm" placeholder="Max" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">{t('products.rating')}</h4>
        {[4,3,2,1].map(r => (
          <button key={r} onClick={() => setFilter('minRating', r)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.minRating === r ? 'bg-orange-50 text-[#ea580c] font-medium' : 'hover:bg-gray-100 dark:hover:bg-[#334155] text-gray-600 dark:text-[#94a3b8]'}`}>
            {r}★ & above
          </button>
        ))}
      </div>

      <button onClick={() => setFilters({ search: '', category: '', minPrice: '', maxPrice: '', minRating: '', sort: '-createdAt' })} className="btn btn-secondary w-full text-sm">
        {t('common.clear')}
      </button>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1">
        {/* Header bar */}
        <div className="bg-gray-50 dark:bg-[#1e293b] border-b border-gray-200 dark:border-[#334155] py-4">
          <div className="container-custom flex flex-wrap gap-3 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-0 max-w-md">
              <input type="text" className="input text-sm" placeholder={t('products.searchPlaceholder')} value={filters.search} onChange={e => setFilter('search', e.target.value)} />
              <button type="submit" className="btn btn-primary px-4"><MdSearch className="text-xl" /></button>
            </form>

            <div className="flex items-center gap-3">
              <select className="select text-sm w-auto" value={filters.sort} onChange={e => setFilter('sort', e.target.value)}>
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button onClick={() => setShowFilter(!showFilter)} className="btn btn-secondary flex items-center gap-2 lg:hidden">
                <MdFilterList /> {t('common.filter')}
              </button>
            </div>
          </div>
        </div>

        <div className="container-custom py-6 flex gap-6">
          {/* Sidebar filter (desktop) */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="card p-4 sticky top-20">
              <h3 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-4 flex items-center gap-2"><MdFilterList /> {t('common.filter')}</h3>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {showFilter && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilter(false)} />
              <div className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-[#1e293b] p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg dark:text-[#e2e8f0]">{t('common.filter')}</h3>
                  <button onClick={() => setShowFilter(false)}><MdClose className="text-2xl" /></button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 dark:text-[#94a3b8] mb-4">{total} products found</p>
            {loading ? (
              <div className="flex justify-center py-20"><Loader size="xl" /></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-[#94a3b8] text-lg">{t('products.noProducts')}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-[#ea580c] text-white' : 'bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-[#94a3b8] hover:bg-orange-50'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Products
