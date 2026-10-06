import React from 'react';
import { TabType, Language, UserProfile } from '../types';
import { useI18n } from '../context/I18nContext';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentLanguage: Language;
  userProfile?: UserProfile | null;
  onLogout?: () => void;
  onOpenQuickStart?: () => void;
  onToggleGeminiChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentLanguage,
  userProfile,
  onLogout,
  onOpenQuickStart,
  onToggleGeminiChat,
}) => {
  const { t, getLocalizedUserName } = useI18n();

  const navItems: { id: TabType; label: string; icon: string; description: string }[] = [
    {
      id: 'dashboard',
      label: t('navDashboard', 'Dashboard'),
      icon: 'dashboard',
      description: currentLanguage === 'hi' ? 'उद्यम व मुख्य आँकड़े' : 'Overview & Enterprises',
    },
    {
      id: 'calculator',
      label: t('navCalculator', 'Scheme Calculator'),
      icon: 'calculate',
      description: currentLanguage === 'hi' ? '10% मार्जिन vs 90% ऋण' : '10% Margin vs 90% Loan',
    },
    {
      id: 'profile',
      label: t('navProfile', 'Business Profile'),
      icon: 'badge',
      description: currentLanguage === 'hi' ? 'उद्यमी व स्थान विवरण' : 'Location & Verification',
    },
    {
      id: 'settings',
      label: t('navSettings', 'Settings & Help'),
      icon: 'tune',
      description: currentLanguage === 'hi' ? 'भाषा व मार्गदर्शन' : 'Language, Voice & FAQs',
    },
  ];

  // Map sub-views to their parent nav item for active state
  const isItemActive = (id: TabType) => {
    if (activeTab === id) return true;
    if (id === 'dashboard' && (activeTab === 'landing' || activeTab === 'category' || activeTab === 'wizard')) return true;
    if (id === 'calculator' && activeTab === 'grants') return true;
    return false;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-[#cbd5e1] h-screen sticky top-0 shrink-0 z-40 select-none shadow-[2px_0_8px_rgba(0,0,0,0.03)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#e2e8f0] flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#f0f6fc] border border-[#c3d5e8] flex items-center justify-center p-1 shrink-0 shadow-xs">
          <img
            src="/Foto.jpeg"
            alt="Vyapar Sahayak"
            className="w-full h-full object-contain rounded-lg"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.jpg';
            }}
          />
        </div>
        <div className="overflow-hidden">
          <div className="font-black text-lg text-[#0a3663] tracking-tight truncate">
            व्यापार SAHAYAK
          </div>
          <div className="text-[11px] font-semibold text-[#107c41] truncate">
            {t('brandTagline', 'AI Business & Financial Assistant')}
          </div>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94a3b8] px-3 mb-1">
          {currentLanguage === 'hi' ? 'मुख्य नेविगेशन' : 'Main Navigation'}
        </div>

        {navItems.map((item) => {
          const active = isItemActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                active
                  ? 'bg-[#0a3663] text-white shadow-sm font-bold'
                  : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0a3663] font-medium'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  active
                    ? 'bg-white/20 text-[#f59e0b]'
                    : 'bg-[#f1f5f9] text-[#0a3663]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-weight={active ? 'fill' : undefined}
                >
                  {item.icon}
                </span>
              </div>
              <div className="overflow-hidden">
                <div className="text-sm truncate leading-tight">{item.label}</div>
                <div
                  className={`text-[10px] truncate mt-0.5 ${
                    active ? 'text-white/80' : 'text-[#64748b]'
                  }`}
                >
                  {item.description}
                </div>
              </div>
              {active && (
                <div className="ml-auto w-1.5 h-6 rounded-full bg-[#f59e0b] shrink-0"></div>
              )}
            </button>
          );
        })}

        {/* Quick Shortcut: AI Feasibility Report */}
        <div className="pt-3">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#94a3b8] px-3 mb-1">
            {currentLanguage === 'hi' ? 'विशेष साधन' : 'Tools & Reports'}
          </div>

          <button
            onClick={() => onTabChange('reports')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-[#107c41] text-white shadow-sm font-bold'
                : 'text-[#334155] hover:bg-[#f1f5f9] font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-lg text-[#107c41]">
              analytics
            </span>
            <span className="text-xs truncate flex-1">
              {t('navReports', 'Feasibility Report')}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eaf8f0] text-[#107c41] font-bold">
              AI
            </span>
          </button>

          {/* AI Advisor Chat Drawer trigger */}
          {onToggleGeminiChat && (
            <button
              onClick={onToggleGeminiChat}
              className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[#334155] hover:bg-[#eef4fb] font-medium cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-lg text-[#0a3663]">
                smart_toy
              </span>
              <span className="text-xs truncate flex-1">
                {t('navAiChat', 'AI Advisor Chat')}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#107c41] animate-pulse"></span>
            </button>
          )}

          {/* User Guide */}
          {onOpenQuickStart && (
            <button
              onClick={onOpenQuickStart}
              className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[#334155] hover:bg-[#f1f5f9] font-medium cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-lg text-[#d97706]">
                help_outline
              </span>
              <span className="text-xs truncate flex-1">
                {t('navUserGuide', 'User Guide & FAQ')}
              </span>
            </button>
          )}
        </div>

        {/* Scheme Eligibility Highlight Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-br from-[#f0f7ff] to-[#e6f4ea] border border-[#cbd5e1] text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#0a3663] mb-1">
            <span className="material-symbols-outlined text-base text-[#107c41]">verified</span>
            <span>MoSJE Scheme 90% Loan</span>
          </div>
          <p className="text-[11px] text-[#475569] leading-snug">
            {currentLanguage === 'hi'
              ? '10% स्व-निवेश पर 90% तक रियायती ब्याज दर (6.5%) पर ऋण सुविधा।'
              : 'Invest 10% self-margin to unlock 90% concessional credit at 6.5% interest.'}
          </p>
        </div>
      </div>

      {/* User Profile & Switch Account Footer */}
      <div className="p-3.5 border-t border-[#e2e8f0] bg-[#f8fafc]">
        <div
          onClick={() => onTabChange('profile')}
          className="flex items-center gap-3 mb-2 p-1.5 rounded-xl hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-[#cbd5e1]"
          title="Open Business Profile"
        >
          {userProfile?.profilePhoto ? (
            <img
              src={userProfile.profilePhoto}
              alt={getLocalizedUserName(userProfile?.name)}
              className="w-10 h-10 rounded-full object-cover border border-[#c3d5e8] shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#0a3663] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {getLocalizedUserName(userProfile?.name).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden flex-1">
            <div className="font-bold text-xs text-[#0f172a] truncate leading-normal">
              {getLocalizedUserName(userProfile?.name)}
            </div>
            <div className="text-[10px] text-[#107c41] font-semibold truncate flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified</span>
              {userProfile?.district || 'Varanasi'}, {userProfile?.state || 'UP'}
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-1.5 px-2 rounded-lg bg-white border border-[#cbd5e1] text-[11px] font-bold text-[#dc2626] hover:bg-[#fee2e2] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">logout</span>
            <span>{t('navLogout', 'खाता बदलें / Switch Account')}</span>
          </button>
        )}
      </div>
    </aside>
  );
};
