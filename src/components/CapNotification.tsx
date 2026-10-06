import React from 'react';
import { CapNotification as CapNotificationType, Language } from '../types';
import { formatINR } from '../utils/calculations';

interface CapNotificationProps {
  capNotification?: CapNotificationType;
  currentLanguage?: Language;
  className?: string;
}

export const CapNotification: React.FC<CapNotificationProps> = ({
  capNotification,
  currentLanguage = 'en',
  className = '',
}) => {
  if (!capNotification || !capNotification.isCapped) {
    return null;
  }

  const isHindi = currentLanguage === 'hi';

  return (
    <div
      id="statutory-cap-notification"
      className={`bg-[#fffbeb] border-2 border-[#f59e0b] rounded-2xl p-4 md:p-5 text-[#92400e] shadow-sm space-y-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#d97706] text-2xl shrink-0 mt-0.5">
            warning
          </span>
          <div>
            <h4 className="font-extrabold text-sm md:text-base text-[#78350f]">
              {isHindi
                ? 'वैधानिक ऋण सीमा लागू (Statutory Scheme Ceiling Applied)'
                : 'MoSJE Statutory Scheme Ceiling Enforced'}
            </h4>
            <p className="text-xs text-[#92400e] mt-0.5 leading-relaxed">
              {isHindi ? capNotification.messageHindi : capNotification.message}
            </p>
          </div>
        </div>

        <span className="bg-[#fef3c7] text-[#b45309] text-[10px] uppercase font-black px-2.5 py-1 rounded-full border border-[#fde68a] shrink-0">
          MoSJE Rule Cap
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#fde68a] text-xs">
        <div className="bg-white/80 p-2.5 rounded-xl border border-[#fde68a]">
          <span className="text-[11px] text-[#78350f] block font-medium">
            {isHindi ? 'प्रस्तावित परियोजना लागत' : 'Input Theoretical Cost'}:
          </span>
          <strong className="text-sm font-bold text-[#b45309] line-through">
            {formatINR(capNotification.theoreticalCost)}
          </strong>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-[#fde68a]">
          <span className="text-[11px] text-[#78350f] block font-medium">
            {isHindi ? 'वैधानिक पात्र लागत (Statutory Limit)' : 'Eligible Project Cost'}:
          </span>
          <strong className="text-sm font-bold text-[#15803d]">
            {formatINR(capNotification.cappedCost)}
          </strong>
        </div>

        <div className="bg-white/80 p-2.5 rounded-xl border border-[#fde68a]">
          <span className="text-[11px] text-[#78350f] block font-medium">
            {isHindi ? 'अधिकतम ऋण स्वीकृति' : 'Statutory Max Loan'}:
          </span>
          <strong className="text-sm font-bold text-[#0369a1]">
            {formatINR(capNotification.maxLoanPermitted)}
          </strong>
        </div>
      </div>
    </div>
  );
};
