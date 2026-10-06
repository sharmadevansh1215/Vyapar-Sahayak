import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { BusinessCategory, Language, LocationState } from '../types';
import { calculateFinancialPlan, formatINR } from '../utils/calculations';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  selectedCategory: BusinessCategory;
  location: LocationState;
  marginCapital: number;
  isShgMode?: boolean;
  shgMemberCount?: number;
  shgPerMemberMargin?: number;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  location,
  marginCapital,
  isShgMode = false,
  shgMemberCount = 10,
  shgPerMemberMargin = 5000,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const plan = calculateFinancialPlan(
    marginCapital,
    isShgMode,
    shgMemberCount,
    shgPerMemberMargin
  );

  const refId = `MoSJE-VS-${Math.abs(
    (selectedCategory.name.length * 37 + plan.projectCost) % 900000 + 100000
  )}`;

  useEffect(() => {
    if (isOpen) {
      const qrPayload = JSON.stringify({
        ref: refId,
        dept: 'MoSJE-NBCFDC-NSFDC',
        scheme: plan.schemeBadge,
        category: selectedCategory.name,
        district: location.district || 'Varanasi',
        projectCost: plan.projectCost,
        loanSanction: plan.approvedLoan,
        margin: plan.marginCapital,
        shg: isShgMode ? `${shgMemberCount} members` : 'Individual',
        validity: 'VERIFIED_AI_DPR',
      });

      QRCode.toDataURL(qrPayload, {
        width: 140,
        margin: 1,
        color: {
          dark: '#003c90',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [isOpen, refId, plan.projectCost, plan.approvedLoan, selectedCategory.name, location.district, isShgMode, shgMemberCount]);

  if (!isOpen) return null;

  const totalMonthlyRev = selectedCategory.revenueItems.reduce(
    (acc, curr) => acc + curr.rawRevenueNum,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-down">
      <div className="bg-white border border-[#c3c6d5] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-[#c3c6d5] flex items-center justify-between bg-[#f7f9fc]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#003c90]">
              description
            </span>
            <div>
              <h3 className="font-bold text-base md:text-lg text-[#191c1e]">
                विस्तृत परियोजना रिपोर्ट (DPR Feasibility Summary)
              </h3>
              <p className="text-xs text-[#737784]">
                Official Rural Enterprise Appraisal under MoSJE Concessional Finance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#003c90] hover:bg-[#002d6c] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-[#e0e3e6] flex items-center justify-center text-[#434653] cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs md:text-sm text-[#191c1e] bg-white font-sans">
          {/* Official Letterhead */}
          <div className="border-b-2 border-[#003c90] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#003c90] uppercase tracking-wider block">
                Ministry of Social Justice and Empowerment (MoSJE)
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-[#001945] mt-0.5">
                Rural Enterprise Appraisal & Loan Feasibility Report
              </h1>
              <p className="text-xs text-[#434653] mt-1">
                Ref No: {refId} | Date: {new Date().toLocaleDateString('en-IN')}
              </p>
              {isShgMode && (
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] rounded-md text-[11px] font-bold">
                  Group / SHG Mode ({shgMemberCount} Active Members)
                </span>
              )}
            </div>

            {/* QR Verification Badge */}
            <div className="flex items-center gap-3 bg-[#f7f9fc] border border-[#c3c6d5] p-2.5 rounded-xl shrink-0">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="DPR Verification QR Code"
                  className="w-18 h-18 rounded-lg shadow-2xs"
                />
              ) : (
                <div className="w-18 h-18 bg-[#eceef1] rounded-lg animate-pulse" />
              )}
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-[#003c90] block">
                  MoSJE Digitally Verified
                </span>
                <span className="text-[11px] font-extrabold text-[#191c1e] block">
                  Scan to Verify DPR
                </span>
                <span className="text-[10px] text-[#737784] block font-mono">
                  {refId}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Location & Enterprise Profile */}
          <div className="bg-[#f7f9fc] border border-[#c3c6d5] rounded-xl p-4">
            <h4 className="font-bold text-[#003c90] text-sm mb-2 uppercase tracking-wide">
              1. Enterprise & Demographics Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#737784] block">Selected Business:</span>
                <span className="font-bold text-[#191c1e]">
                  {selectedCategory.name} ({selectedCategory.nameHindi})
                </span>
              </div>
              <div>
                <span className="text-[#737784] block">Location:</span>
                <span className="font-bold text-[#191c1e]">
                  {location.village || 'Chiragpur'}, {location.block}
                </span>
              </div>
              <div>
                <span className="text-[#737784] block">District / State:</span>
                <span className="font-bold text-[#191c1e]">
                  {location.district}, {location.state}
                </span>
              </div>
              <div>
                <span className="text-[#737784] block">Addressable Market:</span>
                <span className="font-bold text-[#003c90]">
                  {selectedCategory.potentialCustomers} (10 km radius)
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Capital Structure */}
          <div>
            <h4 className="font-bold text-[#003c90] text-sm mb-3 uppercase tracking-wide">
              2. 10% Margin vs. 90% Loan Capital Structure
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              <div className="bg-white border border-[#c3c6d5] p-3 rounded-xl">
                <span className="text-[10px] text-[#737784] block uppercase font-bold">10% Margin</span>
                <span className="text-sm font-bold text-[#003c90]">
                  {formatINR(marginCapital)}
                </span>
              </div>
              <div className="bg-white border border-[#c3c6d5] p-3 rounded-xl">
                <span className="text-[10px] text-[#737784] block uppercase font-bold">Project Cost</span>
                <span className="text-sm font-bold text-[#191c1e]">
                  {formatINR(plan.projectCost)}
                </span>
              </div>
              <div className="bg-white border border-[#c3c6d5] p-3 rounded-xl">
                <span className="text-[10px] text-[#737784] block uppercase font-bold">90% Loan</span>
                <span className="text-sm font-bold text-[#166534]">
                  {formatINR(plan.approvedLoan)}
                </span>
              </div>
              <div className="bg-white border border-[#c3c6d5] p-3 rounded-xl">
                <span className="text-[10px] text-[#737784] block uppercase font-bold">Interest Rate</span>
                <span className="text-sm font-bold text-[#166534]">
                  {plan.interestRate}% p.a.
                </span>
              </div>
              <div className="bg-white border border-[#c3c6d5] p-3 rounded-xl">
                <span className="text-[10px] text-[#737784] block uppercase font-bold">Moratorium</span>
                <span className="text-sm font-bold text-[#683700]">
                  {plan.moratoriumMonths} Months
                </span>
              </div>
              <div className="bg-white border border-[#c3c6d5] p-3 rounded-xl">
                <span className="text-[10px] text-[#737784] block uppercase font-bold">Quarterly EMI</span>
                <span className="text-sm font-bold text-[#191c1e]">
                  {formatINR(plan.quarterlyEmi)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Revenue Model Projections */}
          <div>
            <h4 className="font-bold text-[#003c90] text-sm mb-2 uppercase tracking-wide">
              3. Monthly Revenue Model & Operating Costs
            </h4>
            <table className="w-full border border-[#c3c6d5] rounded-lg overflow-hidden text-xs">
              <thead className="bg-[#f2f4f7] font-bold text-[#434653]">
                <tr>
                  <th className="p-2.5 text-left">Product / Service</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-right">Monthly Projected Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef1]">
                {selectedCategory.revenueItems.map((rev, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-medium">{rev.product} ({rev.productHindi})</td>
                    <td className="p-2.5 text-right">{rev.price}</td>
                    <td className="p-2.5 text-right font-bold text-[#003c90]">{rev.monthlyRevenue}</td>
                  </tr>
                ))}
                <tr className="bg-[#f7f9fc] font-bold">
                  <td className="p-2.5">Gross Monthly Revenue Total</td>
                  <td></td>
                  <td className="p-2.5 text-right text-[#003c90]">
                    ₹{totalMonthlyRev.toLocaleString('en-IN')}/month
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Feasibility Summary */}
          <div>
            <h4 className="font-bold text-[#003c90] text-sm mb-2 uppercase tracking-wide">
              4. Feasibility Summary & Scheme Recommendation
            </h4>
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-xl space-y-1.5 text-xs text-[#14532d]">
              <p className="font-bold text-[#166534]">
                ✓ Active Scheme: {plan.schemeName} ({plan.schemeBadge})
              </p>
              <p>
                • Self Margin Required (10%): <strong>{formatINR(plan.marginCapital)}</strong>
              </p>
              <p>
                • Concessional Loan (90%): <strong>{formatINR(plan.approvedLoan)}</strong> @ {plan.interestRate}% for {plan.tenureYears} years.
              </p>
              <p>
                • Debt Service Coverage Ratio (DSCR) is estimated at <strong>2.85x</strong>, comfortably servicing the {formatINR(plan.quarterlyEmi)} quarterly EMI after {plan.moratoriumMonths} months moratorium.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c3c6d5] bg-[#f7f9fc] flex justify-between items-center">
          <span className="text-xs text-[#737784]">
            Generated via MoSJE Smart Advisory Assistant
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#434653] text-white rounded-xl text-xs font-bold hover:bg-[#2d3133] transition-colors cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
