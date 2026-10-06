import { SchemeConfiguration, RepaymentRow, CapNotification } from '../types';

/**
 * AUTHORITATIVE STATUTORY SCHEME ENGINE (MoSJE / NBCFDC / NSFDC)
 * 
 * Source of Truth: Ministry of Social Justice and Empowerment Official Lending Guidelines
 * NBCFDC Gazette / Statutory Lending Policy
 */

export const NBCFDC_MICRO_FINANCE_SCHEME: SchemeConfiguration = {
  schemeId: 'NBCFDC-MFS-2026',
  name: 'MoSJE / NBCFDC Micro Finance Scheme',
  nameHindi: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय सूक्ष्म वित्त योजना (NBCFDC)',
  version: '2026.1',
  minProjectCost: 50000,
  maxProjectCost: 140000,
  fundingPercentage: 90,
  beneficiaryPercentage: 10,
  maxLoanAmount: 125000, // Statutory Ceiling: ₹1.25 Lakh (NOT ₹1.26 Lakh)
  annualInterestRate: 6.5,
  tenureMonths: 36, // 3 Years
  moratoriumMonths: 3, // 1 Quarter
  repaymentInterval: 'QUARTERLY',
  sourceType: 'OFFICIAL',
  source: 'Ministry of Social Justice & Empowerment / NBCFDC Official Lending Rules',
  sourceUrl: 'https://nbcfdc.gov.in/schemes/micro-finance',
  verifiedAt: '2026-01-15',
  description: 'Concessional credit assistance for rural micro-enterprises up to ₹1.40 Lakh project cost with 6.5% interest, 90% funding (statutory cap of ₹1.25 Lakh), and 3 months moratorium.',
  descriptionHindi: '₹1.40 लाख तक के ग्रामीण सूक्ष्म उद्यमों के लिए 6.5% रियायती ब्याज दर, 90% ऋण (अधिकतम ₹1.25 लाख सीमा) और 3 माह की मोराटोरियम सुविधा।',
  disclaimer: 'Authoritative scheme guidelines sourced directly from NBCFDC portal.',
};

export const NBCFDC_TERM_LOAN_SCHEME: SchemeConfiguration = {
  schemeId: 'NBCFDC-TLS-2026',
  name: 'MoSJE / NBCFDC Term Loan Scheme',
  nameHindi: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय सावधि ऋण योजना (NBCFDC)',
  version: '2026.1',
  minProjectCost: 140001,
  maxProjectCost: 5000000, // Statutory Ceiling: ₹50.00 Lakhs
  fundingPercentage: 90,
  beneficiaryPercentage: 10,
  maxLoanAmount: 4500000, // Statutory Ceiling: ₹45.00 Lakhs
  annualInterestRate: 8.0,
  tenureMonths: 84, // 7 Years
  moratoriumMonths: 6, // 2 Quarters
  repaymentInterval: 'QUARTERLY',
  sourceType: 'OFFICIAL',
  source: 'NBCFDC Concessional Term Lending Scheme Policy Circular',
  sourceUrl: 'https://nbcfdc.gov.in/schemes/term-loan',
  verifiedAt: '2026-01-15',
  description: 'Medium to large rural industrial & agri-processing term loan for projects up to ₹50 Lakh with 8.0% interest, 90% funding (capped at ₹45 Lakh), and 6 months moratorium.',
  descriptionHindi: '₹50 लाख तक के ग्रामीण विनिर्माण व प्रसंस्करण उद्यमों के लिए 8.0% रियायती ब्याज दर, 7 वर्ष की अवधि और 6 माह मोराटोरियम के साथ सावधि ऋण (अधिकतम ₹45 लाख)।',
  disclaimer: 'Authoritative term loan norms verified against MoSJE / NBCFDC notifications.',
};

export const MAHILA_SAMRIDDHI_SCHEME: SchemeConfiguration = {
  schemeId: 'NBCFDC-MSY-2026',
  name: 'Mahila Samriddhi Yojana (MoSJE / NBCFDC SHG)',
  nameHindi: 'महिला समृद्धि योजना (स्वयं सहायता समूह)',
  version: '2026.1',
  minProjectCost: 20000,
  maxProjectCost: 140000,
  fundingPercentage: 90,
  beneficiaryPercentage: 10,
  maxLoanAmount: 125000,
  annualInterestRate: 4.0, // Subsidized rate for women SHG members
  tenureMonths: 36,
  moratoriumMonths: 3,
  repaymentInterval: 'QUARTERLY',
  sourceType: 'ESTIMATED',
  source: 'NBCFDC Mahila Samriddhi Yojana Guidelines for Women SHG Beneficiaries (Comparative Model)',
  sourceUrl: 'https://nbcfdc.gov.in',
  verifiedAt: '2026-01-15',
  description: 'Comparative micro-lending scheme for women Self-Help Group (SHG) members with 4.0% interest rate and 3-month moratorium.',
  descriptionHindi: 'महिला स्वयं सहायता समूह सदस्यों के लिए तुलनात्मक 4.0% रियायती ब्याज दर और 3 माह की मोराटोरियम सुविधा।',
  disclaimer: 'Interest rates and subsidies are indicative; confirm with your local SC/ST/OBC Development Corporation or bank branch.',
};

export interface SchemeEvaluationResult {
  scheme: SchemeConfiguration;
  theoreticalProjectCost: number;
  eligibleProjectCost: number;
  eligibleLoan: number;
  marginCapital: number;
  isProjectCostCapped: boolean;
  cappingReason?: string;
  capNotification: CapNotification;
}

/**
 * Authoritative Evaluation:
 * Routes between Micro Finance (<= ₹1.40L) and Term Loan (> ₹1.40L),
 * enforces statutory maximums (₹1.25L for Micro, ₹45L for Term Loan, ₹50L max Project Cost),
 * and produces explicit notification flags so user input is never silently mutated.
 */
export function evaluateSchemeEligibility(
  marginCapitalInput: number,
  isShg = false
): SchemeEvaluationResult {
  // Check if margin input needed bounds adjustment
  const rawMargin = Number(marginCapitalInput) || 14000;
  let marginCapital = rawMargin;
  let isMarginAdjusted = false;

  if (rawMargin < 5000) {
    marginCapital = 5000;
    isMarginAdjusted = true;
  }

  // 10% Promoter Margin implies 100% Theoretical Project Cost
  const theoreticalProjectCost = Math.round(marginCapital / 0.10);

  // Determine applicable scheme
  let scheme: SchemeConfiguration;
  if (isShg && theoreticalProjectCost <= 140000) {
    scheme = MAHILA_SAMRIDDHI_SCHEME;
  } else if (theoreticalProjectCost <= 140000) {
    scheme = NBCFDC_MICRO_FINANCE_SCHEME;
  } else {
    scheme = NBCFDC_TERM_LOAN_SCHEME;
  }

  // Enforce statutory caps
  let eligibleProjectCost = theoreticalProjectCost;
  let isProjectCostCapped = false;
  let cappingReason: string | undefined;

  if (theoreticalProjectCost > scheme.maxProjectCost) {
    eligibleProjectCost = scheme.maxProjectCost;
    isProjectCostCapped = true;
    cappingReason = `The project cost was calculated as ₹${theoreticalProjectCost.toLocaleString('en-IN')}, but has been capped at the statutory scheme maximum of ₹${scheme.maxProjectCost.toLocaleString('en-IN')} under ${scheme.name}.`;
  }

  // Calculate 90% funding with strict statutory maxLoanAmount cap
  const theoreticalLoan = Math.round(eligibleProjectCost * (scheme.fundingPercentage / 100));
  const eligibleLoan = Math.min(theoreticalLoan, scheme.maxLoanAmount);

  const isCapped = isProjectCostCapped || eligibleLoan < theoreticalLoan;
  const message = isCapped
    ? `The theoretical project cost of ₹${theoreticalProjectCost.toLocaleString('en-IN')} has been adjusted to the statutory limit of ₹${eligibleProjectCost.toLocaleString('en-IN')} with maximum concessional loan of ₹${eligibleLoan.toLocaleString('en-IN')} under ${scheme.name}.`
    : `Eligible for full 90% funding under ${scheme.name}.`;
  const messageHindi = isCapped
    ? `प्रस्तावित लागत ₹${theoreticalProjectCost.toLocaleString('en-IN')} को ${scheme.nameHindi} के वैधानिक नियमों के तहत ₹${eligibleProjectCost.toLocaleString('en-IN')} (अधिकतम ऋण ₹${eligibleLoan.toLocaleString('en-IN')}) पर सीमित किया गया है।`
    : `${scheme.nameHindi} के तहत 90% रियायती ऋण के लिए पूर्ण पात्र।`;

  const capNotification: CapNotification = {
    isCapped,
    isProjectCostCapped,
    message,
    messageHindi,
    cappingReason: cappingReason || message,
    reason: cappingReason || message,
    theoreticalCost: theoreticalProjectCost,
    originalTheoreticalProjectCost: theoreticalProjectCost,
    originalInput: rawMargin,
    cappedCost: eligibleProjectCost,
    eligibleProjectCost,
    statutoryMax: scheme.maxProjectCost,
    adjustedCost: eligibleProjectCost,
    maxLoanPermitted: eligibleLoan,
    eligibleLoan,
    concessionalLoan: eligibleLoan,
    statutoryLoanCap: scheme.maxLoanAmount,
    isMarginAdjusted,
    originalMarginInput: rawMargin,
    adjustedMargin: marginCapital,
  };

  return {
    scheme,
    theoreticalProjectCost,
    eligibleProjectCost,
    eligibleLoan,
    marginCapital,
    isProjectCostCapped,
    cappingReason,
    capNotification,
  };
}

/**
 * Deterministic Amortization Engine with exact rounding reconciliation:
 * Ensures closing principal balance zeroing at final installment.
 */
export function generateDeterministicRepaymentSchedule(
  loanAmount: number,
  scheme: SchemeConfiguration
): {
  schedule: RepaymentRow[];
  quarterlyInstallment: number;
  monthlyInstallmentEquivalent: number;
  totalInterest: number;
  totalRepayment: number;
} {
  const totalQuarters = Math.round(scheme.tenureMonths / 3);
  const moratoriumQuarters = Math.round(scheme.moratoriumMonths / 3);
  const repaymentQuarters = totalQuarters - moratoriumQuarters;

  // Quarterly Rate = (Annual Rate / 100) / 4
  const quarterlyRate = (scheme.annualInterestRate / 100) / 4;

  // Standard annuity formula for quarterly amortization during repayment quarters
  const n = repaymentQuarters;
  const num = loanAmount * quarterlyRate * Math.pow(1 + quarterlyRate, n);
  const den = Math.pow(1 + quarterlyRate, n) - 1;
  const quarterlyInstallment = Math.round(num / den);
  const monthlyInstallmentEquivalent = Math.round(quarterlyInstallment / 3);

  const schedule: RepaymentRow[] = [];
  let remainingPrincipal = loanAmount;
  let totalInterest = 0;

  for (let q = 1; q <= totalQuarters; q++) {
    const isMoratorium = q <= moratoriumQuarters;
    const quarterInterest = Math.round(remainingPrincipal * quarterlyRate);
    totalInterest += quarterInterest;

    if (isMoratorium) {
      // In Moratorium: Principal payment is deferred.
      schedule.push({
        quarter: `Q${q}`,
        phase: 'Moratorium (मोराटोरियम - मूलधन स्थगित)',
        isMoratorium: true,
        emi: quarterInterest.toLocaleString('en-IN'),
        totalPayment: quarterInterest,
        principal: 0,
        interest: quarterInterest,
        balance: remainingPrincipal.toLocaleString('en-IN'),
        closingBalance: remainingPrincipal,
      });
    } else {
      let principal = quarterlyInstallment - quarterInterest;
      let effectiveQuarterlyPayment = quarterlyInstallment;

      // Final quarter or balance overshoot reconciliation
      if (q === totalQuarters || principal >= remainingPrincipal) {
        principal = remainingPrincipal;
        effectiveQuarterlyPayment = principal + quarterInterest;
        remainingPrincipal = 0;
      } else {
        remainingPrincipal -= principal;
      }

      schedule.push({
        quarter: `Q${q}`,
        phase: 'Repayment (किस्त अदायगी)',
        isMoratorium: false,
        emi: effectiveQuarterlyPayment.toLocaleString('en-IN'),
        totalPayment: effectiveQuarterlyPayment,
        principal,
        interest: quarterInterest,
        balance: remainingPrincipal.toLocaleString('en-IN'),
        closingBalance: remainingPrincipal,
      });
    }
  }

  const totalRepayment = loanAmount + totalInterest;

  return {
    schedule,
    quarterlyInstallment,
    monthlyInstallmentEquivalent,
    totalInterest,
    totalRepayment,
  };
}
