import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Language } from '../types';
import {
  LanguageConfig,
  LANGUAGE_CONFIGS,
  ACTIVE_LANGUAGES,
  COMING_SOON_LANGUAGES,
  LOCALES,
  getTranslation,
} from '../i18n';
import { translations, TranslationStrings } from '../data/translations';
import { getLocalizedUserName as localizeUserName } from '../utils/userNameUtils';

export interface LanguageOption {
  code: Language;
  label: string;
  native: string;
  region: string;
}

// Backward-compatible export
export const SUPPORTED_LANGUAGES: LanguageOption[] = LANGUAGE_CONFIGS.map((l) => ({
  code: l.code,
  label: l.englishName,
  native: l.nativeName,
  region: l.region,
}));

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationStrings | string, fallback?: string) => string;
  translateAsync: (text: string, targetLang?: Language) => Promise<string>;
  supportedLanguages: LanguageOption[];
  languageConfigs: LanguageConfig[];
  activeLanguages: LanguageConfig[];
  comingSoonLanguages: LanguageConfig[];
  isDynamicTranslating: boolean;
  getLocalizedUserName: (name?: string | null) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const DYNAMIC_CACHE_KEY = 'vyapar_i18n_dynamic_cache';

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLanguage?: Language }> = ({
  children,
  initialLanguage = 'hi',
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('vyapar_language') || localStorage.getItem('vyapar_lang') || localStorage.getItem('mosje_lang');
    if (saved && LANGUAGE_CONFIGS.some((l) => l.code === saved && l.enabled)) {
      return saved as Language;
    }
    return initialLanguage;
  });

  const [dynamicCache, setDynamicCache] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const stored = localStorage.getItem(DYNAMIC_CACHE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [isDynamicTranslating, setIsDynamicTranslating] = useState(false);

  // Synchronize language change without resetting any business state
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('vyapar_language', newLang);
    localStorage.setItem('vyapar_lang', newLang);
    document.documentElement.lang = newLang;
  }, []);

  // Hierarchical fallback translation resolver
  const t = useCallback(
    (key: keyof TranslationStrings | string, fallback?: string): string => {
      // 1. Check primary centralized i18n locales dictionary
      const centralizedRes = getTranslation(language, key as any);
      if (centralizedRes && centralizedRes !== String(key)) {
        return centralizedRes;
      }

      // 2. Direct dictionary lookup in legacy translations
      const activeDict = translations[language] as any;
      if (activeDict && activeDict[key]) {
        return activeDict[key];
      }

      // 3. Check dynamic runtime cache
      if (dynamicCache[language]?.[key]) {
        return dynamicCache[language][key];
      }

      // 4. Fallback to Hindi dictionary (primary rural national language)
      const hiDict = translations['hi'] as any;
      if (hiDict && hiDict[key]) {
        return hiDict[key];
      }

      // 5. Fallback to English dictionary
      const enDict = translations['en'] as any;
      if (enDict && enDict[key]) {
        return enDict[key];
      }

      // 6. Return explicit fallback or key name
      return fallback || (typeof key === 'string' ? key : String(key));
    },
    [language, dynamicCache]
  );

  // Dynamic on-demand translation service for un-cached or dynamic phrases
  const translateAsync = useCallback(
    async (text: string, targetLang?: Language): Promise<string> => {
      const target = targetLang || language;
      if (target === 'en') return text;

      // Check cache first
      if (dynamicCache[target]?.[text]) {
        return dynamicCache[target][text];
      }

      try {
        setIsDynamicTranslating(true);
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLang: target }),
        });
        const data = await res.json();
        const translated = data.translatedText || text;

        // Update cache
        setDynamicCache((prev) => {
          const updated = {
            ...prev,
            [target]: {
              ...(prev[target] || {}),
              [text]: translated,
            },
          };
          try {
            localStorage.setItem(DYNAMIC_CACHE_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        return translated;
      } catch (err) {
        console.warn('Dynamic translation failed, using source:', err);
        return text;
      } finally {
        setIsDynamicTranslating(false);
      }
    },
    [language, dynamicCache]
  );

  const getLocalizedUserName = useCallback(
    (name?: string | null) => localizeUserName(name, language),
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      translateAsync,
      supportedLanguages: SUPPORTED_LANGUAGES,
      languageConfigs: LANGUAGE_CONFIGS,
      activeLanguages: ACTIVE_LANGUAGES,
      comingSoonLanguages: COMING_SOON_LANGUAGES,
      isDynamicTranslating,
      getLocalizedUserName,
    }),
    [language, setLanguage, t, translateAsync, isDynamicTranslating, getLocalizedUserName]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    // Safe fallback if accessed outside I18nProvider
    const defaultLang = (
      localStorage.getItem('vyapar_language') ||
      localStorage.getItem('vyapar_lang') ||
      'hi'
    ) as Language;
    return {
      language: defaultLang,
      setLanguage: () => {},
      t: (key: keyof TranslationStrings | string, fallback?: string): string => {
        const centralizedRes = getTranslation(defaultLang, key as any);
        if (centralizedRes && centralizedRes !== String(key)) return centralizedRes;
        const activeDict = (translations as any)[defaultLang] || (translations as any)['hi'] || (translations as any)['en'];
        return activeDict?.[key] || fallback || (typeof key === 'string' ? key : String(key));
      },
      translateAsync: async (text: string) => text,
      supportedLanguages: SUPPORTED_LANGUAGES,
      languageConfigs: LANGUAGE_CONFIGS,
      activeLanguages: ACTIVE_LANGUAGES,
      comingSoonLanguages: COMING_SOON_LANGUAGES,
      isDynamicTranslating: false,
      getLocalizedUserName: (name?: string | null) => localizeUserName(name, defaultLang),
    };
  }
  return context;
};
