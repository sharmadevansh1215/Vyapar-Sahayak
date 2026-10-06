import React from 'react';
import { NicheOpportunity, Language } from '../types';

interface NicheExploreModalProps {
  niche: NicheOpportunity | null;
  onClose: () => void;
  currentLanguage: Language;
  onApplyForNiche: (title: string) => void;
}

export const NicheExploreModal: React.FC<NicheExploreModalProps> = ({
  niche,
  onClose,
  onApplyForNiche,
}) => {
  if (!niche) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-down">
      <div className="bg-white border border-[#c3c6d5] rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#c3c6d5] flex items-center justify-between bg-[#f7f9fc]">
          <div className="flex items-center gap-3">
            <div
              className={`${niche.bgColor} ${niche.textColor} w-11 h-11 rounded-xl flex items-center justify-center`}
            >
              <span className="material-symbols-outlined text-2xl">{niche.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-[#191c1e]">{niche.title}</h3>
                <span
                  className={`${niche.tagBg} ${niche.tagColor} text-[11px] font-bold px-2 py-0.5 rounded-full`}
                >
                  {niche.demandLevel} Demand
                </span>
              </div>
              <p className="text-xs text-[#737784]">High Growth Rural Micro-Sector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#e0e3e6] flex items-center justify-center text-[#434653] cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs md:text-sm text-[#434653]">
          <p className="text-sm font-medium text-[#191c1e] leading-relaxed">
            {niche.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f7f9fc] border border-[#c3c6d5] p-3 rounded-xl">
              <span className="text-[10px] text-[#737784] font-bold block uppercase">
                Est. Setup Investment
              </span>
              <span className="text-base font-bold text-[#003c90]">₹45,000 - ₹90,000</span>
            </div>

            <div className="bg-[#f7f9fc] border border-[#c3c6d5] p-3 rounded-xl">
              <span className="text-[10px] text-[#737784] font-bold block uppercase">
                Expected Payback Period
              </span>
              <span className="text-base font-bold text-[#166534]">4 - 6 Months</span>
            </div>
          </div>

          <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-3.5 rounded-xl space-y-1.5 text-xs text-[#14532d]">
            <span className="font-bold flex items-center gap-1 text-[#166534]">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              MoSJE & NABARD Subsidized Priority
            </span>
            <p>
              Eligible for up to 35% capital subsidy and priority bank loan processing through local SHG clusters.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs text-[#191c1e] uppercase tracking-wide">
              Key Requirements & Equipment
            </h4>
            <ul className="space-y-1 text-xs text-[#434653] list-disc list-inside">
              <li>Basic 200 sq.ft covered workspace or shaded area</li>
              <li>MoSJE accredited 3-day rural skill certification</li>
              <li>Local farmer group / cooperative supply linkage</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c3c6d5] bg-[#f7f9fc] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#434653] hover:bg-[#e0e3e6] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApplyForNiche(niche.title);
              onClose();
            }}
            className="px-5 py-2.5 bg-[#003c90] hover:bg-[#002d6c] text-white rounded-xl text-xs md:text-sm font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>इस क्षेत्र में योजना जोड़ें (Select Niche)</span>
            <span className="material-symbols-outlined text-sm">check</span>
          </button>
        </div>
      </div>
    </div>
  );
};
