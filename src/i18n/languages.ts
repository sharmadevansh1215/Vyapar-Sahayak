import { LanguageConfig } from './types';

/**
 * Authoritative Language Configurations
 * Languages with full UI dictionary implementations are marked enabled: true.
 * Regional/tribal languages under active development are cleanly marked isComingSoon: true.
 */
export const LANGUAGE_CONFIGS: LanguageConfig[] = [
  {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    direction: 'ltr',
    enabled: true,
    region: 'National / North India',
  },
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    direction: 'ltr',
    enabled: true,
    region: 'Pan-India Official',
  },
  {
    code: 'mr',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    direction: 'ltr',
    enabled: true,
    region: 'Maharashtra',
  },
  {
    code: 'ta',
    nativeName: 'தமிழ்',
    englishName: 'Tamil',
    direction: 'ltr',
    enabled: true,
    region: 'Tamil Nadu',
  },
  {
    code: 'te',
    nativeName: 'తెలుగు',
    englishName: 'Telugu',
    direction: 'ltr',
    enabled: true,
    region: 'Andhra Pradesh & Telangana',
  },
  {
    code: 'kn',
    nativeName: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    direction: 'ltr',
    enabled: true,
    region: 'Karnataka',
  },
  {
    code: 'bn',
    nativeName: 'বাংলা',
    englishName: 'Bengali',
    direction: 'ltr',
    enabled: true,
    region: 'West Bengal & Tripura',
  },
  {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    englishName: 'Gujarati',
    direction: 'ltr',
    enabled: true,
    region: 'Gujarat',
  },
  {
    code: 'or',
    nativeName: 'ଓଡ଼ିଆ',
    englishName: 'Odia',
    direction: 'ltr',
    enabled: false,
    isComingSoon: true,
    region: 'Odisha (Coming Soon)',
  },
  {
    code: 'as',
    nativeName: 'অসমীয়া',
    englishName: 'Assamese',
    direction: 'ltr',
    enabled: false,
    isComingSoon: true,
    region: 'Assam & North East (Coming Soon)',
  },
  {
    code: 'sat',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    englishName: 'Santali',
    direction: 'ltr',
    enabled: false,
    isComingSoon: true,
    region: 'Jharkhand, Odisha (Coming Soon)',
  },
  {
    code: 'brx',
    nativeName: 'बड़ो / Boro',
    englishName: 'Bodo',
    direction: 'ltr',
    enabled: false,
    isComingSoon: true,
    region: 'Assam / Bodoland (Coming Soon)',
  },
];

export const ACTIVE_LANGUAGES = LANGUAGE_CONFIGS.filter((l) => l.enabled);
export const COMING_SOON_LANGUAGES = LANGUAGE_CONFIGS.filter((l) => l.isComingSoon);
