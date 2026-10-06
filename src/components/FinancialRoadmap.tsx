import React, { useState } from 'react';
import { BusinessCategory, Language, DocumentItem, LocationState } from '../types';
import { translations } from '../data/translations';
import { calculateFinancialPlan, formatINR } from '../utils/calculations';
import { ProgressStepper } from './ProgressStepper';
import { CapNotification } from './CapNotification';
import { ViabilityAndStressCard } from './ViabilityAndStressCard';
import { EvidenceBadgeList } from './EvidenceBadgeList';

interface FinancialRoadmapProps {
  currentLanguage: Language;
  selectedCategory: BusinessCategory;
  marginCapital: number;
  location?: LocationState;
  isShgMode?: boolean;
  shgMemberCount?: number;
  shgPerMemberMargin?: number;
  shgGroupName?: string;
  onBackToDashboard: () => void;
  onOpenBankLocator: () => void;
  onOpenDocUpload: () => void;
  onDownloadBrochure: () => void;
}

export const FinancialRoadmap: React.FC<FinancialRoadmapProps> = ({
  currentLanguage,
  selectedCategory,
  marginCapital,
  location,
  isShgMode = false,
  shgMemberCount = 10,
  shgPerMemberMargin = 5000,
  shgGroupName = 'Gramodaya Mahila SHG',
  onBackToDashboard,
  onOpenBankLocator,
  onOpenDocUpload,
  onDownloadBrochure,
}) => {
  const t = translations[currentLanguage];
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [docs, setDocs] = useState<DocumentItem[]>([
    {
      id: 'doc_1',
      title: 'Aadhar Card / Identity Proof',
      titleHindi: 'आधार कार्ड / पहचान प्रमाण',
      subtitle: 'UIDAI verified identity',
      status: 'verified',
    },
    {
      id: 'doc_2',
      title: 'Land Record / Lease Deed',
      titleHindi: 'भूमि स्वामित्व / खसरा-खतौनी',
      subtitle: 'Khasra/Khatauni or rent agreement',
      status: 'verified',
    },
    {
      id: 'doc_3',
      title: 'MoSJE Detailed Project Report (DPR)',
      titleHindi: 'परियोजना डीपीआर रिपोर्ट',
      subtitle: 'Generated Feasibility & Cashflow Estimate',
      status: 'verified',
    },
    {
      id: 'doc_4',
      title: 'Bank Passbook & 10% Margin Proof',
      titleHindi: 'बैंक पासबुक व 10% मार्जिन प्रमाण',
      subtitle: 'Last 6 months account statement',
      status: 'pending',
    },
    {
      id: 'doc_5',
      title: 'Caste Certificate (if applicable for SC/OBC/Safai Karamchari)',
      titleHindi: 'जाति प्रमाण पत्र (यथालागू)',
      subtitle: 'NBCFDC / NSKFDC / NSFDC eligibility',
      status: 'verified',
    },
  ]);

  const plan = calculateFinancialPlan(
    marginCapital,
    isShgMode,
    shgMemberCount,
    shgPerMemberMargin,
    shgGroupName
  );
  const visibleRows = showFullSchedule ? plan.repaymentSchedule : plan.repaymentSchedule.slice(0, 6);

  const toggleDocStatus = (id: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 'verified' ? 'pending' : 'verified' } : d
      )
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full px-4 md:px-8 py-6 space-y-6 pb-28 md:pb-16">
      {/* Progress Stepper on Financial Roadmap */}
      <ProgressStepper currentStep={4} currentLanguage={currentLanguage} />

      {/* Back to Dashboard Breadcrumb */}
      <div className="flex flex-col gap-1.5">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#434653] hover:text-[#003c90] transition-colors w-fit cursor-pointer uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>{t.backToDashboard}</span>
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-[24px] md:text-[32px] font-extrabold text-[#001945] tracking-tight">
            {t.financeTab} • MoSJE Scheme Roadmap
          </h1>
          <span className="text-xs font-bold text-[#003c90] bg-[#d9e2ff] px-3 py-1 rounded-full w-fit">
            {selectedCategory.emoji} {selectedCategory.name} Scheme Routing
          </span>
        </div>
      </div>

      {/* Scheme Banner */}
      <div className={`rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-md text-white ${
        plan.schemeType === 'micro_finance' ? 'bg-[#0f52ba]' : 'bg-[#003078]'
      }`}>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[150px] -mt-6 -mr-6">
            account_balance
          </span>
        </div>

        <div className="z-10 relative max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold backdrop-blur-xs border border-white/30">
              {t.activeScheme}: {plan.schemeBadge}
            </span>
            <span className="px-3 py-1 bg-[#fe9832] text-[#683700] rounded-full text-xs font-extrabold">
              {plan.schemeType === 'micro_finance' ? t.ruleMicroFinanceBadge : t.ruleTermLoanBadge}
            </span>
          </div>

          <h2 className="text-[22px] md:text-[28px] font-bold text-white mb-2 leading-tight">
            {currentLanguage === 'en' ? plan.schemeName : plan.schemeNameHindi}
          </h2>
          <p className="text-xs md:text-sm text-[#bcceff] leading-relaxed">
            {currentLanguage === 'en' ? plan.schemeDescription : plan.schemeDescriptionHindi}
          </p>
        </div>

        <button
          onClick={onDownloadBrochure}
          className="z-10 shrink-0 bg-[#fe9832] hover:bg-[#e68524] text-[#683700] font-bold text-xs md:text-sm px-5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          <span>{t.downloadBrochure}</span>
        </button>
      </div>

      {/* Statutory Ceiling Notification */}
      {plan.isProjectCostCapped && (
        <CapNotification
          capNotification={plan.capNotification}
          currentLanguage={currentLanguage}
        />
      )}

      {/* 10% Margin vs. 90% Loan Visual Progress Split */}
      <div className="bg-white border border-[#c3c6d5] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#191c1e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003c90]">pie_chart</span>
              <span>10% Self Margin vs. 90% Concessional MoSJE Loan</span>
            </h3>
            <p className="text-xs text-[#737784]">
              Mandated financing ratio for national backward classes & rural welfare corporations
            </p>
          </div>
          <span className="text-xs bg-[#f0fdf4] text-[#166534] font-bold px-3 py-1 rounded-full border border-[#bbf7d0]">
            100% Fully Financed
          </span>
        </div>

        {/* Visual Dual-Bar */}
        <div className="w-full h-5 bg-[#bbf7d0] rounded-full overflow-hidden flex shadow-inner">
          <div style={{ width: '10%' }} className="bg-[#003c90] h-full transition-all" title="10% Self Margin"></div>
          <div style={{ width: '90%' }} className="bg-[#16a34a] h-full transition-all" title="90% Concessional Loan"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-[#eff6ff] border border-[#bfdbfe]">
            <span className="text-[11px] font-bold text-[#1e3a8a] block">
              10% {t.marginCapitalLabel} (Self-Contribution):
            </span>
            <strong className="text-lg font-extrabold text-[#003c90]">{formatINR(plan.marginCapital)}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
            <span className="text-[11px] font-bold text-[#14532d] block">
              90% {t.approvedLoan} (Concessional Debt):
            </span>
            <strong className="text-lg font-extrabold text-[#166534]">{formatINR(plan.approvedLoan)}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#f7f9fc] border border-[#c3c6d5]">
            <span className="text-[11px] font-bold text-[#434653] block">
              {t.projectCost} (Total Investment):
            </span>
            <strong className="text-lg font-extrabold text-[#191c1e]">{formatINR(plan.projectCost)}</strong>
          </div>
        </div>
      </div>

      {/* Bento Grid: 6 Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Metric 1 */}
        <div className="bg-white border border-[#c3c6d5] rounded-2xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-[#434653] mb-1">
            <span className="material-symbols-outlined text-base text-[#003c90]">account_balance_wallet</span>
            <span className="text-[11px] font-bold">{t.projectCost}</span>
          </div>
          <span className="text-base md:text-lg font-extrabold text-[#191c1e]">
            {formatINR(plan.projectCost)}
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#c3c6d5] rounded-2xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-[#434653] mb-1">
            <span className="material-symbols-outlined text-base text-[#16a34a]">real_estate_agent</span>
            <span className="text-[11px] font-bold">{t.approvedLoan}</span>
          </div>
          <span className="text-base md:text-lg font-extrabold text-[#166534]">
            {formatINR(plan.approvedLoan)}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#c3c6d5] rounded-2xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-[#434653] mb-1">
            <span className="material-symbols-outlined text-base text-[#003c90]">percent</span>
            <span className="text-[11px] font-bold">{t.interestRate}</span>
          </div>
          <span className="text-base md:text-lg font-extrabold text-[#191c1e]">
            {plan.interestRate}% <span className="text-[10px] font-normal text-[#737784]">p.a.</span>
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#c3c6d5] rounded-2xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-[#434653] mb-1">
            <span className="material-symbols-outlined text-base text-[#003c90]">calendar_month</span>
            <span className="text-[11px] font-bold">{t.tenure}</span>
          </div>
          <span className="text-base md:text-lg font-extrabold text-[#191c1e]">
            {plan.tenureYears} Years
          </span>
        </div>

        {/* Metric 5: Moratorium */}
        <div className="bg-[#fff4ea] border border-[#ffdcc2] rounded-2xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-[#8f4e00] mb-1">
            <span className="material-symbols-outlined text-base text-[#fe9832]">hourglass_empty</span>
            <span className="text-[11px] font-bold">{t.moratorium}</span>
          </div>
          <span className="text-base md:text-lg font-extrabold text-[#8f4e00]">
            {plan.moratoriumMonths} Months
          </span>
        </div>

        {/* Metric 6: Quarterly EMI */}
        <div className="bg-white border border-[#c3c6d5] rounded-2xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-1.5 text-[#434653] mb-1">
            <span className="material-symbols-outlined text-base text-[#003c90]">payments</span>
            <span className="text-[11px] font-bold">{t.quarterlyEmi}</span>
          </div>
          <span className="text-base md:text-lg font-extrabold text-[#003c90]">
            {formatINR(plan.quarterlyEmi)}
          </span>
        </div>
      </div>

      {/* Baseline Operational Costs & Working Capital Estimations */}
      <div className="bg-white border border-[#c3c6d5] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#191c1e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003c90]">precision_manufacturing</span>
              <span>{t.operationalCostsTitle}</span>
            </h3>
            <p className="text-xs text-[#737784]">
              Capital allocation, monthly recurring operational expenditure (OPEX), and net margins
            </p>
          </div>
          <span className="text-xs bg-[#d9e2ff] text-[#001945] font-bold px-3 py-1 rounded-full">
            Break-Even: {plan.breakEvenMonths} Months
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#f7f9fc] border border-[#e0e3e6]">
            <span className="text-xs font-semibold text-[#737784] block mb-1">Fixed Capex (Machinery & Shed 65%)</span>
            <strong className="text-lg font-bold text-[#191c1e]">{formatINR(plan.fixedCapex)}</strong>
            <p className="text-[11px] text-[#434653] mt-1">Equipment, livestock, construction & fixtures</p>
          </div>

          <div className="p-4 rounded-xl bg-[#f7f9fc] border border-[#e0e3e6]">
            <span className="text-xs font-semibold text-[#737784] block mb-1">Working Capital Buffer (35%)</span>
            <strong className="text-lg font-bold text-[#003c90]">{formatINR(plan.workingCapital)}</strong>
            <p className="text-[11px] text-[#434653] mt-1">First 3-month raw materials & buffer funds</p>
          </div>

          <div className="p-4 rounded-xl bg-[#f7f9fc] border border-[#e0e3e6]">
            <span className="text-xs font-semibold text-[#737784] block mb-1">Monthly OPEX Cost</span>
            <strong className="text-lg font-bold text-[#ba1a1a]">{formatINR(plan.estimatedMonthlyOpex)}/mo</strong>
            <p className="text-[11px] text-[#434653] mt-1">Feed, labor, electricity, packing & logistics</p>
          </div>

          <div className="p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]">
            <span className="text-xs font-semibold text-[#166534] block mb-1">Estimated Net Profit</span>
            <strong className="text-lg font-bold text-[#166534]">{formatINR(plan.estimatedMonthlyNetProfit)}/mo</strong>
            <p className="text-[11px] text-[#15803d] mt-1">After deducting OPEX & quarterly loan amortization</p>
          </div>
        </div>
      </div>

      {/* Repayment Table & Checklist Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repayment Schedule Table (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-[#c3c6d5] rounded-2xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-5 md:p-6 border-b border-[#c3c6d5] flex justify-between items-center bg-[#f7f9fc]">
            <div>
              <h3 className="text-[18px] md:text-[20px] font-bold text-[#191c1e]">
                {t.repaymentSchedule}
              </h3>
              <p className="text-xs text-[#737784] mt-0.5">
                Amortized reducing balance schedule factoring {plan.moratoriumMonths} months moratorium
              </p>
            </div>
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="text-[#003c90] hover:bg-[#eceef1] px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 border border-[#c3c6d5]"
            >
              <span>{showFullSchedule ? 'Collapse' : 'Show All'}</span>
              <span className="material-symbols-outlined text-sm">
                {showFullSchedule ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f2f4f7] text-[#434653] text-[11px] md:text-xs font-bold uppercase tracking-wider border-b border-[#c3c6d5]">
                  <th className="px-4 md:px-5 py-3">{t.quarter}</th>
                  <th className="px-4 md:px-5 py-3">{t.phase}</th>
                  <th className="px-4 md:px-5 py-3 text-right">EMI (₹)</th>
                  <th className="px-4 md:px-5 py-3 text-right">{t.principal}</th>
                  <th className="px-4 md:px-5 py-3 text-right">{t.interest}</th>
                  <th className="px-4 md:px-5 py-3 text-right">{t.balance}</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm text-[#191c1e] divide-y divide-[#eceef1]">
                {visibleRows.map((row) => (
                  <tr
                    key={row.quarter}
                    className={`transition-colors ${
                      row.isMoratorium
                        ? 'bg-[#fff8f2] hover:bg-[#ffeedd]'
                        : 'hover:bg-[#f7f9fc]'
                    }`}
                  >
                    <td className="px-4 md:px-5 py-3 font-medium">{row.quarter}</td>
                    <td className="px-4 md:px-5 py-3">
                      {row.isMoratorium ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#ffdcc2] text-[#683700] text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#fe9832]"></span>
                          {t.moratorium}
                        </span>
                      ) : (
                        <span className="text-[#434653] font-medium">Repayment</span>
                      )}
                    </td>
                    <td className="px-4 md:px-5 py-3 text-right font-bold text-[#003c90]">
                      {row.emi}
                    </td>
                    <td className="px-4 md:px-5 py-3 text-right text-[#434653]">
                      {row.principal}
                    </td>
                    <td className="px-4 md:px-5 py-3 text-right text-[#434653]">{row.interest}</td>
                    <td className="px-4 md:px-5 py-3 text-right font-bold text-[#191c1e]">
                      {row.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 border-t border-[#c3c6d5] bg-[#f7f9fc] text-center">
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="text-[#003c90] font-bold text-xs md:text-sm hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              <span>{showFullSchedule ? 'Show Less' : `View Full ${plan.tenureYears}-Year Schedule (${plan.totalQuarters} Quarters)`}</span>
              <span className="material-symbols-outlined text-sm">
                {showFullSchedule ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>
        </div>

        {/* Documentation Checklist & Actions (Span 1) */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-[#c3c6d5] rounded-2xl p-6 flex flex-col h-full shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-[#003c90] text-2xl font-bold">
                fact_check
              </span>
              <div>
                <h3 className="text-[18px] font-bold text-[#191c1e]">
                  {t.requiredDocuments}
                </h3>
                <p className="text-[11px] text-[#737784]">Click to toggle verification status</p>
              </div>
            </div>

            <ul className="space-y-3 mb-6 flex-1">
              {docs.map((doc) => {
                const isVerified = doc.status === 'verified';
                return (
                  <li
                    key={doc.id}
                    onClick={() => toggleDocStatus(doc.id)}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#f7f9fc] cursor-pointer transition-colors border border-transparent hover:border-[#e0e3e6]"
                  >
                    <span
                      className={`material-symbols-outlined text-xl mt-0.5 ${
                        isVerified ? 'text-[#16a34a] filled' : 'text-[#737784]'
                      }`}
                    >
                      {isVerified ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#191c1e]">
                        {currentLanguage === 'en' ? doc.title : doc.titleHindi}
                      </p>
                      <p className="text-[11px] text-[#737784]">{doc.subtitle}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="pt-4 border-t border-[#c3c6d5] space-y-3">
              <p className="text-xs font-bold text-[#737784] text-center">
                {t.nextAction}
              </p>

              <button
                onClick={onOpenBankLocator}
                className="w-full bg-[#003c90] hover:bg-[#002d6c] text-white h-[50px] rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">location_on</span>
                <span>{t.findNearestBank}</span>
              </button>

              <button
                onClick={onOpenDocUpload}
                className="w-full bg-white border-2 border-[#003c90] text-[#003c90] hover:bg-[#f2f4f7] h-[50px] rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">upload_file</span>
                <span>{t.uploadPendingDocs}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Viability Scoring & Stress Testing Sensitivity */}
      <ViabilityAndStressCard
        category={selectedCategory}
        marginCapital={marginCapital}
        location={location || { state: 'Uttar Pradesh', district: 'Varanasi', block: 'Cholapur', village: 'Chiragpur Village' }}
        quarterlyDebtService={plan.quarterlyEmi}
        currentLanguage={currentLanguage}
      />

      {/* Official Evidence & Statutory Audit Ledger */}
      <EvidenceBadgeList
        plan={plan}
        categoryId={selectedCategory.id}
        location={location || { state: 'Uttar Pradesh', district: 'Varanasi', block: 'Cholapur', village: 'Chiragpur Village' }}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};
