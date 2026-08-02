import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const FAQS = [
  { q: 'How do I place an order?',        a: 'Browse products, click "Add to Cart", then go to Cart → Checkout. Fill in your shipping address, choose a payment method and click "Place Order".' },
  { q: 'What payment methods are accepted?', a: 'We accept Telebirr, CBE Birr and Cash on Delivery. More payment options are coming soon.' },
  { q: 'How long does delivery take?',    a: 'Delivery within Addis Ababa takes 1–3 business days. Outside Addis Ababa takes 3–7 business days depending on your location.' },
  { q: 'Can I track my order?',           a: 'Yes. Go to My Orders in your profile and click on any order to see its current status and history.' },
  { q: 'How do I cancel an order?',       a: 'You can cancel an order that is still in "Pending" or "Confirmed" status. Go to My Orders, open the order and click Cancel Order.' },
  { q: 'What is the return policy?',      a: 'We accept returns within 7 days of delivery for items that are unused and in original packaging. Contact us to start a return.' },
  { q: 'Is my payment information safe?', a: 'Yes. We use secure, encrypted connections for all transactions. We never store your payment credentials.' },
  { q: 'How do I change my password?',    a: 'Go to Profile → Change Password. Enter your current password and choose a new one.' },
  { q: 'Can I shop without creating an account?', a: 'You need an account to place orders. Registration is free and takes less than a minute.' },
  { q: 'How do I contact customer support?', a: 'Call us at +251 931 756 792, email alexgetnet34@gmail.com or reach us on Telegram @Alemayehu3175.' },
]

const TOPICS = [
  { icon: '📦', label: 'Orders',    to: '/orders'   },
  { icon: '🚚', label: 'Shipping',  to: '/shipping' },
  { icon: '↩️', label: 'Returns',   to: '/returns'  },
  { icon: '💳', label: 'Payments',  to: '/contact'  },
  { icon: '👤', label: 'Account',   to: '/profile'  },
  { icon: '💬', label: 'Contact',   to: '/contact'  },
]

const HelpCenter = () => {
  const [open, setOpen] = useState(null)
  const [search, setSearch] = useState('')
  const filtered = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#ea580c] to-[#9a3412] py-14">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">❓ Help Center</h1>
            <p className="text-orange-100 mb-7 max-w-md mx-auto text-sm">Find answers to common questions or contact our team directly.</p>
            <div className="max-w-lg mx-auto">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search for help..." className="input text-sm" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Topic shortcuts */}
      <section className="py-8 bg-gray-50 dark:bg-[#1e293b]">
        <div className="container-custom">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {TOPICS.map(({ icon, label, to }) => (
              <Link key={label} to={to}
                className="card p-4 flex flex-col items-center gap-2 text-center card-hover">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-[#e2e8f0]">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <main className="flex-1 container-custom py-12 max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6">
          Frequently Asked Questions
          {search && <span className="text-base font-normal text-gray-400 ml-2">— {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"</span>}
        </h2>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>No results found. <Link to="/contact" className="text-[#ea580c] hover:underline">Contact us</Link> directly.</p>
          </div>
        )}

        <div className="space-y-2">
          {filtered.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4">
                <span className="font-semibold text-sm text-gray-900 dark:text-[#e2e8f0]">{faq.q}</span>
                <span className={`text-lg flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}>⌄</span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                    exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }}>
                    <div className="px-5 pb-4 text-sm text-gray-600 dark:text-[#94a3b8] leading-relaxed border-t border-gray-100 dark:border-[#334155] pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-10 card p-6 text-center bg-orange-50 dark:bg-[#1e293b] border-[#ea580c]/20">
          <p className="text-gray-700 dark:text-[#e2e8f0] font-semibold mb-3">Still need help?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+251931756792" className="btn btn-primary gap-2 text-sm">📞 Call Us</a>
            <Link to="/contact" className="btn btn-secondary gap-2 text-sm">💬 Contact Us</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HelpCenter
