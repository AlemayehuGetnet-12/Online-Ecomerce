import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const eligible = [
  { item:'Wrong item received',          eligible: true  },
  { item:'Damaged or defective product', eligible: true  },
  { item:'Item not as described',        eligible: true  },
  { item:'Unused item in original pack', eligible: true  },
  { item:'Item used or opened',          eligible: false },
  { item:'Digital/downloadable products',eligible: false },
  { item:'Perishable food items',        eligible: false },
  { item:'Returns after 7 days',         eligible: false },
]

const steps = [
  { n:'1', title:'Contact Us',      desc:'Email or call us within 7 days of delivery. Describe the issue and include your order number.',    emoji:'📞' },
  { n:'2', title:'We Review',       desc:'Our team reviews your request within 24 hours and confirms if your return is approved.',           emoji:'🔍' },
  { n:'3', title:'Send it Back',    desc:'Package the item securely and hand it to our delivery agent or drop it at the designated point.',  emoji:'📦' },
  { n:'4', title:'Refund Issued',   desc:'Once we receive and inspect the item, your refund is processed within 3–5 business days.',         emoji:'💰' },
]

const Returns = () => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
    <Navbar />

    <section className="bg-gradient-to-br from-[#ea580c] to-[#9a3412] py-14">
      <div className="container-custom text-center">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">↩️ Returns & Refunds</h1>
          <p className="text-orange-100 max-w-md mx-auto text-sm">Not satisfied? We make returns easy. 7-day return policy on eligible items.</p>
        </motion.div>
      </div>
    </section>

    <main className="flex-1 container-custom py-12">
      {/* Policy summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { emoji:'📅', title:'7 Days',     desc:'Return window from delivery date' },
          { emoji:'💸', title:'Full Refund', desc:'For eligible items in original condition' },
          { emoji:'⚡', title:'3–5 Days',   desc:'Refund processing time after receipt' },
        ].map(({ emoji, title, desc }) => (
          <div key={title} className="card p-5 text-center">
            <div className="text-3xl mb-2">{emoji}</div>
            <p className="font-bold text-gray-900 dark:text-[#e2e8f0]">{title}</p>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8] mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {/* How to return */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6 text-center">How to Return an Item</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {steps.map(({ n, title, desc, emoji }) => (
          <div key={n} className="card p-5 text-center">
            <div className="w-8 h-8 bg-[#ea580c] rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">{n}</div>
            <div className="text-3xl mb-2">{emoji}</div>
            <h3 className="font-bold text-gray-900 dark:text-[#e2e8f0] text-sm mb-1">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Eligibility */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6 text-center">What Can Be Returned?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-12">
        {eligible.map(({ item, eligible: ok }) => (
          <div key={item} className={`flex items-center gap-3 p-3 rounded-xl ${ok ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <span className="text-lg flex-shrink-0">{ok ? '✅' : '❌'}</span>
            <span className={`text-sm ${ok ? 'text-green-700 dark:text-green-300' : 'text-red-600 dark:text-red-400'}`}>{item}</span>
          </div>
        ))}
      </div>

      <div className="text-center flex flex-wrap justify-center gap-3">
        <Link to="/contact"  className="btn btn-primary px-8 py-3 gap-2">📞 Start a Return</Link>
        <Link to="/orders"   className="btn btn-secondary px-8 py-3 gap-2">📦 View My Orders</Link>
      </div>
    </main>
    <Footer />
  </div>
)

export default Returns
