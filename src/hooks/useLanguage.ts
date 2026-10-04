import { useEffect, useMemo } from 'react';
import { AppLanguage } from '../types/medicine';
import { getTranslation, Translations } from '../utils/translations';

export function useLanguage(
  currentLanguage: AppLanguage = 'en',
  onLanguageChange?: (lang: AppLanguage) => void
) {
  const language: AppLanguage = currentLanguage || 'en';

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ur' ? 'rtl' : 'ltr';

    if (language === 'ur') {
      root.classList.add('font-urdu');
    } else {
      root.classList.remove('font-urdu');
    }
  }, [language]);

  const t: Translations = useMemo(() => {
    return getTranslation(language);
  }, [language]);

  const cycleLanguage = () => {
    if (!onLanguageChange) return;
    const nextLang: AppLanguage = language === 'en' ? 'hi' : language === 'hi' ? 'ur' : 'en';
    onLanguageChange(nextLang);
  };

  return {
    language,
    isRTL: language === 'ur',
    t,
    cycleLanguage,
  };
}
