import { Language } from '../types';
import { I18nDictionary, LanguageConfig } from './types';
import { LANGUAGE_CONFIGS, ACTIVE_LANGUAGES, COMING_SOON_LANGUAGES } from './languages';
import { translations } from '../data/translations';
import { enLocale } from './locales/en';
import { hiLocale } from './locales/hi';
import { mrLocale } from './locales/mr';
import { taLocale } from './locales/ta';
import { teLocale } from './locales/te';
import { knLocale } from './locales/kn';
import { bnLocale } from './locales/bn';
import { guLocale } from './locales/gu';

export * from './types';
export * from './languages';

export const LOCALES: Record<string, I18nDictionary> = {
  en: enLocale,
  hi: hiLocale,
  mr: mrLocale,
  ta: taLocale,
  te: teLocale,
  kn: knLocale,
  bn: bnLocale,
  gu: guLocale,
};

/**
 * Hierarchical i18n translation resolver
 * 1. Checks selected language dictionary in LOCALES
 * 2. Checks selected language dictionary in translations data
 * 3. Falls back to Hindi (national rural default)
 * 4. Falls back to English (standard base)
 * 5. Falls back to explicit fallback parameter or key
 */
export function getTranslation(
  lang: Language,
  key: keyof I18nDictionary | string,
  fallback?: string
): string {
  const activeDict = LOCALES[lang];
  if (activeDict && (activeDict as any)[key]) {
    return (activeDict as any)[key];
  }

  const activeDataDict = (translations as any)[lang];
  if (activeDataDict && activeDataDict[key]) {
    return activeDataDict[key];
  }

  const hiDict = LOCALES['hi'];
  if (hiDict && (hiDict as any)[key]) {
    return (hiDict as any)[key];
  }
  if ((translations as any)['hi']?.[key]) {
    return (translations as any)['hi'][key];
  }

  const enDict = LOCALES['en'];
  if (enDict && (enDict as any)[key]) {
    return (enDict as any)[key];
  }
  if ((translations as any)['en']?.[key]) {
    return (translations as any)['en'][key];
  }

  return fallback || String(key);
}

/**
 * Formatter for dynamic key strings e.g. "Hello {name}"
 */
export function formatTranslation(template: string, params: Record<string, string | number>): string {
  let result = template;
  for (const [k, v] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return result;
}
