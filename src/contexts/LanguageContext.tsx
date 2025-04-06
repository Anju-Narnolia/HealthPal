
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { en } from '../translations/en';
import { es } from '../translations/es';
import { zh } from '../translations/zh';
import { hi } from '../translations/hi';

type Language = 'en' | 'es' | 'zh' | 'hi';
// Make sure we define the Translations type based on the actual structure of our translation files
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
}

// Create the context with a default value that matches the shape
const defaultContext: LanguageContextType = {
  language: 'en',
  translations: en,
  setLanguage: () => {}
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

const translations: Record<Language, Translations> = {
  en,
  es,
  zh,
  hi,
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value: LanguageContextType = {
    language,
    translations: translations[language],
    setLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
