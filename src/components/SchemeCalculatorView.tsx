import React, { useState } from 'react';
import { Language, BusinessCategory, LocationState } from '../types';
import { translations } from '../data/translations';
import { calculateFinancialPlan, formatINR } from '../utils/calculations';
import { CapNotification } from './CapNotification';
import { ViabilityAndStressCard } from './ViabilityAndStressCard';
import { EvidenceBadgeList } from './EvidenceBadgeList';

interface SchemeCalculatorViewProps {
  currentLanguage: Language;
  selectedCategory: BusinessCategory;
  marginCapital: number;
  onMarginCapitalChange: (val: number) => void;
  location: LocationState;
  onOpenBankLocator: () => void;
  onOpenPdfModal: () => void;
  onOpenDocUpload: () => void;
}

export const SchemeCalculatorView: React.FC<SchemeCalculatorViewProps> = ({
  currentLanguage,
  selectedCategory,
  marginCapital,
  onMarginCapitalChange,
  location,
  onOpenBankLocator,
  onOpenPdfModal,
  onOpenDocUpload,
}) => {
  const t = translations[currentLanguage];

  // Statutory Financial Plan as Single Source of Truth
  const plan = calculateFinancialPlan(marginCapital, false);
  const isMicroFinance = plan.schemeType === 'micro_finance';
  const schedule = plan.repaymentSchedule.slice(0, 8);


  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#cbd5e1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#e8f3ff] text-[#0a3663] text-xs font-black border border-[#c3d5e8]">
              {t.appBadge || 'AI Business Advisory'}
            </span>
            <span className="text-xs font-semibold text-[#107c41]">
              10% Margin • 90% Concessional Credit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0a3663]">
            {t.navCalculator || 'Scheme & Loan Calculator'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1 max-w-2xl">
            {currentLanguage === 'hi'
              ? 'सामाजिक न्याय और अधिकारिता मंत्रालय द्वारा प्रायोजित 90% रियायती ऋण योजना। 10% स्व-पूंजी निवेश से अपनी पात्रता, किस्त एवं मोराटोरियम की गणना करें।'
              : 'Calculate your 90% concessional credit eligibility, subsidized interest (6.5%), 3-month moratorium, and quarterly repayment schedule.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenPdfModal}
            className="px-4 py-2.5 rounded-xl bg-[#0a3663] hover:bg-[#082a4d] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>{currentLanguage === 'hi' ? 'प्रस्ताव PDF' : 'Proposal PDF'}</span>
          </button>
          <button
            onClick={onOpenBankLocator}
            className="px-4 py-2.5 rounded-xl bg-[#f0f6fc] hover:bg-[#e2e8f0] text-[#0a3663] font-bold text-xs sm:text-sm border border-[#c3d5e8] flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-lg">account_balance</span>
            <span>{currentLanguage === 'hi' ? 'बैंक खोजें' : 'Lead Bank'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Inputs & Sliders */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 sm:p-6 border border-[#cbd5e1] shadow-xs space-y-5">
          <h2 className="font-black text-base text-[#0f172a] pb-2 border-b border-[#f1f5f9] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0a3663]">tune</span>
            <span>{currentLanguage === 'hi' ? 'पूंजी व अवधि सेट करें' : 'Capital & Terms'}</span>
          </h2>

          {/* 10% Self-Margin Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#334155]">
                {currentLanguage === 'hi' ? '10% स्व-निवेश (Margin)' : '10% Beneficiary Margin'}
              </label>
              <span className="text-base font-black text-[#107c41]">
                ₹{marginCapital.toLocaleString('en-IN')}
              </span>
            </div>

            <input
              type="range"
              min={10000}
              max={500000}
              step={5000}
              value={marginCapital}
              onChange={(e) => onMarginCapitalChange(Number(e.target.value))}
              className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#0a3663]"
            />

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {[25000, 50000, 100000, 200000, 300000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => onMarginCapitalChange(amt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    marginCapital === amt
                      ? 'bg-[#0a3663] text-white border-[#0a3663]'
                      : 'bg-[#f8fafc] text-[#475569] border-[#cbd5e1] hover:bg-[#e2e8f0]'
                  }`}
                >
                  ₹{(amt / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Statutory Scheme Tenure */}
          <div>
            <label className="block text-xs font-bold text-[#334155] mb-2">
              {currentLanguage === 'hi' ? 'वैधानिक ऋण चुकौती अवधि (Statutory Scheme Tenure)' : 'Statutory Scheme Tenure'}
            </label>
            <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] flex items-center justify-between">
              <span className="text-xs font-bold text-[#0a3663]">{plan.schemeName}</span>
              <span className="text-xs font-black text-[#107c41] bg-[#eaf8f0] px-2.5 py-1 rounded-lg border border-[#bbf7d0]">
                {plan.tenureYears} {currentLanguage === 'hi' ? 'वर्ष (36 माह)' : 'Years'}
              </span>
            </div>
          </div>

          {/* Selected Enterprise Sector info */}
          <div className="p-3.5 rounded-xl bg-[#f0f6fc] border border-[#c3d5e8]">
            <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">
              {currentLanguage === 'hi' ? 'चयनित उद्यम' : 'Active Enterprise'}
            </div>
            <div className="flex items-center gap-2 font-bold text-sm text-[#0a3663]">
              <span className="text-xl">{selectedCategory.emoji}</span>
              <span>{currentLanguage === 'hi' ? selectedCategory.nameHindi : selectedCategory.name}</span>
            </div>
            <div className="text-xs text-[#107c41] font-semibold mt-1">
              {currentLanguage === 'hi' ? 'स्थान:' : 'Location:'} {location.village}, {location.district}
            </div>
          </div>

          {/* Documents check action */}
          <button
            type="button"
            onClick={onOpenDocUpload}
            className="w-full py-2.5 px-3 rounded-xl border border-[#cbd5e1] hover:border-[#0a3663] bg-white text-xs font-bold text-[#0a3663] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">checklist</span>
            <span>{currentLanguage === 'hi' ? 'आवश्यक दस्तावेज चेकलिस्ट' : 'View KYC & Loan Checklist'}</span>
          </button>
        </div>

        {/* Right 2 Columns: Financial Breakdown & Amortization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statutory Scheme Ceiling Notification */}
          {plan.isProjectCostCapped && (
            <CapNotification
              capNotification={plan.capNotification}
              currentLanguage={currentLanguage}
            />
          )}

          {/* 4 Big Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#cbd5e1] shadow-xs">
              <div className="text-[11px] font-semibold text-[#64748b]">Total Project Cost</div>
              <div className="text-lg sm:text-xl font-black text-[#0f172a] mt-1">
                {formatINR(plan.projectCost)}
              </div>
              <div className="text-[10px] text-[#0a3663] font-bold mt-1">100% Capital</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cbd5e1] shadow-xs">
              <div className="text-[11px] font-semibold text-[#64748b]">90% Govt Loan</div>
              <div className="text-lg sm:text-xl font-black text-[#0a3663] mt-1">
                {formatINR(plan.approvedLoan)}
              </div>
              <div className="text-[10px] text-[#107c41] font-bold mt-1">MoSJE Sanction</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cbd5e1] shadow-xs">
              <div className="text-[11px] font-semibold text-[#64748b]">Subsidized Rate</div>
              <div className="text-lg sm:text-xl font-black text-[#107c41] mt-1">
                {plan.interestRate}% p.a.
              </div>
              <div className="text-[10px] text-[#d97706] font-bold mt-1">
                {plan.moratoriumMonths}-Month Moratorium
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cbd5e1] shadow-xs">
              <div className="text-[11px] font-semibold text-[#64748b]">Quarterly EMI</div>
              <div className="text-lg sm:text-xl font-black text-[#d97706] mt-1">
                {formatINR(plan.quarterlyEmi)}
              </div>
              <div className="text-[10px] text-[#64748b] font-medium mt-1">
                ~{formatINR(plan.monthlyEquivalentInstallment)}/mo eq.
              </div>
            </div>
          </div>

          {/* Benchmark Interest Saving vs Commercial MFI */}
          <div className="p-3.5 bg-[#f0fdf4] rounded-xl border border-[#bbf7d0] text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="font-bold text-[#166534] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">savings</span>
                {currentLanguage === 'hi'
                  ? 'अनुमानित ब्याज बचत (14% वाणिज्यिक MFI की तुलना में):'
                  : 'Est. Interest Saving vs 14% Commercial MFI Benchmark:'}
              </span>
              <span className="text-[10px] text-[#15803d] block">{plan.benchmarkDisclaimer}</span>
            </div>
            <strong className="text-[#166534] text-base font-black shrink-0">
              +{formatINR(plan.benchmarkInterestSaving)}
            </strong>
          </div>

          {/* Scheme Classification Box: Rule A vs Rule B */}
          <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            isMicroFinance
              ? 'bg-[#eaf8f0] border-[#107c41]'
              : 'bg-[#eff6ff] border-[#0a3663]'
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`material-symbols-outlined text-xl ${
                isMicroFinance ? 'text-[#107c41]' : 'text-[#0a3663]'
              }`}>
                verified
              </span>
              <span className="font-black text-sm text-[#0f172a]">
                {isMicroFinance
                  ? 'योजना वर्गीकरण: Rule A - Micro Finance Scheme (≤ ₹1.40 Lakh)'
                  : 'योजना वर्गीकरण: Rule B - Term Loan Scheme (> ₹1.40 Lakh)'}
              </span>
            </div>
            <p className="text-xs text-[#334155] leading-relaxed">
              {isMicroFinance
                ? 'आपका स्वीकृत ऋण ₹1.40 लाख के भीतर है। यह MoSJE माइक्रो फाइनेंस विंडो के अंतर्गत आता है जिसमें प्राथमिक ग्रामीण स्वीकृति, न्यूनतम कागजी कार्रवाई और 3 महीने की मोराटोरियम सुविधा मिलती है।'
                : 'आपका ऋण ₹1.40 लाख से अधिक है। यह MoSJE टर्म लोन योजना के तहत सीधे बैंक शाखा द्वारा संयंत्र, उपकरण या पशुधन खरीद के लिए चरणबद्ध रूप से जारी किया जाएगा।'}
            </p>
          </div>

          {/* Repayment Amortization Schedule Table */}
          <div className="bg-white rounded-2xl p-5 border border-[#cbd5e1] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-sm text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0a3663]">calendar_month</span>
                <span>
                  {currentLanguage === 'hi' ? 'तिमाही किस्त रोडमैप (Amortization Schedule)' : 'Quarterly Repayment Roadmap'}
                </span>
              </h3>
              <span className="text-[11px] text-[#64748b]">
                {plan.tenureYears * 4} Quarters Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#cbd5e1] text-[#475569] font-bold">
                    <th className="py-2.5 px-3">तिमाही (Quarter)</th>
                    <th className="py-2.5 px-3">मूलधन (Principal)</th>
                    <th className="py-2.5 px-3">ब्याज (6.5%)</th>
                    <th className="py-2.5 px-3">कुल किस्त (EMI)</th>
                    <th className="py-2.5 px-3 text-right">शेष ऋण (Balance)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {schedule.map((row) => {
                    const qLabel = String(row.quarter).startsWith('Q') ? row.quarter : `Q${row.quarter}`;
                    const formatCell = (val: string | number | undefined) => {
                      if (val === undefined || val === null) return '0';
                      if (typeof val === 'number') return `₹${val.toLocaleString('en-IN')}`;
                      return String(val).startsWith('₹') ? val : `₹${val}`;
                    };

                    return (
                      <tr key={String(row.quarter)} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#0a3663]">
                          {qLabel} {row.isMoratorium ? '(Moratorium)' : ''}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-[#0f172a]">
                          {formatCell(row.principal)}
                        </td>
                        <td className="py-2.5 px-3 text-[#107c41] font-semibold">
                          {formatCell(row.interest)}
                        </td>
                        <td className="py-2.5 px-3 font-black text-[#d97706]">
                          {formatCell(row.totalPayment ?? row.emi)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-[#64748b]">
                          {formatCell(row.closingBalance ?? row.balance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[11px] text-[#64748b] flex items-center justify-between">
              <span>* 3 माह का मोराटोरियम प्रारंभिक उत्पादन चक्र (gestation) के लिए उपलब्ध है।</span>
              <span className="font-bold text-[#0a3663]">MoSJE Concessional Credit Terms</span>
            </div>
          </div>

          {/* Viability Scoring & Stress Testing Engine Integration */}
          <ViabilityAndStressCard
            category={selectedCategory}
            marginCapital={marginCapital}
            location={location}
            quarterlyDebtService={plan.quarterlyEmi}
            currentLanguage={currentLanguage}
          />

          {/* Evidence Ledger & Provenance */}
          <EvidenceBadgeList
            plan={plan}
            categoryId={selectedCategory.id}
            location={location}
            currentLanguage={currentLanguage}
          />
        </div>
      </div>
    </div>
  );
};
