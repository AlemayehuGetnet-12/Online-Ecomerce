import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MdLanguage, MdCheck } from 'react-icons/md'

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'om', name: 'Afaan Oromo', nativeName: 'Afaan Oromo' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
]

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
        aria-label="Select language"
      >
        <MdLanguage className="text-xl text-gray-700 dark:text-dark-text" />
        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-dark-text">
          {currentLanguage.nativeName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`
                  w-full px-4 py-2 text-left text-sm flex items-center justify-between
                  hover:bg-gray-100 dark:hover:bg-dark-border transition-colors
                  ${i18n.language === lang.code ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-dark-text'}
                `}
              >
                <span>{lang.nativeName}</span>
                {i18n.language === lang.code && <MdCheck className="text-lg" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
