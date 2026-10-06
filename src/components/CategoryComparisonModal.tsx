import React, { useState } from 'react';
import { BusinessCategory, Language } from '../types';
import { categories } from '../data/categories';
import { calculateFinancialPlan, formatINR } from '../utils/calculations';

interface CategoryComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: BusinessCategory;
  onSelectCategory: (category: BusinessCategory) => void;
  currentLanguage: Language;
  marginCapital: number;
}

export const CategoryComparisonModal: React.FC<CategoryComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  currentLanguage,
  marginCapital,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    selectedCategory.id,
    selectedCategory.id === 'dairy' ? 'kirana' : 'dairy',
    selectedCategory.id === 'poultry' ? 'food_processing' : 'poultry',
  ]);

  if (!isOpen) return null;

  const comparedCategories = categories.filter((c) => selectedIds.includes(c.id));

  const toggleCategorySelection = (catId: string) => {
    if (selectedIds.includes(catId)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((id) => id !== catId));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, catId]);
      } else {
        // Replace last item
        setSelectedIds([selectedIds[0], selectedIds[1], catId]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#c3c6d5] overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-[#eceef1] flex items-center justify-between bg-[#f7f9fc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d9e2ff] flex items-center justify-center text-[#003c90]">
              <span className="material-symbols-outlined text-2xl font-bold">compare_arrows</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-[#001945]">
                Side-by-Side Rural Enterprise Comparator
              </h2>
              <p className="text-xs text-[#737784]">
                Compare feasibility, capital efficiency, and ROI across 2-3 enterprise sectors
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#c3c6d5] flex items-center justify-center text-[#434653] hover:bg-[#eceef1] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Sector Selector Chips */}
        <div className="px-6 py-3 border-b border-[#eceef1] bg-white flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#737784] mr-2">Select Sectors (Up to 3):</span>
          {categories.map((cat) => {
            const isChecked = selectedIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategorySelection(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isChecked
                    ? 'bg-[#003c90] text-white shadow-xs'
                    : 'bg-[#f2f4f7] text-[#434653] hover:bg-[#e4e7ec]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
                {isChecked && <span className="material-symbols-outlined text-xs">check</span>}
              </button>
            );
          })}
        </div>

        {/* Comparison Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {comparedCategories.map((cat) => {
              const plan = calculateFinancialPlan(marginCapital);
              const isCurrent = cat.id === selectedCategory.id;

              return (
                <div
                  key={cat.id}
                  className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-[#003c90] ring-2 ring-[#003c90]/20 bg-[#f9fbff]'
                      : 'border-[#c3c6d5] bg-white hover:border-[#8e9099]'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{cat.emoji}</span>
                        <div>
                          <h3 className="font-extrabold text-base text-[#191c1e]">{cat.name}</h3>
                          <span className="text-xs text-[#737784] font-medium">{cat.nameHindi}</span>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-[#d9e2ff] text-[#003c90] text-[10px] font-extrabold rounded-md">
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#434653] line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Metrics Table */}
                    <div className="space-y-2.5 pt-2 border-t border-[#eceef1] text-xs">
                      <div className="flex justify-between py-1 border-b border-[#f2f4f7]">
                        <span className="text-[#737784]">10% Self Margin:</span>
                        <strong className="text-[#003c90] font-bold">{formatINR(plan.marginCapital)}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f2f4f7]">
                        <span className="text-[#737784]">90% MoSJE Loan:</span>
                        <strong className="text-[#166534] font-bold">{formatINR(plan.approvedLoan)}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f2f4f7]">
                        <span className="text-[#737784]">Total Feasible Capital:</span>
                        <strong className="text-[#191c1e] font-bold">{formatINR(plan.projectCost)}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f2f4f7]">
                        <span className="text-[#737784]">Est. Monthly Net Profit:</span>
                        <strong className="text-[#166534] font-extrabold">
                          {formatINR(plan.estimatedMonthlyNetProfit)}/mo
                        </strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f2f4f7]">
                        <span className="text-[#737784]">Break-Even Timeline:</span>
                        <strong className="text-[#8f4e00] font-bold">{plan.breakEvenMonths} Months</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#f2f4f7]">
                        <span className="text-[#737784]">Target Market Reach:</span>
                        <strong className="text-[#191c1e] font-bold">{cat.potentialCustomers}</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#737784]">Interest Rate:</span>
                        <strong className="text-[#003c90] font-bold">{plan.interestRate}% p.a.</strong>
                      </div>
                    </div>

                    {/* Top Strengths */}
                    <div className="bg-[#f2f4f7] p-3 rounded-xl">
                      <span className="text-[11px] font-bold text-[#434653] block mb-1">
                        Core Moat / Advantage:
                      </span>
                      <p className="text-[11px] text-[#191c1e] font-medium leading-tight">
                        {cat.swot.strengths[0] || 'High local daily cashflow'}
                      </p>
                    </div>
                  </div>

                  {/* Choose Button */}
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      onClose();
                    }}
                    className={`w-full mt-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#003c90] text-white shadow-xs'
                        : 'bg-white border-2 border-[#003c90] text-[#003c90] hover:bg-[#d9e2ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isCurrent ? 'check' : 'touch_app'}
                    </span>
                    <span>{isCurrent ? 'Current Active Sector' : 'Switch to this Sector'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f7f9fc] border-t border-[#eceef1] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#eceef1] hover:bg-[#e0e3e6] text-[#191c1e] font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close Comparator
          </button>
        </div>
      </div>
    </div>
  );
};
