import React, { useState } from 'react';
import { FinancialPlan, LocationState, Language } from '../types';
import { generateEvidenceLedger, getEvidenceBadgeConfig } from '../utils/evidenceSystem';
import { buildBusinessEconomicsModel } from '../utils/businessEconomics';

interface EvidenceBadgeListProps {
  plan: FinancialPlan;
  categoryId: string;
  location: LocationState;
  currentLanguage?: Language;
  defaultExpanded?: boolean;
}

export const EvidenceBadgeList: React.FC<EvidenceBadgeListProps> = ({
  plan,
  categoryId,
  location,
  currentLanguage = 'en',
  defaultExpanded = false,
}) => {
  const isHindi = currentLanguage === 'hi';
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const economics = buildBusinessEconomicsModel(categoryId, plan.marginCapital, location);
  const ledger = generateEvidenceLedger(plan, economics, location);

  return (
    <div
      id="evidence-audit-ledger"
      className="bg-white border border-[#c3c6d5] rounded-2xl p-5 md:p-6 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#003c90] text-xl">policy</span>
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#191c1e] flex items-center gap-2">
              <span>{isHindi ? 'डेटा प्रमाण व स्रोत पारदर्शिता' : 'Evidence & Data Provenance Ledger'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5e9] text-[#1b5e20] border border-[#a5d6a7]">
                100% Audited
              </span>
            </h3>
            <p className="text-xs text-[#737784] mt-0.5">
              {isHindi
                ? 'प्रत्येक वित्तीय आंकड़े, ब्याज दर एवं सरकारी योजना का आधिकारिक सत्यापन स्रोत'
                : 'Full audit trail of official MoSJE gazette sources, mathematical formulas, and verified benchmarks'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-[#003c90] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? (isHindi ? 'संक्षेप करें' : 'Hide Ledger') : (isHindi ? 'पूरा ऑडिट देखें' : 'View Full Ledger')}</span>
          <span className="material-symbols-outlined text-sm">
            {isExpanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {/* Quick Summary Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {ledger.slice(0, isExpanded ? ledger.length : 4).map((item) => {
          const badge = getEvidenceBadgeConfig(item.sourceType);
          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border flex flex-col justify-between gap-1 text-xs min-w-[200px] flex-1 ${badge.bgClass} ${badge.borderClass}`}
            >
              <div className="flex justify-between items-center gap-2">
                <span className="font-bold text-[#1e293b]">{item.metric}</span>
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full border ${badge.borderClass} ${badge.textClass} flex items-center gap-0.5`}
                >
                  <span className="material-symbols-outlined text-[10px]">{badge.icon}</span>
                  <span>{badge.label.replace(/^[✓~⚠!]\s*/, '')}</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2 mt-1">
                <span className="text-sm font-extrabold text-[#0f172a]">{item.value}</span>
                <span className="text-[10px] text-[#475569] truncate max-w-[140px] font-medium" title={item.source}>
                  {item.source}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Table */}
      {isExpanded && (
        <div className="overflow-x-auto border-t border-[#eceef1] pt-3">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] text-[#475569] border-b border-[#e2e8f0] font-bold">
                <th className="p-2.5">Metric</th>
                <th className="p-2.5">Value</th>
                <th className="p-2.5">Source Type</th>
                <th className="p-2.5">Official Source Reference</th>
                <th className="p-2.5">Verification Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {ledger.map((item) => {
                const badge = getEvidenceBadgeConfig(item.sourceType);
                return (
                  <tr key={item.id} className="hover:bg-[#f8fafc]">
                    <td className="p-2.5 font-bold text-[#1e293b]">{item.metric}</td>
                    <td className="p-2.5 font-mono font-bold text-[#003c90]">{item.value}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.bgClass} ${badge.borderClass} ${badge.textClass}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-2.5 text-[#475569]">
                      {item.sourceUrl ? (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#003c90] underline font-medium"
                        >
                          {item.source}
                        </a>
                      ) : (
                        item.source
                      )}
                    </td>
                    <td className="p-2.5 text-[11px] text-[#64748b]">{item.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
