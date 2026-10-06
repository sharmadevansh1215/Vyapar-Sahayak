import React from 'react';
import { TabType, Language } from '../types';
import { translations } from '../data/translations';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentLanguage: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  currentLanguage,
}) => {
  const t = translations[currentLanguage];

  const navItems: { id: TabType; label: string; icon: string }[] = [
    {
      id: 'dashboard',
      label: t.navHome || 'Home',
      icon: 'dashboard',
    },
    {
      id: 'calculator',
      label: t.navCalculator || 'Calculator',
      icon: 'calculate',
    },
    {
      id: 'profile',
      label: t.navProfile || 'Profile',
      icon: 'badge',
    },
    {
      id: 'settings',
      label: t.navSettings || 'Settings',
      icon: 'tune',
    },
  ];

  // Helper to map secondary tabs to the 4 main bottom items
  const isItemActive = (id: TabType) => {
    if (activeTab === id) return true;
    if (id === 'dashboard' && (activeTab === 'landing' || activeTab === 'category' || activeTab === 'wizard')) return true;
    if (id === 'calculator' && activeTab === 'grants') return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-3 py-1.5 bg-white border-t border-[#cbd5e1] md:hidden h-[68px] shadow-[0_-3px_12px_rgba(0,0,0,0.06)]">
      {navItems.map((item) => {
        const isActive = isItemActive(item.id);
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center transition-all cursor-pointer h-12 w-[72px] rounded-xl relative ${
              isActive
                ? 'bg-[#0a3663] text-white shadow-sm'
                : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0a3663]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-transform ${
                isActive ? 'text-[#f59e0b] scale-110' : 'text-[#475569]'
              }`}
              data-weight={isActive ? 'fill' : undefined}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] font-bold mt-0.5 truncate max-w-[64px] text-center ${
              isActive ? 'text-white' : 'text-[#64748b]'
            }`}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute -top-1 w-6 h-1 rounded-full bg-[#f59e0b]"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
