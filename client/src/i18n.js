import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import en from './locales/en.json'
import am from './locales/am.json'
import om from './locales/om.json'
import ti from './locales/ti.json'
import ar from './locales/ar.json'
import fr from './locales/fr.json'

const resources = {
  en: { translation: en },
  am: { translation: am },
  om: { translation: om },
  ti: { translation: ti },
  ar: { translation: ar },
  fr: { translation: fr },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

// Update document direction for RTL languages
i18n.on('languageChanged', (lng) => {
  const isRTL = lng === 'ar'
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
})

export default i18n
