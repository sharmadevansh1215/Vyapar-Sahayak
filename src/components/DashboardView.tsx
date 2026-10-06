import React from 'react';
import { Language, BusinessCategory, LocationState, UserProfile } from '../types';
import { useI18n } from '../context/I18nContext';
import { categories } from '../data/categories';

interface DashboardViewProps {
  currentLanguage: Language;
  userProfile?: UserProfile | null;
  selectedCategory: BusinessCategory;
  onSelectCategory: (category: BusinessCategory) => void;
  location: LocationState;
  marginCapital: number;
  onOpenReports: () => void;
  onOpenCalculator: () => void;
  onOpenBankLocator: () => void;
  onOpenPdfModal: () => void;
  onOpenGeminiChat: () => void;
  onOpenProfile: () => void;
  onOpenDocUpload?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentLanguage,
  userProfile,
  selectedCategory,
  onSelectCategory,
  location,
  marginCapital,
  onOpenReports,
  onOpenCalculator,
  onOpenBankLocator,
  onOpenPdfModal,
  onOpenGeminiChat,
  onOpenProfile,
  onOpenDocUpload,
}) => {
  const { t, getLocalizedUserName } = useI18n();

  // Calculate 90% loan amount based on 10% self margin
  const totalProjectCost = marginCapital * 10;
  const loanAmount = marginCapital * 9;
  const quarterlyEmi = Math.round((loanAmount * 0.065) / 4 + loanAmount / (3 * 4));

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Welcome Banner with Brand Logo & Entrepreneur Info */}
      <div className="bg-gradient-to-r from-[#0a3663] via-[#0d4782] to-[#107c41] rounded-2xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/95 p-1 shrink-0 shadow-md flex items-center justify-center border border-white/20">
              <img
                src="/Foto.jpeg"
                alt="Vyapar Sahayak"
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b] text-[#0a3663] text-xs font-black uppercase tracking-wider">
                  Verified Entrepreneur
                </span>
                <span className="text-xs text-white/80 font-medium">
                  {location.village}, {location.district} ({location.state})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1 leading-snug tracking-normal">
                {t('dashboardGreeting')}, {getLocalizedUserName(userProfile?.name)}!
              </h1>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl leading-relaxed">
                {currentLanguage === 'hi'
                  ? 'व्यापार सहायक में आपका स्वागत है। सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE) रियायती योजना के तहत आपका ऋण प्रस्ताव तैयार है।'
                  : 'Your AI Business Advisor & 90% MoSJE Concessional Credit proposal is active and ready for evaluation.'}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={onOpenReports}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white text-[#0a3663] hover:bg-[#f0f6fc] font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg text-[#107c41]">analytics</span>
              <span>{currentLanguage === 'hi' ? 'AI संभाव्यता रिपोर्ट देखें' : 'View Feasibility'}</span>
            </button>

            <button
              onClick={onOpenGeminiChat}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm border border-white/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-lg text-[#f59e0b]">smart_toy</span>
              <span>{currentLanguage === 'hi' ? 'AI से प्रश्न पूछें' : 'Ask AI Advisor'}</span>
            </button>
          </div>
        </div>

        {/* Live Scheme Financial Snapshot Strip */}
        <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-white">
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <div className="text-[10px] text-white/75 font-semibold">10% Self-Margin</div>
            <div className="text-base sm:text-lg font-black text-[#fef08a]">
              ₹{marginCapital.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <div className="text-[10px] text-white/75 font-semibold">90% Govt Loan</div>
            <div className="text-base sm:text-lg font-black text-white">
              ₹{loanAmount.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <div className="text-[10px] text-white/75 font-semibold">Subsidized Interest</div>
            <div className="text-base sm:text-lg font-black text-[#86efac]">
              6.5% p.a.
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <div className="text-[10px] text-white/75 font-semibold">Est. Quarterly EMI</div>
            <div className="text-base sm:text-lg font-black text-white">
              ₹{quarterlyEmi.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Feasibility Analysis */}
        <div
          onClick={onOpenReports}
          className="bg-white p-5 rounded-2xl border border-[#cbd5e1] hover:border-[#0a3663] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#e8f3ff] text-[#0a3663] group-hover:bg-[#0a3663] group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-2xl">monitoring</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] group-hover:text-[#0a3663]">
              {currentLanguage === 'hi' ? 'बाज़ार संभाव्यता विश्लेषण' : 'Market Feasibility'}
            </h3>
            <p className="text-xs text-[#64748b] mt-1 line-clamp-2">
              {currentLanguage === 'hi'
                ? '5-10 किमी के दायरे में 8,450+ ग्राहक, स्थानीय मांग व प्रतिस्पर्धा मैपिंग।'
                : 'Customer density, competition heatmaps, and SWOT analysis for your village.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs font-bold text-[#0a3663]">
            <span>{currentLanguage === 'hi' ? 'रिपोर्ट देखें' : 'View Report'}</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* 2. Scheme & EMI Calculator */}
        <div
          onClick={onOpenCalculator}
          className="bg-white p-5 rounded-2xl border border-[#cbd5e1] hover:border-[#107c41] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#eaf8f0] text-[#107c41] group-hover:bg-[#107c41] group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-2xl">calculate</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] group-hover:text-[#107c41]">
              {currentLanguage === 'hi' ? 'ऋण योजना कैलकुलेटर' : 'Scheme Calculator'}
            </h3>
            <p className="text-xs text-[#64748b] mt-1 line-clamp-2">
              {currentLanguage === 'hi'
                ? '10% मार्जिन पूंजी से 90% सरकारी ऋण, ब्याज दर, मोराटोरियम व EMI गणना करें।'
                : 'Interactive 10% margin vs 90% credit breakdown with quarterly amortization schedule.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs font-bold text-[#107c41]">
            <span>{currentLanguage === 'hi' ? 'गणना करें' : 'Open Calculator'}</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* 3. Lead Bank Locator */}
        <div
          onClick={onOpenBankLocator}
          className="bg-white p-5 rounded-2xl border border-[#cbd5e1] hover:border-[#d97706] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#fef3c7] text-[#d97706] group-hover:bg-[#d97706] group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] group-hover:text-[#d97706]">
              {currentLanguage === 'hi' ? 'निकटतम बैंक शाखा खोजें' : 'Lead Bank Locator'}
            </h3>
            <p className="text-xs text-[#64748b] mt-1 line-clamp-2">
              {currentLanguage === 'hi'
                ? `${location.district} में MoSJE नोडल बैंक, संपर्क सूत्र एवं आवेदन केंद्र।`
                : `Locate official MoSJE lead bank branches and loan officers in ${location.district}.`}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs font-bold text-[#d97706]">
            <span>{currentLanguage === 'hi' ? 'शाखाएं देखें' : 'Find Branches'}</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* 4. Business Profile & Documents */}
        <div
          onClick={onOpenDocUpload || onOpenProfile}
          className="bg-white p-5 rounded-2xl border border-[#cbd5e1] hover:border-[#2563eb] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#eff6ff] text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition-colors flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] group-hover:text-[#2563eb]">
              {currentLanguage === 'hi' ? 'दस्तावेज व KYC सत्यापन' : 'KYC & Document Hub'}
            </h3>
            <p className="text-xs text-[#64748b] mt-1 line-clamp-2">
              {currentLanguage === 'hi'
                ? 'PAN, आधार eKYC, उद्यम MSME एवं बैंक पासबुक का त्वरित AI सत्यापन।'
                : 'Instant cloud KYC and encrypted document vault for 90% loan eligibility.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs font-bold text-[#2563eb]">
            <span>{currentLanguage === 'hi' ? 'सत्यापन केंद्र खोलें' : 'Open Verification'}</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Enterprise Categories Selection Grid */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#cbd5e1] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#0f172a]">
              {currentLanguage === 'hi' ? 'ग्रामीण उद्यम श्रेणियां' : 'Rural Enterprise Sectors'}
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              {currentLanguage === 'hi'
                ? 'वह उद्यम चुनें जिसका आप विश्लेषण या ऋण आवेदन करना चाहते हैं'
                : 'Select an enterprise sector to inspect financial viability and 90% loan terms'}
            </p>
          </div>
          <span className="text-xs font-bold text-[#0a3663] bg-[#e8f3ff] px-3 py-1 rounded-full border border-[#c3d5e8] self-start sm:self-auto">
            {categories.length} {currentLanguage === 'hi' ? 'सक्रिय श्रेणियां' : 'Supported Sectors'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left relative ${
                  isSelected
                    ? 'border-[#0a3663] bg-[#f0f6fc] shadow-sm ring-2 ring-[#0a3663]/20'
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#0a3663] text-white text-[10px] font-bold">
                    Active
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{cat.emoji}</span>
                    <div>
                      <h3 className="font-black text-sm text-[#0f172a]">
                        {currentLanguage === 'hi' ? cat.nameHindi : cat.name}
                      </h3>
                      <div className="text-[11px] font-semibold text-[#107c41]">
                        {currentLanguage === 'hi' ? 'अनुमानित मार्जिन:' : 'Est. Margin:'} {cat.defaultMargin}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748b] line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#e2e8f0] flex items-center justify-between text-xs">
                  <span className="text-[#64748b] text-[11px]">
                    {cat.subcategories.length} {currentLanguage === 'hi' ? 'उप-श्रेणियां' : 'Sub-options'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCategory(cat);
                      onOpenReports();
                    }}
                    className="font-bold text-[#0a3663] hover:underline flex items-center gap-0.5"
                  >
                    <span>{currentLanguage === 'hi' ? 'संभाव्यता देखें' : 'Run Feasibility'}</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF Export & WhatsApp Proposal Bar */}
      <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#eaf8f0] text-[#107c41] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
          </div>
          <div>
            <div className="font-bold text-sm text-[#0f172a]">
              {currentLanguage === 'hi' ? 'आधिकारिक बैंक ऋण प्रस्ताव PDF' : 'Download Formal Loan Proposal PDF'}
            </div>
            <div className="text-xs text-[#64748b]">
              {currentLanguage === 'hi'
                ? 'बैंक शाखा प्रबंधक को प्रस्तुत करने हेतु संपूर्ण वित्तीय विवरणिका तैयार करें'
                : 'Pre-formatted MoSJE concessional credit application ready for branch submission'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenPdfModal}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0a3663] hover:bg-[#082a4d] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>{currentLanguage === 'hi' ? 'PDF डाउनलोड करें' : 'Download PDF Proposal'}</span>
        </button>
      </div>
    </div>
  );
};
