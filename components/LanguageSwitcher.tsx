
import React from 'react';
import { useI18n } from '../context/i18n';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useI18n();

  const handleLanguageChange = (lang: 'es' | 'en') => {
    setLocale(lang);
  };

  return (
    <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
      <button
        onClick={() => handleLanguageChange('es')}
        className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${
          locale === 'es'
            ? 'bg-white dark:bg-gray-600 text-kimi-green dark:text-white shadow'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        ES
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${
          locale === 'en'
            ? 'bg-white dark:bg-gray-600 text-kimi-green dark:text-white shadow'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
