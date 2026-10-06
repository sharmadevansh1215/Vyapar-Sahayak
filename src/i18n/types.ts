import { Language } from '../types';

export interface LanguageConfig {
  code: Language;
  nativeName: string;
  englishName: string;
  direction: 'ltr' | 'rtl';
  enabled: boolean;
  isComingSoon?: boolean;
  region: string;
}

export interface I18nDictionary {
  // Brand & Global
  appName: string;
  brandTagline: string;
  appBadge: string;
  dashboardGreeting: string;
  officialDisclaimer: string;

  // Navigation
  navDashboard: string;
  navCalculator: string;
  navReports: string;
  navGrants: string;
  navProfile: string;
  navSettings: string;
  navGallery: string;
  navLogout: string;
  navUserGuide: string;
  navAiChat: string;

  // Common Actions
  commonSave: string;
  commonCancel: string;
  commonEdit: string;
  commonDelete: string;
  commonConfirm: string;
  commonClose: string;
  commonBack: string;
  commonNext: string;
  commonContinue: string;
  commonLoading: string;
  commonProcessing: string;
  commonSuccess: string;
  commonError: string;
  commonDownloadPdf: string;
  commonShareWhatsApp: string;
  commonVoiceAudio: string;
  commonRegenerate: string;
  commonChangeInputs: string;
  commonCompareSectors: string;
  commonSelect: string;
  commonSelected: string;
  commonViewDetails: string;
  commonLearnMore: string;

  // Header & Status
  headerSelectLanguage: string;
  headerVoiceGuide: string;
  headerVoiceSpeaking: string;
  headerAiAdvisor: string;
  headerLowResourceMode: string;

  // Onboarding & Wizard
  onboardingWelcome: string;
  onboardingSubtitle: string;
  onboardingStep1: string;
  onboardingStep2: string;
  onboardingStep3: string;
  onboardingStep4: string;
  onboardingEnterPhone: string;
  onboardingPhoneNote: string;
  onboardingSendOtp: string;
  onboardingVerifyOtp: string;
  onboardingEnterOtp: string;
  onboardingResendOtp: string;
  onboardingUseDemoOtp: string;
  onboardingProfileSetup: string;
  onboardingFullName: string;
  onboardingFullNamePlaceholder: string;
  onboardingSelectBusiness: string;
  onboardingEnterDashboard: string;

  // Location Selector
  locationState: string;
  locationDistrict: string;
  locationBlock: string;
  locationVillage: string;
  locationVillagePlaceholder: string;
  locationSpeakToEnter: string;
  locationDetectedLocation: string;

  // Finance & Calculator
  financeMarginCapital: string;
  financeMarginHelp: string;
  financeTotalProjectCost: string;
  financeEligibleLoan: string;
  financeInterestRate: string;
  financeTenure: string;
  financeMoratorium: string;
  financeQuarterlyEmi: string;
  financeActiveScheme: string;
  financeRepaymentSchedule: string;
  financeQuarter: string;
  financePhase: string;
  financePrincipal: string;
  financeInterest: string;
  financeBalance: string;
  financeCapex: string;
  financeWorkingCapital: string;
  financeMonthlyOpex: string;
  financeProjectedProfit: string;
  financeBreakEven: string;

  // Feasibility Report
  reportTitle: string;
  reportExecutiveSummary: string;
  reportViabilityScore: string;
  reportRecommendation: string;
  reportKeyInsights: string;
  reportBusinessEconomics: string;
  reportMarketAnalysis: string;
  reportMarketReach5km: string;
  reportMarketReach10km: string;
  reportCompetitorAnalysis: string;
  reportCompetitionIntensity: string;
  reportCompetitorCount: string;
  reportPricingStrategy: string;
  reportObservedPricing: string;
  reportRiskAnalysis: string;
  reportTopRisks: string;
  reportMitigationPlan: string;
  reportSwotAnalysis: string;
  reportStrengths: string;
  reportWeaknesses: string;
  reportOpportunities: string;
  reportThreats: string;
  reportStressTest: string;
  reportStressTestDownside: string;
  reportWhyRecommendation: string;
  reportNext3Actions: string;
  reportEvidenceSources: string;
  reportDataQuality: string;
  reportQualityHigh: string;
  reportQualityMedium: string;
  reportQualityLow: string;
  reportQualityDemo: string;
  reportLastAnalyzed: string;
  reportMarketDataDate: string;
  reportAnalyzingStep1: string;
  reportAnalyzingStep2: string;
  reportAnalyzingStep3: string;
  reportAnalyzingStep4: string;
  reportAnalyzingStep5: string;
  reportAnalyzingStep6: string;

  // Profile
  profileTitle: string;
  profileSubtitle: string;
  profilePhotoUpload: string;
  profilePhotoReplace: string;
  profilePhotoRemove: string;
  profileCompletion: string;
  profileMissingInfo: string;
  profilePersonalInformation: string;
  profileLocationInfo: string;
  profileBusinessInfo: string;
  profileFinancialInfo: string;
  profileDocuments: string;
  profileVerificationStatus: string;
  profileStatusNotVerified: string;
  profileStatusPending: string;
  profileStatusDemoVerified: string;
  profileStatusVerified: string;
  profileApplicationStatus: string;
  profilePreferences: string;
  profileLastUpdated: string;
  profileUpdateSuccess: string;
  profileConfirmFinancialChange: string;

  // Bank Locator & KYC
  bankLocatorTitle: string;
  bankLocatorSubtitle: string;
  bankLocatorSearchPincode: string;
  bankLocatorLeadBank: string;
  bankLocatorRrb: string;
  bankLocatorContactTollFree: string;
  bankLocatorNodalOfficer: string;
  kycDocumentUpload: string;
  kycSupportedDocs: string;
  kycUploadStateDemo: string;
}
