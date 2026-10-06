import React, { useState } from 'react';
import { BusinessCategory, LocationState } from '../types';
import { calculateFinancialPlan, formatINR } from '../utils/calculations';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: BusinessCategory;
  location: LocationState;
  marginCapital: number;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  location,
  marginCapital,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const plan = calculateFinancialPlan(marginCapital);

  if (!isOpen) return null;

  const shareText = `*Rural Enterprise DPR Feasibility & Financial Summary - MoSJE*
🏢 *Business:* ${selectedCategory.name} (${selectedCategory.nameHindi})
📍 *Location:* ${location.village || 'Chiragpur'}, ${location.block}, ${location.district} (${location.state})
💰 *10% Margin Money:* ${formatINR(marginCapital)}
📊 *Total Feasible Project Cost:* ${formatINR(plan.projectCost)}
🏦 *90% Concessional Loan:* ${formatINR(plan.approvedLoan)}
🏷️ *Scheme Route:* ${plan.schemeName} (${plan.schemeBadge})
📉 *Interest Rate:* ${plan.interestRate}% p.a.
⏳ *Moratorium Period:* ${plan.moratoriumMonths} Months | Tenure: ${plan.tenureYears} Years
💳 *Quarterly EMI:* ${formatINR(plan.quarterlyEmi)}
📈 *Addressable Local Customers (10km):* ${selectedCategory.potentialCustomers}

_Generated via MoSJE AI Business Advisory Assistant & Scheme Router_`;

  const handleShare = () => {
    const encoded = encodeURIComponent(shareText);
    const url = phoneNumber
      ? `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-down">
      <div className="bg-white border border-[#c3c6d5] rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#c3c6d5] flex items-center justify-between bg-[#f7f9fc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">chat</span>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-[#191c1e]">
                WhatsApp पर शेयर करें
              </h3>
              <p className="text-xs text-[#737784]">Share DPR Summary via WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#e0e3e6] flex items-center justify-center text-[#434653] cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs md:text-sm">
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-3 rounded-xl font-mono text-[11px] text-[#14532d] max-h-44 overflow-y-auto whitespace-pre-wrap">
            {shareText}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#434653]">
              मोबाइल नंबर दर्ज करें (वैकल्पिक / Optional WhatsApp Number)
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-11 rounded-xl border border-[#c3c6d5] bg-white px-3 text-xs md:text-sm outline-none focus:border-[#003c90]"
            />
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
            onClick={handleShare}
            className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1eb857] text-white rounded-xl text-xs md:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">send</span>
            <span>WhatsApp भेजें (Send)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
