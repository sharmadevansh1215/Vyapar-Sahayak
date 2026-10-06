import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { useI18n } from '../context/I18nContext';
import { LanguageConfig } from '../i18n';

interface LanguageDropdownProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  currentLanguage,
  onLanguageChange,
  className = '',
}) => {
  const { languageConfigs, activeLanguages, comingSoonLanguages, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentConfig = languageConfigs.find((l) => l.code === currentLanguage) || languageConfigs[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id="language-selector-button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t('headerSelectLanguage', 'Select Language')}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#cbd5e1] text-[#0a3663] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0a3663]/30"
      >
        <span className="material-symbols-outlined text-[17px] text-[#0a3663]">translate</span>
        <span className="font-semibold">{currentConfig.nativeName}</span>
        <span className="material-symbols-outlined text-[16px] text-[#64748b] transition-transform duration-200">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Popover Dropdown (Desktop) & Bottom Sheet (Mobile) */}
      {isOpen && (
        <>
          {/* Semi-transparent Backdrop for Desktop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Backdrop & Bottom Sheet */}
          <div
            className="sm:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <div
              className="bg-white rounded-t-2xl p-4 max-h-[80vh] flex flex-col shadow-2xl animate-slide-up"
              ref={dropdownRef}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0a3663]">
                  <span className="material-symbols-outlined text-lg">translate</span>
                  <span>{t('headerSelectLanguage', 'Select Language / भाषा चुनें')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-[#64748b] hover:bg-[#f1f5f9] cursor-pointer"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div className="overflow-y-auto py-2 space-y-1 divide-y divide-[#f1f5f9]">
                <div className="pb-2">
                  <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider px-2 py-1">
                    {t('commonSelected', 'Supported Languages')} ({activeLanguages.length})
                  </div>
                  {activeLanguages.map((lang: LanguageConfig) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        currentLanguage === lang.code
                          ? 'bg-[#e8f3ff] text-[#0a3663] font-bold border border-[#c3d5e8]'
                          : 'text-[#1e293b] hover:bg-[#f8fafc]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{lang.nativeName}</span>
                        <span className="text-[10px] text-[#64748b]">
                          {lang.englishName} • {lang.region}
                        </span>
                      </div>
                      {currentLanguage === lang.code && (
                        <span className="material-symbols-outlined text-base text-[#107c41]">check_circle</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Coming Soon Section */}
                <div className="pt-2">
                  <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider px-2 py-1">
                    Coming Soon / जल्द आ रहा है ({comingSoonLanguages.length})
                  </div>
                  {comingSoonLanguages.map((lang: LanguageConfig) => (
                    <div
                      key={lang.code}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between text-[#94a3b8] bg-[#f8fafc]/60 cursor-not-allowed opacity-75"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{lang.nativeName}</span>
                        <span className="text-[9px]">{lang.englishName} • {lang.region}</span>
                      </div>
                      <span className="text-[9px] bg-[#f1f5f9] text-[#64748b] px-1.5 py-0.5 rounded border border-[#e2e8f0]">
                        Coming Soon
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Floating Popover */}
          <div
            className="hidden sm:block absolute right-0 mt-2 w-72 max-h-[420px] bg-white border border-[#cbd5e1] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-down"
            style={{ filter: 'drop-shadow(0 12px 24px rgba(10, 54, 99, 0.15))' }}
          >
            {/* Header banner */}
            <div className="px-3.5 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between text-xs font-bold text-[#0a3663]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">translate</span>
                <span>{t('headerSelectLanguage', 'Select Language')}</span>
              </span>
              <span className="text-[10px] font-semibold text-[#107c41] bg-[#eaf8f0] px-2 py-0.5 rounded-full border border-[#bbf7d0]">
                {activeLanguages.length} Active
              </span>
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto max-h-[340px] p-1.5 space-y-0.5">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748b] px-2 py-1">
                Supported Dialects & Languages
              </div>
              {activeLanguages.map((lang: LanguageConfig) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    currentLanguage === lang.code
                      ? 'bg-[#e8f3ff] text-[#0a3663] font-bold border border-[#c3d5e8]'
                      : 'text-[#1e293b] hover:bg-[#f1f5f9]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold leading-tight">{lang.nativeName}</span>
                    <span className="text-[10px] text-[#64748b]">
                      {lang.englishName} ({lang.region})
                    </span>
                  </div>
                  {currentLanguage === lang.code && (
                    <span className="material-symbols-outlined text-base text-[#107c41]">check_circle</span>
                  )}
                </button>
              ))}

              {/* Coming soon section */}
              <div className="pt-2 border-t border-[#f1f5f9] mt-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94a3b8] px-2 py-1">
                  Regional & Tribal (Coming Soon)
                </div>
                {comingSoonLanguages.map((lang: LanguageConfig) => (
                  <div
                    key={lang.code}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between text-[#94a3b8] cursor-not-allowed opacity-70"
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium">{lang.nativeName}</span>
                      <span className="text-[9px] text-[#94a3b8]">{lang.englishName}</span>
                    </div>
                    <span className="text-[9px] bg-[#f8fafc] text-[#94a3b8] px-1.5 py-0.5 rounded border border-[#e2e8f0]">
                      Soon
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
