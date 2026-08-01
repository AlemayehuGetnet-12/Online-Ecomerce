import { Link } from 'react-router-dom'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { FaTelegram, FaGithub, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'

/* ── helper ──────────────────────────────────────────────── */
const FooterLink = ({ to, href, children, external }) => {
  const cls = 'footer-link flex items-center gap-2 text-sm transition-colors py-1 hover:text-[#ea580c] hover:translate-x-1'
  const dot  = <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] flex-shrink-0 opacity-60" />
  if (external)
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{dot}{children}</a>
  return <Link to={to} className={cls}>{dot}{children}</Link>
}

const FooterSection = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#ea580c' }}>
      {title}
    </h3>
    <ul className="space-y-0.5">{children}</ul>
  </div>
)

/* ── Footer ──────────────────────────────────────────────── */
const Footer = () => (
  <footer
    className="mt-auto alex-footer"
    style={{
      background:  'linear-gradient(135deg,#d1d5db 0%,#c0c0c0 50%,#b8bec7 100%)',
      borderTop:   '1px solid #a0a8b4',
    }}
  >
    <style>{`
      .dark footer.alex-footer {
        background: linear-gradient(135deg,#1c2333 0%,#232d3f 60%,#1a2540 100%) !important;
        border-top-color: #2e3a50 !important;
      }
      footer.alex-footer,
      footer.alex-footer p,
      footer.alex-footer span { color: #374151; }
      .dark footer.alex-footer,
      .dark footer.alex-footer p,
      .dark footer.alex-footer span { color: #94a3b8; }
      footer.alex-footer h3 { color: #ea580c !important; }
      footer.alex-footer .footer-link { color: #374151; }
      .dark footer.alex-footer .footer-link { color: #94a3b8; }
      footer.alex-footer .footer-link:hover { color: #ea580c !important; }
      .dark footer.alex-footer .footer-link:hover { color: #f97316 !important; }
      footer.alex-footer .footer-social {
        background: rgba(0,0,0,0.10);
        color: #4b5563;
      }
      .dark footer.alex-footer .footer-social {
        background: rgba(255,255,255,0.07);
        color: #94a3b8;
      }
      footer.alex-footer .footer-divider {
        border-color: rgba(0,0,0,0.15);
      }
      .dark footer.alex-footer .footer-divider {
        border-color: #2e3a50;
      }
      footer.alex-footer .footer-contact-icon {
        background: rgba(0,0,0,0.08);
      }
      .dark footer.alex-footer .footer-contact-icon {
        background: rgba(255,255,255,0.06);
      }
    `}</style>

    <div className="container-custom py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

        {/* ── Brand col (2 units wide on lg) ───────────────── */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#ea580c] rounded-xl flex items-center justify-center shadow flex-shrink-0">
              <span className="text-white font-extrabold text-xl">A</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-[#e2e8f0]">Alex Store</span>
          </div>
          <p className="text-sm leading-relaxed mb-5 max-w-xs">
            Your trusted online marketplace for quality products across Ethiopia.
            Fast delivery · Secure payment · Genuine products.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2 mb-6">
            {[
              { href: 'https://t.me/Alemayehu3175',           Icon: FaTelegram,  label: 'Telegram',  extra: 'hover:text-sky-500'  },
              { href: 'https://github.com/AlemayehuGetnet-12', Icon: FaGithub,   label: 'GitHub',    extra: 'hover:text-gray-900 dark:hover:text-white' },
              { href: '#',                                      Icon: FaInstagram,label: 'Instagram', extra: 'hover:text-pink-500' },
              { href: '#',                                      Icon: FaFacebook, label: 'Facebook',  extra: 'hover:text-blue-600' },
              { href: '#',                                      Icon: FaTwitter,  label: 'Twitter',   extra: 'hover:text-sky-400'  },
            ].map(({ href, Icon, label, extra }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className={`footer-social w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${extra}`}>
                <Icon className="text-base" />
              </a>
            ))}
          </div>

          {/* Contact info */}
          <ul className="space-y-2.5">
            {[
              { href: 'tel:+251931756792',           icon: MdPhone,      text: '+251 931 756 792',         cls: 'hover:text-[#ea580c]'  },
              { href: 'mailto:alexgetnet34@gmail.com', icon: MdEmail,     text: 'alexgetnet34@gmail.com',   cls: 'hover:text-[#ea580c]'  },
              { href: 'https://t.me/Alemayehu3175',   icon: FaTelegram,  text: '@Alemayehu3175',           cls: 'hover:text-sky-500'    },
              { href: null,                            icon: MdLocationOn,text: 'Addis Ababa, Ethiopia',    cls: ''                      },
            ].map(({ href, icon: Icon, text, cls }) => (
              <li key={text}>
                {href ? (
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 text-sm transition-colors ${cls}`}>
                    <span className="footer-contact-icon w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="text-[#ea580c] text-sm" />
                    </span>
                    {text}
                  </a>
                ) : (
                  <span className="flex items-center gap-2.5 text-sm">
                    <span className="footer-contact-icon w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="text-[#ea580c] text-sm" />
                    </span>
                    {text}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ── About Alex Store ─────────────────────────────── */}
        <FooterSection title="About Alex Store">
          <li><FooterLink to="/about">About Us</FooterLink></li>
          <li><FooterLink to="/about#story">Our Story</FooterLink></li>
          <li><FooterLink to="/about#careers">Careers</FooterLink></li>
          <li><FooterLink to="/about#brands">Our Brands</FooterLink></li>
          <li><FooterLink to="/about">Press & Media</FooterLink></li>
        </FooterSection>

        {/* ── Customer Service ─────────────────────────────── */}
        <FooterSection title="Customer Service">
          <li><FooterLink to="/contact">Help Center</FooterLink></li>
          <li><FooterLink to="/contact#shipping">Shipping Info</FooterLink></li>
          <li><FooterLink to="/contact#returns">Returns & Refunds</FooterLink></li>
          <li><FooterLink to="/contact">Contact Us</FooterLink></li>
          <li><FooterLink to="/orders">Track My Order</FooterLink></li>
        </FooterSection>

        {/* ── Shop ─────────────────────────────────────────── */}
        <FooterSection title="Shop">
          <li><FooterLink to="/products?sort=-soldCount">Best Sellers</FooterLink></li>
          <li><FooterLink to="/products?sort=-createdAt">New Arrivals</FooterLink></li>
          <li><FooterLink to="/products?category=fashion">Fashion</FooterLink></li>
          <li><FooterLink to="/products?category=electronics">Electronics</FooterLink></li>
          <li><FooterLink to="/products?discount=true">On Sale</FooterLink></li>
          <li><FooterLink to="/products?isFeatured=true">Featured</FooterLink></li>
        </FooterSection>

      </div>

      {/* ── Bottom bar ───────────────────────────────────── */}
      <div className="footer-divider border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p>© {new Date().getFullYear()} Alex Store. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <Link to="/terms"   className="footer-link">Terms of Service</Link>
          <span>
            Built by{' '}
            <a href="https://github.com/AlemayehuGetnet-12" target="_blank" rel="noopener noreferrer"
              className="text-[#ea580c] font-semibold hover:underline">
              Alemayehu Getnet
            </a>
          </span>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
