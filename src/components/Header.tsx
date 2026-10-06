import React from 'react';
import { Language, TabType, UserProfile } from '../types';
import { useI18n } from '../context/I18nContext';
import { LanguageDropdown } from './LanguageDropdown';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onVoiceReadout?: () => void;
  isReading?: boolean;
  userProfile?: UserProfile | null;
  onToggleGeminiChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
  onVoiceReadout,
  isReading = false,
  userProfile,
  onToggleGeminiChat,
}) => {
  const { t, getLocalizedUserName } = useI18n();

  return (
    <header className="bg-white border-b border-[#cbd5e1] flex justify-between items-center px-3.5 sm:px-6 h-16 w-full sticky top-0 z-40 shadow-xs">
      {/* Brand & Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => onTabChange('dashboard')}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f0f6fc] border border-[#c3d5e8] flex items-center justify-center p-0.5 shrink-0 shadow-xs">
          <img
            src="/Foto.jpeg"
            alt="Vyapar Sahayak Logo"
            className="w-full h-full object-contain rounded-lg"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.jpg';
            }}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-[#0a3663] tracking-tight leading-tight">
              व्यापार SAHAYAK
            </h1>
            <span className="hidden xl:inline-block px-2 py-0.5 rounded-md bg-[#eaf8f0] text-[#107c41] text-[10px] font-bold border border-[#bbf7d0]">
              {t('appBadge', 'AI Business Advisory')}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#475569] font-medium hidden sm:inline truncate">
            {t('brandTagline', 'AI Business & Financial Assistant')}
          </span>
        </div>
      </div>

      {/* Streamlined Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Gemini Chat Trigger */}
        {onToggleGeminiChat && (
          <button
            onClick={onToggleGeminiChat}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-[#0a3663] hover:bg-[#082a4d] text-white transition-all shadow-xs cursor-pointer"
            title={t('navAiChat', 'AI Business Advisor')}
          >
            <span className="material-symbols-outlined text-sm text-[#f59e0b]">smart_toy</span>
            <span className="hidden sm:inline">{t('headerAiAdvisor', 'AI सलाहकार')}</span>
          </button>
        )}

        {/* Voice Readout Button (Accessibility) */}
        {onVoiceReadout && (
          <button
            onClick={onVoiceReadout}
            aria-label="Listen to page summary"
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
              isReading
                ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a] animate-pulse'
                : 'bg-[#f8fafc] text-[#0a3663] border-[#cbd5e1] hover:bg-[#e2e8f0]'
            }`}
            title={t('headerVoiceGuide', 'बोलकर सुनें (Voice Readout)')}
          >
            <span className="material-symbols-outlined text-sm">
              {isReading ? 'volume_up' : 'volume_down'}
            </span>
            <span className="hidden md:inline">
              {isReading ? t('headerVoiceSpeaking', 'बोल रहा है...') : t('headerVoiceGuide', 'ऑडियो गाइड')}
            </span>
          </button>
        )}

        {/* Dedicated State-Safe Language Selector Dropdown */}
        <LanguageDropdown
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />

        {/* Authoritative User Avatar Pill */}
        {userProfile && (
          <button
            onClick={() => onTabChange('profile')}
            className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-[#f8fafc] border border-[#cbd5e1] hover:bg-[#f1f5f9] transition-all cursor-pointer"
            title={t('navProfile', 'View Business Profile')}
          >
            {userProfile.profilePhoto ? (
              <img
                src={userProfile.profilePhoto}
                alt={getLocalizedUserName(userProfile.name)}
                className="w-7 h-7 rounded-full object-cover border border-[#c3d5e8]"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#0a3663] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                {getLocalizedUserName(userProfile.name).charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-bold text-[#0a3663] hidden md:inline truncate max-w-[120px] leading-normal">
              {getLocalizedUserName(userProfile.name)}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
