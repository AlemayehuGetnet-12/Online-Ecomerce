import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md'

const Register = () => {
  const { t } = useTranslation()
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) { navigate('/'); return null }

  const validate = () => {
    const e = {}
    if (!form.name)     e.name = t('auth.nameRequired')
    if (!form.email)    e.email = t('auth.emailRequired')
    if (!form.password) e.password = t('auth.passwordRequired')
    if (form.password.length < 6) e.password = t('auth.passwordMinLength')
    if (form.password !== form.confirmPassword) e.confirmPassword = t('auth.passwordMismatch')
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    const result = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone })
    setLoading(false)
    if (result.success) navigate('/')
  }

  const field = (key, label, type = 'text', Icon, placeholder) => (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type={type}
          className={`input pl-10 ${errors[key] ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
        />
      </div>
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0]">{t('auth.registerTitle')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {field('name', t('auth.name'), 'text', MdPerson, 'Full Name')}
            {field('email', t('auth.email'), 'email', MdEmail, 'you@example.com')}
            {field('phone', t('auth.phone'), 'tel', MdPhone, '+251 9xx xxx xxx')}
            {field('password', t('auth.password'), 'password', MdLock, '••••••••')}
            {field('confirmPassword', t('auth.confirmPassword'), 'password', MdLock, '••••••••')}

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-base mt-2">
              {loading ? <span className="spinner" /> : t('auth.registerButton')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-[#94a3b8] mt-6">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-[#ea580c] font-semibold hover:underline">{t('auth.loginButton')}</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Register
