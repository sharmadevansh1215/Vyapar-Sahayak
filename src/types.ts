export type Language = 
  | 'hi' // Hindi
  | 'en' // English
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'kn' // Kannada
  | 'bn' // Bengali
  | 'gu' // Gujarati
  | 'sat' // Santali (संताली / ᱥᱟᱱᱛᱟᱲᱤ)
  | 'bhb' // Bhili / Bhilodi (भीली / भीलोड़ी)
  | 'gon' // Gondi (गोंडी / 𑴎𑴽𑴟𑴳)
  | 'or'  // Odia (ଓଡ଼ିଆ)
  | 'as'  // Assamese (অসমীয়া)
  | 'brx'; // Bodo (बड़ो / Boro)

export interface BankBranch {
  name: string;
  nameHindi?: string;
  branchName: string;
  bankType?: 'Public Sector' | 'Regional Rural Bank (RRB)' | 'Cooperative Bank' | 'Commercial Bank' | string;
  ifsc: string;
  micr?: string;
  address: string;
  distanceKm?: number;
  distance?: string;
  contactPhone?: string;
  phone?: string;
  managerName?: string;
  workingHours?: string;
  nodalOfficer?: string;
  schemesOffered: string[];
  isLeadBank?: boolean;
  specialization?: string;
  latitude?: number;
  longitude?: number;
}

export interface PincodeBankResponse {
  success?: boolean;
  pincode: string;
  district?: string;
  state?: string;
  leadBank?: string;
  postalDetails?: {
    postOffice: string;
    district: string;
    state: string;
    division: string;
    block?: string;
  };
  banks?: BankBranch[];
  branches?: BankBranch[];
  source: string;
}

export type TabType = 
  | 'dashboard'
  | 'calculator'
  | 'profile'
  | 'settings'
  | 'reports'
  | 'wizard'
  | 'category'
  | 'gallery'
  | 'grants'
  | 'landing';

export interface UserProfile {
  name: string;
  phone: string;
  email?: string;
  profilePhoto?: string;
  preferredLanguage?: Language;
  state: string;
  district: string;
  block: string;
  village: string;
  businessType: string;
  businessCategoryName?: string;
  marginCapital: number;
  isShg: boolean;
  shgGroupName?: string;
  isVerified: boolean;
  verificationStatus?: 'NOT_VERIFIED' | 'PENDING' | 'DEMO_VERIFIED' | 'VERIFIED' | 'not_verified' | 'pending' | 'demo_verified' | 'verified';
  beneficiaryDetails?: {
    category?: string;
    aadhaarLinked?: boolean;
    digiLockerVerified?: boolean;
    casteCertificateNo?: string;
  };
  documentStatus?: {
    uploaded: number;
    verified: number;
    pending: number;
  };
  applicationStatus?: {
    id: string;
    stage: string;
    status: string;
    appliedDate: string;
  };
  lastUpdatedDate?: string;
  notificationPreference?: boolean;
  voicePreference?: boolean;
}

export type ReportSubTab = 'feasibility' | 'finance';

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
  size?: string;
  description?: string;
  isUploaded?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  groundingSources?: { title: string; url?: string; address?: string }[];
  modelUsed?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  nameHindi: string;
}

export interface RevenueItem {
  product: string;
  productHindi: string;
  price: string;
  monthlyRevenue: string;
  rawRevenueNum: number;
}

export interface NicheOpportunity {
  id: string;
  title: string;
  description: string;
  demandLevel: 'High' | 'Med' | 'Low';
  icon: string;
  bgColor: string;
  textColor: string;
  tagBg: string;
  tagColor: string;
}

export interface SwotItem {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitionItem {
  name: string;
  level: string;
  count: number;
  percentage: number;
  barColor: string;
}

export interface BusinessCategory {
  id: string;
  emoji: string;
  iconName?: string;
  name: string;
  nameHindi: string;
  description: string;
  subcategories: SubCategory[];
  defaultMargin: string;
  defaultProjectCost: string;
  defaultLoan: string;
  potentialCustomers: string;
  demographics: { age: string; count: string; heightPct: number; colorClass: string }[];
  competition: CompetitionItem[];
  swot: SwotItem;
  niches: NicheOpportunity[];
  revenueItems: RevenueItem[];
}

export interface LocationState {
  state: string;
  district: string;
  block: string;
  village: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface DocumentVerificationResult {
  documentType: string;
  legibility: 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  extractedFields: {
    fullName?: string;
    accountOrIdNumber?: string;
    address?: string;
    issuerOrBank?: string;
    issueDate?: string;
  };
  eligibilityVerdict: 'Approved for MoSJE Appraisal' | 'Needs Clearer Scan' | 'Invalid Format';
  complianceNotes: string;
}

export interface WeatherContext {
  temperature: number;
  humidity: number;
  weatherCode: number;
  condition: string;
  windSpeed: number;
  seasonalImpact: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  titleHindi: string;
  subtitle: string;
  status: 'verified' | 'pending';
  fileUploaded?: string;
}

export interface RepaymentRow {
  quarter: string | number;
  phase: string;
  isMoratorium: boolean;
  emi: string | number;
  totalPayment?: string | number;
  principal: string | number;
  interest: string | number;
  balance: string | number;
  closingBalance?: string | number;
}

export type SchemeType = 'micro_finance' | 'term_loan';

export interface SHGDetails {
  isShgMode: boolean;
  memberCount: number;
  perMemberContribution: number;
  totalPooledMargin: number;
  perMemberLoanShare: number;
  perMemberMonthlyDividend: number;
  shgGroupName?: string;
}

export interface SchemeMatchOption {
  id: string;
  name: string;
  nameHindi: string;
  ministry: string;
  interestRate: string;
  marginRequiredPct: number;
  marginRequiredAmount?: number;
  maxProjectCost?: string;
  maxLoanLimit?: string;
  moratoriumPeriod?: string;
  tenure?: string;
  subsidyAvailable?: string;
  subsidyInfo?: string;
  bestFor?: string;
  isPrimaryMatch?: boolean;
  isBestMatch?: boolean;
  eligibility?: string;
  eligibilityCriteria?: string[];
  mandatoryDocuments?: string[];
  badgeColor?: string;
  keyBenefits?: string[];
  sourceType?: SchemeSourceType;
  sourceUrl?: string;
  disclaimer?: string;
}

export interface NearbyCompetitorPoint {
  name: string;
  distance: string;
  type: string;
  marketShare: string;
}

export interface MarketDensityDetails {
  densityLevel: 'Low' | 'Medium' | 'High' | string;
  competitorCount: number;
  competitiveAdvantage: string;
  saturationScore: number;
  nearbyClusters: NearbyCompetitorPoint[];
  marketGaps: string[];
  source?: string;
}

export interface FinancialPlan {
  marginCapital: number; // 10%
  marginPercentage: number; // 10%
  projectCost: number; // Eligible project cost after statutory scheme caps
  originalTheoreticalProjectCost: number; // Theoretical cost before scheme cap
  isProjectCostCapped: boolean; // Flag indicating whether statutory ceiling was applied
  cappingReason?: string;
  capNotification?: CapNotification;
  approvedLoan: number; // Approved loan amount strictly capped at scheme max
  loanPercentage: number; // 90%
  schemeType: SchemeType;
  schemeId: string;
  schemeConfig?: SchemeConfiguration;
  schemeName: string;
  schemeNameHindi: string;
  schemeBadge: string;
  schemeDescription: string;
  schemeDescriptionHindi: string;
  interestRate: number; // 6.5% for Micro, 8.0% for Term Loan
  tenureYears: number; // 3 years for Micro, 7 years for Term Loan
  totalQuarters: number; // 12 for Micro, 28 for Term Loan
  moratoriumMonths: number; // 3 months for Micro, 6 months for Term Loan
  moratoriumQuarters: number; // 1 for Micro, 2 for Term Loan
  repaymentQuarters: number; // 11 for Micro, 26 for Term Loan
  quarterlyEmi: number; // Quarterly installment amount
  quarterlyInstallmentLabel: string; // "Quarterly Installment (त्रैमासिक किस्त)"
  monthlyInstallmentEquivalent: number; // Prorated monthly equivalent for user budgeting
  monthlyEquivalentInstallment?: number; // Alias for component compatibility
  totalInterestPayable: number;
  totalRepayment: number;
  subsidyAmount: number; // Kept for backwards compatibility
  benchmarkInterestSaving: number; // Renamed metric: savings vs 14% commercial benchmark
  benchmarkDisclaimer: string; // "This is an illustrative comparison and does not represent a government subsidy entitlement."
  
  // SHG / Group Enterprise Allocation
  shgDetails?: SHGDetails;

  // Baseline Operational Costs & Working Capital
  fixedCapex: number; // ~65% Capex
  workingCapital: number; // ~35% Working Capital
  estimatedMonthlyOpex: number;
  estimatedMonthlyRevenue: number;
  estimatedMonthlyNetProfit: number;
  breakEvenMonths: number;
  
  repaymentSchedule: RepaymentRow[];
}

export interface FeasibilityInsights {
  marketReach: {
    radiusKm: number;
    estimatedConsumers: string;
    distributionChannels: string[];
  };
  opportunityAnalysis: {
    unservedNiches: string[];
    growthDrivers: string[];
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  competitorMapping: {
    densityLevel: 'Low' | 'Medium' | 'High' | string;
    estimatedCount: number;
    competitiveAdvantage: string;
  };
  pricingAndMarketValue: {
    pricingStrategy: string;
    topProducts: {
      name: string;
      price: string;
      monthlyRevenue: string;
    }[];
  };
  operationalCostBreakdown: {
    fixedCapexPct: number;
    workingCapitalPct: number;
    estimatedMonthlyOpex: number;
    estimatedMonthlyNetProfit: number;
    breakEvenMonths: number;
  };
  groundingSources?: { title: string; url?: string; address?: string }[];
  modelUsed?: string;
  executiveSummary?: string;
}

export interface GroundingSource {
  title: string;
  url?: string;
  address?: string;
}

export interface StreamingFeasibilityChunk {
  type: 'init' | 'chunk' | 'grounding' | 'complete' | 'error';
  text?: string;
  modelUsed?: string;
  groundingSources?: GroundingSource[];
  insights?: FeasibilityInsights;
  error?: string;
}

export interface NLPQueryResult {
  categoryId: string;
  marginCapital: number;
  location: LocationState;
  detectedLanguage: Language;
  summaryText: string;
}

// -------------------------------------------------------------
// AUTHORITATIVE SCHEME CONFIGURATION & AUDIT TRAIL
// -------------------------------------------------------------
export type SchemeSourceType = 'OFFICIAL' | 'SIH_PROBLEM_STATEMENT' | 'DEMO' | 'ESTIMATED' | 'SEARCH_GROUNDED';

export interface SchemeConfiguration {
  schemeId: string;
  name: string;
  nameHindi: string;
  version: string;
  minProjectCost: number;
  maxProjectCost: number;
  fundingPercentage: number;
  beneficiaryPercentage: number;
  maxLoanAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  moratoriumMonths: number;
  repaymentInterval: 'QUARTERLY' | 'MONTHLY';
  sourceType: SchemeSourceType;
  source: string;
  sourceUrl?: string;
  verifiedAt: string;
  description: string;
  descriptionHindi: string;
  disclaimer?: string;
}

export interface CapNotification {
  isCapped: boolean;
  isProjectCostCapped?: boolean;
  message?: string;
  messageHindi?: string;
  cappingReason?: string;
  reason?: string;
  theoreticalCost: number;
  originalTheoreticalProjectCost?: number;
  originalInput?: number;
  cappedCost: number;
  eligibleProjectCost?: number;
  statutoryMax?: number;
  adjustedCost?: number;
  maxLoanPermitted: number;
  eligibleLoan?: number;
  concessionalLoan?: number;
  statutoryLoanCap?: number;
  isMarginAdjusted?: boolean;
  originalMarginInput?: number;
  adjustedMargin?: number;
}

// -------------------------------------------------------------
// EVIDENCE AND DATA PROVENANCE SYSTEM
// -------------------------------------------------------------
export type EvidenceSourceType =
  | 'OFFICIAL'
  | 'MAPS'
  | 'SEARCH'
  | 'USER'
  | 'CALCULATED'
  | 'ESTIMATED'
  | 'INFERRED'
  | 'DEMO'
  | 'UNAVAILABLE';

export interface EvidenceItem {
  id: string;
  metric: string;
  value: string | number;
  unit?: string;
  source: string;
  sourceType: EvidenceSourceType;
  retrievedAt?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  notes?: string;
  sourceUrl?: string;
}

// -------------------------------------------------------------
// REAL BUSINESS ECONOMICS, WORKING CAPITAL & UNIT ECONOMICS
// -------------------------------------------------------------
export interface BusinessCostItem {
  name: string;
  nameHindi: string;
  amount: number;
  category: 'CAPEX' | 'OPEX_FIXED' | 'OPEX_VARIABLE' | 'WORKING_CAPITAL';
  notes?: string;
}

export interface BusinessEconomicsModel {
  categoryId: string;
  categoryName: string;
  categoryNameHindi: string;
  
  // Capex Breakdown (Fixed Assets)
  equipmentCapex: number;
  civilOrShelterCapex: number;
  initialStockCapex: number;
  totalFixedCapex: number;

  // Monthly Opex Breakdown
  rawMaterialsMonthly: number;
  labourMonthly: number;
  rentMonthly: number;
  utilitiesMonthly: number; // Electricity, Water, Fuel
  transportationMonthly: number;
  packagingMonthly: number;
  maintenanceMonthly: number;
  marketingMonthly: number;
  totalMonthlyOpex: number;

  // Unit Economics
  unitSellingPrice: number;
  variableCostPerUnit: number;
  contributionMarginPerUnit: number;
  expectedMonthlyUnitsSold: number;

  // Revenue & Profitability
  monthlyRevenue: number;
  monthlyCOGS: number; // Raw materials + packaging + direct logistics
  monthlyGrossProfit: number;
  grossMarginPct: number;
  monthlyOperatingProfit: number; // EBITDA
  operatingMarginPct: number;
  monthlyDebtService: number; // Monthly equivalent of quarterly loan obligation
  monthlyNetCashFlow: number;

  // Break-even Engine
  monthlyFixedCosts: number;
  breakEvenUnits: number;
  breakEvenMonthlyUnits?: number;
  breakEvenRevenue: number;
  unitPrice?: number;
  estimatedMonthsToBreakEven: number;

  // Working Capital & Cash Runway
  workingCapitalRequirement: number; // 2-3 months buffer
  monthlyBurnRate: number; // Fixed costs + debt service
  cashRunwayMonths: number;
  runwayAssessment: 'Strong' | 'Adequate' | 'Low' | 'Critical';

  // Debt Service Coverage Ratio
  debtServiceCoverageRatio: number; // DSCR = Monthly Operating Cash Flow / Monthly Debt Service

  // Seasonality Multipliers
  seasonality: {
    normal: number;
    festive: number;
    harvest: number;
    monsoon: number;
  };

  itemizedCosts: BusinessCostItem[];
}

// -------------------------------------------------------------
// REPAYMENT SENSITIVITY & STRESS TESTING
// -------------------------------------------------------------
export type StressRiskLevel = 'COMFORTABLE' | 'WATCH' | 'STRESSED' | 'UNSUSTAINABLE';

export interface StressScenarioResult {
  id: string;
  scenarioId?: string;
  scenarioName: string;
  scenarioNameHindi: string;
  description: string;
  revenueChangePct: number;
  costChangePct: number;
  priceChangePct: number;
  projectedRevenue: number;
  projectedMonthlyRevenue?: number;
  projectedOperatingProfit: number;
  projectedCashFlow: number;
  projectedMonthlyNetProfit?: number;
  quarterlyDebtService: number;
  monthlyDebtService: number;
  dscr: number;
  canServiceDebt?: boolean;
  riskLevel: StressRiskLevel;
  riskVerdictHindi: string;
  actionableRecommendation: string;
}

// -------------------------------------------------------------
// ADVISORY VIABILITY SCORE & RECOMMENDATION SYSTEM
// -------------------------------------------------------------
export interface ViabilityDimension {
  id: string;
  name: string;
  nameHindi: string;
  score: number;
  maxScore: number;
  description: string;
  descriptionHindi: string;
}

export interface ViabilityScoreBreakdown {
  overallScore: number; // 0 to 100
  demandScore: number; // Max 25
  competitionScore: number; // Max 15
  financialViabilityScore: number; // Max 20
  capitalFitScore: number; // Max 15
  marketAccessScore: number; // Max 10
  supplyRiskScore: number; // Max 10
  seasonalityScore: number; // Max 5
  verdict: 'RECOMMENDED' | 'PROCEED WITH CAUTION' | 'NEEDS MORE VALIDATION' | 'NOT RECOMMENDED';
  verdictHindi: string;
  disclaimer: string;
  dimensions: ViabilityDimension[];
  whyThisBusiness: {
    pros: string[];
    risks: string[];
  };
  alternativeRecommendations: {
    categoryId: string;
    categoryName: string;
    categoryNameHindi: string;
    score: number;
    fitReason: string;
    marginRequired: string;
  }[];
}

// -------------------------------------------------------------
// KYC AND DOCUMENT AUDIT COMPLIANCE STATES
// -------------------------------------------------------------
export type KycStatus =
  | 'NOT_VERIFIED'
  | 'PENDING'
  | 'DEMO_VERIFIED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'UNAVAILABLE';

export type DocumentState =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'OCR_COMPLETE'
  | 'VALIDATION_PENDING'
  | 'NEEDS_REVIEW'
  | 'VERIFIED'
  | 'REJECTED';

export interface KycAuditRecord {
  id: string;
  userId: string;
  idType: 'AADHAAR' | 'PAN' | 'UDYAM' | 'CASTE_CERTIFICATE';
  maskedId: string;
  status: KycStatus;
  verifiedName?: string;
  nameMatchConfidencePct?: number;
  source: string;
  timestamp: string;
  disclaimer: string;
}

