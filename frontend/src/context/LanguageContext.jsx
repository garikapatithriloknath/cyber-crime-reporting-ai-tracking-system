import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, instructionTranslations, getTranslation, getInstructionTranslation } from '../utils/translations';

const LanguageContext = createContext(null);

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'te', label: 'తెలుగు (Telugu)', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', label: 'हिन्दी (Hindi)', native: 'हिन्दी', flag: '🇮🇳' },
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('cyber_lang') || localStorage.getItem('instruction_lang');
      if (saved && ['en', 'te', 'hi'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'en';
  });

  const setLanguage = (newLang) => {
    if (['en', 'te', 'hi'].includes(newLang)) {
      setLanguageState(newLang);
      try {
        localStorage.setItem('cyber_lang', newLang);
        localStorage.setItem('instruction_lang', newLang);
      } catch (e) {}
    }
  };

  // Listen to storage events if another tab modifies the language
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cyber_lang' && e.newValue && ['en', 'te', 'hi'].includes(e.newValue)) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const t = getTranslation(language);
  const it = getInstructionTranslation(language);

  // Safe lookup translation helper
  const translate = (key, fallback = '') => {
    return t[key] || fallback || key;
  };

  // Helper to translate status strings
  const translateStatus = (status = '') => {
    const s = (status || '').toLowerCase().trim();
    if (s.includes('submit')) return t.statusSubmitted || status;
    if (s.includes('review')) return t.statusUnderReview || status;
    if (s.includes('investigat')) return t.statusInvestigating || status;
    if (s.includes('resolv') || s.includes('close')) return t.statusResolved || status;
    return status;
  };

  // Helper to translate priority strings
  const translatePriority = (priority = '') => {
    const p = (priority || '').toLowerCase().trim();
    if (p.includes('high') || p.includes('urgent')) return t.priorityHigh || priority;
    if (p.includes('med')) return t.priorityMedium || priority;
    if (p.includes('low')) return t.priorityLow || priority;
    return priority;
  };

  // Helper to translate category strings
  const translateCategory = (category = '') => {
    const c = (category || '').toLowerCase().trim();
    if (c.includes('phish')) return t.catPhishing || category;
    if (c.includes('fraud') || c.includes('upi') || c.includes('financial') || c.includes('money')) return t.catOnlineFraud || category;
    if (c.includes('identity') || c.includes('imperson')) return t.catIdentityTheft || category;
    if (c.includes('social') || c.includes('instagram') || c.includes('facebook')) return t.catSocialMediaScam || category;
    if (c.includes('bully') || c.includes('harass')) return t.catCyberbullying || category;
    if (c.includes('malware') || c.includes('ransom')) return t.catMalware || category;
    if (c.includes('job') || c.includes('offer')) return t.catJobScam || category;
    if (c.includes('matrimoni') || c.includes('shaadi')) return t.catMatrimonial || category;
    if (c.includes('loan')) return t.catLoanScam || category;
    return category;
  };

  const value = {
    language,
    setLanguage,
    t,
    it,
    translate,
    translateStatus,
    translatePriority,
    translateCategory,
    isTelugu: language === 'te',
    isHindi: language === 'hi',
    isEnglish: language === 'en',
    availableLanguages: AVAILABLE_LANGUAGES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback safe context if used outside provider
    const fallbackT = getTranslation('en');
    const fallbackIt = getInstructionTranslation('en');
    return {
      language: 'en',
      setLanguage: () => {},
      t: fallbackT,
      it: fallbackIt,
      translate: (k, fb = '') => fallbackT[k] || fb || k,
      translateStatus: (s) => s,
      translatePriority: (p) => p,
      translateCategory: (c) => c,
      isTelugu: false,
      isHindi: false,
      isEnglish: true,
      availableLanguages: AVAILABLE_LANGUAGES,
    };
  }
  return context;
};

export default LanguageContext;
