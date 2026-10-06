import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Language, LocationState, UserProfile } from '../types';
import { translations } from '../data/translations';
import { getLocalizedUserName } from '../utils/userNameUtils';

interface OnboardingFlowProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onComplete: (profile: UserProfile) => void;
  initialProfile?: Partial<UserProfile>;
}

const LANGUAGES: { id: Language; label: string; nativeName: string; greeting: string; region: string }[] = [
  { id: 'hi', label: 'Hindi', nativeName: 'हिंदी', greeting: 'नमस्ते! व्यापार सहायक में आपका स्वागत है।', region: 'उत्तर एवं मध्य भारत' },
  { id: 'en', label: 'English', nativeName: 'English', greeting: 'Welcome to Vyapar Sahayak!', region: 'National & Global' },
  { id: 'mr', label: 'Marathi', nativeName: 'मराठी', greeting: 'व्यापार सहायकमध्ये आपले स्वागत आहे.', region: 'महाराष्ट्र' },
  { id: 'ta', label: 'Tamil', nativeName: 'தமிழ்', greeting: 'வியாபார் சஹாயக்கிற்கு வரவேற்கிறோம்.', region: 'தமிழ்நாடு' },
  { id: 'te', label: 'Telugu', nativeName: 'తెలుగు', greeting: 'వ్యాపార సహాయక్‌కు స్వాగతం.', region: 'ఆంధ్రప్రదేశ్ & తెలంగాణ' },
  { id: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', greeting: 'ವ್ಯಾಪಾರ್ ಸಹಾಯಕ್‌ಗೆ ಸುಸ್ವಾಗತ.', region: 'ಕರ್ನಾಟಕ' },
  { id: 'sat', label: 'Santali', nativeName: 'संताली / ᱥᱟᱱᱛᱟᱲᱤ', greeting: 'ᱡᱚᱦᱟᱨ! ᱵᱮᱯᱟᱨ ᱥᱚᱦᱟᱭᱚᱠ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ᱾', region: 'झारखंड, ओडिशा, प. बंगाल' },
  { id: 'bhb', label: 'Bhili', nativeName: 'भीली / भीलोड़ी', greeting: 'राम राम! व्यापार सहायक मां तमारु स्वागत छे.', region: 'म.प्र., राजस्थान, गुजरात' },
  { id: 'gon', label: 'Gondi', nativeName: 'गोंडी / 𑴎𑴽𑴟𑴳', greeting: 'जय सेवा! व्यापार सहायक ते स्वागत मंता.', region: 'म.प्र., छत्तीसगढ़, महाराष्ट्र' },
  { id: 'or', label: 'Odia', nativeName: 'ଓଡ଼ିଆ', greeting: 'ନମସ୍କାର! ବ୍ୟାପାର ସହାୟକକୁ ସ୍ୱାଗତ।', region: 'ଓଡ଼ିଶା' },
  { id: 'as', label: 'Assamese', nativeName: 'অসমীয়া', greeting: 'নমস্কাৰ! ব্যাপাৰ সহায়কলৈ স্বাগতম।', region: 'অসম আৰু উত্তৰ-পূৰ্বাঞ্চল' },
  { id: 'brx', label: 'Bodo', nativeName: 'बड़ो / Boro', greeting: 'खुलुमबाय! व्यापार सहायकसिम बरायबाय।', region: 'असम (बोडोलैंड)' },
];

const STATES_AND_DISTRICTS: Record<string, string[]> = {
  'Uttar Pradesh': ['Varanasi', 'Gorakhpur', 'Prayagraj', 'Lucknow', 'Kanpur', 'Ayodhya', 'Mirzapur', 'Ghazipur'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Nalanda', 'Purnia'],
  'Maharashtra': ['Nagpur', 'Pune', 'Nashik', 'Aurangabad', 'Kolhapur', 'Amravati', 'Solapur'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Rewa', 'Sagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar'],
  'Tamil Nadu': ['Madurai', 'Coimbatore', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Thanjavur'],
  'Karnataka': ['Mysuru', 'Hubballi', 'Belagavi', 'Kalaburagi', 'Mangaluru', 'Dharwad'],
  'Telangana': ['Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Kurnool', 'Tirupati'],
};

const BUSINESS_SECTORS = [
  {
    id: 'dairy',
    name: 'Dairy & Animal Husbandry',
    nameHindi: 'डेयरी व पशुपालन',
    emoji: '🐄',
    typicalProject: '₹1.40L - ₹5.00L',
    margin: '₹14,000 (10%)',
    badge: 'High Rural Demand',
  },
  {
    id: 'retail',
    name: 'Retail & Kirana Store',
    nameHindi: 'किराना व खुदरा दुकान',
    emoji: '🏪',
    typicalProject: '₹1.00L - ₹3.50L',
    margin: '₹10,000 (10%)',
    badge: 'Daily Cash Flow',
  },
  {
    id: 'agriculture',
    name: 'Agri-Processing & Horticulture',
    nameHindi: 'कृषि व बागवानी प्रसंस्करण',
    emoji: '🌾',
    typicalProject: '₹1.80L - ₹6.00L',
    margin: '₹18,000 (10%)',
    badge: 'MoSJE Subsidized',
  },
  {
    id: 'food_processing',
    name: 'Food Processing & Flour Mill',
    nameHindi: 'खाद्य प्रसंस्करण व आटा चक्की',
    emoji: '🥣',
    typicalProject: '₹1.20L - ₹4.00L',
    margin: '₹12,000 (10%)',
    badge: 'Essential Utility',
  },
  {
    id: 'poultry',
    name: 'Poultry & Small Livestock',
    nameHindi: 'पोल्ट्री व लघु पशुपालन',
    emoji: '🐔',
    typicalProject: '₹90,000 - ₹2.50L',
    margin: '₹9,000 (10%)',
    badge: 'Quick Cycle',
  },
  {
    id: 'handicrafts',
    name: 'Handicrafts & Handloom',
    nameHindi: 'हस्तशिल्प व हथकरघा',
    emoji: '🧵',
    typicalProject: '₹80,000 - ₹2.00L',
    margin: '₹8,000 (10%)',
    badge: 'Artisan Grant',
  },
  {
    id: 'services',
    name: 'Rural Repair & Services',
    nameHindi: 'मरम्मत व तकनीकी सेवा केंद्र',
    emoji: '🔧',
    typicalProject: '₹1.00L - ₹2.80L',
    margin: '₹10,000 (10%)',
    badge: 'Low Fixed Capex',
  },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  currentLanguage,
  onLanguageChange,
  onComplete,
  initialProfile,
}) => {
  const t = translations[currentLanguage];

  // Step state: 1: Language -> 2: Phone/OTP -> 3: Profile Setup -> 4: Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Phone & OTP state
  const [phone, setPhone] = useState<string>(initialProfile?.phone || '');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [phoneError, setPhoneError] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  // Profile setup state
  const [fullName, setFullName] = useState<string>(initialProfile?.name || '');
  const [state, setState] = useState<string>(initialProfile?.state || 'Uttar Pradesh');
  const [district, setDistrict] = useState<string>(initialProfile?.district || 'Varanasi');
  const [block, setBlock] = useState<string>(initialProfile?.block || 'Cholapur');
  const [village, setVillage] = useState<string>(initialProfile?.village || 'Chiragpur Village');
  const [businessType, setBusinessType] = useState<string>(initialProfile?.businessType || 'dairy');
  const [marginCapital, setMarginCapital] = useState<number>(initialProfile?.marginCapital || 50000);
  const [isShg, setIsShg] = useState<boolean>(initialProfile?.isShg || false);
  const [shgGroupName, setShgGroupName] = useState<string>(initialProfile?.shgGroupName || 'Gramodaya Mahila SHG');
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);

  // Voice Preview for Language Selection
  const playVoiceGreeting = (greeting: string, langCode: Language) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(greeting);
    const codeMap: Record<Language, string> = {
      hi: 'hi-IN',
      en: 'en-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      sat: 'hi-IN',
      bhb: 'hi-IN',
      gon: 'hi-IN',
      or: 'or-IN',
      as: 'as-IN',
      brx: 'as-IN',
    };
    utterance.lang = codeMap[langCode] || 'hi-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Timer countdown for OTP
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError(currentLanguage === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');
    setOtpSent(true);
    setTimer(30);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setOtpError(currentLanguage === 'hi' ? 'कृपया 4-अंकीय ओटीपी दर्ज करें' : 'Please enter the 4-digit OTP code');
      return;
    }
    // Demo verification accepts 1234 or any 4 digits
    setOtpError('');
    setStep(3); // Proceed to Profile Setup
  };

  // Voice input for Village
  const handleVoiceInputVillage = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition not available in this browser');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      setIsListeningVoice(true);

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setVillage(text);
        }
        setIsListeningVoice(false);
      };

      recognition.onerror = () => setIsListeningVoice(false);
      recognition.onend = () => setIsListeningVoice(false);
      recognition.start();
    } catch {
      setIsListeningVoice(false);
    }
  };

  // Handle Final Profile Submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      name: fullName.trim() || 'Rameshwar Sharma',
      phone: phone || '9876543210',
      state,
      district,
      block: block || 'Cholapur',
      village: village || 'Chiragpur Village',
      businessType,
      marginCapital: Number(marginCapital) || 50000,
      isShg,
      shgGroupName: isShg ? shgGroupName : undefined,
      isVerified: true,
    };

    setStep(4);
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#0a3663', '#107c41', '#f59e0b', '#2563eb'],
    });

    setTimeout(() => {
      onComplete(profile);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef4fb] via-[#f8fafc] to-[#f1f5f9] flex flex-col justify-between py-6 px-4 sm:px-6">
      <div className="max-w-xl w-full mx-auto">
        {/* Top Branding & Progress Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-1.5 bg-white rounded-2xl shadow-md border border-[#c3d5e8] mb-3">
            <img
              src="/Foto.jpeg"
              alt="Vyapar Sahayak Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to logo.jpg if Foto.jpeg has an issue
                (e.target as HTMLImageElement).src = '/logo.jpg';
              }}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0a3663] tracking-tight">
            व्यापार SAHAYAK
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#107c41] mt-0.5">
            {t.brandTagline || 'AI Business & Financial Assistant'}
          </p>
          <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f3ff] text-[#0a3663] text-[11px] font-bold border border-[#c3d9f5]">
            <span className="w-2 h-2 rounded-full bg-[#107c41] animate-pulse"></span>
            MoSJE Concessional Loan Advisory
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-[#e2e8f0] -translate-y-1/2 -z-0"></div>
            <div
              className="absolute top-1/2 left-6 h-0.5 bg-[#0a3663] -translate-y-1/2 transition-all duration-300 -z-0"
              style={{
                width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
              }}
            ></div>

            {/* Step 1 Pill */}
            <button
              onClick={() => setStep(1)}
              className={`relative z-10 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                step === 1
                  ? 'text-[#0a3663] font-bold'
                  : step > 1
                  ? 'text-[#107c41]'
                  : 'text-[#64748b]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  step === 1
                    ? 'bg-[#0a3663] text-white ring-4 ring-[#d8e6f7]'
                    : step > 1
                    ? 'bg-[#107c41] text-white'
                    : 'bg-[#f1f5f9] text-[#64748b] border border-[#cbd5e1]'
                }`}
              >
                {step > 1 ? (
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  '1'
                )}
              </div>
              <span className="text-[11px] text-center leading-tight">
                {t.stepLanguage || 'Language'}
              </span>
            </button>

            {/* Step 2 Pill */}
            <button
              onClick={() => {
                if (step > 1) setStep(2);
              }}
              disabled={step < 2}
              className={`relative z-10 flex flex-col items-center gap-1 transition-all ${
                step === 2
                  ? 'text-[#0a3663] font-bold'
                  : step > 2
                  ? 'text-[#107c41]'
                  : 'text-[#94a3b8]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  step === 2
                    ? 'bg-[#0a3663] text-white ring-4 ring-[#d8e6f7]'
                    : step > 2
                    ? 'bg-[#107c41] text-white'
                    : 'bg-[#f1f5f9] text-[#94a3b8] border border-[#cbd5e1]'
                }`}
              >
                {step > 2 ? (
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  '2'
                )}
              </div>
              <span className="text-[11px] text-center leading-tight">
                {t.stepLogin || 'OTP Login'}
              </span>
            </button>

            {/* Step 3 Pill */}
            <button
              onClick={() => {
                if (step > 2) setStep(3);
              }}
              disabled={step < 3}
              className={`relative z-10 flex flex-col items-center gap-1 transition-all ${
                step === 3
                  ? 'text-[#0a3663] font-bold'
                  : step > 3
                  ? 'text-[#107c41]'
                  : 'text-[#94a3b8]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  step === 3
                    ? 'bg-[#0a3663] text-white ring-4 ring-[#d8e6f7]'
                    : step > 3
                    ? 'bg-[#107c41] text-white'
                    : 'bg-[#f1f5f9] text-[#94a3b8] border border-[#cbd5e1]'
                }`}
              >
                {step > 3 ? (
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  '3'
                )}
              </div>
              <span className="text-[11px] text-center leading-tight">
                {t.stepProfile || 'Profile'}
              </span>
            </button>
          </div>
        </div>

        {/* STEP 1: LANGUAGE SELECTION */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#e2e8f0] animate-fade-in-down">
            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-[#0f172a]">
                अपनी भाषा चुनें / Select Your Language
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-1">
                {t.onboardingSubtitle || 'Choose your preferred language for financial advisory & voice guidance'}
              </p>
            </div>

            {/* Language Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {LANGUAGES.map((lang) => {
                const isSelected = currentLanguage === lang.id;
                return (
                  <div
                    key={lang.id}
                    onClick={() => {
                      onLanguageChange(lang.id);
                      playVoiceGreeting(lang.greeting, lang.id);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-left ${
                      isSelected
                        ? 'border-[#0a3663] bg-[#f0f6fc] shadow-sm ring-2 ring-[#0a3663]/20'
                        : 'border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? 'border-[#0a3663] bg-[#0a3663] text-white'
                            : 'border-[#cbd5e1] bg-white'
                        }`}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-base text-[#0f172a] leading-tight">
                          {lang.nativeName}
                        </div>
                        <div className="text-xs text-[#64748b]">
                          {lang.label} • <span className="text-[#107c41] font-medium">{lang.region}</span>
                        </div>
                      </div>
                    </div>

                    {/* Audio Listen Preview Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLanguageChange(lang.id);
                        playVoiceGreeting(lang.greeting, lang.id);
                      }}
                      className="p-2 rounded-lg bg-white border border-[#cbd5e1] text-[#0a3663] hover:bg-[#e2e8f0] active:scale-95 transition-all text-xs flex items-center gap-1 font-semibold"
                      title="सुनें (Listen sample)"
                    >
                      <span className="material-symbols-outlined text-base">volume_up</span>
                      <span className="hidden sm:inline">सुनें</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setStep(2)}
              className="w-full h-14 bg-[#0a3663] hover:bg-[#082a4d] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-base transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>{t.continueBtn || 'आगे बढ़ें / Continue'}</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        )}

        {/* STEP 2: PHONE & OTP LOGIN */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#e2e8f0] animate-fade-in-down">
            {!otpSent ? (
              /* Phone Input Sub-step */
              <div>
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-full bg-[#e8f3ff] text-[#0a3663] flex items-center justify-center mx-auto mb-2">
                    <span className="material-symbols-outlined text-2xl">smartphone</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0f172a]">
                    {t.phoneTitle || 'मोबाइल नंबर दर्ज करें'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475569] mt-1">
                    {t.phoneSubtitle || 'सत्यापन के लिए आपके नंबर पर 4-अंकीय ओटीपी भेजा जाएगा'}
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2">
                      {t.phoneLabel || 'मोबाइल नंबर'}
                    </label>
                    <div className="flex rounded-xl border-2 border-[#cbd5e1] focus-within:border-[#0a3663] focus-within:ring-2 focus-within:ring-[#0a3663]/20 overflow-hidden transition-all bg-white">
                      <div className="px-3.5 py-3 bg-[#f8fafc] border-r border-[#cbd5e1] flex items-center gap-1.5 font-bold text-[#0a3663] text-sm">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        autoFocus
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder={t.namePlaceholder ? '98765 43210' : '9876543210'}
                        className="flex-1 px-4 py-3 text-base sm:text-lg font-semibold text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                      />
                    </div>
                    {phoneError && (
                      <p className="text-xs text-[#dc2626] font-semibold mt-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {phoneError}
                      </p>
                    )}
                  </div>

                  {/* Privacy note */}
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[11px] text-[#64748b] flex items-start gap-2">
                    <span className="material-symbols-outlined text-base text-[#107c41] shrink-0 mt-0.5">verified_user</span>
                    <span>
                      आपके विवरण सरकारी सुरक्षा मानकों के अनुसार पूर्णतः सुरक्षित हैं। कोई अनपेक्षित कॉल या शुल्क नहीं।
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-14 bg-[#0a3663] hover:bg-[#082a4d] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-base transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>{t.sendOtpBtn || 'ओटीपी प्राप्त करें (Get OTP)'}</span>
                    <span className="material-symbols-outlined text-xl">sms</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPhone('9876543210');
                      setOtpSent(true);
                      setTimer(30);
                    }}
                    className="w-full text-center text-xs font-semibold text-[#107c41] hover:underline pt-1 cursor-pointer"
                  >
                    ⚡ Quick Test with Demo Number (98765 43210)
                  </button>
                </form>
              </div>
            ) : (
              /* OTP Verification Sub-step */
              <div>
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-full bg-[#eaf8f0] text-[#107c41] flex items-center justify-center mx-auto mb-2">
                    <span className="material-symbols-outlined text-2xl">mark_email_read</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0f172a]">
                    {t.otpTitle || 'ओटीपी कोड सत्यापित करें'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475569] mt-1">
                    {t.otpSubtitle || 'इस नंबर पर भेजा गया कोड दर्ज करें:'}{' '}
                    <span className="font-bold text-[#0a3663]">+91 {phone}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="text-xs font-semibold text-[#d97706] hover:underline mt-1 inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    {t.changePhone || 'नंबर बदलें'}
                  </button>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2 text-center">
                      4-Digit Verification Code
                    </label>
                    <div className="flex justify-center gap-3">
                      {[0, 1, 2, 3].map((idx) => {
                        const digit = otp[idx] || '';
                        return (
                          <input
                            key={idx}
                            id={`otp-box-${idx}`}
                            type="text"
                            maxLength={1}
                            autoFocus={idx === 0}
                            value={digit}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              const newOtp = otp.split('');
                              newOtp[idx] = val;
                              const combined = newOtp.join('').slice(0, 4);
                              setOtp(combined);
                              if (val && idx < 3) {
                                document.getElementById(`otp-box-${idx + 1}`)?.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                                document.getElementById(`otp-box-${idx - 1}`)?.focus();
                              }
                            }}
                            className="w-14 h-14 text-center text-2xl font-black rounded-xl border-2 border-[#cbd5e1] focus:border-[#0a3663] focus:ring-2 focus:ring-[#0a3663]/20 outline-none transition-all bg-white"
                          />
                        );
                      })}
                    </div>

                    {otpError && (
                      <p className="text-xs text-[#dc2626] font-semibold mt-2 text-center flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {otpError}
                      </p>
                    )}
                  </div>

                  {/* Demo Helper Button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setOtp('1234')}
                      className="px-3 py-1.5 rounded-lg bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-xs font-bold hover:bg-[#fde68a] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">key</span>
                      {t.useDemoOtp || 'Auto-fill Demo OTP (1234)'}
                    </button>
                  </div>

                  {/* Resend OTP countdown */}
                  <div className="text-center text-xs text-[#64748b]">
                    {timer > 0 ? (
                      <span>पुनः कोड भेजें: <strong className="text-[#0a3663] font-bold">{timer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setTimer(30)}
                        className="text-[#0a3663] font-bold hover:underline cursor-pointer"
                      >
                        {t.resendOtp || 'ओटीपी पुनः भेजें (Resend OTP)'}
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full h-14 bg-[#107c41] hover:bg-[#0e6937] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-base transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>{t.verifyOtpBtn || 'सत्यापित करें और आगे बढ़ें (Verify & Continue)'}</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: USER PROFILE SETUP */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#e2e8f0] animate-fade-in-down">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-2xl">badge</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0f172a]">
                {t.profileTitle || 'व्यापार प्रोफाइल सेटअप करें'}
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-1">
                {t.profileSubtitle || 'अपनी वित्तीय संभाव्यता और 90% ऋण योजना के लिए स्थान व उद्यम चुनें'}
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  {t.fullNameLabel || 'उद्यमी का पूरा नाम'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="उदा. रामेश्वर शर्मा / Rameshwar Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-[#cbd5e1] focus:border-[#0a3663] focus:ring-2 focus:ring-[#0a3663]/20 font-semibold text-[#0f172a] outline-none"
                />
              </div>

              {/* State & District Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    {t.stateLabel || 'राज्य (State)'}
                  </label>
                  <select
                    value={state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setState(newState);
                      const defaultDist = STATES_AND_DISTRICTS[newState]?.[0] || 'Varanasi';
                      setDistrict(defaultDist);
                    }}
                    className="w-full px-3.5 py-3 rounded-xl border border-[#cbd5e1] focus:border-[#0a3663] focus:ring-2 focus:ring-[#0a3663]/20 font-semibold text-[#0f172a] bg-white outline-none"
                  >
                    {Object.keys(STATES_AND_DISTRICTS).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    {t.districtLabel || 'ज़िला (District)'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-[#cbd5e1] focus:border-[#0a3663] focus:ring-2 focus:ring-[#0a3663]/20 font-semibold text-[#0f172a] bg-white outline-none"
                  >
                    {(STATES_AND_DISTRICTS[state] || ['Varanasi', 'Gorakhpur']).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Block & Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    {t.blockLabel || 'तहसील / ब्लॉक (Block)'}
                  </label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="उदा. Cholapur"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] focus:border-[#0a3663] font-semibold text-[#0f172a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    {t.villageLabel || 'गाँव (Village)'}
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="उदा. Chiragpur Village"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[#cbd5e1] focus:border-[#0a3663] font-semibold text-[#0f172a] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVoiceInputVillage}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isListeningVoice
                          ? 'bg-[#dc2626] text-white animate-pulse'
                          : 'bg-[#f1f5f9] text-[#0a3663] hover:bg-[#e2e8f0]'
                      }`}
                      title="बोलकर गाँव का नाम दर्ज करें"
                    >
                      <span className="material-symbols-outlined text-lg">mic</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Business Sector / Enterprise Selection */}
              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2">
                  {t.businessTypeLabel || 'व्यापार का प्रकार / क्षेत्र (Business Type)'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {BUSINESS_SECTORS.map((sector) => {
                    const isSelected = businessType === sector.id;
                    return (
                      <div
                        key={sector.id}
                        onClick={() => setBusinessType(sector.id)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-left ${
                          isSelected
                            ? 'border-[#0a3663] bg-[#f0f6fc] shadow-xs'
                            : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{sector.emoji}</span>
                          <div>
                            <div className="text-xs font-bold text-[#0f172a] leading-tight">
                              {currentLanguage === 'hi' ? sector.nameHindi : sector.name}
                            </div>
                            <div className="text-[10px] text-[#64748b]">
                              Project: <strong className="text-[#0a3663]">{sector.typicalProject}</strong>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[#0a3663] text-lg font-bold">check_circle</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Margin Capital Input */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#cbd5e1]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#0a3663]">
                    {t.marginCapitalLabel || 'उपलब्ध मार्जिन पूंजी (10% Self-Contribution)'}
                  </label>
                  <span className="text-sm font-black text-[#107c41]">
                    ₹{marginCapital.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {[25000, 50000, 100000, 200000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setMarginCapital(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        marginCapital === amt
                          ? 'bg-[#0a3663] text-white border-[#0a3663]'
                          : 'bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#e2e8f0]'
                      }`}
                    >
                      ₹{(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#64748b]">
                  💡 10% स्व-निवेश (₹{marginCapital.toLocaleString('en-IN')}) पर MoSJE योजना के तहत <strong>₹{(marginCapital * 9).toLocaleString('en-IN')} (90%)</strong> तक रियायती ऋण सहायता उपलब्ध होगी।
                </p>
              </div>

              {/* SHG / Mahila Mandal Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#cbd5e1] bg-white">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d97706] text-xl">groups</span>
                  <div>
                    <div className="text-xs font-bold text-[#0f172a]">स्वयं सहायता समूह (SHG) सदस्य?</div>
                    <div className="text-[10px] text-[#64748b]">Women self-help groups get additional interest rebate</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isShg}
                  onChange={(e) => setIsShg(e.target.checked)}
                  className="w-5 h-5 accent-[#0a3663] cursor-pointer"
                />
              </div>

              {isShg && (
                <div className="animate-fade-in-down">
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    समूह का नाम (SHG Name)
                  </label>
                  <input
                    type="text"
                    value={shgGroupName}
                    onChange={(e) => setShgGroupName(e.target.value)}
                    placeholder="उदा. Gramodaya Mahila SHG"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#0f172a]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full h-14 bg-[#0a3663] hover:bg-[#082a4d] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-base transition-all active:scale-[0.99] cursor-pointer mt-3"
              >
                <span>{t.enterDashboardBtn || 'व्यापार सहायक डैशबोर्ड में प्रवेश करें'}</span>
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: CELEBRATION & REDIRECT */}
        {step === 4 && (
          <div className="bg-white rounded-2xl p-8 shadow-md border border-[#e2e8f0] text-center animate-fade-in-down">
            <div className="w-16 h-16 rounded-full bg-[#eaf8f0] text-[#107c41] flex items-center justify-center mx-auto mb-4 animate-bounce">
              <span className="material-symbols-outlined text-3xl font-bold">verified</span>
            </div>
            <h2 className="text-2xl font-black text-[#0a3663]">
              प्रोफ़ाइल सफलतापूर्वक सत्यापित!
            </h2>
            <p className="text-sm text-[#334155] mt-1 font-medium">
              नमस्ते, <strong>{getLocalizedUserName(fullName, currentLanguage)}</strong>! व्यापार सहायक डैशबोर्ड लोड हो रहा है...
            </p>
            <div className="mt-5 p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#64748b]">चयनित उद्यम:</span>
                <span className="font-bold text-[#0f172a] capitalize">{businessType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">स्थान:</span>
                <span className="font-bold text-[#0f172a]">{village}, {district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">मार्जिन निवेश:</span>
                <span className="font-bold text-[#107c41]">₹{marginCapital.toLocaleString('en-IN')} (10%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">अनुमानित ऋण:</span>
                <span className="font-bold text-[#0a3663]">₹{(marginCapital * 9).toLocaleString('en-IN')} (90% MoSJE)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
