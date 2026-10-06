import React, { useState } from 'react';
import { BusinessCategory, Language, LocationState } from '../types';
import { calculateViabilityScore, VIABILITY_SCORE_DISCLAIMER } from '../utils/viabilityScore';
import { buildBusinessEconomicsModel } from '../utils/businessEconomics';
import { runStressScenarios, STRESS_DISCLAIMER } from '../utils/stressTesting';
import { formatINR } from '../utils/calculations';

interface ViabilityAndStressCardProps {
  category: BusinessCategory;
  marginCapital: number;
  location: LocationState;
  quarterlyDebtService: number;
  currentLanguage?: Language;
}

export const ViabilityAndStressCard: React.FC<ViabilityAndStressCardProps> = ({
  category,
  marginCapital,
  location,
  quarterlyDebtService,
  currentLanguage = 'en',
}) => {
  const isHindi = currentLanguage === 'hi';
  const [activeTab, setActiveTab] = useState<'viability' | 'stress'>('viability');

  // Compute models
  const viability = calculateViabilityScore(category.id, marginCapital, location);
  const economics = buildBusinessEconomicsModel(category.id, marginCapital, location);
  const stressScenarios = runStressScenarios(economics, quarterlyDebtService);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#15803d] bg-[#f0fdf4] border-[#bbf7d0]';
    if (score >= 65) return 'text-[#b45309] bg-[#fffbeb] border-[#fde68a]';
    return 'text-[#b91c1c] bg-[#fef2f2] border-[#fecaca]';
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dcfce7] text-[#166534]">Low Risk (सुरक्षित)</span>;
      case 'MODERATE':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef3c7] text-[#92400e]">Moderate (मध्यम)</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fee2e2] text-[#991b1b]">High (उच्च जोखिम)</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f3f4f6] text-[#374151]">Critical (गंभीर)</span>;
    }
  };

  return (
    <div
      id="viability-and-stress-analysis"
      className="bg-white border border-[#c3c6d5] rounded-2xl p-5 md:p-6 shadow-xs space-y-5"
    >
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#eceef1] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003c90] text-xl">analytics</span>
            <h3 className="text-base md:text-lg font-bold text-[#191c1e]">
              {isHindi ? 'व्यवहार्यता स्कोर एवं संवेदनशीलता परीक्षण' : 'Viability Scoring & Repayment Stress Testing'}
            </h3>
          </div>
          <p className="text-xs text-[#737784] mt-0.5">
            {isHindi
              ? '7 आयामों पर समग्र व्यावसायिक व्यवहार्यता एवं विभिन्न प्रतिकूल आर्थिक स्थितियों में ऋण अदायगी क्षमता'
              : 'Holistic 7-dimension feasibility scoring & cashflow sensitivity under adverse market shocks'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-[#eff2f6] p-1 rounded-xl gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('viability')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'viability'
                ? 'bg-white text-[#003c90] shadow-2xs'
                : 'text-[#64748b] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>{isHindi ? 'व्यवहार्यता स्कोर' : 'Viability Score'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stress')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'stress'
                ? 'bg-white text-[#003c90] shadow-2xs'
                : 'text-[#64748b] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">speed</span>
            <span>{isHindi ? 'तनाव परीक्षण (Stress Test)' : 'Stress Testing'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 7-Dimension Viability Score */}
      {activeTab === 'viability' && (
        <div className="space-y-4">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-black ${getScoreColor(
                  viability.overallScore
                )}`}
              >
                <span className="text-2xl leading-none">{viability.overallScore}</span>
                <span className="text-[10px] font-bold uppercase opacity-80">/ 100</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                  {isHindi ? 'सलाहकार व्यवहार्यता निर्णय' : 'Advisory Feasibility Verdict'}
                </span>
                <h4 className="text-sm md:text-base font-extrabold text-[#0f172a]">
                  {isHindi ? viability.verdictHindi : viability.verdict}
                </h4>
                <p className="text-xs text-[#475569] mt-0.5">
                  {category.name} in {location.district}, {location.state}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white border border-[#cbd5e1] rounded-full text-xs font-semibold text-[#0a3663]">
                DSCR: {economics.debtServiceCoverageRatio.toFixed(2)}x
              </span>
              <span className="px-3 py-1 bg-white border border-[#cbd5e1] rounded-full text-xs font-semibold text-[#15803d]">
                Margin: {economics.operatingMarginPct}%
              </span>
            </div>
          </div>

          {/* 7-Dimension Breakdown Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {viability.dimensions.map((dim) => (
              <div
                key={dim.id}
                className="p-3 bg-white rounded-xl border border-[#e2e8f0] flex flex-col justify-between gap-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1e293b]">
                    {isHindi ? dim.nameHindi : dim.name}
                  </span>
                  <span className="font-mono font-bold text-[#0a3663]">
                    {dim.score} / {dim.maxScore}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                    className={`h-full rounded-full ${
                      (dim.score / dim.maxScore) >= 0.8
                        ? 'bg-[#16a34a]'
                        : (dim.score / dim.maxScore) >= 0.6
                        ? 'bg-[#eab308]'
                        : 'bg-[#dc2626]'
                    }`}
                  ></div>
                </div>
                <p className="text-[11px] text-[#64748b] leading-tight">
                  {isHindi ? dim.descriptionHindi : dim.description}
                </p>
              </div>
            ))}
          </div>

          {/* Statutory Disclaimer */}
          <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-[11px] text-[#475569] leading-relaxed">
            <strong>सूचना (Advisory Disclaimer):</strong> {VIABILITY_SCORE_DISCLAIMER}
          </div>
        </div>
      )}

      {/* Tab 2: Sensitivity & Stress Testing Scenarios */}
      {activeTab === 'stress' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8fafc] text-[#475569] border-b border-[#e2e8f0] font-bold">
                  <th className="p-3">{isHindi ? 'परिदृश्य (Scenario)' : 'Economic Scenario'}</th>
                  <th className="p-3 text-right">{isHindi ? 'मासिक राजस्व' : 'Monthly Revenue'}</th>
                  <th className="p-3 text-right">{isHindi ? 'शुद्ध नकद लाभ' : 'Net Cashflow'}</th>
                  <th className="p-3 text-center">{isHindi ? 'ऋण सेवा अनुपात (DSCR)' : 'DSCR'}</th>
                  <th className="p-3 text-center">{isHindi ? 'जोखिम स्तर' : 'Risk Rating'}</th>
                  <th className="p-3 text-center">{isHindi ? 'ऋण चुकाने की स्थिति' : 'Solvency'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {stressScenarios.map((sc) => (
                  <tr key={sc.scenarioId} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3">
                      <strong className="text-[#0f172a] block">
                        {isHindi ? sc.scenarioNameHindi : sc.scenarioName}
                      </strong>
                      <span className="text-[10px] text-[#64748b] leading-snug block max-w-xs">
                        {sc.description}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium text-[#334155]">
                      {formatINR(sc.projectedMonthlyRevenue)}
                    </td>
                    <td className="p-3 text-right font-bold text-[#0f172a]">
                      <span className={sc.projectedMonthlyNetProfit >= 0 ? 'text-[#166534]' : 'text-[#b91c1c]'}>
                        {formatINR(sc.projectedMonthlyNetProfit)}/mo
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold">
                      <span className={sc.dscr >= 1.3 ? 'text-[#166534]' : sc.dscr >= 1.0 ? 'text-[#d97706]' : 'text-[#b91c1c]'}>
                        {sc.dscr.toFixed(2)}x
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {getRiskBadge(sc.riskLevel)}
                    </td>
                    <td className="p-3 text-center font-semibold">
                      {sc.canServiceDebt ? (
                        <span className="inline-flex items-center gap-1 text-[#166534] text-[11px]">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          <span>Solvent</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#b91c1c] text-[11px]">
                          <span className="material-symbols-outlined text-sm">cancel</span>
                          <span>Stress Buffer Req.</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stress Testing Actionable Insights */}
          <div className="p-3.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl text-xs text-[#1e40af] space-y-1">
            <strong>रणनीतिक सुरक्षा बफर (Underwriting Safety Buffer):</strong>
            <p className="text-[11px] text-[#1e3a8a] leading-relaxed">
              MoSJE / NBCFDC योजनाओं के तहत 3-माह का मोराटोरियम लाभार्थी को शुरुआती प्रतिकूल परिस्थितियों से निपटने का समय देता है।
              व्यवसाय को पहले 3 महीनों में कम से कम ₹{Math.round(economics.breakEvenMonthlyUnits * economics.unitPrice * 0.5).toLocaleString('en-IN')} का आपातकालीन कार्यशील पूंजी बफर बनाए रखना चाहिए।
            </p>
          </div>

          {/* Statutory Disclaimer */}
          <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-[11px] text-[#475569] leading-relaxed">
            <strong>सूचना (Stress Disclaimer):</strong> {STRESS_DISCLAIMER}
          </div>
        </div>
      )}
    </div>
  );
};
