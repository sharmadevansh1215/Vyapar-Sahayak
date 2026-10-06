import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface LandingScreenProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onStart,
}) => {
  const t = translations[currentLanguage];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
  ];

  return (
    <div className="flex-grow flex flex-col px-4 md:px-8 pb-[100px] pt-6 max-w-[1200px] mx-auto w-full gap-6">
      {/* Hero Card */}
      <section className="bg-white rounded-2xl border border-[#c3c6d5] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden relative shadow-xs">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f2f4f7] to-white opacity-60"></div>
        <div className="flex-1 w-full flex justify-center">
          <img
            referrerPolicy="no-referrer"
            className="w-full max-w-md object-contain aspect-[4/3] rounded-xl shadow-xs"
            alt="Rural Entrepreneurs Advisory Meeting"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPcRv48B36o20N_kKQCn-5AjGB19pzGauGuHuNMH-yePybuXmnhskc9buZtIeuiD8lEMEBIioSaDPZdD7OG4cM7S9YygvUVmcQlqOH7wuukmGXKAHO9vpkqE1o4iCI3vSuBLYNsQolz4rWFPpA8jfrORmYQwVJBeNTDqkQbUJweeTAWyhwQ9GjC95a3q_gm_UYuqgeHHSkAT9zY1-1pgYLFfXe-fR5oTuVhvmJy1raNNbPanN7ewKu"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d9e2ff] text-[#003c90] rounded-full text-xs font-bold w-fit mx-auto md:mx-0">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>MoSJE Approved Rural Assistance Portal</span>
          </div>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#191c1e] tracking-tight leading-tight">
            {t.heroTitle}
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#434653] leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Quick stats badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-[#f7f9fc] border border-[#e0e3e6] rounded-xl p-3 text-center">
              <span className="block text-[#003c90] font-bold text-lg md:text-xl">600+</span>
              <span className="text-[11px] text-[#737784] font-medium">Districts Covered</span>
            </div>
            <div className="bg-[#f7f9fc] border border-[#e0e3e6] rounded-xl p-3 text-center">
              <span className="block text-[#fe9832] font-bold text-lg md:text-xl">₹1.25L</span>
              <span className="text-[11px] text-[#737784] font-medium">Avg Micro-Grant</span>
            </div>
            <div className="bg-[#f7f9fc] border border-[#e0e3e6] rounded-xl p-3 text-center">
              <span className="block text-[#0f52ba] font-bold text-lg md:text-xl">6.5%</span>
              <span className="text-[11px] text-[#737784] font-medium">Subsidized Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Language Selection */}
      <section className="flex flex-col gap-3">
        <h3 className="text-[18px] md:text-[20px] font-bold text-[#191c1e] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#003c90]">language</span>
          {t.selectLanguage}
        </h3>
        <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x">
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`snap-start shrink-0 rounded-full px-6 py-3 text-sm md:text-base font-bold transition-all active:scale-95 flex items-center justify-center min-w-[120px] ${
                  isSelected
                    ? 'bg-[#003c90] text-white border-2 border-[#003c90] shadow-sm'
                    : 'bg-white text-[#003c90] border-2 border-[#c3c6d5] hover:border-[#003c90] hover:bg-[#f2f4f7]'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c3c6d5] rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#d9e2ff] text-[#003c90] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">analytics</span>
          </div>
          <div>
            <h4 className="font-bold text-base text-[#191c1e] mb-1">Local Feasibility</h4>
            <p className="text-xs text-[#434653] leading-relaxed">
              Analyze radius demographics, nearby competitor counts, and SWOT strength factors.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d5] rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ffdcc2] text-[#683700] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">calculate</span>
          </div>
          <div>
            <h4 className="font-bold text-base text-[#191c1e] mb-1">Margin Capital Math</h4>
            <p className="text-xs text-[#434653] leading-relaxed">
              Calculate exact project cost multipliers, subsidized loan approvals, and 3-year EMI schedules.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d5] rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#e0e3e6] text-[#003c90] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">account_balance</span>
          </div>
          <div>
            <h4 className="font-bold text-base text-[#191c1e] mb-1">MoSJE Scheme Linkage</h4>
            <p className="text-xs text-[#434653] leading-relaxed">
              Direct access to government interest subventions, bank branch locators, and document checklists.
            </p>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-[#c3c6d5] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-40">
        <div className="max-w-[1200px] mx-auto flex justify-center">
          <button
            onClick={onStart}
            className="w-full md:w-auto md:min-w-[420px] h-[56px] bg-[#fe9832] hover:bg-[#e68524] text-[#683700] font-bold text-lg md:text-xl rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <span>{t.startBusiness}</span>
            <span className="material-symbols-outlined text-2xl font-bold">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
