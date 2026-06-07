import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

function detectInitialLang() {
  const saved = localStorage.getItem('lang');
  if (saved === 'en' || saved === 'te') return saved;
  return (navigator.language || '').toLowerCase().startsWith('te') ? 'te' : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectInitialLang);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // t('key', { name: 'x' }) — falls back to English, then the raw key.
  const t = (key, vars) => {
    let str = translations[lang]?.[key] ?? translations.en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) str = str.replaceAll(`{${k}}`, v);
    return str;
  };

  const toggle = () => setLang((l) => (l === 'en' ? 'te' : 'en'));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
