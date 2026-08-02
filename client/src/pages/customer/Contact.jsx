import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import toast from 'react-hot-toast'
import {
  MdPhone, MdEmail, MdLocationOn, MdSend,
  MdAccessTime, MdSupportAgent,
} from 'react-icons/md'
import { FaTelegram, FaGithub } from 'react-icons/fa'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const ContactCard = ({ icon: Icon, title, value, href, color, iconColor }) => (
  <motion.a
    variants={fadeUp}
    href={href}
    target={href?.startsWith('http') ? '_blank' : undefined}
    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    className={`card p-5 flex items-start gap-4 card-hover ${href ? 'cursor-pointer' : 'cursor-default'}`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className={`text-2xl ${iconColor}`} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#94a3b8] mb-1">{title}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-[#e2e8f0] break-all">{value}</p>
    </div>
  </motion.a>
)

const Contact = () => {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }
    setSending(true)
    // Simulate sending (in production connect to an email API)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Message sent! We will get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-sky-600 dark:bg-[#0f172a]">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[rgb(73,97,163)] to-[#369736] py-16  dark:bg-[#0f172a] ">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Contact Us</h1>
            <p className="text-orange-100 text-lg max-w-xl mx-auto">
              Have a question, suggestion, or need help? We'd love to hear from you.
              Reach us any time through the channels below.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 container-custom py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: contact info */}
          <div className="lg:col-span-2 space-y-5">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-gray-900 dark:text-[#20508f] mb-6"
            >
              Our Contact Details
            </motion.h2>

            <motion.div
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <ContactCard
                icon={MdPhone}
                title="Phone"
                value="+251 931 756 792"
                href="tel:+251931756792"
                color="bg-green-100 dark:bg-green-900/30"
                iconColor="text-green-600"
              />
              <ContactCard
                icon={MdEmail}
                title="Email"
                value="alexgetnet34@gmail.com"
                href="mailto:alexgetnet34@gmail.com"
                color="bg-blue-100 dark:bg-blue-900/30"
                iconColor="text-blue-600"
              />
              <ContactCard
                icon={FaTelegram}
                title="Telegram"
                value="@Alemayehu3175"
                href="https://t.me/Alemayehu3175"
                color="bg-sky-100 dark:bg-sky-900/30"
                iconColor="text-sky-500"
              />
              <ContactCard
                icon={FaGithub}
                title="GitHub"
                value="AlemayehuGetnet-12"
                href="https://github.com/AlemayehuGetnet-12"
                color="bg-gray-100 dark:bg-gray-800"
                iconColor="text-gray-700 dark:text-[#e2e8f0]"
              />
              <ContactCard
                icon={MdLocationOn}
                title="Location"
                value="Addis Ababa, Ethiopia"
                href={null}
                color="bg-orange-100 dark:bg-orange-900/30"
                iconColor="text-[#ea580c]"
              />
            </motion.div>

            {/* Hours */}
            <div className="card p-5 mt-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MdAccessTime className="text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-[#e2e8f0]">Working Hours</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-[#94a3b8]">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-medium text-gray-900 dark:text-[#e2e8f0]">8:00 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-gray-900 dark:text-[#e2e8f0]">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-gray-900 dark:text-[#e2e8f0]">10:00 AM – 4:00 PM</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="card p-5 border-0" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
              <div className="flex items-center gap-3 mb-3">
                <MdSupportAgent className="text-white text-2xl flex-shrink-0" />
                <h3 className="font-bold text-white">24/7 Customer Support</h3>
              </div>
              <p className="text-orange-100 text-sm leading-relaxed">
                For urgent orders or delivery issues, contact us directly on Telegram or by phone.
                We respond within minutes during working hours.
              </p>
            </div>
          </div>

          {/* Right: contact form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6 flex items-center gap-2">
                <MdSend className="text-[#ea580c]" /> Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">full Name <span className="text-red-500">*</span></label>
                    <input
                      className="input"
                      placeholder="your full name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      className="input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Subject</label>
                  <select
                    className="select"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  >
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
                  <label className="label">Message <span className="text-red-500">*</span></label>
                  <textarea
                    className="textarea"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn btn-primary w-full py-3 text-base gap-2"
                >
                  {sending
                    ? <><span className="spinner" /> Sending...</>
                    : <><MdSend className="text-lg" /> Send Message</>
                  }
                </button>
              </form>

              {/* Quick contact buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#334155]">
                <p className="text-sm text-gray-500 dark:text-[#94a3b8] text-center mb-4">
                  Or reach us directly
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="tel:+251931756792"
                    className="btn btn-secondary py-2.5 gap-2 text-sm justify-center"
                  >
                    <MdPhone className="text-green-500 text-lg" /> Call Now
                  </a>
                  <a
                    href="https://t.me/Alemayehu3175"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn py-2.5 gap-2 text-sm justify-center text-white"
                    style={{ background: '#0088cc' }}
                  >
                    <FaTelegram className="text-lg" /> Telegram
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
