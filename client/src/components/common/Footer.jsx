import { Link } from 'react-router-dom'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { FaTelegram, FaGithub, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'

const FL = ({ to, href, children }) => {
  const cls = 'flex items-center gap-1.5 text-xs footer-link py-0.5 hover:text-[#ea580c] transition-colors'
  const dot = <span className="w-1 h-1 rounded-full bg-[#ea580c] flex-shrink-0 opacity-50" />
  if (href) return <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
    rel="noopener noreferrer" className={cls}>{dot}{children}</a>
  return <Link to={to} className={cls}>{dot}{children}</Link>
}

const Col = ({ title, children }) => (
  <div>
    <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#ea580c' }}>{title}</h4>
    <ul className="space-y-0">{children}</ul>
  </div>
)

const Footer = () => (
  <footer className="mt-auto alex-footer"
    style={{ background: 'linear-gradient(135deg,#d1d5db 0%,#c0c0c0 50%,#b8bec7 100%)', borderTop: '1px solid #a0a8b4' }}>
    <style>{`
      .dark footer.alex-footer {
        background: linear-gradient(135deg,#1c2333 0%,#232d3f 60%,#1a2540 100%) !important;
        border-top-color: #fd4416 !important;
      }
      footer.alex-footer, footer.alex-footer p, footer.alex-footer span { color:#374151; }
      .dark footer.alex-footer, .dark footer.alex-footer p, .dark footer.alex-footer span { color:#94a3b8; }
      footer.alex-footer h4 { color:#ea580c !important; }
      footer.alex-footer .footer-link { color:#374151; }
      .dark footer.alex-footer .footer-link { color:#94a3b8; }
      footer.alex-footer .footer-link:hover { color:#ea580c !important; }
      .dark footer.alex-footer .footer-link:hover { color:#f97316 !important; }
      footer.alex-footer .fs { background:rgba(0,0,0,0.09); color:#4b5563; }
      .dark footer.alex-footer .fs { background:rgba(255,255,255,0.06); color:#94a3b8; }
      footer.alex-footer .fd { border-color:rgba(0,0,0,0.14); }
      .dark footer.alex-footer .fd { border-color:#2e3a50; }
      footer.alex-footer .fi { background:rgba(0,0,0,0.07); }
      .dark footer.alex-footer .fi { background:rgba(255,255,255,0.05); }
    `}</style>

    <div className="container-custom py-7">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

        {/* Brand — 2 cols on lg */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[red] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-extrabold text-base">A</span>
            </div>
            <span className="text-base font-extrabold text-yellow-400 dark:text-[#2e588f]">Alex Store</span>
          </div>
          <p className="text-xs leading-relaxed mb-3 max-w-xs">
            Ethiopia's trusted online marketplace. Fast delivery · Secure payment · Genuine products.
          </p>

          {/* Social */}
          <div className="flex items-center gap-1 mb-1">
            {[
              { href: 'https://t.me/Alemayehu3175',            Icon: FaTelegram,   label: 'Telegram',   c: 'hover:text-red-500' },
              { href: 'https://github.com/AlemayehuGetnet-12',  Icon: FaGithub,    label: 'GitHub',     c: 'hover:text-gray-900 dark:hover:text-white' },
              { href: '#',                                        Icon: FaInstagram, label: 'Instagram',  c: 'hover:text-pink-500' },
              { href: '#',                                        Icon: FaFacebook,  label: 'Facebook',   c: 'hover:text-blue-600' },
              { href: '#',                                        Icon: FaTwitter,   label: 'Twitter',    c: 'hover:text-sky-400' },
            ].map(({ href, Icon, label, c }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className={`fs w-7 h-7 rounded-full flex items-center justify-center transition-all text-sm ${c}`}>
                <Icon />
              </a>
            ))}
          </div>

          {/* Contact */}
          <ul className="space-y-1">
            {[
              { href: 'tel:+251931756792',             Icon: MdPhone,    txt: '+251 931 756 792' },
              { href: 'mailto:alexgetnet34@gmail.com',  Icon: MdEmail,      txt: 'alexgetnet34@gmail.com' },
              { href: 'https://t.me/Alemayehu3175',    Icon: FaTelegram,   txt: '@Alemayehu3175' },
              { href: null,                             Icon: MdLocationOn, txt: 'Addis Ababa, Ethiopia' },
            ].map(({ href, Icon, txt }) => {
              const inner = (
                <span className="flex items-center gap-2 text-xs">
                  <span className="fi w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="text-[#300d4d] text-xs" />
                  </span>
                  {txt}
                </span>
              )
              return (
                <li key={txt}>
                  {href
                    ? <a href={href} target={href?.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer" className="hover:text-[#ea580c] transition-colors">
                        {inner}
                      </a>
                    : inner
                  }
                </li>
              )
            })}
          </ul>
        </div>

        {/* About Alex Store */}
        <Col title="About Alex Store">
          <li><FL to="/about">About Us</FL></li>
          <li><FL to="/about">Our Story</FL></li>
          <li><FL to="/about#careers">Careers</FL></li>
          <li><FL to="/about#brands">Our Brands</FL></li>
          <li><FL to="/about">Press & Media</FL></li>
        </Col>

        {/* Customer Service */}
        <Col title="Customer Service">
          <li><FL to="/help">Help Center</FL></li>
          <li><FL to="/shipping">Shipping Info</FL></li>
          <li><FL to="/returns">Returns & Refunds</FL></li>
          <li><FL to="/contact">Contact Us</FL></li>
          <li><FL to="/orders">Track My Order</FL></li>
        </Col>

        {/* Shop */}
        <Col title="Shop">
          <li><FL to="/products?sort=-soldCount">Best Sellers</FL></li>
          <li><FL to="/products?sort=-createdAt">New Arrivals</FL></li>
          <li><FL to="/products?category=fashion">Fashion</FL></li>
          <li><FL to="/products?category=electronics">Electronics</FL></li>
          <li><FL to="/products?discount=true">On Sale</FL></li>
          <li><FL to="/products?isFeatured=true">Featured</FL></li>
        </Col>

        {/* Who We Are (Mission/Vision/Values) */}
        <Col title="Who We Are">
          <li><FL to="/about">🎯 Mission</FL></li>
          <li><FL to="/about">🔭 Vision</FL></li>
          <li><FL to="/about">💎 Values</FL></li>
          <li><FL to="/contact">🤝 Help</FL></li>
          
        </Col>
      </div>

      {/* Bottom bar */}
      <div className="fd border-t mt-5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <p>© {new Date().getFullYear()} Alex Store. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <Link to="/terms"   className="footer-link">Terms</Link>
          <span>
            Built by{' '}
            <a href="https://alemayehu-news-app.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="text-[red] font-semibold hover:underline">
              Alemayehu Getnet
            </a>
          </span>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
