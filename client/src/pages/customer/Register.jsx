import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { MdEmail, MdLock, MdPerson, MdPhone, MdArrowForward, MdVerified } from 'react-icons/md'

const Register = () => {
  const { t }                      = useTranslation()
  const { register, isAuthenticated } = useAuth()
  const navigate                   = useNavigate()

  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirmPassword:'', phone:'' })
  const [errors,  setErrors]  = useState({})
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
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const result = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone })
    setLoading(false)
    if (result.success) navigate('/')
  }

  const F = ({ k, label, type='text', Icon, placeholder }) => (
    <div>
      <label className="label text-sm">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input type={type}
          className={`input pl-10 text-sm ${errors[k] ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={form[k]}
          onChange={e => { setForm({ ...form, [k]: e.target.value }); setErrors({}) }}
        />
      </div>
      {errors[k] && <p className="text-red-500 text-xs mt-1">{errors[k]}</p>}
    </div>
  )

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
            <h1 className="text-2xl font-extrabold text-white">Welcome to Alex Store!</h1>
            <p className="text-orange-100 text-sm mt-1">Create your free account in seconds</p>
          </div>

          <div className="p-7">
            {/* ── Benefits ── */}
            <div className="mb-5 grid grid-cols-3 gap-2">
              {[
                ['🛍️', 'Shop Online'],
                ['🚚', 'Fast Delivery'],
                ['💳', 'Secure Pay'],
              ].map(([icon, label]) => (
                <div key={label} className="bg-orange-50 dark:bg-[#1e293b] rounded-xl p-2.5 text-center">
                  <div className="text-xl mb-0.5">{icon}</div>
                  <p className="text-[10px] font-semibold text-gray-700 dark:text-[#e2e8f0]">{label}</p>
                </div>
              ))}
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <F k="name"            label={t('auth.name')}            type="text"     Icon={MdPerson}  placeholder="Full Name" />
              <F k="email"           label={t('auth.email')}           type="email"    Icon={MdEmail}   placeholder="you@example.com" />
              <F k="phone"           label={t('auth.phone')}           type="tel"      Icon={MdPhone}   placeholder="+251 9xx xxx xxx" />
              <F k="password"        label={t('auth.password')}        type="password" Icon={MdLock}    placeholder="••••••••" />
              <F k="confirmPassword" label={t('auth.confirmPassword')} type="password" Icon={MdLock}    placeholder="••••••••" />

              <div className="flex items-start gap-2 py-1">
                <MdVerified className="text-green-500 text-base flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-500 dark:text-[#94a3b8] leading-relaxed">
                  By registering you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>

              <button type="submit" disabled={loading}
                className="btn btn-primary w-full py-3 text-sm gap-2">
                {loading
                  ? <span className="spinner w-4 h-4 border-2" />
                  : <><span>{t('auth.registerButton')}</span> <MdArrowForward className="text-base" /></>
                }
              </button>
            </form>

            {/* ── Go to Login ── */}
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-[#334155] text-center">
              <p className="text-sm text-gray-500 dark:text-[#94a3b8] mb-3">
                {t('auth.alreadyHaveAccount')}
              </p>
              <Link to="/login"
                className="btn w-full py-2.5 text-sm font-semibold border-2 border-[#ea580c] text-[#ea580c] hover:bg-orange-50 dark:hover:bg-[#1e293b] gap-2 justify-center">
                {t('auth.loginButton')} — Sign In to Your Account
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

export default Register
