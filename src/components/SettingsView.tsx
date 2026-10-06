import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { translations } from '../data/translations';

interface SettingsViewProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenQuickStart: () => void;
  onRestartOnboarding: () => void;
  userProfile?: UserProfile | null;
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

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenQuickStart,
  onRestartOnboarding,
  userProfile,
}) => {
  const t = translations[currentLanguage];
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);

  const playTestSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = currentLanguage === 'hi'
      ? 'व्यापार सहायक ऑडियो परीक्षण सफल रहा। आपकी भाषा हिंदी चयनित है।'
      : 'Vyapar Sahayak voice guidance test successful. Audio playback is active.';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingTestAudio(true);
    utterance.onend = () => setIsPlayingTestAudio(false);
    utterance.onerror = () => setIsPlayingTestAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#cbd5e1] shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0a3663]">
          {t.navSettings || 'Settings & Miscellaneous'}
        </h1>
        <p className="text-xs sm:text-sm text-[#64748b] mt-1">
          {currentLanguage === 'hi'
            ? 'अपनी पसंदीदा भाषा, ऑडियो गाइड, मार्गदर्शिका एवं खाता सेटिंग्स प्रबंधित करें।'
            : 'Configure system language, voice guidance settings, user guides, and enterprise account.'}
        </p>
      </div>

      {/* 1. Language Preferences */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cbd5e1] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-base text-[#0f172a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0a3663]">translate</span>
            <span>{currentLanguage === 'hi' ? 'भाषा प्राथमिकता (Language Selection)' : 'Language Selection'}</span>
          </h2>
          <span className="text-xs font-bold text-[#107c41]">
            Active: {LANGUAGES.find((l) => l.id === currentLanguage)?.nativeName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.id;
            return (
              <div
                key={lang.id}
                onClick={() => onLanguageChange(lang.id)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-left ${
                  isSelected
                    ? 'border-[#0a3663] bg-[#f0f6fc] shadow-xs ring-2 ring-[#0a3663]/20'
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-[#0f172a] leading-tight">
                    {lang.nativeName}
                  </div>
                  <div className="text-[11px] text-[#64748b]">
                    {lang.label} • {lang.region}
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

      {/* 2. Audio & Voice Readout Settings */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cbd5e1] shadow-xs space-y-4">
        <h2 className="font-black text-base text-[#0f172a] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#107c41]">record_voice_over</span>
          <span>{currentLanguage === 'hi' ? 'ऑडियो गाइड एवं वाक् सहायता' : 'Voice Assistance & Accessibility'}</span>
        </h2>
        <p className="text-xs text-[#64748b]">
          {currentLanguage === 'hi'
            ? 'कम साक्षरता या दृष्टिगत सुविधा के लिए व्यापार सहायक पूरी स्क्रीन की जानकारी बोलकर समझाता है।'
            : 'Vyapar Sahayak reads aloud critical financial figures and local advisory for accessibility.'}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={playTestSpeech}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
              isPlayingTestAudio
                ? 'bg-[#107c41] text-white border-[#107c41] animate-pulse'
                : 'bg-[#f0f6fc] hover:bg-[#e2e8f0] text-[#0a3663] border-[#c3d5e8]'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isPlayingTestAudio ? 'volume_up' : 'play_arrow'}
            </span>
            <span>{isPlayingTestAudio ? 'ऑडियो बज रहा है...' : 'आवाज़ का परीक्षण करें (Test Voice)'}</span>
          </button>
        </div>
      </div>

      {/* 3. User Guide & App Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-xl">menu_book</span>
            </div>
            <h3 className="font-bold text-sm text-[#0f172a]">
              {currentLanguage === 'hi' ? 'उपयोगकर्ता मार्गदर्शिका (User Manual)' : 'Quick Start Guide'}
            </h3>
            <p className="text-xs text-[#64748b] mt-1">
              {currentLanguage === 'hi'
                ? '10% मार्जिन से 90% सरकारी ऋण प्राप्त करने की चरण-दर-चरण प्रक्रिया और आवश्यक प्रमाण पत्र।'
                : 'Step-by-step walkthrough on securing 90% concessional credit with 10% self margin.'}
            </p>
          </div>
          <button
            onClick={onOpenQuickStart}
            className="mt-4 pt-3 border-t border-[#f1f5f9] text-xs font-bold text-[#0a3663] hover:underline flex items-center gap-1"
          >
            <span>{currentLanguage === 'hi' ? 'गाइड खोलें' : 'Open Guide'}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#e8f3ff] text-[#0a3663] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-xl">info</span>
            </div>
            <h3 className="font-bold text-sm text-[#0f172a]">
              व्यापार सहायक (Vyapar Sahayak)
            </h3>
            <p className="text-xs text-[#64748b] mt-1">
              Ministry of Social Justice & Empowerment (MoSJE) Concessional Finance & AI Rural Advisory Engine.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-[11px] text-[#64748b] flex justify-between items-center">
            <span>Version 2.4.0 (PWA Ready)</span>
            <span className="font-bold text-[#107c41]">Active & Connected</span>
          </div>
        </div>
      </div>

      {/* 4. Switch Account & Re-run Onboarding */}
      <div className="bg-[#fef2f2] border border-[#fecaca] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-[#991b1b]">
            {currentLanguage === 'hi' ? 'खाता बदलें या नया पंजीकरण करें' : 'Switch Account or Restart Onboarding'}
          </h3>
          <p className="text-xs text-[#b91c1c] mt-0.5">
            {currentLanguage === 'hi'
              ? 'यदि आप अन्य लाभार्थी अथवा अन्य गाँव/उद्यम के लिए आवेदन सेटअप करना चाहते हैं।'
              : 'Restart the multilingual OTP login and business profile setup flow.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onRestartOnboarding}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          <span>{t.logoutBtn || 'खाता बदलें / Restart Onboarding'}</span>
        </button>
      </div>
    </div>
  );
};
