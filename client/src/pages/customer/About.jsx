import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import {
  MdVerified, MdLocalShipping, MdSecurity, MdSupportAgent,
  MdShoppingBag, MdStar, MdGroup, MdStorefront,
} from 'react-icons/md'
import { FaTelegram, FaGithub } from 'react-icons/fa'

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

const StatCard = ({ icon: Icon, value, label, color }) => (
  <motion.div variants={fadeUp} className="card p-6 text-center">
    <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${color}`}>
      <Icon className="text-2xl text-white" />
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1">{value}</p>
    <p className="text-sm text-gray-500 dark:text-[#94a3b8]">{label}</p>
  </motion.div>
)

const ValueCard = ({ icon: Icon, title, desc }) => (
  <motion.div variants={fadeUp} className="card p-6">
    <div className="w-12 h-12 bg-orange-100 dark:bg-[#334155] rounded-xl flex items-center justify-center mb-4">
      <Icon className="text-2xl text-[#ea580c]" />
    </div>
    <h3 className="font-bold text-gray-900 dark:text-[#e2e8f0] mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-[#94a3b8] leading-relaxed">{desc}</p>
  </motion.div>
)

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ea580c] via-[#c2410c] to-[#9a3412]">
        <div className="container-custom py-20 md:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
              About Alex Store
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Ethiopia's Trusted Online Marketplace
            </h1>
            <p className="text-lg text-orange-100 leading-relaxed mb-8">
              Alex Store was founded with one mission — to make online shopping
              easy, safe, and accessible for every Ethiopian. From electronics to
              fashion, food to beauty, we bring quality products to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn bg-white text-[#ea580c] px-7 py-3 font-semibold hover:bg-orange-50">
                Shop Now
              </Link>
              <Link to="/contact" className="btn border-2 border-white text-white hover:bg-white/10 px-7 py-3">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
        {/* decorative */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
          <div className="absolute -right-16 -top-16 w-96 h-96 bg-white rounded-full" />
          <div className="absolute right-20 bottom-0 w-64 h-64 bg-white rounded-full" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-gray-50 dark:bg-[#1e293b]">
        <div className="container-custom">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <StatCard icon={MdGroup}       value="5,000+"  label="Happy Customers"   color="bg-blue-500" />
            <StatCard icon={MdStorefront}  value="1,200+"  label="Products Listed"   color="bg-[#ea580c]" />
            <StatCard icon={MdShoppingBag} value="12,000+" label="Orders Delivered"  color="bg-green-500" />
            <StatCard icon={MdStar}        value="4.8 / 5" label="Average Rating"    color="bg-yellow-500" />
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#ea580c] font-semibold text-sm uppercase tracking-widest">Our Story</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mt-3 mb-5">
                Built for Ethiopians, by an Ethiopian
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-[#94a3b8] leading-relaxed">
                <p>
                  Alex Store was created by <strong className="text-gray-800 dark:text-[#e2e8f0]">Alemayehu Getnet</strong>,
                  a passionate software developer from Addis Ababa, Ethiopia. The platform was born out of a simple
                  observation — Ethiopians deserve a reliable, modern, and user-friendly online shopping experience.
                </p>
                <p>
                  Starting with just a handful of categories, Alex Store has grown into a full marketplace
                  supporting multiple payment methods including Telebirr and CBE Birr, making it easy for
                  anyone across Ethiopia to shop online without needing a bank card.
                </p>
                <p>
                  Our platform supports <strong className="text-gray-800 dark:text-[#e2e8f0]">6 languages</strong> — 
                  English, Amharic, Afaan Oromo, Tigrinya, Arabic, and French — so every customer
                  can shop in the language they are most comfortable with.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#ea580c] to-[#9a3412] rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-6">Our Mission</h3>
                {[
                  'Make online shopping accessible to all Ethiopians',
                  'Offer genuine, quality-verified products',
                  'Support local Ethiopian businesses and sellers',
                  'Provide fast, safe, and reliable delivery',
                  'Build trust through transparency and great service',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4">
                    <MdVerified className="text-orange-200 text-xl flex-shrink-0 mt-0.5" />
                    <p className="text-orange-100 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50 dark:bg-[#1e293b]">
        <div className="container-custom">
          <div className="text-center mb-10">
            <span className="text-[#ea580c] font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mt-3">Our Core Values</h2>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            <ValueCard
              icon={MdVerified}
              title="Genuine Products"
              desc="Every product on Alex Store is verified for authenticity. We partner only with trusted suppliers and brands."
            />
            <ValueCard
              icon={MdLocalShipping}
              title="Fast Delivery"
              desc="We deliver across Ethiopia quickly and reliably. Free shipping on orders above 500 ETB."
            />
            <ValueCard
              icon={MdSecurity}
              title="Secure Payments"
              desc="Shop safely with Telebirr, CBE Birr, or Cash on Delivery. Your payment information is always protected."
            />
            <ValueCard
              icon={MdSupportAgent}
              title="24/7 Support"
              desc="Our support team is always available to help you with any question, order, or issue you have."
            />
          </motion.div>
        </div>
      </section>

      {/* Developer */}
      <section className="py-16">
        <div className="container-custom max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#ea580c] font-semibold text-sm uppercase tracking-widest">The Developer</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mt-3 mb-8">Meet the Creator</h2>
            <div className="card p-8 inline-block w-full">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ea580c] to-[#9a3412] rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-white font-bold text-3xl">A</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1">Alemayehu Getnet</h3>
              <p className="text-[#ea580c] font-medium mb-4">Full-Stack Developer · Addis Ababa, Ethiopia</p>
              <p className="text-gray-600 dark:text-[#94a3b8] text-sm leading-relaxed mb-6 max-w-lg mx-auto">
                Passionate software engineer specializing in full-stack web development. Alex Store is built using
                the MERN stack (MongoDB, Express, React, Node.js) with modern best practices including JWT auth,
                REST APIs, multi-language support, and cloud deployment.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="tel:+251931756792"
                  className="btn btn-primary gap-2 px-5 py-2.5"
                >
                  📞 0931 756 792
                </a>
                <a
                  href="mailto:alexgetnet34@gmail.com"
                  className="btn btn-secondary gap-2 px-5 py-2.5"
                >
                  ✉️ alexgetnet34@gmail.com
                </a>
                <a
                  href="https://t.me/Alemayehu3175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn gap-2 px-5 py-2.5"
                  style={{ background: '#0088cc', color: '#fff' }}
                >
                  <FaTelegram /> @Alemayehu3175
                </a>
                <a
                  href="https://github.com/AlemayehuGetnet-12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn gap-2 px-5 py-2.5"
                  style={{ background: '#24292e', color: '#fff' }}
                >
                  <FaGithub /> AlemayehuGetnet-12
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-[#ea580c] to-[#9a3412]">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-orange-100 mb-8 text-lg">
            Join thousands of happy customers across Ethiopia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn bg-white text-[#ea580c] px-8 py-3 font-semibold hover:bg-orange-50 text-base">
              Browse Products
            </Link>
            <Link to="/register" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-base">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About
