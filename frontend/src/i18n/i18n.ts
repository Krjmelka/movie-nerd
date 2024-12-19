import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import ua from './ua.json';

const storedLang = window.localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ua: { translation: ua },
  },
  lng: storedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
