import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import ProductCard from '../../components/customer/ProductCard'
import Loader from '../../components/common/Loader'
import { productAPI, categoryAPI } from '../../services/api'
import {
  MdLocalShipping, MdSecurity, MdVerified, MdSupportAgent,
  MdArrowForward, MdChevronLeft, MdChevronRight,
} from 'react-icons/md'

const SLIDE_META = [
  { key: 'electronics', ctaLink: '/products?category=electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80', gradient: 'from-slate-900/80 via-slate-800/60 to-transparent' },
  { key: 'fashion',     ctaLink: '/products?category=fashion',     image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80', gradient: 'from-pink-900/80 via-pink-800/50 to-transparent' },
  { key: 'home',        ctaLink: '/products?category=home-living', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80', gradient: 'from-amber-900/80 via-amber-800/50 to-transparent' },
  { key: 'beauty',      ctaLink: '/products?category=beauty',      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80', gradient: 'from-rose-900/80 via-rose-800/50 to-transparent' },
  { key: 'coffee',      ctaLink: '/products?category=food',        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80', gradient: 'from-stone-900/80 via-stone-800/50 to-transparent' },
]

/* ─── Hero Carousel ──────────────────────────────────────── */
const HeroCarousel = () => {
  const { t } = useTranslation()
  const slides = SLIDE_META.map(s => ({
    ...s,
    title:    t(`home.slides.${s.key}.title`),
    subtitle: t(`home.slides.${s.key}.subtitle`),
    cta:      t(`home.slides.${s.key}.cta`),
    badge:    t(`home.slides.${s.key}.badge`),
  }))

  const [current,   setCurrent]   = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused,    setPaused]    = useState(false)
  const timerRef = useRef(null)

  const go   = useCallback((idx, dir = 1) => { setDirection(dir); setCurrent(idx) }, [])
  const next = useCallback(() => go((current + 1) % slides.length, 1),  [current, go, slides.length])
  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length, -1), [current, go, slides.length])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, 5000)
    return () => clearTimeout(timerRef.current)
  }, [current, paused, next])

  const variants = {
    enter:  (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(260px, 55vw, 580px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img src={slides[current].image} alt={slides[current].title} className="w-full h-full object-cover" loading="eager" />
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].gradient}`} />
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="max-w-lg"
              >
                <span className="inline-block bg-[#ea580c] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wide shadow">
                  {slides[current].badge}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-md">
                  {slides[current].title}
                </h1>
                <p className="text-white/90 text-sm md:text-lg mb-5 leading-relaxed drop-shadow hidden sm:block">
                  {slides[current].subtitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link to={slides[current].ctaLink} className="btn bg-[#ea580c] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#c2410c] shadow-lg">
                    {slides[current].cta}
                  </Link>
                  <Link to="/products" className="btn bg-white/20 backdrop-blur-sm text-white border border-white/40 px-5 py-2.5 text-sm hover:bg-white/30">
                    {t('common.seeAll')}
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors z-10" aria-label="Previous slide">
        <MdChevronLeft className="text-2xl" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors z-10" aria-label="Next slide">
        <MdChevronRight className="text-2xl" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i, i > current ? 1 : -1)} aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`} />
        ))}
      </div>

      <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full z-10">
        {current + 1} / {slides.length}
      </div>

      {!paused && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-[#ea580c] z-10"
          style={{ animation: 'progressBar 5s linear', animationFillMode: 'forwards' }} />
      )}
      <style>{`@keyframes progressBar { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  )
}

/* ─── Helper components ──────────────────────────────────── */
const FeatureCard = ({ Icon, title, desc }) => (
  <div className="card p-4 text-center">
    <div className="w-10 h-10 bg-orange-50 dark:bg-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-2">
      <Icon className="text-xl text-[#ea580c]" />
    </div>
    <h3 className="font-semibold text-gray-900 dark:text-[#e2e8f0] text-xs sm:text-sm mb-1">{title}</h3>
    <p className="text-xs text-gray-500 dark:text-[#94a3b8] hidden sm:block">{desc}</p>
  </div>
)

const Section = ({ title, href, children, loading, t }) => (
  <section className="py-8">
    <div className="container-custom px-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e2e8f0]">{title}</h2>
        <Link to={href} className="flex items-center gap-1 text-[#ea580c] text-sm font-medium hover:gap-2 transition-all">
          {t('common.seeAll')} <MdArrowForward />
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-10"><Loader size="lg" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {children}
        </div>
      )}
    </div>
  </section>
)

/* ─── Home Page ──────────────────────────────────────────── */
const Home = () => {
  const { t } = useTranslation()
  const [featured,    setFeatured]    = useState([])
  const [bestSelling, setBestSelling] = useState([])
  const [onSale,      setOnSale]      = useState([])
  const [categories,  setCategories]  = useState([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [f, b, s, c] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getBestSelling(),
          productAPI.getOnSale(),
          categoryAPI.getAll({ isActive: true }),
        ])
        setFeatured(f.data.products      || [])
        setBestSelling(b.data.products   || [])
        setOnSale(s.data.products        || [])
        setCategories(c.data.categories  || [])
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
      <Navbar />

      <HeroCarousel />

      {/* Feature Strip */}
      <section className="py-6 bg-gray-50 dark:bg-[#1e293b]">
        <div className="container-custom px-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <FeatureCard Icon={MdLocalShipping} title={t('home.freeShipping')}    desc={t('home.freeShippingDesc')} />
          <FeatureCard Icon={MdSecurity}      title={t('home.securePayment')}   desc={t('home.securePaymentDesc')} />
          <FeatureCard Icon={MdVerified}      title={t('home.qualityProducts')} desc={t('home.qualityProductsDesc')} />
          <FeatureCard Icon={MdSupportAgent}  title={t('home.customerSupport')} desc={t('home.customerSupportDesc')} />
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-8">
          <div className="container-custom px-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#e2e8f0]">{t('home.categories')}</h2>
              <Link to="/products" className="flex items-center gap-1 text-[#ea580c] text-sm font-medium hover:gap-2 transition-all">
                {t('common.seeAll')} <MdArrowForward />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat.slug}`}
                  className="flex-shrink-0 card card-hover p-3 flex flex-col items-center gap-2 min-w-[80px]"
                >
                  {cat.image?.url ? (
                    <img src={cat.image.url} alt={cat.name} className="w-10 h-10 object-cover rounded-full" />
                  ) : (
                    <div className="w-10 h-10 bg-orange-100 dark:bg-[#334155] rounded-full flex items-center justify-center">
                      <span className="text-[#ea580c] font-bold">{cat.name[0]}</span>
                    </div>
                  )}
                  <span className="text-xs font-medium text-gray-700 dark:text-[#e2e8f0] text-center whitespace-nowrap">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Section title={t('home.featured')} href="/products?isFeatured=true" loading={loading && !featured.length} t={t}>
        {featured.slice(0, 5).map(p => <ProductCard key={p._id} product={p} />)}
      </Section>

      <div className="bg-gray-50 dark:bg-[#1e293b]">
        <Section title={t('home.bestSelling')} href="/products?sort=-soldCount" loading={loading && !bestSelling.length} t={t}>
          {bestSelling.slice(0, 5).map(p => <ProductCard key={p._id} product={p} />)}
        </Section>
      </div>

      <Section title={t('home.onSale')} href="/products?discount=true" loading={loading && !onSale.length} t={t}>
        {onSale.slice(0, 5).map(p => <ProductCard key={p._id} product={p} />)}
      </Section>

      {/* Newsletter */}
      <section className="py-12 bg-gradient-to-r from-[#ea580c] to-[#9a3412]">
        <div className="container-custom px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t('home.newsletter')}</h2>
          <p className="text-orange-100 mb-6 text-sm sm:text-base">{t('home.newsletterDesc')}</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder={t('home.emailPlaceholder')} className="input flex-1" />
            <button type="submit" className="btn bg-white text-[#ea580c] px-6 font-semibold hover:bg-orange-50">
              {t('home.subscribe')}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
