import { FinancialPlan, RepaymentRow, SHGDetails, SchemeMatchOption } from '../types';
import {
  evaluateSchemeEligibility,
  generateDeterministicRepaymentSchedule,
} from './schemeEngine';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumberWithCommas(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(amount));
}

export const BENCHMARK_DISCLAIMER = 'This is an illustrative comparison against standard 14.0% commercial MFI rates and does not represent a government subsidy entitlement or cash grant. / यह 14.0% वाणिज्यिक एमएफआई दरों की तुलना में अनुमानित ब्याज बचत है, सरकारी प्रत्यक्ष अनुदान (सब्सिडी) नहीं।';

/**
 * Authoritative Financial Engine & Statutory Scheme Router
 * Fully compliant with MoSJE / NBCFDC official lending rules.
 * 
 * Statutory Constraints:
 * - Micro Finance Scheme: maxProjectCost = ₹1,40,000, funding = 90%, maxLoanAmount = ₹1,25,000 (NOT ₹1,26,000)
 * - Term Loan Scheme: maxProjectCost = ₹50,00,000, funding = 90%, maxLoanAmount = ₹45,00,000
 * - Explicit cap notification flag when inputs exceed scheme ceilings
 * - Renamed "Government Subsidy" to "Estimated Interest Saving vs Benchmark"
 * - Rounding reconciliation ensuring final installment balance is exactly 0
 */
export function calculateFinancialPlan(
  marginCapitalInput: number,
  isShgMode = false,
  shgMemberCount = 10,
  shgPerMemberContribution = 5000,
  shgGroupName = 'Gramodaya Mahila SHG'
): FinancialPlan {
  // Determine effective margin capital
  let effectiveMargin: number;
  let shgDetails: SHGDetails | undefined;

  if (isShgMode) {
    const validMemberCount = Math.max(2, Math.min(shgMemberCount || 10, 50));
    const validContribution = Math.max(500, Math.min(shgPerMemberContribution || 5000, 50000));
    effectiveMargin = validMemberCount * validContribution;
  } else {
    effectiveMargin = marginCapitalInput;
  }

  // Authoritative scheme evaluation & statutory caps
  const evalResult = evaluateSchemeEligibility(effectiveMargin, isShgMode);
  const scheme = evalResult.scheme;
  const projectCost = evalResult.eligibleProjectCost;
  const approvedLoan = evalResult.eligibleLoan;
  const marginCapital = evalResult.marginCapital;

  const isMicroFinance = scheme.maxProjectCost <= 140000;
  const schemeType = isMicroFinance ? 'micro_finance' : 'term_loan';
  const schemeBadge = isMicroFinance ? 'MoSJE Micro Finance' : 'MoSJE Term Loan';

  const tenureYears = Math.round(scheme.tenureMonths / 12);
  const totalQuarters = Math.round(scheme.tenureMonths / 3);
  const moratoriumMonths = scheme.moratoriumMonths;
  const moratoriumQuarters = Math.round(moratoriumMonths / 3);
  const repaymentQuarters = totalQuarters - moratoriumQuarters;

  // Generate deterministic amortization schedule with zero closing balance
  const scheduleResult = generateDeterministicRepaymentSchedule(approvedLoan, scheme);
  const repaymentSchedule = scheduleResult.schedule;
  const quarterlyEmi = scheduleResult.quarterlyInstallment;
  const monthlyInstallmentEquivalent = scheduleResult.monthlyInstallmentEquivalent;
  const totalInterestPayable = scheduleResult.totalInterest;
  const totalRepayment = scheduleResult.totalRepayment;

  // Comparison with 14.0% Commercial MFI Benchmark (NOT labeled as subsidy!)
  const commercialInterestRate = 14.0;
  const commercialQuarterlyRate = (commercialInterestRate / 100) / 4;
  const n = repaymentQuarters;
  const commercialEmiNumerator = approvedLoan * commercialQuarterlyRate * Math.pow(1 + commercialQuarterlyRate, n);
  const commercialEmiDenominator = Math.pow(1 + commercialQuarterlyRate, n) - 1;
  const commercialQuarterlyEmi = Math.round(commercialEmiNumerator / commercialEmiDenominator);
  const commercialTotalInterest = (commercialQuarterlyEmi * n) - approvedLoan;
  const benchmarkInterestSaving = Math.max(0, commercialTotalInterest - totalInterestPayable);

  // Capex & Working Capital Allocations
  const fixedCapex = Math.round(projectCost * 0.65);
  const workingCapital = Math.round(projectCost * 0.35);
  const estimatedMonthlyOpex = Math.round((workingCapital / 3) + (projectCost * 0.015));
  const estimatedMonthlyRevenue = Math.round(estimatedMonthlyOpex * 1.48);
  const estimatedMonthlyNetProfit = Math.max(8000, estimatedMonthlyRevenue - estimatedMonthlyOpex - monthlyInstallmentEquivalent);
  const breakEvenMonths = isMicroFinance ? 4 : 6;

  // SHG Details
  if (isShgMode) {
    const validMemberCount = Math.max(2, Math.min(shgMemberCount || 10, 50));
    shgDetails = {
      isShgMode: true,
      memberCount: validMemberCount,
      perMemberContribution: shgPerMemberContribution,
      totalPooledMargin: marginCapital,
      perMemberLoanShare: Math.round(approvedLoan / validMemberCount),
      perMemberMonthlyDividend: Math.round(estimatedMonthlyNetProfit / validMemberCount),
      shgGroupName: shgGroupName || 'Gramodaya Mahila SHG',
    };
  }

  return {
    marginCapital,
    marginPercentage: 10,
    projectCost,
    originalTheoreticalProjectCost: evalResult.theoreticalProjectCost,
    isProjectCostCapped: evalResult.isProjectCostCapped,
    cappingReason: evalResult.cappingReason,
    capNotification: evalResult.capNotification,
    approvedLoan,
    loanPercentage: 90,
    schemeType,
    schemeId: scheme.schemeId,
    schemeConfig: scheme,
    schemeName: scheme.name,
    schemeNameHindi: scheme.nameHindi,
    schemeBadge,
    schemeDescription: scheme.description,
    schemeDescriptionHindi: scheme.descriptionHindi,
    interestRate: scheme.annualInterestRate,
    tenureYears,
    totalQuarters,
    moratoriumMonths,
    moratoriumQuarters,
    repaymentQuarters,
    quarterlyEmi,
    quarterlyInstallmentLabel: 'Quarterly Installment (त्रैमासिक किस्त)',
    monthlyInstallmentEquivalent,
    monthlyEquivalentInstallment: monthlyInstallmentEquivalent,
    totalInterestPayable,
    totalRepayment,
    subsidyAmount: benchmarkInterestSaving, // Backward compatibility
    benchmarkInterestSaving,
    benchmarkDisclaimer: BENCHMARK_DISCLAIMER,
    shgDetails,
    fixedCapex,
    workingCapital,
    estimatedMonthlyOpex,
    estimatedMonthlyRevenue,
    estimatedMonthlyNetProfit,
    breakEvenMonths,
    repaymentSchedule,
  };
}

/**
 * Cross-Scheme Comparative Engine
 */
export function getSchemeMatches(
  projectCost: number,
  marginCapital: number,
  isShg = false
): SchemeMatchOption[] {
  const isUnder140k = projectCost <= 140000;
  const isUnder5Lakh = projectCost <= 500000;

  return [
    {
      id: 'mosje_concessional',
      name: isUnder140k ? 'MoSJE Micro Finance Scheme' : 'MoSJE Term Loan Scheme',
      nameHindi: isUnder140k ? 'सामाजिक न्याय माइक्रो फाइनेंस' : 'सामाजिक न्याय सावधि ऋण',
      ministry: 'Ministry of Social Justice & Empowerment (MoSJE / NBCFDC / NSFDC)',
      interestRate: isUnder140k ? '6.5% p.a.' : '8.0% p.a.',
      marginRequiredPct: 10,
      marginRequiredAmount: marginCapital,
      maxProjectCost: isUnder140k ? '₹1.40 Lakh' : '₹50.00 Lakh',
      moratoriumPeriod: isUnder140k ? '3 Months (1 Qtr)' : '6 Months (2 Qtrs)',
      tenure: isUnder140k ? '3 Years' : '7 Years',
      subsidyAvailable: isUnder140k
        ? 'Interest subvention @ 6.5% flat concessional rate'
        : 'Subsidized term lending @ 8.0% rate',
      bestFor: isUnder140k
        ? 'Rural micro-enterprises & SHG women seeking lowest rate'
        : 'Agro-processing units, flour mills, and equipment hiring',
      isPrimaryMatch: true,
      sourceType: 'OFFICIAL',
      sourceUrl: isUnder140k ? 'https://nbcfdc.gov.in/schemes/micro-finance' : 'https://nbcfdc.gov.in/schemes/term-loan',
      disclaimer: 'Authoritative scheme guidelines sourced directly from NBCFDC portal.',
      eligibilityCriteria: [
        'Annual household income below statutory ceiling or target backward class category',
        'Valid Aadhaar, Bank Account & Rural Address',
        'Minimum 10% self promoter margin',
      ],
      mandatoryDocuments: [
        'Aadhaar Card (UIDAI)',
        'Caste / Income Verification Certificate',
        'Bank Passbook / Cancelled Cheque',
        'Simplified Project Appraisal Report',
      ],
    },
    {
      id: 'pmegp',
      name: 'Prime Minister Employment Generation Programme (PMEGP)',
      nameHindi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)',
      ministry: 'Ministry of MSME / KVIC',
      interestRate: '10.5% - 12.0% p.a. (Commercial Bank Rate)',
      marginRequiredPct: 5,
      marginRequiredAmount: Math.round(projectCost * 0.05),
      maxProjectCost: 'Up to ₹50 Lakh (Mfg) / ₹20 Lakh (Service)',
      moratoriumPeriod: 'Bank Discretion (3-6 Months)',
      tenure: '3 - 7 Years',
      subsidyAvailable: '25% - 35% Capital Back-Ended Subsidy for Special Category Rural',
      bestFor: 'Higher capital projects seeking upfront capital grant subsidy',
      isPrimaryMatch: false,
      sourceType: 'ESTIMATED',
      sourceUrl: 'https://kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
      disclaimer: 'Interest rates and subsidies are indicative; confirm with your local SC/ST/OBC Development Corporation or bank branch.',
      eligibilityCriteria: [
        'Above 18 years of age',
        'At least 8th standard pass for projects > ₹10 Lakh in manufacturing',
        'New enterprise only (no existing unit expansion)',
      ],
      mandatoryDocuments: [
        'Aadhaar & PAN Card',
        'EDP Training Certificate',
        'Detailed Project Report (DPR)',
        'Educational Qualification Certificate',
      ],
    },
    {
      id: 'mudra',
      name: 'Pradhan Mantri MUDRA Yojana (Shishu / Kishor)',
      nameHindi: 'प्रधानमंत्री मुद्रा योजना (शिशु व किशोर)',
      ministry: 'Department of Financial Services (DFS)',
      interestRate: '9.5% - 11.5% p.a.',
      marginRequiredPct: isUnder5Lakh ? 15 : 20,
      marginRequiredAmount: Math.round(projectCost * (isUnder5Lakh ? 0.15 : 0.20)),
      maxProjectCost: 'Shishu: ₹50k | Kishor: ₹5L | Tarun: ₹10L',
      moratoriumPeriod: 'Nil or up to 3 Months',
      tenure: '3 - 5 Years',
      subsidyAvailable: 'No capital subsidy; collateral-free credit guarantee',
      bestFor: 'Unregistered micro traders needing immediate working capital',
      isPrimaryMatch: false,
      sourceType: 'ESTIMATED',
      sourceUrl: 'https://www.mudra.org.in',
      disclaimer: 'Interest rates and subsidies are indicative; confirm with your local SC/ST/OBC Development Corporation or bank branch.',
      eligibilityCriteria: [
        'Non-farm rural or urban enterprise',
        'No prior bank loan default history',
      ],
      mandatoryDocuments: [
        'Identity & Address Proof',
        'Last 6 Months Bank Statement',
        'Business Quotation / Invoice for machinery',
      ],
    },
    {
      id: 'standup_india',
      name: 'Stand-Up India Scheme',
      nameHindi: 'स्टैंड-अप इंडिया योजना',
      ministry: 'Department of Financial Services (DFS) & SIDBI',
      interestRate: 'MCLR + 3% + Tenor Premium (~9.5% - 11.5%)',
      marginRequiredPct: 15,
      marginRequiredAmount: Math.round(projectCost * 0.15),
      maxProjectCost: '₹10 Lakh to ₹1 Crore',
      moratoriumPeriod: 'Up to 18 Months',
      tenure: 'Up to 7 Years',
      subsidyAvailable: 'Composite loan (Term Loan + Working Capital) with convergence support',
      bestFor: 'SC/ST and Women entrepreneurs for greenfield manufacturing units',
      isPrimaryMatch: false,
      sourceType: 'ESTIMATED',
      sourceUrl: 'https://www.standupmitra.in',
      disclaimer: 'Interest rates and subsidies are indicative; confirm with your local SC/ST/OBC Development Corporation or bank branch.',
      eligibilityCriteria: [
        'SC/ST and/or Woman Entrepreneur',
        'Greenfield project in manufacturing, services or trading',
        '51% shareholding and controlling stake with SC/ST/Woman',
      ],
      mandatoryDocuments: [
        'Identity, Caste & Address Proof',
        'Project Report with Balance Sheet projections',
        'Pollution clearance / Panchayat NOC if applicable',
      ],
    },
  ];
}
