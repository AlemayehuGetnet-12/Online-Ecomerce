import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/common/Loader'
import { categoryAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdAdd, MdEdit, MdDelete, MdClose, MdImage } from 'react-icons/md'

const emptyForm = { name: '', description: '', isActive: true, image: '' }

const CategoryManagement = () => {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showModal,  setShowModal]  = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [form,       setForm]       = useState(emptyForm)
  const [saving,     setSaving]     = useState(false)

  const load = () => { setLoading(true); categoryAPI.getAll().then(r => setCategories(r.data.categories || [])).catch(()=>{}).finally(()=>setLoading(false)) }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [])

  const openAdd  = () => { setForm(emptyForm); setEditItem(null); setShowModal(true) }
  const openEdit = c  => { setForm({ name: c.name, description: c.description || '', isActive: c.isActive, image: c.image?.url || '' }); setEditItem(c); setShowModal(true) }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setForm(f => ({ ...f, image: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const handleSave = async e => {
    e.preventDefault()
    if (!form.name) { toast.error('Category name is required'); return }
    setSaving(true)
    try {
      if (editItem) { await categoryAPI.update(editItem._id, form); toast.success(t('admin.updateSuccess')) }
      else          { await categoryAPI.create(form);               toast.success(t('admin.createSuccess')) }
      setShowModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    setSaving(false)
  }

  const handleDelete = async id => {
    if (!window.confirm(t('admin.confirmDelete'))) return
    try { await categoryAPI.delete(id); toast.success(t('admin.deleteSuccess')); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed') }
  }

  return (
    <AdminLayout title={t('admin.categories')}>
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-gray-500 dark:text-[#94a3b8]">{categories.length} categories</p>
        <button onClick={openAdd} className="btn btn-primary gap-2"><MdAdd className="text-xl" /> {t('admin.addCategory')}</button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader size="xl" /></div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className="card p-4 text-center group">
              {cat.image?.url ? (
                <img src={cat.image.url} alt={cat.name} className="w-16 h-16 object-cover rounded-full mx-auto mb-3" />
              ) : (
                <div className="w-16 h-16 bg-orange-100 dark:bg-[#334155] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#ea580c] font-bold text-2xl">{cat.name[0]}</span>
                </div>
              )}
              <h3 className="font-semibold text-gray-900 dark:text-[#e2e8f0] text-sm mb-1 truncate">{cat.name}</h3>
              <p className="text-xs text-gray-500 dark:text-[#94a3b8] mb-3">{cat.productCount || 0} products</p>
              <span className={`badge text-xs ${cat.isActive ? 'badge-success' : 'badge-gray'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span>
              <div className="flex gap-2 justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-[#334155] rounded-lg"><MdEdit className="text-lg" /></button>
                <button onClick={() => handleDelete(cat._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-[#334155] rounded-lg"><MdDelete className="text-lg" /></button>
              </div>
            </div>
          ))}
          {!categories.length && <div className="col-span-full text-center py-20 text-gray-400">No categories yet</div>}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="card w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-[#334155]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#e2e8f0]">{editItem ? t('admin.editCategory') : t('admin.addCategory')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#334155] rounded-lg"><MdClose className="text-xl" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="label">{t('admin.categoryName')} *</label>
                <input className="input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
              </div>
              <div>
                <label className="label">{t('admin.categoryDescription')}</label>
                <textarea className="textarea" rows={3} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
              </div>
              <div>
                <label className="label">{t('admin.categoryImage')}</label>
                <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 dark:border-[#334155] rounded-xl p-3 cursor-pointer hover:border-[#ea580c]">
                  <MdImage className="text-2xl text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-[#94a3b8]">Click to upload image</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                </label>
                {form.image && <img src={form.image} alt="preview" className="w-20 h-20 object-cover rounded-lg mt-2" />}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-orange-600" checked={form.isActive} onChange={e => setForm(f=>({...f,isActive:e.target.checked}))} />
                <span className="text-sm text-gray-700 dark:text-[#e2e8f0]">{t('admin.active')}</span>
              </label>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">{t('common.cancel')}</button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? <span className="spinner" /> : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default CategoryManagement
