import React from 'react';
import { Language } from '../types';

export interface ProgressStepperProps {
  currentStep: number; // 1: Category, 2: Setup/Location, 3: AI Feasibility, 4: Finance & Schemes, 5: Bank Disbursal
  onStepClick?: (step: number) => void;
  currentLanguage: Language;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  onStepClick,
  currentLanguage,
}) => {
  const steps = [
    { number: 1, title: 'Sector / Category', titleHindi: 'व्यवसाय चयन', icon: 'storefront' },
    { number: 2, title: 'Location & Capital', titleHindi: 'स्थान व पूंजी', icon: 'tune' },
    { number: 3, title: 'AI Feasibility', titleHindi: 'एआई व्यवहार्यता', icon: 'psychology' },
    { number: 4, title: 'Credit Schemes', titleHindi: 'सरकारी ऋण योजना', icon: 'account_balance' },
    { number: 5, title: 'DPR & Sanction', titleHindi: 'डीपीआर व स्वीकृति', icon: 'verified_user' },
  ];

  return (
    <div className="w-full bg-white border border-[#c3c6d5] rounded-2xl p-4 md:p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting Progress Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-[#eceef1] -z-0">
          <div
            className="h-full bg-[#003c90] transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${Math.min(100, Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100))}%`,
            }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = onStepClick && step.number <= currentStep + 1;

          return (
            <div
              key={step.number}
              onClick={() => isClickable && onStepClick && onStepClick(step.number)}
              className={`flex flex-col items-center relative z-10 ${
                isClickable ? 'cursor-pointer group' : 'cursor-default'
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 shadow-sm ${
                  isCompleted
                    ? 'bg-[#16a34a] text-white ring-4 ring-[#dcfce7]'
                    : isCurrent
                    ? 'bg-[#003c90] text-white ring-4 ring-[#d9e2ff] scale-105'
                    : 'bg-white border-2 border-[#c3c6d5] text-[#737784] group-hover:border-[#003c90]'
                }`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-base md:text-lg">check</span>
                ) : (
                  <span className="material-symbols-outlined text-sm md:text-base">{step.icon}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="text-center mt-2 hidden sm:block">
                <span
                  className={`text-[11px] md:text-xs font-bold block whitespace-nowrap ${
                    isCurrent
                      ? 'text-[#003c90]'
                      : isCompleted
                      ? 'text-[#16a34a]'
                      : 'text-[#737784]'
                  }`}
                >
                  {currentLanguage === 'en' ? step.title : step.titleHindi}
                </span>
                <span className="text-[10px] text-[#8e9099] font-medium block">
                  Step {step.number}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
