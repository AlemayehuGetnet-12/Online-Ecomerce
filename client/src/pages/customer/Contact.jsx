import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar  from '../../components/common/Navbar'
import Footer  from '../../components/common/Footer'
import toast   from 'react-hot-toast'
import { MdPhone, MdEmail, MdLocationOn, MdSend, MdAccessTime, MdSupportAgent } from 'react-icons/md'
import { FaTelegram, FaGithub } from 'react-icons/fa'

/* ── compact contact card ─────────────────────────────── */
const CCard = ({ icon: Icon, title, value, href, bg, ic }) => {
  const cls = `flex items-center gap-2.5 p-3 rounded-xl card-hover ${href ? 'cursor-pointer' : ''}`
  const inner = (
    <>
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon className={`text-base ${ic}`} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-[#64748b]">{title}</p>
        <p className="text-xs font-semibold text-gray-800 dark:text-[#e2e8f0] truncate">{value}</p>
      </div>
    </>
  )
  if (!href) return <div className={cls}>{inner}</div>
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer" className={cls}>{inner}</a>
  )
}

const Contact = () => {
  const [form, setForm]   = useState({ name:'', email:'', subject:'', message:'' })
  const [busy, setBusy]   = useState(false)

  const submit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Fill all required fields'); return }
    setBusy(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Message sent!')
    setForm({ name:'', email:'', subject:'', message:'' })
    setBusy(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Navbar />

      {/* ── compact hero ── */}
      <section className="bg-gradient-to-br from-[#ea580c] to-[#9a3412] py-8">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
            <h1 className="text-2xl font-extrabold text-white mb-1">Contact Us</h1>
            <p className="text-orange-100 text-xs max-w-sm mx-auto">
              Questions or issues? Reach us any time — we respond fast.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── main content ── */}
      <main className="flex-1 container-custom py-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-3">

            {/* Contact cards — compact */}
            <div className="card p-3 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c] px-1 mb-2">Contact Details</p>
              <CCard icon={MdPhone}      title="Phone"    value="+251 931 756 792"      href="tel:+251931756792"                   bg="bg-green-100 dark:bg-green-900/30" ic="text-green-600" />
              <CCard icon={MdEmail}      title="Email"    value="alexgetnet34@gmail.com" href="mailto:alexgetnet34@gmail.com"       bg="bg-blue-100 dark:bg-blue-900/30"   ic="text-blue-600" />
              <CCard icon={FaTelegram}   title="Telegram" value="@Alemayehu3175"         href="https://t.me/Alemayehu3175"          bg="bg-sky-100 dark:bg-sky-900/30"     ic="text-sky-500"  />
              <CCard icon={FaGithub}     title="GitHub"   value="AlemayehuGetnet-12"     href="https://github.com/AlemayehuGetnet-12" bg="bg-gray-100 dark:bg-gray-800"   ic="text-gray-700 dark:text-white" />
              <CCard icon={MdLocationOn} title="Location" value="Addis Ababa, Ethiopia"  href={null}                               bg="bg-orange-100 dark:bg-orange-900/30" ic="text-[#ea580c]" />
            </div>

            {/* Working hours — compact */}
            <div className="card p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MdAccessTime className="text-purple-600 text-sm" />
                </span>
                <p className="text-xs font-bold text-gray-800 dark:text-[#e2e8f0]">Working Hours</p>
              </div>
              <div className="space-y-1 text-xs text-gray-600 dark:text-[#94a3b8]">
                {[
                  ['Mon – Fri', '8:00 AM – 8:00 PM'],
                  ['Saturday',  '9:00 AM – 6:00 PM'],
                  ['Sunday',    '10:00 AM – 4:00 PM'],
                ].map(([day, time]) => (
                  <div key={day} className="flex justify-between">
                    <span>{day}</span>
                    <span className="font-semibold text-gray-900 dark:text-[#e2e8f0]">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 24/7 support — green, compact */}
            <div className="rounded-xl p-3" style={{ background:'linear-gradient(135deg,#16a34a,#15803d)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <MdSupportAgent className="text-white text-lg flex-shrink-0" />
                <p className="text-xs font-bold text-white">24/7 Customer Support</p>
              </div>
              <p className="text-green-100 text-xs leading-relaxed">
                For urgent orders or delivery issues, contact us on Telegram or by phone.
                We respond within minutes during working hours.
              </p>
            </div>
          </div>

          {/* Right column — form */}
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }}
              className="card p-5">

              <h2 className="text-base font-bold text-gray-900 dark:text-[#e2e8f0] mb-4 flex items-center gap-2">
                <MdSend className="text-[#ea580c]" /> Send Us a Message
              </h2>

              <form onSubmit={submit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Full Name <span className="text-red-500">*</span></label>
                    <input className="input text-sm py-1.5" placeholder="Your name"
                      value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                  </div>
                  <div>
                    <label className="label text-xs">Email <span className="text-red-500">*</span></label>
                    <input type="email" className="input text-sm py-1.5" placeholder="you@example.com"
                      value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                  </div>
                </div>

                <div>
                  <label className="label text-xs">Subject</label>
                  <select className="select text-sm py-1.5"
                    value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}>
                    <option value="">Select a topic</option>
                    <option value="order">Order Issue</option>
                    <option value="delivery">Delivery Question</option>
                    <option value="payment">Payment Problem</option>
                    <option value="product">Product Inquiry</option>
                    <option value="return">Return / Refund</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="label text-xs">Message <span className="text-red-500">*</span></label>
                  <textarea className="textarea text-sm" rows={4} placeholder="Tell us how we can help..."
                    value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
                </div>

                <button type="submit" disabled={busy}
                  className="btn btn-primary w-full py-2.5 text-sm gap-2">
                  {busy
                    ? <><span className="spinner w-4 h-4 border-2" /> Sending...</>
                    : <><MdSend /> Send Message</>}
                </button>
              </form>

              {/* Quick contact */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#334155]">
                <p className="text-xs text-gray-400 text-center mb-2">Or reach us directly</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="tel:+251931756792"
                    className="btn btn-secondary py-2 gap-1.5 text-xs justify-center">
                    <MdPhone className="text-green-500" /> Call Now
                  </a>
                  <a href="https://t.me/Alemayehu3175" target="_blank" rel="noopener noreferrer"
                    className="btn py-2 gap-1.5 text-xs justify-center text-white" style={{ background:'#0088cc' }}>
                    <FaTelegram /> Telegram
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
