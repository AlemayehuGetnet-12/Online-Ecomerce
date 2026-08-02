import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const zones = [
  { zone:'Addis Ababa',         time:'1 – 3 business days', cost:'Free over 500 ETB, else 50 ETB',  emoji:'🏙️' },
  { zone:'Oromia (nearby)',     time:'3 – 5 business days', cost:'80 ETB flat rate',                  emoji:'🌿' },
  { zone:'Amhara Region',       time:'3 – 6 business days', cost:'100 ETB flat rate',                 emoji:'🏔️' },
  { zone:'SNNPR',               time:'4 – 7 business days', cost:'100 ETB flat rate',                 emoji:'🌾' },
  { zone:'Tigray Region',       time:'5 – 8 business days', cost:'120 ETB flat rate',                 emoji:'🏛️' },
  { zone:'Other Regions',       time:'5 – 10 business days',cost:'Contact for quote',                emoji:'📍' },
]

const steps = [
  { step:'1', title:'Place Your Order',      desc:'Choose your items, add to cart and complete checkout with your address and payment.', emoji:'🛒' },
  { step:'2', title:'Order Confirmed',       desc:'You receive a confirmation and your order is prepared for dispatch within 24 hours.', emoji:'✅' },
  { step:'3', title:'Out for Delivery',      desc:'Your package is picked up and dispatched to your delivery address.', emoji:'🚚' },
  { step:'4', title:'Delivered',             desc:'Your order arrives at your door. For cash on delivery, payment is collected here.', emoji:'📦' },
]

const Shipping = () => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
    <Navbar />

    <section className="bg-gradient-to-br from-[#ea580c] to-[#9a3412] py-14">
      <div className="container-custom text-center">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">🚚 Shipping Information</h1>
          <p className="text-orange-100 max-w-md mx-auto text-sm">Fast, reliable delivery across Ethiopia. Free shipping on orders over 500 ETB.</p>
        </motion.div>
      </div>
    </section>

    <main className="flex-1 container-custom py-12">
      {/* How it works */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6 text-center">How Delivery Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        {steps.map(({ step, title, desc, emoji }) => (
          <div key={step} className="card p-5 text-center relative">
            <div className="w-8 h-8 bg-[#ea580c] rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">{step}</div>
            <div className="text-3xl mb-2">{emoji}</div>
            <h3 className="font-bold text-gray-900 dark:text-[#e2e8f0] text-sm mb-1">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Delivery zones */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6 text-center">Delivery Zones & Times</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {zones.map(({ zone, time, cost, emoji }) => (
          <div key={zone} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{emoji}</span>
              <h3 className="font-bold text-gray-900 dark:text-[#e2e8f0] text-sm">{zone}</h3>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-600 dark:text-[#94a3b8]">⏱ <span className="font-medium">{time}</span></p>
              <p className="text-xs text-gray-600 dark:text-[#94a3b8]">💰 <span className="font-medium">{cost}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="card p-6 bg-orange-50 dark:bg-[#1e293b] border-[#ea580c]/20 mb-8">
        <h3 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-3">📋 Important Notes</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-[#94a3b8]">
          <li>• Orders placed before 2:00 PM are dispatched the same day (business days only).</li>
          <li>• Delivery times are estimates and may vary during holidays or peak periods.</li>
          <li>• You will receive an SMS/notification when your order is out for delivery.</li>
          <li>• Make sure your phone number is correct — our delivery team will call before arrival.</li>
          <li>• For Cash on Delivery, please have the exact amount ready.</li>
        </ul>
      </div>

      <div className="text-center">
        <Link to="/orders" className="btn btn-primary px-8 py-3 gap-2">📦 Track My Order</Link>
      </div>
    </main>
    <Footer />
  </div>
)

export default Shipping
