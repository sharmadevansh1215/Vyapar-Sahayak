import React, { useState } from 'react';
import { BusinessCategory, Language } from '../types';
import { categories } from '../data/categories';
import { translations } from '../data/translations';

interface CategorySelectionProps {
  currentLanguage: Language;
  selectedCategory: BusinessCategory;
  onSelectCategory: (cat: BusinessCategory) => void;
  selectedSubcategoryId: string;
  onSelectSubcategory: (subId: string) => void;
  onProceedToWizard: () => void;
  onDirectReport: () => void;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  currentLanguage,
  selectedCategory,
  onSelectCategory,
  selectedSubcategoryId,
  onSelectSubcategory,
  onProceedToWizard,
  onDirectReport,
}) => {
  const t = translations[currentLanguage];

  return (
    <div className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-6 pb-[150px] md:pb-32">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h2 className="text-[22px] md:text-[26px] font-bold text-[#191c1e] mb-1">
          {t.selectCategoryTitle}
        </h2>
        <p className="text-sm md:text-base text-[#434653]">
          {t.selectCategorySubtitle}
        </p>
      </div>

      {/* Grid of Business Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory.id === cat.id;

          return (
            <React.Fragment key={cat.id}>
              <button
                onClick={() => {
                  onSelectCategory(cat);
                  if (cat.subcategories.length > 0) {
                    onSelectSubcategory(cat.subcategories[0].id);
                  }
                }}
                className={`flex flex-col items-center justify-between p-3.5 sm:p-4 md:p-5 bg-white rounded-2xl shadow-xs transition-all duration-200 focus:outline-none min-h-[190px] md:min-h-[220px] h-auto relative overflow-hidden group cursor-pointer text-center ${
                  isSelected
                    ? 'border-2 border-[#fe9832] ring-2 ring-[#fe9832]/20 bg-[#fffaf5]'
                    : 'border border-[#c3c6d5] hover:border-[#003c90] hover:bg-[#f7f9fc]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <span className="material-symbols-outlined text-[#fe9832] text-lg md:text-xl filled">
                      check_circle
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center w-full">
                  <span className="text-3xl sm:text-4xl md:text-5xl mb-1.5 transform group-hover:scale-110 transition-transform">
                    {cat.emoji}
                  </span>
                  <span className="text-[15px] sm:text-[16px] md:text-[18px] font-bold text-[#191c1e] text-center leading-snug break-words line-clamp-2 w-full px-1">
                    {currentLanguage === 'en' ? cat.name : cat.nameHindi}
                  </span>
                  <span className="text-[11px] sm:text-[12px] md:text-[13px] text-[#434653] mt-0.5 text-center font-medium break-words line-clamp-1 w-full px-1">
                    {currentLanguage === 'en' ? cat.nameHindi : cat.name}
                  </span>
                </div>
                
                <span className="mt-2 text-[10px] md:text-[11px] font-bold text-[#003c90] bg-[#d9e2ff] px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  Margin: {cat.defaultMargin}
                </span>
              </button>

              {/* Sub-category dropdown directly beneath if Selected on Mobile */}
              {isSelected && (
                <div className="col-span-2 md:hidden bg-white border border-[#c3c6d5] rounded-xl p-4 my-[-4px] animate-fade-in-down shadow-xs">
                  <label
                    htmlFor={`subcat-${cat.id}`}
                    className="block text-xs md:text-sm font-bold text-[#191c1e] mb-2 flex items-center justify-between"
                  >
                    <span>{t.selectSubcategory}</span>
                    <span className="text-[11px] text-[#737784] font-normal">
                      {cat.subcategories.length} Options
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id={`subcat-${cat.id}`}
                      value={selectedSubcategoryId}
                      onChange={(e) => onSelectSubcategory(e.target.value)}
                      className="block w-full h-[52px] pl-4 pr-10 py-2 text-sm md:text-base text-[#191c1e] bg-white border border-[#c3c6d5] rounded-xl appearance-none focus:outline-none focus:border-[#003c90] focus:ring-2 focus:ring-[#003c90]/20 font-medium"
                    >
                      {cat.subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {currentLanguage === 'en' ? sub.name : sub.nameHindi}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#434653]">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Desktop Sub-category Bar */}
      <div className="hidden md:block mt-6 bg-white border border-[#c3c6d5] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003c90]">tune</span>
            <h3 className="font-bold text-base text-[#191c1e]">
              {t.selectSubcategory} <span className="text-[#003c90]">({selectedCategory.name})</span>
            </h3>
          </div>
          <span className="text-xs text-[#737784]">Select a specialized production or service branch</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {selectedCategory.subcategories.map((sub) => {
            const isSubSelected = selectedSubcategoryId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubcategory(sub.id)}
                className={`p-3 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSubSelected
                    ? 'border-[#003c90] bg-[#d9e2ff] text-[#001945]'
                    : 'border-[#c3c6d5] bg-[#f7f9fc] text-[#434653] hover:bg-white'
                }`}
              >
                <span>{currentLanguage === 'en' ? sub.name : sub.nameHindi}</span>
                {isSubSelected && (
                  <span className="material-symbols-outlined text-sm text-[#003c90]">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Bar (Contextual Action matching Screen 2) */}
      <div className="fixed bottom-[72px] md:bottom-0 left-0 w-full z-40 bg-white border-t border-[#c3c6d5] shadow-[0_-4px_16px_rgba(0,60,144,0.08)] px-4 md:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fe9832] text-xl filled">
              check_circle
            </span>
            <span className="text-sm md:text-base font-bold text-[#191c1e]">
              {t.selectedText}: {selectedCategory.name} ({selectedCategory.nameHindi})
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f2f4f7] px-3 py-1 rounded-full border border-[#c3c6d5]">
            <span className="material-symbols-outlined text-[#1d59c1] text-base">
              trending_up
            </span>
            <span className="text-xs md:text-sm text-[#434653]">
              {t.estMargin}: <strong className="text-[#003c90] font-bold">{selectedCategory.defaultMargin}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onProceedToWizard}
            className="flex-1 md:flex-initial min-h-[54px] px-4 bg-white border-2 border-[#003c90] text-[#003c90] text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#f2f4f7] transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">location_on</span>
            <span className="h-[54px] w-[140px] flex items-center justify-center text-center text-xs md:text-sm leading-tight">
              स्थान व निवेश (Location & Margin)
            </span>
          </button>

          <button
            onClick={onDirectReport}
            className="flex-1 md:flex-initial h-[52px] px-7 bg-[#993900] hover:bg-[#7d2d00] text-[#ffc0a7] hover:text-white text-base md:text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-95"
          >
            <span>{t.generateReport}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
