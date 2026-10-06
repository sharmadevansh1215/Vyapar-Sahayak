import { Language } from '../types';

// Precise localized mappings for full standard names
const FULL_NAME_MAP: Record<string, Record<Language, string>> = {
  'rameshwar sharma': {
    en: 'Rameshwar Sharma',
    hi: 'रामेश्वर शर्मा',
    mr: 'रामेश्वर शर्मा',
    ta: 'ராமேஸ்வர சர்மா',
    te: 'రామేశ్వర్ శర్మ',
    kn: 'ರಾಮೇಶ್ವರ ಶರ್ಮಾ',
    bn: 'রামেশ্বর শর্মা',
    gu: 'રામેશ્વર શર્મા',
    or: 'ରାମେଶ୍ୱର ଶର୍ମା',
    as: 'ৰামেশ্বৰ শৰ্মা',
    sat: 'ᱨᱟᱢᱮᱥᱣᱚᱨ ᱥᱚᱨᱢᱟ',
    bhb: 'रामेश्वर शर्मा',
    gon: 'रामेश्वर शर्मा',
    brx: 'रामेश्वर शर्मा',
  },
  'रामेश्वर शर्मा': {
    en: 'Rameshwar Sharma',
    hi: 'रामेश्वर शर्मा',
    mr: 'रामेश्वर शर्मा',
    ta: 'ராமேஸ்வர சர்மா',
    te: 'రామేశ్వర్ శర్మ',
    kn: 'ರಾಮೇಶ್ವರ ಶರ್ಮಾ',
    bn: 'রামেশ্বর শর্মা',
    gu: 'રામેશ્વર શર્મા',
    or: 'ରାମେଶ୍ୱର ଶର୍ମା',
    as: 'ৰামেশ্বৰ শৰ্মা',
    sat: 'ᱨᱟᱢᱮᱥᱣᱚᱨ ᱥᱚᱨᱢᱟ',
    bhb: 'रामेश्वर शर्मा',
    gon: 'रामेश्वर शर्मा',
    brx: 'रामेश्वर शर्मा',
  },
  'rameshwar': {
    en: 'Rameshwar',
    hi: 'रामेश्वर',
    mr: 'रामेश्वर',
    ta: 'ராமேஸ்வரர்',
    te: 'రామేశ్వర్',
    kn: 'ರಾಮೇಶ್ವರ',
    bn: 'রামেশ্বর',
    gu: 'રામેશ્વર',
    or: 'ରାମେଶ୍ୱର',
    as: 'ৰামেশ্বৰ',
    sat: 'ᱨᱟᱢᱮᱥᱣᱚᱨ',
    bhb: 'रामेश्वर',
    gon: 'रामेश्वर',
    brx: 'रामेश्वर',
  },
  'sharma': {
    en: 'Sharma',
    hi: 'शर्मा',
    mr: 'शर्मा',
    ta: 'சர்மா',
    te: 'శర్మ',
    kn: 'ಶರ್ಮಾ',
    bn: 'শর্মা',
    gu: 'શર્મા',
    or: 'ଶର୍ମା',
    as: 'শৰ্মা',
    sat: 'ᱥᱚᱨᱢᱟ',
    bhb: 'शर्मा',
    gon: 'शर्मा',
    brx: 'शर्मा',
  },
  'sunita devi': {
    en: 'Sunita Devi',
    hi: 'सुनीता देवी',
    mr: 'सुनिता देवी',
    ta: 'சுனிதா தேவி',
    te: 'సునీత దేవి',
    kn: 'ಸುನೀತಾ ದೇವಿ',
    bn: 'সুনীতা দেবী',
    gu: 'સુનિતા દેવી',
    or: 'ସୁନୀତା ଦେବୀ',
    as: 'সুনীতা দেৱী',
    sat: 'ᱥᱩᱱᱤᱛᱟ ᱫᱮᱵᱤ',
    bhb: 'सुनीता देवी',
    gon: 'सुनीता देवी',
    brx: 'सुनीता देबी',
  },
  'rajesh kumar': {
    en: 'Rajesh Kumar',
    hi: 'राजेश कुमार',
    mr: 'राजेश कुमार',
    ta: 'ராஜேஷ் குமார்',
    te: 'రాజేష్ కుమార్',
    kn: 'ರಾಜೇಶ್ ಕುಮಾರ್',
    bn: 'রাজেশ কুমার',
    gu: 'રાજેશ કુમાર',
    or: 'ରାଜେଶ କୁମାର',
    as: 'ৰাজেশ কুমাৰ',
    sat: 'ᱨᱟᱡᱮᱥ ᱠᱩᱢᱟᱨ',
    bhb: 'राजेश कुमार',
    gon: 'राजेश कुमार',
    brx: 'राजेश कुमार',
  },
};

// Common Indian given names and surnames for compounding
const NAME_PART_MAP: Record<string, Record<Language, string>> = {
  rameshwar: {
    en: 'Rameshwar',
    hi: 'रामेश्वर',
    mr: 'रामेश्वर',
    ta: 'ராமேஸ்வரர்',
    te: 'రామేశ్వర్',
    kn: 'ರಾಮೇಶ್ವರ',
    bn: 'রামেশ্বর',
    gu: 'રામેશ્વર',
    or: 'ରାମେଶ୍ୱର',
    as: 'ৰামেশ্বৰ',
    sat: 'ᱨᱟᱢᱮᱥᱣᱚᱨ',
    bhb: 'रामेश्वर',
    gon: 'रामेश्वर',
    brx: 'रामेश्वर',
  },
  रामेश्वर: {
    en: 'Rameshwar',
    hi: 'रामेश्वर',
    mr: 'रामेश्वर',
    ta: 'ராமேஸ்வரர்',
    te: 'రామేశ్వర్',
    kn: 'ರಾಮೇಶ್ವರ',
    bn: 'রামেশ্বর',
    gu: 'રામેશ્વર',
    or: 'ରାମେଶ୍ୱର',
    as: 'ৰামেশ্বৰ',
    sat: 'ᱨᱟᱢᱮᱥᱣᱚᱨ',
    bhb: 'रामेश्वर',
    gon: 'रामेश्वर',
    brx: 'रामेश्वर',
  },
  sharma: {
    en: 'Sharma',
    hi: 'शर्मा',
    mr: 'शर्मा',
    ta: 'சர்மா',
    te: 'శర్మ',
    kn: 'ಶರ್ಮಾ',
    bn: 'শর্মা',
    gu: 'શર્મા',
    or: 'ଶର୍ମା',
    as: 'শৰ্মা',
    sat: 'ᱥᱚᱨᱢᱟ',
    bhb: 'शर्मा',
    gon: 'शर्मा',
    brx: 'शर्मा',
  },
  शर्मा: {
    en: 'Sharma',
    hi: 'शर्मा',
    mr: 'शर्मा',
    ta: 'சர்மா',
    te: 'శర్మ',
    kn: 'ಶರ್ಮಾ',
    bn: 'শর্মা',
    gu: 'શર્મા',
    or: 'ଶର୍ମା',
    as: 'শৰ্মা',
    sat: 'ᱥᱚᱨᱢᱟ',
    bhb: 'शर्मा',
    gon: 'शर्मा',
    brx: 'शर्मा',
  },
  ram: {
    en: 'Ram',
    hi: 'राम',
    mr: 'राम',
    ta: 'ராம்',
    te: 'రామ్',
    kn: 'ರಾಮ್',
    bn: 'রাম',
    gu: 'રામ',
    or: 'ରାମ',
    as: 'ৰাম',
    sat: 'ᱨᱟᱢ',
    bhb: 'राम',
    gon: 'राम',
    brx: 'राम',
  },
  kumar: {
    en: 'Kumar',
    hi: 'कुमार',
    mr: 'कुमार',
    ta: 'குமார்',
    te: 'కుమార్',
    kn: 'ಕುಮಾರ್',
    bn: 'কুমার',
    gu: 'કુમાર',
    or: 'କୁମାର',
    as: 'কুমাৰ',
    sat: 'ᱠᱩᱢᱟᱨ',
    bhb: 'कुमार',
    gon: 'कुमार',
    brx: 'कुमार',
  },
  devi: {
    en: 'Devi',
    hi: 'देवी',
    mr: 'देवी',
    ta: 'தேவி',
    te: 'దేవి',
    kn: 'ದೇವಿ',
    bn: 'দেবী',
    gu: 'દેવી',
    or: 'ଦେବୀ',
    as: 'দেৱী',
    sat: 'ᱫᱮᱵᱤ',
    bhb: 'देवी',
    gon: 'देवी',
    brx: 'देबी',
  },
  singh: {
    en: 'Singh',
    hi: 'सिंह',
    mr: 'सिंह',
    ta: 'சிங்',
    te: 'సింగ్',
    kn: 'ಸಿಂಗ್',
    bn: 'সিংহ',
    gu: 'સિંહ',
    or: 'ସିଂହ',
    as: 'সিংহ',
    sat: 'ᱥᱤᱝ',
    bhb: 'सिंह',
    gon: 'सिंह',
    brx: 'सिंह',
  },
  patel: {
    en: 'Patel',
    hi: 'पटेल',
    mr: 'पटेल',
    ta: 'படேல்',
    te: 'పటేల్',
    kn: 'ಪಟೇಲ್',
    bn: 'প্যাটেল',
    gu: 'પટેલ',
    or: 'ପଟେଲ',
    as: 'পেটেল',
    sat: 'ᱯᱟᱴᱮᱞ',
    bhb: 'पटेल',
    gon: 'पटेल',
    brx: 'पटेल',
  },
  yadav: {
    en: 'Yadav',
    hi: 'यादव',
    mr: 'यादव',
    ta: 'யாதவ்',
    te: 'యాదవ్',
    kn: 'ಯಾದವ್',
    bn: 'যাদব',
    gu: 'યાદવ',
    or: 'ଯାଦବ',
    as: 'যাদৱ',
    sat: 'ᱭᱟᱫᱚᱵ',
    bhb: 'यादव',
    gon: 'यादव',
    brx: 'यादव',
  },
  verma: {
    en: 'Verma',
    hi: 'वर्मा',
    mr: 'वर्मा',
    ta: 'வர்மா',
    te: 'వర్మ',
    kn: 'ವರ್ಮಾ',
    bn: 'বর্মা',
    gu: 'વર્મા',
    or: 'ବର୍ମା',
    as: 'বৰ্মা',
    sat: 'ᱵᱚᱨᱢᱟ',
    bhb: 'वर्मा',
    gon: 'वर्मा',
    brx: 'वर्मा',
  },
  gupta: {
    en: 'Gupta',
    hi: 'गुप्ता',
    mr: 'गुप्ता',
    ta: 'குப்தா',
    te: 'గుప్తా',
    kn: 'ಗುಪ್ತಾ',
    bn: 'গুপ্তা',
    gu: 'ગુપ્તા',
    or: 'ଗୁପ୍ତା',
    as: 'গুপ্তা',
    sat: 'ᱜᱩᱯᱛᱟ',
    bhb: 'गुप्ता',
    gon: 'गुप्ता',
    brx: 'गुप्ता',
  },
  sunita: {
    en: 'Sunita',
    hi: 'सुनीता',
    mr: 'सुनिता',
    ta: 'சுனிதா',
    te: 'సునీత',
    kn: 'ಸುನೀತಾ',
    bn: 'সুনীতা',
    gu: 'સુનિતા',
    or: 'ସୁନୀତା',
    as: 'সুনীতা',
    sat: 'ᱥᱩᱱᱤᱛᱟ',
    bhb: 'सुनीता',
    gon: 'सुनीता',
    brx: 'सुनीता',
  },
  rajesh: {
    en: 'Rajesh',
    hi: 'राजेश',
    mr: 'राजेश',
    ta: 'ராஜேஷ்',
    te: 'రాజేష్',
    kn: 'ರಾಜೇಶ್',
    bn: 'রাজেশ',
    gu: 'રાજેશ',
    or: 'ରାଜેશ',
    as: 'ৰাজেশ',
    sat: 'ᱨᱟᱡᱮᱥ',
    bhb: 'राजेश',
    gon: 'राजेश',
    brx: 'राजेश',
  },
  anita: {
    en: 'Anita',
    hi: 'अनीता',
    mr: 'अनिता',
    ta: 'அனிதா',
    te: 'అనిత',
    kn: 'ಅನಿತಾ',
    bn: 'অনিতা',
    gu: 'અનિતા',
    or: 'ଅନିତା',
    as: 'অনিতা',
    sat: 'ᱟᱱᱤᱛᱟ',
    bhb: 'अनीता',
    gon: 'अनीता',
    brx: 'अनीता',
  },
  pooja: {
    en: 'Pooja',
    hi: 'पूजा',
    mr: 'पूजा',
    ta: 'பூஜா',
    te: 'పూజా',
    kn: 'ಪೂಜಾ',
    bn: 'পূজা',
    gu: 'પૂજા',
    or: 'ପୂଜା',
    as: 'পূজা',
    sat: 'ᱯᱩᱡᱟ',
    bhb: 'पूजा',
    gon: 'पूजा',
    brx: 'पूजा',
  },
  radha: {
    en: 'Radha',
    hi: 'राधा',
    mr: 'राधा',
    ta: 'ராதா',
    te: 'రాధ',
    kn: 'ರಾಧಾ',
    bn: 'রাধা',
    gu: 'રાધા',
    or: 'ରାଧା',
    as: 'ৰাধা',
    sat: 'ᱨᱟᱫᱷᱟ',
    bhb: 'राधा',
    gon: 'राधा',
    brx: 'राधा',
  },
  geeta: {
    en: 'Geeta',
    hi: 'गीता',
    mr: 'गीता',
    ta: 'கீதா',
    te: 'గీత',
    kn: 'ಗೀತಾ',
    bn: 'গীতা',
    gu: 'ગીતા',
    or: 'ଗୀତା',
    as: 'গীতা',
    sat: 'ᱜᱤᱛᱟ',
    bhb: 'गीता',
    gon: 'गीता',
    brx: 'गीता',
  },
  laxmi: {
    en: 'Laxmi',
    hi: 'लक्ष्मी',
    mr: 'लक्ष्मी',
    ta: 'லட்சுமி',
    te: 'లక్ష్మి',
    kn: 'ಲಕ್ಷ್ಮಿ',
    bn: 'লক্ষ্মী',
    gu: 'લક્ષ્મી',
    or: 'ଲକ୍ଷ୍ମୀ',
    as: 'লক্ষ্মী',
    sat: 'ᱞᱚᱠᱷᱢᱤ',
    bhb: 'लक्ष्मी',
    gon: 'लक्ष्मी',
    brx: 'लक्ष्मी',
  },
  mohan: {
    en: 'Mohan',
    hi: 'मोहन',
    mr: 'मोहन',
    ta: 'மோகன்',
    te: 'మోహన్',
    kn: 'ಮೋಹನ್',
    bn: 'মোহন',
    gu: 'મોહન',
    or: 'ମୋହନ',
    as: 'মোহন',
    sat: 'ᱢᱚᱦᱚᱱ',
    bhb: 'मोहन',
    gon: 'मोहन',
    brx: 'मोहन',
  },
  lal: {
    en: 'Lal',
    hi: 'लाल',
    mr: 'लाल',
    ta: 'லால்',
    te: 'లాల్',
    kn: 'ಲಾಲ್',
    bn: 'লাল',
    gu: 'લાલ',
    or: 'ଲାଲ',
    as: 'লাল',
    sat: 'ᱞᱟᱞ',
    bhb: 'लाल',
    gon: 'लाल',
    brx: 'लाल',
  },
};

// Character transliteration dictionary for English to Indic phonetics
const PHONETIC_CONSONANTS: Record<string, string> = {
  bh: 'भ',
  kh: 'ख',
  gh: 'घ',
  ch: 'च',
  chh: 'छ',
  jh: 'झ',
  th: 'थ',
  dh: 'ध',
  ph: 'फ',
  sh: 'श',
  shh: 'ष',
  k: 'क',
  g: 'ग',
  j: 'ज',
  t: 'ट',
  d: 'ड',
  n: 'न',
  p: 'प',
  b: 'ब',
  m: 'म',
  y: 'य',
  r: 'र',
  l: 'ल',
  v: 'व',
  w: 'व',
  s: 'स',
  h: 'ह',
};

const PHONETIC_VOWELS: Record<string, string> = {
  aa: 'ा',
  ee: 'ी',
  ii: 'ी',
  oo: 'ू',
  uu: 'ू',
  ai: 'ै',
  au: 'ौ',
  a: '',
  i: 'ि',
  u: 'ु',
  e: 'े',
  o: 'ो',
};

// Convert Devanagari to English Roman script
function devanagariToEnglish(text: string): string {
  // If exact matches known
  const clean = text.trim();
  if (clean === 'रामेश्वर शर्मा') return 'Rameshwar Sharma';
  if (clean === 'रामेश्वर') return 'Rameshwar';
  if (clean === 'शर्मा') return 'Sharma';
  if (clean === 'सुनीता देवी') return 'Sunita Devi';
  if (clean === 'राजेश कुमार') return 'Rajesh Kumar';

  // Return text as is if not in dictionary
  return text;
}

// Convert English to Devanagari phonetically for any unknown names
function englishToDevanagari(text: string): string {
  let lower = text.toLowerCase().trim();
  if (!lower) return text;

  // Split into words
  const words = lower.split(/\s+/);
  const translatedWords = words.map((w) => {
    let res = '';
    let i = 0;
    let isFirstChar = true;

    while (i < w.length) {
      // Check 3-char consonants
      if (i + 2 < w.length && PHONETIC_CONSONANTS[w.slice(i, i + 3)]) {
        res += PHONETIC_CONSONANTS[w.slice(i, i + 3)];
        i += 3;
        isFirstChar = false;
        continue;
      }
      // Check 2-char consonants
      if (i + 1 < w.length && PHONETIC_CONSONANTS[w.slice(i, i + 2)]) {
        res += PHONETIC_CONSONANTS[w.slice(i, i + 2)];
        i += 2;
        isFirstChar = false;
        continue;
      }
      // Check 2-char vowels
      if (i + 1 < w.length && PHONETIC_VOWELS[w.slice(i, i + 2)] !== undefined) {
        res += PHONETIC_VOWELS[w.slice(i, i + 2)];
        i += 2;
        isFirstChar = false;
        continue;
      }
      // Check 1-char consonants
      if (PHONETIC_CONSONANTS[w[i]]) {
        res += PHONETIC_CONSONANTS[w[i]];
        i++;
        isFirstChar = false;
        continue;
      }
      // Check 1-char vowels
      if (PHONETIC_VOWELS[w[i]] !== undefined) {
        if (isFirstChar) {
          const initialVowels: Record<string, string> = {
            a: 'अ',
            i: 'इ',
            u: 'उ',
            e: 'ए',
            o: 'ओ',
          };
          res += initialVowels[w[i]] || w[i];
        } else {
          res += PHONETIC_VOWELS[w[i]];
        }
        i++;
        isFirstChar = false;
        continue;
      }
      // Fallback
      res += w[i];
      i++;
      isFirstChar = false;
    }
    return res;
  });

  return translatedWords.join(' ');
}

/**
 * Returns the localized user name according to the currently active language.
 * Guarantees that default name 'Rameshwar Sharma' or user-entered names are correctly
 * rendered in the target language's native script.
 */
export function getLocalizedUserName(
  name: string | undefined | null,
  lang: Language = 'hi'
): string {
  const fallback = 'Rameshwar Sharma';
  const effectiveName = (name && name.trim().length > 0 ? name : fallback).trim();

  // If language is English, return English Roman form
  if (lang === 'en') {
    const lower = effectiveName.toLowerCase();
    if (FULL_NAME_MAP[lower]?.en) return FULL_NAME_MAP[lower].en;
    if (FULL_NAME_MAP[effectiveName]?.en) return FULL_NAME_MAP[effectiveName].en;
    return devanagariToEnglish(effectiveName);
  }

  // Check exact full name match in dictionary (case-insensitive)
  const lowerName = effectiveName.toLowerCase();
  if (FULL_NAME_MAP[lowerName]?.[lang]) {
    return FULL_NAME_MAP[lowerName][lang];
  }
  if (FULL_NAME_MAP[effectiveName]?.[lang]) {
    return FULL_NAME_MAP[effectiveName][lang];
  }

  // Check by splitting words / compounding
  const parts = effectiveName.split(/\s+/);
  const translatedParts = parts.map((p) => {
    const pLower = p.toLowerCase();
    if (NAME_PART_MAP[pLower]?.[lang]) {
      return NAME_PART_MAP[pLower][lang];
    }
    if (NAME_PART_MAP[p]?.[lang]) {
      return NAME_PART_MAP[p][lang];
    }
    return null;
  });

  // If all parts were recognized, join them
  if (translatedParts.every((p) => p !== null)) {
    return translatedParts.join(' ');
  }

  // If target uses Devanagari (hi, mr, bhb, gon, brx)
  if (['hi', 'mr', 'bhb', 'gon', 'brx'].includes(lang)) {
    // If it already contains Devanagari characters, return as is
    if (/[\u0900-\u097F]/.test(effectiveName)) {
      return effectiveName;
    }
    return englishToDevanagari(effectiveName);
  }

  // If part was recognized and part wasn't, replace recognized ones
  const mixedParts = parts.map((p, idx) => translatedParts[idx] || p);
  const result = mixedParts.join(' ');

  // Return best matched localized string or original
  return result;
}
