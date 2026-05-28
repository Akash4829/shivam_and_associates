import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../translations/en.json';
import hi from '../translations/hi.json';

const STORAGE_KEY = 'firm-ui-lang';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    fallbackLng: 'en',
    lng: typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) || 'en' : 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
  });

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng === 'hi' ? 'hi' : 'en';
    document.documentElement.classList.toggle('lang-hi', lng === 'hi');
  }
});

export default i18n;
