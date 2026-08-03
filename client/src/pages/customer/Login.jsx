import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { MdEmail, MdLock, MdArrowForward } from 'react-icons/md'

const Login = () => {
  const { t }                    = useTranslation()
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const navigate                 = useNavigate()
  const location                 = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, from, navigate])

  if (authLoading || isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="spinner w-8 h-8 border-2 border-[#ea580c]" />
        </main>
        <Footer />
      </div>
    )
  }

  const validate = () => {
    const e = {}
    if (!form.email)  e.email    = t('auth.emailRequired')
    if (!form.password) e.password = t('auth.passwordRequired')
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) navigate(from, { replace: true })
  }

  const fillDemo = (role) => {
    if (role === 'admin')
      setForm({ email: 'admin@alexstore.com',    password: 'admin123' })
    else
      setForm({ email: 'customer@alexstore.com', password: 'customer123' })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.4 }}
          className="card w-full max-w-md overflow-hidden">

          {/* ── Welcome banner ── */}
          <div className="bg-gradient-to-r from-[#ea580c] to-[#c2410c] px-8 py-7 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-extrabold text-2xl">A</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Welcome Back!</h1>
            <p className="text-orange-100 text-sm mt-1">Sign in to your Alex Store account</p>
          </div>

          <div className="p-7">
            {/* ── Demo quick-fill ── */}
            <div className="mb-5 p-3 bg-orange-50 dark:bg-[#1e293b] rounded-xl border border-orange-200 dark:border-[#334155]">
              <p className="text-xs text-gray-500 dark:text-[#94a3b8] text-center mb-2">Try a demo account</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => fillDemo('customer')}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-[#ea580c] text-white hover:bg-[#c2410c] transition-colors">
                  👤 Customer Demo
                </button>
                <button type="button" onClick={() => fillDemo('admin')}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-[#ea580c] text-[#ea580c] hover:bg-orange-50 dark:hover:bg-[#334155] transition-colors">
                  🛠 Admin Demo
                </button>
              </div>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label text-sm">{t('auth.email')}</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input type="email"
                    className={`input pl-10 text-sm ${errors.email ? 'input-error' : ''}`}
                    placeholder="your@example.com"
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({}) }}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="label text-sm">{t('auth.password')}</label>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input type="password"
                    className={`input pl-10 text-sm ${errors.password ? 'input-error' : ''}`}
                    placeholder="insert password"
                    value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({}) }}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="btn btn-primary w-full py-3 text-sm gap-2 mt-1">
                {loading
                  ? <span className="spinner w-4 h-4 border-2" />
                  : <><span>{t('auth.loginButton')}</span> <MdArrowForward className="text-base" /></>
                }
              </button>
            </form>

            {/* ── Go to Register ── */}
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-[#334155] text-center">
              <p className="text-sm text-gray-500 dark:text-[#94a3b8] mb-3">
                {t('auth.dontHaveAccount')}
              </p>
              <Link to="/register" state={location.state}
                className="btn w-full py-2.5 text-sm font-semibold border-2 border-[#ea580c] text-[#ea580c] hover:bg-orange-50 dark:hover:bg-[#1e293b] gap-2 justify-center">
                {t('auth.registerButton')} — Create a Free Account
                <MdArrowForward className="text-base" />
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

export default Login
