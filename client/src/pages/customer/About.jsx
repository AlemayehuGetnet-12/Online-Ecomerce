import { useState } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import {
  MdVerified, MdLocalShipping, MdSecurity, MdSupportAgent,
  MdShoppingBag, MdStar, MdGroup, MdStorefront,
} from 'react-icons/md'
import { FaTelegram, FaGithub } from 'react-icons/fa'

const fade = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit:   { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

const SectionTitle = ({ badge, title, subtitle }) => (
  <div className="text-center mb-10">
    <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#ea580c] bg-orange-50 dark:bg-[#1e293b] px-3 py-1 rounded-full mb-3">{badge}</span>
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mt-1">{title}</h2>
    {subtitle && <p className="text-gray-500 dark:text-[#94a3b8] mt-3 max-w-xl mx-auto text-sm leading-relaxed">{subtitle}</p>}
  </div>
)

/* ── TAB CONTENT COMPONENTS ─────────────────────────────── */
const TabStory = () => (
  <motion.div key="story" variants={fade} initial="hidden" animate="show" exit="exit">
    <SectionTitle badge="Our Story" title="Built for Ethiopians, by an Ethiopian"
      subtitle="How a simple idea grew into Ethiopia's most trusted online marketplace." />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div className="space-y-5 text-gray-600 dark:text-[#94a3b8] leading-relaxed text-sm sm:text-base">
        <p><strong className="text-gray-900 dark:text-[#e2e8f0]">Alex Store</strong> was founded in 2023 by{' '}
          <strong className="text-[#ea580c]">Alemayehu Getnet</strong>, a software developer from Addis Ababa who noticed a gap — Ethiopian shoppers had no reliable, modern, multilingual online marketplace built for them.</p>
        <p>The journey started small: a handful of product categories, a simple checkout, and a dream. Within months the platform expanded to support Telebirr and CBE Birr payments — removing the biggest barrier for shoppers without international bank cards.</p>
        <p>Today Alex Store serves thousands of customers across Ethiopia in <strong className="text-gray-900 dark:text-[#e2e8f0]">6 languages</strong>: English, Amharic, Afaan Oromo, Tigrinya, Arabic and French.</p>
        <p>What began as a one-person project has grown into a full-stack platform used by mobile users, product engineers and entrepreneurs who believe Ethiopia's digital future starts with accessible commerce.</p>
      </div>
      <div>
        <div className="bg-gradient-to-br from-[#ea580c] to-[#9a3412] rounded-2xl p-7 text-white mb-4">
          <h3 className="text-lg font-bold mb-5">Mission · Vision · Values</h3>
          {[
            { e:'🎯', t:'Mission', d:'Make online shopping easy, safe and accessible for every Ethiopian.' },
            { e:'🔭', t:'Vision',  d:"Become Ethiopia's most trusted e-commerce marketplace by 2027." },
            { e:'💎', t:'Values',  d:'Integrity, quality, customer-first, speed and transparency.' },
            { e:'🌍', t:'Impact',  d:"Support local businesses and grow Ethiopia's digital economy." },
          ].map(({ e, t, d }) => (
            <div key={t} className="flex items-start gap-3 mb-4 last:mb-0">
              <span className="text-xl flex-shrink-0 mt-0.5">{e}</span>
              <div><p className="font-semibold text-sm text-orange-100 mb-0.5">{t}</p>
                <p className="text-orange-100/80 text-xs leading-relaxed">{d}</p></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[['2023','Founded'],['2024','6 Languages'],['2026','12K+ Orders']].map(([y,l]) => (
            <div key={y} className="card p-3 text-center">
              <p className="text-xl font-extrabold text-[#ea580c]">{y}</p>
              <p className="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
)

const BRANDS = [
  { name:'Samsung',     cat:'Electronics',      emoji:'📱', desc:'Global leader in mobile phones, TVs and home appliances.' },
  { name:'Apple',       cat:'Electronics',      emoji:'🍎', desc:'Premium iPhones, iPads and accessories.' },
  { name:'Nike',        cat:'Sports & Fashion', emoji:'👟', desc:'World-renowned sportswear and running shoes.' },
  { name:'Sony',        cat:'Electronics',      emoji:'🎧', desc:'High-quality headphones, cameras and audio.' },
  { name:'Dell',        cat:'Electronics',      emoji:'💻', desc:'Reliable laptops and business computers.' },
  { name:'GlowLab',     cat:'Beauty',           emoji:'✨', desc:'Ethiopian skincare using natural ingredients.' },
  { name:'Kaffa Beans', cat:'Food',             emoji:'☕', desc:'Premium single-origin Ethiopian coffee.' },
  { name:'FitLife',     cat:'Sports',           emoji:'🏋️', desc:'Affordable, quality fitness accessories.' },
  { name:'StyleHub',    cat:'Fashion',          emoji:'👗', desc:'Contemporary fashion for modern women.' },
  { name:'FurniCraft',  cat:'Home Living',      emoji:'🛋️', desc:'Handcrafted Ethiopian furniture and decor.' },
  { name:'IronFit',     cat:'Sports',           emoji:'🏃', desc:'Professional gym and workout equipment.' },
  { name:'TimeMaster',  cat:'Accessories',      emoji:'⌚', desc:'Classic and modern watches for every style.' },
]

const TabBrands = () => {
  const [search, setSearch] = useState('')
  const [cat,    setCat]    = useState('All')
  const cats = ['All', ...Array.from(new Set(BRANDS.map(b => b.cat)))]
  const filtered = BRANDS.filter(b =>
    (cat === 'All' || b.cat === cat) &&
    b.name.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <motion.div key="brands" variants={fade} initial="hidden" animate="show" exit="exit">
      <SectionTitle badge="Our Brands" title="Products We Trust"
        subtitle="Alex Store works exclusively with verified suppliers and recognized brands to guarantee authenticity." />
      {/* filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search brands..."
          className="input text-sm max-w-xs" />
        <div className="flex flex-wrap gap-2">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${cat === c ? 'bg-[#ea580c] text-white' : 'bg-gray-100 dark:bg-[#334155] text-gray-600 dark:text-[#94a3b8] hover:bg-orange-50'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {/* grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">No brands found.</div>
        )}
        {filtered.map(({ name, cat: c, emoji, desc }) => (
          <div key={name} className="card p-4 flex flex-col items-center text-center card-hover">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-[#334155] flex items-center justify-center mb-3 text-3xl">{emoji}</div>
            <h3 className="font-bold text-gray-900 dark:text-[#e2e8f0] text-sm mb-0.5">{name}</h3>
            <span className="text-[10px] font-semibold text-[#ea580c] uppercase tracking-wider mb-2">{c}</span>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link to="/products" className="btn btn-primary px-8 py-3">Browse All Products</Link>
      </div>
    </motion.div>
  )
}

const JOBS = [
  { title:'Frontend Developer', type:'Full-time · Remote',      dept:'Engineering', skills:['React','Tailwind','TypeScript'],   desc:'Build fast, accessible React UIs for Ethiopian shoppers. Mobile-first, clean code, great UX.' },
  { title:'Backend Engineer',   type:'Full-time · Addis Ababa', dept:'Engineering', skills:['Node.js','MongoDB','JWT'],         desc:'Design and scale our Node.js API, MongoDB schemas and payment integrations.' },
  { title:'Mobile Developer',   type:'Full-time · Remote',      dept:'Engineering', skills:['React Native','Expo'],            desc:'Build our React Native app for iOS and Android for millions of Ethiopian users.' },
  { title:'Product Engineer',   type:'Full-time · Addis Ababa', dept:'Product',     skills:['A/B Testing','Analytics','Agile'],desc:'Bridge product vision and engineering. Run experiments, track metrics, improve conversion.' },
  { title:'UI/UX Designer',     type:'Contract · Remote',       dept:'Design',      skills:['Figma','Prototyping','Research'],  desc:'Design mobile-first experiences native to Ethiopian users and culture.' },
  { title:'Customer Support',   type:'Part-time · Addis Ababa', dept:'Support',     skills:['Amharic','English','Communication'], desc:"Be the voice of Alex Store. Help customers with orders and payments." },
]

const TabCareers = () => (
  <motion.div key="careers" variants={fade} initial="hidden" animate="show" exit="exit">
    <SectionTitle badge="Careers" title="Join Our Growing Team"
      subtitle="We are a small but mighty team building the future of Ethiopian e-commerce." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
      {JOBS.map(({ title, type, dept, desc, skills }) => (
        <div key={title} className="card p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-[#e2e8f0] text-sm">{title}</h3>
              <p className="text-xs text-gray-400 dark:text-[#94a3b8] mt-0.5">{type}</p>
            </div>
            <span className="badge badge-info text-[10px] flex-shrink-0">{dept}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-[#94a3b8] leading-relaxed">{desc}</p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {skills.map(s => (
              <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-50 dark:bg-[#334155] text-[#ea580c]">{s}</span>
            ))}
          </div>
          <a href={`mailto:alexgetnet34@gmail.com?subject=Application: ${title}`}
            className="btn btn-primary w-full py-2 text-xs mt-1">Apply Now</a>
        </div>
      ))}
    </div>
    <div className="bg-gradient-to-br from-[#ea580c] to-[#9a3412] rounded-2xl p-7 text-white">
      <h3 className="text-lg font-bold mb-5 text-center">Why Work at Alex Store?</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[['🌍','Real Impact','Your code helps thousands of Ethiopians daily.'],
          ['🏠','Remote-Friendly','Most roles are remote or hybrid.'],
          ['📈','Grow Fast','Small team = big responsibility from day one.'],
          ['💡','Latest Tech','React 19, Node.js, MongoDB Atlas, Vite 8.'],
        ].map(([e,t,d]) => (
          <div key={t} className="text-center">
            <div className="text-2xl mb-1">{e}</div>
            <p className="font-bold text-sm mb-1">{t}</p>
            <p className="text-orange-100 text-xs">{d}</p>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
)

const PRESS = [
  { date:'Aug 2026', tag:'Launch',    emoji:'🚀', title:'Multi-Language Platform Launches for Ethiopian Shoppers', body:'Alex Store officially launched support for 6 languages — making it the only Ethiopian e-commerce platform to serve English, Amharic, Afaan Oromo, Tigrinya, Arabic and French speakers nationwide.' },
  { date:'Jul 2026', tag:'Payment',   emoji:'💳', title:'Telebirr & CBE Birr Integration Enables Cashless Shopping', body:'Over 30 million mobile money users across Ethiopia can now shop online without a bank card after Alex Store integrated both Telebirr and CBE Birr payment systems.' },
  { date:'Jun 2026', tag:'Product',   emoji:'📊', title:'New Admin Dashboard Gives Sellers Real-Time Insights', body:'A brand new Admin Dashboard was released featuring live sales charts, inventory alerts, customer analytics and full order management in a single responsive interface.' },
  { date:'May 2026', tag:'Community', emoji:'🇪🇹', title:'Local Brand Partnership Promotes Ethiopian-Made Products', body:"Alex Store launched its 'Made in Ethiopia' collection, partnering with Kaffa Beans, GlowLab and StyleHub to promote Ethiopian-made products to a global audience." },
  { date:'Mar 2026', tag:'Mobile',    emoji:'📱', title:'Mobile-First Redesign Brings App-Like Experience', body:'A full mobile redesign with bottom navigation, touch-optimized cards, live search suggestions and one-tap checkout made mobile the primary platform.' },
  { date:'Jan 2026', tag:'Milestone', emoji:'🎉', title:'Alex Store Surpasses 5,000 Customers in First Year', body:'Less than one year after launch, Alex Store reached 5,000 registered customers and 12,000 delivered orders across Ethiopia.' },
]

const TabPress = () => (
  <motion.div key="press" variants={fade} initial="hidden" animate="show" exit="exit">
    <SectionTitle badge="Press & Media" title="Alex Store in the News"
      subtitle="Official press releases, announcements and media resources for journalists and content creators." />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      {PRESS.map(({ date, tag, emoji, title, body }) => (
        <div key={title} className="card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{date}</span>
            <span className="badge badge-info text-[10px]">{tag}</span>
          </div>
          <div className="text-3xl">{emoji}</div>
          <h3 className="font-bold text-gray-900 dark:text-[#e2e8f0] text-sm leading-snug">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-[#94a3b8] leading-relaxed flex-1">{body}</p>
        </div>
      ))}
    </div>
    <div className="card p-7">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-3">Media Kit</h3>
          <p className="text-sm text-gray-600 dark:text-[#94a3b8] leading-relaxed mb-5">
            Journalists and content creators can request our official logos, brand guidelines, product screenshots,
            founder biography and company fact sheet. Contact us directly for interviews.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:alexgetnet34@gmail.com?subject=Press Inquiry" className="btn btn-primary gap-2 text-sm px-5 py-2.5">📧 Press Inquiry</a>
            <a href="https://github.com/AlemayehuGetnet-12" target="_blank" rel="noopener noreferrer" className="btn btn-secondary gap-2 text-sm px-5 py-2.5">📦 GitHub</a>
            <a href="https://t.me/Alemayehu3175" target="_blank" rel="noopener noreferrer" className="btn gap-2 text-sm px-5 py-2.5 text-white" style={{background:'#0088cc'}}>✈️ Telegram</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[['🖼️','Logo Pack','SVG, PNG, dark & light'],['📐','Brand Guide','Colors, fonts, spacing'],
            ['📸','Screenshots','App screens & products'],['📄','Fact Sheet','Stats, timeline, team']].map(([e,t,d]) => (
            <div key={t} className="card p-4 text-center bg-gray-50 dark:bg-[#0f172a]">
              <div className="text-2xl mb-1">{e}</div>
              <p className="text-sm font-semibold text-gray-900 dark:text-[#e2e8f0]">{t}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{d}</p>
              <a href="mailto:alexgetnet34@gmail.com?subject=Media Kit" className="text-[10px] font-bold text-[#ea580c] hover:underline mt-1.5 inline-block">Request →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
)

const TabDeveloper = () => (
  <motion.div key="developer" variants={fade} initial="hidden" animate="show" exit="exit">
    <SectionTitle badge="The Developer" title="Meet the Creator"
      subtitle="Alex Store is built and maintained by one passionate Ethiopian developer." />
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-[#ea580c] to-[#9a3412] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
          <span className="text-white font-bold text-4xl">A</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-1">Alemayehu Getnet</h3>
        <p className="text-[#ea580c] font-semibold mb-1">Full-Stack Developer</p>
        <p className="text-sm text-gray-400 dark:text-[#94a3b8] mb-5">Addis Ababa, Ethiopia</p>
        <p className="text-sm text-gray-600 dark:text-[#94a3b8] leading-relaxed mb-6 max-w-lg mx-auto">
          Passionate software engineer specializing in full-stack web development. Alex Store is built
          with the MERN stack — MongoDB, Express, React 19, Node.js — with JWT auth, REST APIs,
          multi-language support (6 languages), Tailwind CSS, Framer Motion and cloud deployment on Vercel + Render.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {['React 19','Node.js','MongoDB','Tailwind CSS','Framer Motion','i18next','JWT','Cloudinary'].map(s => (
            <span key={s} className="text-xs px-3 py-1 rounded-full bg-orange-50 dark:bg-[#334155] text-[#ea580c] font-medium">{s}</span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="tel:+251931756792" className="btn btn-primary gap-2 px-5 py-2.5">📞 0931 756 792</a>
          <a href="mailto:alexgetnet34@gmail.com" className="btn btn-secondary gap-2 px-5 py-2.5">✉️ alexgetnet34@gmail.com</a>
          <a href="https://t.me/Alemayehu3175" target="_blank" rel="noopener noreferrer" className="btn gap-2 px-5 py-2.5 text-white" style={{background:'#0088cc'}}>
            <FaTelegram /> @Alemayehu3175
          </a>
          <a href="https://github.com/AlemayehuGetnet-12" target="_blank" rel="noopener noreferrer" className="btn gap-2 px-5 py-2.5 text-white" style={{background:'#24292e'}}>
            <FaGithub /> AlemayehuGetnet-12
          </a>
        </div>
      </div>
    </div>
  </motion.div>
)

/* ── TABS CONFIG ─────────────────────────────────────────── */
const TABS = [
  { id:'story',     label:'📖 Our Story',      Component: TabStory     },
  { id:'brands',    label:'🏷️ Brands',          Component: TabBrands    },
  { id:'careers',   label:'💼 Careers',         Component: TabCareers   },
  { id:'press',     label:'📰 Press & Media',   Component: TabPress     },
  { id:'developer', label:'👤 The Developer',   Component: TabDeveloper },
]

/* ── MAIN PAGE ───────────────────────────────────────────── */
const About = () => {
  const [activeTab, setActiveTab] = useState('story')
  const ActiveComponent = TABS.find(t => t.id === activeTab)?.Component || TabStory

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ea580c] via-[#c2410c] to-[#9a3412] py-14 md:py-20">
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="max-w-2xl">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">About Alex Store</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">Ethiopia's Trusted Online Marketplace</h1>
            <p className="text-orange-100 text-base mb-6 leading-relaxed max-w-lg">
              Founded to make quality online shopping accessible, fast and safe for every Ethiopian.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="btn bg-white text-[#ea580c] font-bold px-6 py-2.5">Shop Now</Link>
              <Link to="/contact"  className="btn border-2 border-white/60 text-white hover:bg-white/10 px-6 py-2.5">Contact Us</Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white rounded-full" />
          <div className="absolute right-24 bottom-0 w-64 h-64 bg-white rounded-full" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-gray-50 dark:bg-[#1e293b]">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { Icon:MdGroup,       value:'5,000+',  label:'Happy Customers', bg:'bg-blue-500'   },
            { Icon:MdStorefront,  value:'1,200+',  label:'Products Listed', bg:'bg-[#ea580c]'  },
            { Icon:MdShoppingBag, value:'12,000+', label:'Orders Delivered',bg:'bg-green-500'  },
            { Icon:MdStar,        value:'4.8 / 5', label:'Average Rating',  bg:'bg-yellow-500' },
          ].map(({ Icon, value, label, bg }) => (
            <div key={label} className="card p-4 text-center">
              <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${bg}`}>
                <Icon className="text-lg text-white" />
              </div>
              <p className="text-xl font-extrabold text-gray-900 dark:text-[#e2e8f0]">{value}</p>
              <p className="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur border-b border-gray-200 dark:border-[#334155] shadow-sm">
        <div className="container-custom overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max">
            {TABS.map(({ id, label }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === id
                    ? 'border-[#ea580c] text-[#ea580c] bg-orange-50/50 dark:bg-[#1e293b]'
                    : 'border-transparent text-gray-500 dark:text-[#94a3b8] hover:text-[#ea580c] hover:border-orange-300'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="flex-1 container-custom py-12">
        <AnimatePresence mode="wait">
          <ActiveComponent key={activeTab} />
        </AnimatePresence>
      </main>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-[#ea580c] to-[#9a3412]">
        <div className="container-custom text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Start Shopping?</h2>
          <p className="text-orange-100 mb-6">Join thousands of happy customers across Ethiopia.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products" className="btn bg-white text-[#ea580c] font-bold px-8 py-3">Browse Products</Link>
            <Link to="/register" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-3">Create Account</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About
