import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { MdEmail, MdLock } from 'react-icons/md'

const Login = () => {
  const { t } = useTranslation()
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) { navigate(from, { replace: true }); return null }

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = t('auth.emailRequired')
    if (!form.password) e.password = t('auth.passwordRequired')
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) navigate(from, { replace: true })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0]">{t('auth.loginTitle')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">{t('auth.email')}</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">{t('auth.password')}</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="password"
                  className={`input pl-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-base">
              {loading ? <span className="spinner" /> : t('auth.loginButton')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-[#94a3b8] mt-6">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="text-[#ea580c] font-semibold hover:underline">{t('auth.registerButton')}</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login
