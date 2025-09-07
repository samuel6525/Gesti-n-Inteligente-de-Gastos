
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import es from '../locales/es';
import en from '../locales/en';

type Translations = typeof es;
type Locale = 'es' | 'en';

const translations: Record<Locale, Translations> = { es, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['es', 'en'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    } else {
      const browserLang = navigator.language.split('-')[0];
      setLocaleState(browserLang === 'en' ? 'en' : 'es');
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setLocaleState(newLocale);
  };
  
  const getNestedValue = (obj: any, path: string): string | object | undefined => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
      const translation = getNestedValue(translations[locale], key) || key;

      if (typeof translation !== 'string') {
        if (options && 'count' in options && typeof translation === 'object' && translation !== null) {
          const count = options.count as number;
          if (count === 1 && 'one' in translation) {
            return (translation as any).one.replace('{{count}}', String(count));
          }
          if ('other' in translation) {
            return (translation as any).other.replace('{{count}}', String(count));
          }
        }
        return key;
      }

      let result = translation;
      if (options) {
          Object.keys(options).forEach(optKey => {
              result = result.replace(new RegExp(`{{${optKey}}}`, 'g'), String(options[optKey]));
          });
      }
      return result;
  }, [locale]);


  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
