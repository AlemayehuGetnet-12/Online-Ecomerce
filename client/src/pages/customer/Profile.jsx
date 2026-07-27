import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { MdPerson, MdLock, MdSave } from 'react-icons/md'

const Profile = () => {
  const { t } = useTranslation()
  const { user, updateUser } = useAuth()

  const [profile, setProfile] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    address: { street: user?.address?.street || '', city: user?.address?.city || '', region: user?.address?.region || '', country: user?.address?.country || 'Ethiopia' },
  })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving,  setSaving]   = useState(false)
  const [pwSaving,setPwSaving] = useState(false)
  const [tab,     setTab]      = useState('profile')

  const saveProfile = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await authAPI.updateProfile(profile)
      updateUser(data.user)
      toast.success(t('profile.profileUpdated'))
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    setSaving(false)
  }

  const savePassword = async e => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error(t('auth.passwordMismatch')); return }
    if (passwords.newPassword.length < 6) { toast.error(t('auth.passwordMinLength')); return }
    setPwSaving(true)
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      toast.success(t('profile.passwordUpdated'))
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update password') }
    setPwSaving(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 container-custom py-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#ea580c] rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0]">{user?.name}</h1>
            <p className="text-gray-500 dark:text-[#94a3b8] text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-[#334155]">
            {[['profile', MdPerson, 'Profile'], ['password', MdLock, 'Password']].map(([k, Icon, label]) => (
              <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${tab === k ? 'border-b-2 border-[#ea580c] text-[#ea580c]' : 'text-gray-600 dark:text-[#94a3b8] hover:text-[#ea580c]'}`}>
                <Icon className="text-lg" /> {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === 'profile' ? (
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">{t('profile.name')}</label>
                    <input className="input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">{t('profile.phone')}</label>
                    <input className="input" type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input className="input" type="email" value={user?.email} disabled className="opacity-60 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input className="input" value={profile.address.city} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, city: e.target.value } }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Street Address</label>
                    <input className="input" value={profile.address.street} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, street: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="label">Region</label>
                    <input className="input" value={profile.address.region} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, region: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <input className="input" value={profile.address.country} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, country: e.target.value } }))} />
                  </div>
                </div>
                <button type="submit" disabled={saving} className="btn btn-primary px-8 py-3">
                  {saving ? <span className="spinner" /> : <><MdSave className="text-lg" /> {t('profile.updateProfile')}</>}
                </button>
              </form>
            ) : (
              <form onSubmit={savePassword} className="space-y-4 max-w-sm">
                {[['currentPassword', t('profile.currentPassword')], ['newPassword', t('profile.newPassword')], ['confirmPassword', t('profile.confirmPassword')]].map(([k, label]) => (
                  <div key={k}>
                    <label className="label">{label}</label>
                    <input type="password" className="input" value={passwords[k]} onChange={e => setPasswords(p => ({ ...p, [k]: e.target.value }))} placeholder="••••••••" />
                  </div>
                ))}
                <button type="submit" disabled={pwSaving} className="btn btn-primary px-8 py-3">
                  {pwSaving ? <span className="spinner" /> : t('profile.updatePassword')}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile
