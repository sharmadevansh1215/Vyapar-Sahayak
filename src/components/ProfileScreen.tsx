import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface ProfileScreenProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenReport: () => void;
  onOpenBankLocator: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenReport,
  onOpenBankLocator,
}) => {
  const t = translations[currentLanguage];

  return (
    <div className="max-w-[1000px] mx-auto w-full px-4 md:px-8 py-6 space-y-6 pb-28 md:pb-16">
      {/* Profile Header */}
      <div className="bg-white border border-[#c3c6d5] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xs">
        <div className="w-20 h-20 rounded-2xl bg-[#003c90] text-white flex items-center justify-center text-3xl font-bold shadow-sm">
          <span className="material-symbols-outlined text-4xl">person</span>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#191c1e]">
                रामेश्वर प्रसाद (Rameshwar Prasad)
              </h2>
              <p className="text-xs md:text-sm text-[#434653]">
                Chiragpur Village, Cholapur Block, Varanasi (UP)
              </p>
            </div>
            <span className="bg-[#dcfce7] text-[#166534] text-xs font-bold px-3 py-1 rounded-full border border-[#bbf7d0] w-fit mx-auto sm:mx-0">
              ✓ KYC Verified Applicant
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#eceef1] text-xs">
            <div>
              <span className="text-[#737784] block font-semibold">Registered Mobile</span>
              <span className="font-bold text-[#191c1e]">+91 98390 XXXXX</span>
            </div>
            <div>
              <span className="text-[#737784] block font-semibold">Aadhar Status</span>
              <span className="font-bold text-[#166534]">Linked via DigiLocker</span>
            </div>
            <div>
              <span className="text-[#737784] block font-semibold">Target Business</span>
              <span className="font-bold text-[#003c90]">Dairy & Fodder Unit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loan Application Tracker */}
      <div className="bg-white border border-[#c3c6d5] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-[#737784] uppercase tracking-wider block">
              Application ID: #MoSJE-2026-0849
            </span>
            <h3 className="text-base md:text-lg font-bold text-[#001945]">
              MoSJE Micro Finance Scheme Application
            </h3>
          </div>
          <span className="bg-[#d9e2ff] text-[#001945] font-bold text-xs px-3 py-1 rounded-full">
            Under Bank Review
          </span>
        </div>

        {/* Steps Timeline */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-xs mb-1">
              ✓
            </div>
            <span className="text-[11px] font-bold text-[#166534]">DPR Submitted</span>
            <span className="text-[10px] text-[#737784]">Completed</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-xs mb-1">
              ✓
            </div>
            <span className="text-[11px] font-bold text-[#166534]">Doc Verification</span>
            <span className="text-[10px] text-[#737784]">Verified</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#fe9832] text-[#683700] flex items-center justify-center font-bold text-xs mb-1 ring-2 ring-[#fe9832]/30">
              3
            </div>
            <span className="text-[11px] font-bold text-[#683700]">Branch Appraisal</span>
            <span className="text-[10px] text-[#003c90] font-semibold">In Progress (SBI)</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#e0e3e6] text-[#737784] flex items-center justify-center font-bold text-xs mb-1">
              4
            </div>
            <span className="text-[11px] font-medium text-[#737784]">Disbursement</span>
            <span className="text-[10px] text-[#737784]">Pending</span>
          </div>
        </div>

        <div className="bg-[#f7f9fc] p-3 rounded-xl border border-[#c3c6d5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
          <span className="text-[#434653]">
            Nodal Bank: <strong>State Bank of India (Cholapur)</strong> | Field Officer: <strong>Rajesh Kumar</strong>
          </span>
          <button
            onClick={onOpenBankLocator}
            className="text-[#003c90] font-bold hover:underline cursor-pointer"
          >
            शाखा विवरण देखें (View Branch Info) →
          </button>
        </div>
      </div>

      {/* Saved Reports & Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Saved DPRs */}
        <div className="bg-white border border-[#c3c6d5] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003c90]">folder_open</span>
            <h4 className="font-bold text-base text-[#191c1e]">सुरक्षित डीपीआर रिपोर्ट्स (Saved DPR Reports)</h4>
          </div>

          <div
            onClick={onOpenReport}
            className="p-3 bg-[#f7f9fc] hover:bg-[#f2f4f7] border border-[#c3c6d5] rounded-xl cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-xs md:text-sm text-[#001945] block">
                🐄 Dairy Feasibility Report - Varanasi
              </span>
              <span className="text-[11px] text-[#737784]">
                Cost: ₹1.40L | Loan: ₹1.25L | Subsidy: 25%
              </span>
            </div>
            <span className="material-symbols-outlined text-[#003c90]">chevron_right</span>
          </div>

          <div
            onClick={onOpenReport}
            className="p-3 bg-[#f7f9fc] hover:bg-[#f2f4f7] border border-[#c3c6d5] rounded-xl cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-xs md:text-sm text-[#001945] block">
                🍅 Food Processing (Chakki & Oil) - Varanasi
              </span>
              <span className="text-[11px] text-[#737784]">
                Cost: ₹2.20L | Margin: ₹22k/mo
              </span>
            </div>
            <span className="material-symbols-outlined text-[#003c90]">chevron_right</span>
          </div>
        </div>

        {/* Government Help & Toll-Free Assistance */}
        <div className="bg-white border border-[#c3c6d5] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fe9832]">support_agent</span>
            <h4 className="font-bold text-base text-[#191c1e]">सरकारी सहायता केंद्र (Government Helpline)</h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#fffaf5] border border-[#ffdcc2] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-[#683700] block">MoSJE National Citizen Helpline</span>
                <span className="text-[#737784]">Toll-Free (24x7 Support)</span>
              </div>
              <a
                href="tel:14566"
                className="px-3 py-1.5 bg-[#fe9832] text-[#683700] font-bold rounded-lg"
              >
                📞 14566
              </a>
            </div>

            <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-[#166534] block">Kisan Call Center / Agriculture Desk</span>
                <span className="text-[#737784]">Govt of India Toll-Free</span>
              </div>
              <a
                href="tel:18001801551"
                className="px-3 py-1.5 bg-[#16a34a] text-white font-bold rounded-lg"
              >
                📞 1800-180-1551
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
