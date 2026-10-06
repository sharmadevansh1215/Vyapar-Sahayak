import React from 'react';
import { Language } from '../types';

interface QuickStartGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export const QuickStartGuideModal: React.FC<QuickStartGuideModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
}) => {
  if (!isOpen) return null;

  const handleDismissForever = () => {
    try {
      localStorage.setItem('mosje_quickstart_dismissed', 'true');
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#c3c6d5] relative overflow-hidden">
        {/* Decorative Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-[#d9e2ff] text-[#003c90] rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            <span>Quick Start Onboarding</span>
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2f4f7] flex items-center justify-center text-[#737784] hover:bg-[#e4e7ec] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <h2 className="text-xl md:text-2xl font-extrabold text-[#001945] mb-2 leading-tight">
          How to get your MoSJE Project Feasibility & Loan in 30 Seconds
        </h2>
        <p className="text-xs md:text-sm text-[#434653] mb-6 leading-relaxed">
          Welcome to the AI Rural Advisory Platform. Follow these 3 simple steps to generate a bank-ready DPR and claim up to 90% concessional financing.
        </p>

        {/* 3 Step Cards */}
        <div className="space-y-3.5 mb-6">
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#f7f9fc] border border-[#eceef1]">
            <div className="w-8 h-8 rounded-xl bg-[#003c90] text-white flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm text-[#191c1e]">
                Choose Business Sector & Enter Capital
              </h4>
              <p className="text-[11px] md:text-xs text-[#737784] mt-0.5">
                Pick from Dairy, Kirana, Poultry, Agro-Processing or use voice search. Enter your 10% self-margin (Individual or SHG Group mode).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe]">
            <div className="w-8 h-8 rounded-xl bg-[#16a34a] text-white flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm text-[#191c1e]">
                Instant AI Feasibility & Competitor Scan
              </h4>
              <p className="text-[11px] md:text-xs text-[#737784] mt-0.5">
                Gemini AI streams real-time local demand analysis, live Mandi prices, competitor density, and weather risk buffers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0]">
            <div className="w-8 h-8 rounded-xl bg-[#fe9832] text-[#683700] flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs md:text-sm text-[#191c1e]">
                Download QR-Verified DPR & Locate Bank
              </h4>
              <p className="text-[11px] md:text-xs text-[#737784] mt-0.5">
                Export an official PDF report with scannable QR verification code and locate nearest Lead Bank branches for immediate disbursal.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#eceef1]">
          <button
            onClick={handleDismissForever}
            className="text-xs text-[#737784] hover:text-[#191c1e] font-semibold underline cursor-pointer"
          >
            Don't show this again
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-[#003c90] hover:bg-[#002d6c] text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Got it, Let's Start!
          </button>
        </div>
      </div>
    </div>
  );
};
