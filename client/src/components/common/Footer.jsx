import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { FaTelegram, FaGithub, FaInstagram, FaFacebook } from 'react-icons/fa'

const Footer = () => {
  const { t } = useTranslation()

  const socialLinks = [
    {
      href:  'https://t.me/Alemayehu3175',
      icon:  FaTelegram,
      label: 'Telegram',
      color: 'hover:text-sky-500',
    },
    {
      href:  'https://github.com/AlemayehuGetnet-12',
      icon:  FaGithub,
      label: 'GitHub',
      color: 'hover:text-gray-900 dark:hover:text-white',
    },
    {
      href:  'https://www.instagram.com/',
      icon:  FaInstagram,
      label: 'Instagram',
      color: 'hover:text-pink-500',
    },
    {
      href:  'https://www.facebook.com/',
      icon:  FaFacebook,
      label: 'Facebook',
      color: 'hover:text-blue-600',
    },
  ]

  return (
    <footer className="mt-auto alex-footer" style={{ background: 'linear-gradient(135deg, #d1d5db 0%, #c0c0c0 50%, #b8bec7 100%)', borderTop: '1px solid #a0a8b4' }}>
      <style>{`
        .dark footer.alex-footer {
          background: linear-gradient(135deg, #1c2333 0%, #232d3f 50%, #1a2540 100%) !important;
          border-top-color: #2e3a50 !important;
        }
        footer.alex-footer h3          { color: #1f2937 !important; }
        .dark footer.alex-footer h3    { color: #e2e8f0 !important; }
        footer.alex-footer p,
        footer.alex-footer span:not(.dot-bullet) { color: #374151; }
        .dark footer.alex-footer p,
        .dark footer.alex-footer span:not(.dot-bullet) { color: #94a3b8; }
        footer.alex-footer a:not(:hover)        { color: #374151; }
        .dark footer.alex-footer a:not(:hover)  { color: #94a3b8; }
        footer.alex-footer .footer-link:hover        { color: #ea580c !important; }
        .dark footer.alex-footer .footer-link:hover  { color: #f97316 !important; }
        footer.alex-footer .social-btn {
          background: rgba(0,0,0,0.10);
          color: #4b5563;
        }
        .dark footer.alex-footer .social-btn {
          background: rgba(255,255,255,0.07);
          color: #94a3b8;
        }
        footer.alex-footer .contact-icon-wrap {
          background: rgba(0,0,0,0.08);
        }
        .dark footer.alex-footer .contact-icon-wrap {
          background: rgba(255,255,255,0.06);
        }
        footer.alex-footer .footer-divider {
          border-color: rgba(0,0,0,0.15);
        }
        .dark footer.alex-footer .footer-divider {
          border-color: #2e3a50;
        }
      `}</style>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#ea580c] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#e2e8f0]">Alex Store</h3>
            </div>
            <p className="text-gray-600 dark:text-[#94a3b8] text-sm leading-relaxed mb-5">
              Your trusted online marketplace for quality products across Ethiopia.
              Shop with confidence — fast delivery, secure payment, genuine products.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`social-btn w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${color}`}
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-[#e2e8f0] mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/',        label: t('nav.home') },
                { to: '/products', label: t('nav.products') },
                { to: '/about',   label: t('footer.aboutUs') },
                { to: '/contact', label: t('footer.contactUs') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="footer-link text-sm text-gray-600 dark:text-[#94a3b8] hover:text-[#ea580c] dark:hover:text-[#f97316] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 bg-[#ea580c] rounded-full flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-[#e2e8f0] mb-4">
              {t('footer.customerService')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/orders',  label: t('nav.orders') },
                { to: '/profile', label: t('profile.title') },
                { to: '/cart',    label: t('nav.cart') },
                { to: '/wishlist', label: t('nav.wishlist') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="footer-link text-sm text-gray-600 dark:text-[#94a3b8] hover:text-[#ea580c] dark:hover:text-[#f97316] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 bg-[#ea580c] rounded-full flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-[#e2e8f0] mb-4">
              {t('footer.contactUs')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+251931756792"
                  className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-[#94a3b8] hover:text-[#ea580c] dark:hover:text-[#f97316] transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#334155] flex items-center justify-center flex-shrink-0">
                    <MdPhone className="text-[#ea580c] text-base" />
                  </span>
                  +251 931 756 792
                </a>
              </li>
              <li>
                <a
                  href="mailto:alexgetnet34@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-[#94a3b8] hover:text-[#ea580c] dark:hover:text-[#f97316] transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#334155] flex items-center justify-center flex-shrink-0">
                    <MdEmail className="text-[#ea580c] text-base" />
                  </span>
                  alexgetnet34@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/Alemayehu3175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-[#94a3b8] hover:text-sky-500 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#334155] flex items-center justify-center flex-shrink-0">
                    <FaTelegram className="text-sky-500 text-base" />
                  </span>
                  @Alemayehu3175
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/AlemayehuGetnet-12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-[#94a3b8] hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#334155] flex items-center justify-center flex-shrink-0">
                    <FaGithub className="text-gray-700 dark:text-[#94a3b8] text-base" />
                  </span>
                  AlemayehuGetnet-12
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-[#94a3b8]">
                <span className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#334155] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MdLocationOn className="text-[#ea580c] text-base" />
                </span>
                Addis Ababa, Ethiopia
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-divider border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-[#94a3b8]">
            © {new Date().getFullYear()} Alex Store. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 dark:text-[#94a3b8]">
            Built by{' '}
            <a
              href="https://github.com/AlemayehuGetnet-12"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ea580c] hover:underline font-medium"
            >
              Alemayehu Getnet
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
