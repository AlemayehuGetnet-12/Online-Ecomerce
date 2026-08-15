import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/common/Loader'
import { productAPI, categoryAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose, MdImage } from 'react-icons/md'

const emptyForm = { name:'', description:'', price:'', discount:'0', category:'', brand:'', stock:'0', isFeatured:false, isActive:true, images:[] }

const ProductManagement = () => {
  const { t } = useTranslation()
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [catLoading, setCatLoading] = useState(true)
  const [loading,    setLoading]    = useState(true)
  const [showModal,  setShowModal]  = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [form,       setForm]       = useState(emptyForm)
  const [saving,     setSaving]     = useState(false)
  const [search,     setSearch]     = useState('')
  const [page,       setPage]       = useState(1)
  const [total,      setTotal]      = useState(0)
  const [errors,     setErrors]     = useState({})
  const limit = 15

  const loadCategories = async () => {
    setCatLoading(true)
    try {
      // no filter — fetch ALL categories so admin always sees them
      const { data } = await categoryAPI.getAll()
      const cats = data.categories || []
      if (cats.length === 0) {
        // fallback: try with explicit no-filter
        const r2 = await categoryAPI.getAll({ limit: 100 })
        setCategories(r2.data.categories || [])
      } else {
        setCategories(cats)
      }
    } catch (err) {
      console.error('Failed to load categories:', err.message)
      setCategories([])
      toast.error('Could not load categories — check your connection')
    } finally {
      setCatLoading(false)
    }
  }

  const load = async (pg=1, q='') => {
    setLoading(true)
    try {
      const params = { page: pg, limit, ...(q && { search: q }) }
      const { data } = await productAPI.getAllAdmin(params)
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
    loadCategories()
  }, [])

  const openAdd  = () => {
    setForm(emptyForm)
    setEditItem(null)
    setErrors({})
    if (categories.length === 0) loadCategories()
    setShowModal(true)
  }

  const openEdit = (p) => {
    setForm({
      name:        p.name,
      description: p.description,
      price:       p.price,
      discount:    p.discount,
      category:    p.category?._id || '',
      brand:       p.brand || '',
      stock:       p.stock,
      isFeatured:  p.isFeatured,
      isActive:    p.isActive,
      images:      p.images || [],
    })
    setErrors({})
    setEditItem(p)
    setShowModal(true)
  }

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setForm(f => ({ ...f, images: [...f.images, ev.target.result] }))
      reader.readAsDataURL(file)
    })
  }

  const handleSave = async e => {
    e.preventDefault()

    // Validate each field individually and show which ones are missing
    const newErrors = {}
    if (!form.name.trim())     newErrors.name     = 'Product name is required'
    if (!form.price)           newErrors.price    = 'Price is required'
    if (Number(form.price) <= 0) newErrors.price  = 'Price must be greater than 0'
    if (!form.category)        newErrors.category = 'Please select a category'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fix the errors below')
      return
    }

    setErrors({})
    setSaving(true)
    try {
      const payload = {
        ...form,
        price:    Number(form.price),
        discount: Number(form.discount || 0),
        stock:    Number(form.stock   || 0),
        images:   form.images.map(img =>
          typeof img === 'string' ? img : img.url || img
        ),
      }
      if (editItem) {
        await productAPI.update(editItem._id, payload)
        toast.success(t('admin.updateSuccess'))
      } else {
        await productAPI.create(payload)
        toast.success(t('admin.createSuccess'))
      }
      setShowModal(false)
      load(page, search)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return
    try { await productAPI.delete(id); toast.success(t('admin.deleteSuccess')); load(page, search) }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed') }
  }

  const pages = Math.ceil(total / limit)

  return (
    <AdminLayout title={t('admin.products')}>
      <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
        <form onSubmit={e => { e.preventDefault(); setPage(1); load(1, search) }} className="flex gap-2">
          <input className="input text-sm w-64" placeholder={t('products.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="btn btn-primary px-4"><MdSearch className="text-xl" /></button>
        </form>
        <button onClick={openAdd} className="btn btn-primary gap-2"><MdAdd className="text-xl" /> {t('admin.addProduct')}</button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#0f172a] text-xs text-gray-600 dark:text-[#94a3b8] uppercase">
              <tr>{['Image','Name','Category','Price','Discount','Stock','Status','Actions'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="text-center py-10"><Loader size="lg" /></td></tr>
              : products.map(p => (
                <tr key={p._id} className="border-t border-gray-100 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1e293b]">
                  <td className="px-4 py-3">
                    <img src={p.images?.[0]?.url || 'https://placehold.co/48x48?text=?'} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-[#e2e8f0] max-w-[180px]">
                    <p className="line-clamp-1">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.brand}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-[#94a3b8]">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-[#e2e8f0]">{p.price?.toFixed(2)} ETB</td>
                  <td className="px-4 py-3">{p.discount > 0 ? <span className="badge badge-danger">{p.discount}%</span> : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= 10 ? 'badge-warning' : 'badge-success'}`}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.isActive ? 'badge-success' : 'badge-gray'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-[#334155] rounded-lg"><MdEdit className="text-lg" /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-[#334155] rounded-lg"><MdDelete className="text-lg" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !products.length && <tr><td colSpan={8} className="text-center py-10 text-gray-400">{t('products.noProducts')}</td></tr>}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="p-4 flex gap-2 justify-center border-t border-gray-200 dark:border-[#334155]">
            {Array.from({ length: pages }, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => { setPage(p); load(p, search) }} className={`w-8 h-8 rounded-lg text-xs font-medium ${page===p ? 'bg-[#ea580c] text-white' : 'bg-gray-100 dark:bg-[#1e293b] text-gray-600 dark:text-[#94a3b8]'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="card w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-[#334155]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#e2e8f0]">{editItem ? t('admin.editProduct') : t('admin.addProduct')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg"><MdClose className="text-xl text-gray-600 dark:text-[#94a3b8]" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="label">{t('admin.productName')} <span className="text-red-500">*</span></label>
                  <input
                    className={`input ${errors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Samsung Galaxy A55"
                    value={form.name}
                    onChange={e => { setForm(f=>({...f,name:e.target.value})); setErrors(er=>({...er,name:''})) }}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠ {errors.name}</p>}
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="label">{t('admin.productDescription')}</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Describe the product..."
                    value={form.description}
                    onChange={e => setForm(f=>({...f,description:e.target.value}))}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="label">{t('admin.productPrice')} (ETB) <span className="text-red-500">*</span></label>
                  <input
                    className={`input ${errors.price ? 'input-error' : ''}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={e => { setForm(f=>({...f,price:e.target.value})); setErrors(er=>({...er,price:''})) }}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠ {errors.price}</p>}
                </div>

                {/* Discount */}
                <div>
                  <label className="label">{t('admin.productDiscount')}</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={form.discount}
                    onChange={e => setForm(f=>({...f,discount:e.target.value}))}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="label">{t('admin.productCategory')} <span className="text-red-500">*</span></label>
                  {catLoading ? (
                    <div className="input flex items-center gap-2 text-gray-400 text-sm">
                      <span className="spinner w-4 h-4 border-2" /> Loading categories...
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="space-y-2">
                      <div className="input text-red-400 text-sm flex items-center gap-2">
                        ⚠ No categories found
                      </div>
                      <button
                        type="button"
                        onClick={loadCategories}
                        className="btn btn-secondary text-xs py-1.5 px-3 gap-1"
                      >
                        🔄 Retry loading categories
                      </button>
                    </div>
                  ) : (
                    <select
                      className={`select ${errors.category ? 'input-error' : ''}`}
                      value={form.category}
                      onChange={e => { setForm(f=>({...f,category:e.target.value})); setErrors(er=>({...er,category:''})) }}
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  )}
                  {errors.category && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠ {errors.category}</p>}
                </div>

                {/* Brand */}
                <div>
                  <label className="label">{t('admin.productBrand')}</label>
                  <input
                    className="input"
                    placeholder="e.g. Samsung"
                    value={form.brand}
                    onChange={e => setForm(f=>({...f,brand:e.target.value}))}
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="label">{t('admin.productStock')}</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.stock}
                    onChange={e => setForm(f=>({...f,stock:e.target.value}))}
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-orange-600" checked={form.isFeatured} onChange={e => setForm(f=>({...f,isFeatured:e.target.checked}))} />
                    <span className="text-sm text-gray-700 dark:text-[#e2e8f0]">{t('admin.featured')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-orange-600" checked={form.isActive} onChange={e => setForm(f=>({...f,isActive:e.target.checked}))} />
                    <span className="text-sm text-gray-700 dark:text-[#e2e8f0]">{t('admin.active')}</span>
                  </label>
                </div>

                {/* Images */}
                <div className="sm:col-span-2">
                  <label className="label">{t('admin.productImages')}</label>
                  <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 dark:border-[#334155] rounded-xl p-4 cursor-pointer hover:border-[#ea580c] transition-colors">
                    <MdImage className="text-3xl text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-[#94a3b8] font-medium">{t('admin.uploadImages')}</p>
                      <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, JPEG — multiple allowed</p>
                    </div>
                    <input type="file" multiple accept="image/*" className="sr-only" onChange={handleImageAdd} />
                  </label>
                  {form.images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={typeof img === 'string' ? img : img.url || img}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-[#334155]"
                          />
                          <button
                            type="button"
                            onClick={() => setForm(f=>({...f,images:f.images.filter((_,j)=>j!==i)}))}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Summary of errors */}
              {Object.keys(errors).filter(k => errors[k]).length > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                  <p className="font-semibold mb-1">Please fix the following:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {Object.values(errors).filter(Boolean).map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">{t('common.cancel')}</button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary px-8"
                >
                  {saving ? <><span className="spinner" /> Saving...</> : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default ProductManagement
