import { EvidenceItem, EvidenceSourceType, FinancialPlan, BusinessEconomicsModel, LocationState } from '../types';

/**
 * EVIDENCE & DATA PROVENANCE SYSTEM
 * Tracks transparency, source references, and credibility ratings for every metric displayed.
 */

export function getEvidenceBadgeConfig(sourceType: EvidenceSourceType): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon: string;
} {
  switch (sourceType) {
    case 'OFFICIAL':
      return {
        label: '✓ VERIFIED OFFICIAL',
        bgClass: 'bg-[#e8f5e9]',
        textClass: 'text-[#1b5e20]',
        borderClass: 'border-[#a5d6a7]',
        icon: 'verified',
      };
    case 'CALCULATED':
      return {
        label: '✓ CALCULATED FORMULA',
        bgClass: 'bg-[#e3f2fd]',
        textClass: 'text-[#0d47a1]',
        borderClass: 'border-[#90caf9]',
        icon: 'calculate',
      };
    case 'MAPS':
      return {
        label: '✓ GOOGLE MAPS LIVE',
        bgClass: 'bg-[#e0f7fa]',
        textClass: 'text-[#006064]',
        borderClass: 'border-[#80deea]',
        icon: 'place',
      };
    case 'SEARCH':
      return {
        label: '✓ SEARCH GROUNDED',
        bgClass: 'bg-[#ede7f6]',
        textClass: 'text-[#4a148c]',
        borderClass: 'border-[#b39ddb]',
        icon: 'travel_explore',
      };
    case 'ESTIMATED':
      return {
        label: '~ ESTIMATED BENCHMARK',
        bgClass: 'bg-[#fff8e1]',
        textClass: 'text-[#f57f17]',
        borderClass: 'border-[#ffe082]',
        icon: 'query_stats',
      };
    case 'INFERRED':
      return {
        label: '~ INFERRED DEMAND',
        bgClass: 'bg-[#f3e5f5]',
        textClass: 'text-[#6a1b9a]',
        borderClass: 'border-[#ce93d8]',
        icon: 'psychology',
      };
    case 'DEMO':
      return {
        label: '⚠ DEMO SIMULATION',
        bgClass: 'bg-[#fff3e0]',
        textClass: 'text-[#e65100]',
        borderClass: 'border-[#ffcc80]',
        icon: 'warning',
      };
    case 'USER':
      return {
        label: '✎ USER INPUT',
        bgClass: 'bg-[#f5f5f5]',
        textClass: 'text-[#424242]',
        borderClass: 'border-[#e0e0e0]',
        icon: 'person',
      };
    case 'UNAVAILABLE':
    default:
      return {
        label: '! DETAILS UNAVAILABLE',
        bgClass: 'bg-[#eeeeee]',
        textClass: 'text-[#757575]',
        borderClass: 'border-[#cccccc]',
        icon: 'help_outline',
      };
  }
}

/**
 * Generate a complete audit trail of all primary metrics in the plan
 */
export function generateEvidenceLedger(
  plan: FinancialPlan,
  economics: BusinessEconomicsModel,
  location: LocationState
): EvidenceItem[] {
  return [
    {
      id: 'scheme_statutory_loan',
      metric: 'Approved Concessional Loan',
      value: `₹${plan.approvedLoan.toLocaleString('en-IN')}`,
      unit: 'INR',
      source: 'MoSJE & NBCFDC Official Gazette Guidelines',
      sourceType: 'OFFICIAL',
      sourceUrl: 'https://nbcfdc.gov.in',
      retrievedAt: '2026-01-15',
      confidence: 'HIGH',
      notes: plan.schemeType === 'micro_finance'
        ? 'Micro Finance scheme 90% funding with statutory maximum ceiling of ₹1,25,000.'
        : 'Term Loan scheme 90% funding with statutory maximum ceiling of ₹45,00,000.',
    },
    {
      id: 'scheme_interest_rate',
      metric: 'Concessional Interest Rate',
      value: `${plan.interestRate}%`,
      unit: 'Annual Flat/Reducing',
      source: 'NBCFDC Channel Partner Lending Policy',
      sourceType: 'OFFICIAL',
      sourceUrl: 'https://nbcfdc.gov.in',
      confidence: 'HIGH',
      notes: 'Subsidized rate for target socio-economic entrepreneurs.',
    },
    {
      id: 'quarterly_installment',
      metric: 'Quarterly Loan Installment',
      value: `₹${plan.quarterlyEmi.toLocaleString('en-IN')}`,
      unit: 'INR per Quarter',
      source: 'Deterministic Amortization Algorithm',
      sourceType: 'CALCULATED',
      confidence: 'HIGH',
      notes: 'Equal quarterly installment during repayment quarters after moratorium.',
    },
    {
      id: 'benchmark_savings',
      metric: 'Estimated Interest Saving vs Benchmark',
      value: `₹${plan.benchmarkInterestSaving.toLocaleString('en-IN')}`,
      unit: 'INR Total',
      source: 'Calculated comparison against 14.0% commercial MFI benchmark',
      sourceType: 'CALCULATED',
      confidence: 'HIGH',
      notes: plan.benchmarkDisclaimer,
    },
    {
      id: 'monthly_revenue',
      metric: 'Projected Monthly Sales Revenue',
      value: `₹${economics.monthlyRevenue.toLocaleString('en-IN')}`,
      unit: 'INR / Month',
      source: 'MSME Cluster Unit Economics Model',
      sourceType: 'ESTIMATED',
      confidence: 'MEDIUM',
      notes: `Based on ${economics.expectedMonthlyUnitsSold.toLocaleString('en-IN')} units @ ₹${economics.unitSellingPrice}/unit.`,
    },
    {
      id: 'break_even_point',
      metric: 'Estimated Break-Even Timeline',
      value: `${economics.estimatedMonthsToBreakEven} Months`,
      unit: 'Months',
      source: 'Contribution Margin & Fixed Opex Absorption Model',
      sourceType: 'CALCULATED',
      confidence: 'MEDIUM',
      notes: `Break-even volume is ${economics.breakEvenUnits.toLocaleString('en-IN')} units per month.`,
    },
    {
      id: 'working_capital_runway',
      metric: 'Working Capital Cash Runway',
      value: `${economics.cashRunwayMonths} Months (${economics.runwayAssessment})`,
      unit: 'Months',
      source: 'Cash Burn Formula: Working Capital / (Fixed Opex + Debt Service)',
      sourceType: 'CALCULATED',
      confidence: 'HIGH',
      notes: `Buffer capital ₹${economics.workingCapitalRequirement.toLocaleString('en-IN')} against monthly burn of ₹${economics.monthlyBurnRate.toLocaleString('en-IN')}.`,
    },
    {
      id: 'geographic_location',
      metric: 'Enterprise Operational Cluster',
      value: `${location.village}, ${location.block}, ${location.district}`,
      unit: 'Administrative Hierarchy',
      source: location.pincode ? 'India Post Postal API + User GPS' : 'User Selection',
      sourceType: location.pincode ? 'MAPS' : 'USER',
      confidence: 'HIGH',
      notes: `PIN: ${location.pincode || '221101'} | Coordinates: ${location.latitude}, ${location.longitude}`,
    },
  ];
}
