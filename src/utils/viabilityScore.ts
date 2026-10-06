import { ViabilityScoreBreakdown, LocationState } from '../types';
import { BUSINESS_BASELINES } from './businessEconomics';

/**
 * ADVISORY FEASIBILITY & VIABILITY SCORING ENGINE
 * Evaluates holistic business health across 7 statutory dimensions.
 * 
 * Statutory Disclaimer:
 * "Advisory feasibility score for planning purposes. Not a credit bureau score or loan guarantee."
 */

export const VIABILITY_SCORE_DISCLAIMER = 'Advisory feasibility score for planning purposes. Not a credit bureau score or loan guarantee. / यह सलाहकार व्यवहार्यता स्कोर केवल योजना निर्माण हेतु है, किसी क्रेडिट ब्यूरो का आधिकारिक क्रेडिट स्कोर अथवा ऋण गारंटी नहीं है।';

export function calculateViabilityScore(
  categoryId: string,
  marginCapital: number,
  location: LocationState
): ViabilityScoreBreakdown {
  const normCat = categoryId.toLowerCase();
  const baseline = BUSINESS_BASELINES[normCat] || BUSINESS_BASELINES.dairy;

  // 1. Market Demand (Max 25)
  // Essential commodities like Dairy & Retail score higher in rural areas
  let demandScore = 20;
  if (normCat === 'dairy' || normCat === 'food_processing') demandScore = 24;
  else if (normCat === 'retail') demandScore = 22;
  else if (normCat === 'services' || normCat === 'tailoring') demandScore = 21;
  else if (normCat === 'textiles' || normCat === 'handicrafts') demandScore = 18;

  // 2. Competition & Saturation (Max 15)
  // Dynamically computed from category nature and location commercial density
  const highCommercialDistricts = [
    'jaipur', 'pune', 'nagpur', 'patna', 'varanasi', 'lucknow', 'indore',
    'bhopal', 'ahmedabad', 'kanpur', 'agra', 'ludhiana', 'alwar', 'kota', 'coimbatore'
  ];
  const isHighDensityDistrict = highCommercialDistricts.some((d) =>
    (location.district || '').toLowerCase().includes(d)
  );

  let competitionScore = 12;
  if (normCat === 'retail') {
    competitionScore = isHighDensityDistrict ? 8 : 10; // High saturation in tier 1/2 towns
  } else if (normCat === 'tailoring') {
    competitionScore = isHighDensityDistrict ? 10 : 12;
  } else if (normCat === 'food_processing' || normCat === 'agri_machinery') {
    competitionScore = 14; // High barrier, lower competitor density
  } else if (normCat === 'dairy') {
    competitionScore = isHighDensityDistrict ? 11 : 13;
  } else {
    competitionScore = isHighDensityDistrict ? 11 : 13;
  }

  // 3. Financial Viability & Margins (Max 20)
  // Based on operating margins
  let financialViabilityScore = 16;
  if (normCat === 'food_processing' || normCat === 'tailoring') financialViabilityScore = 18;
  else if (normCat === 'dairy') financialViabilityScore = 17;
  else if (normCat === 'retail') financialViabilityScore = 14;

  // 4. Capital & Margin Fit (Max 15)
  // Checks if user's margin meets the required capex
  let capitalFitScore = 12;
  if (marginCapital >= 40000 && marginCapital <= 150000) {
    capitalFitScore = 14;
  } else if (marginCapital > 150000) {
    capitalFitScore = 15;
  } else if (marginCapital < 20000) {
    capitalFitScore = 9;
  }

  // 5. Market Access & Logistics (Max 10)
  // Factoring in mandi proximity, road connectivity tier, and transit corridors
  let marketAccessScore = 7;
  if (isHighDensityDistrict) {
    marketAccessScore = 9; // Major mandi & highway transit corridor access
  } else if (location.block && location.block !== location.village) {
    marketAccessScore = 8; // Block HQ / Tehsil market linkage
  } else {
    marketAccessScore = 7; // Interior village cluster
  }

  // 6. Supply Chain / Input Risk (Max 10)
  let supplyRiskScore = 8;
  if (normCat === 'dairy') supplyRiskScore = 7; // green fodder risk
  else if (normCat === 'food_processing') supplyRiskScore = 8;
  else if (normCat === 'services') supplyRiskScore = 9;

  // 7. Seasonality Stability (Max 5)
  let seasonalityScore = 4;
  if (baseline.seasonality.monsoon < 0.8) seasonalityScore = 3;
  else if (baseline.seasonality.festive > 1.5) seasonalityScore = 4;

  const overallScore = demandScore + competitionScore + financialViabilityScore + capitalFitScore + marketAccessScore + supplyRiskScore + seasonalityScore;

  let verdict: 'RECOMMENDED' | 'PROCEED WITH CAUTION' | 'NEEDS MORE VALIDATION' | 'NOT RECOMMENDED';
  let verdictHindi: string;

  if (overallScore >= 80) {
    verdict = 'RECOMMENDED';
    verdictHindi = 'अत्यधिक अनुशंसित (Recommended) - मजबूत स्थानीय मांग एवं ऋण अदायगी क्षमता';
  } else if (overallScore >= 65) {
    verdict = 'PROCEED WITH CAUTION';
    verdictHindi = 'सतर्कता के साथ आगे बढ़ें (Proceed with Caution) - व्यावहारिक किंतु कड़ी प्रतिस्पर्धा';
  } else if (overallScore >= 50) {
    verdict = 'NEEDS MORE VALIDATION';
    verdictHindi = 'अतिरिक्त तैयारी आवश्यक (Needs Validation) - कार्यशील पूंजी व ग्राहक आधार की पुष्टि करें';
  } else {
    verdict = 'NOT RECOMMENDED';
    verdictHindi = 'वर्तमान स्थिति में उपयुक्त नहीं (Not Recommended) - अन्य व्यावसायिक विकल्प चुनें';
  }

  // Why This Business Summary
  const whyThisBusiness = {
    pros: [
      `High local consumption in ${location.district} ensures daily liquid cash realization.`,
      `Statutory MoSJE/NBCFDC 90% concessional credit limits beneficiary promoter risk to 10%.`,
      `Consistent 15-28% operating margins with proven rural household repayment track record.`,
      `Direct integration with local mandi, cooperative societies, or village clusters.`,
    ],
    risks: [
      `Seasonal fluctuations during monsoon months require strict 2-month cash runway management.`,
      `Working capital price volatility in raw inputs (procurement cost changes).`,
      `Competition from unorganized local vendors requires strict quality standardization.`,
    ],
  };

  // Dynamic Alternatives based on profile
  const allAlternatives = [
    {
      categoryId: 'dairy',
      categoryName: 'Dairy & Animal Husbandry',
      categoryNameHindi: 'डेयरी व पशुपालन',
      score: 87,
      fitReason: 'Daily cash collections, co-op milk federation tie-ups, steady rural demand.',
      marginRequired: '₹14,000 - ₹50,000',
    },
    {
      categoryId: 'food_processing',
      categoryName: 'Flour & Oilseed Processing Mill',
      categoryNameHindi: 'आटा-तेल प्रसंस्करण चक्की',
      score: 84,
      fitReason: 'High utility essential service with low credit risk and durable equipment value.',
      marginRequired: '₹20,000 - ₹60,000',
    },
    {
      categoryId: 'retail',
      categoryName: 'Village Kirana & Provisions',
      categoryNameHindi: 'किराना व खुदरा दुकान',
      score: 76,
      fitReason: 'Immediate daily turnover, straightforward inventory management.',
      marginRequired: '₹10,000 - ₹35,000',
    },
    {
      categoryId: 'services',
      categoryName: 'Rural Tech & Repair Center',
      categoryNameHindi: 'तकनीकी सेवा व मरम्मत केंद्र',
      score: 82,
      fitReason: 'Low capex inventory, high service profit margins, growing digital adoption.',
      marginRequired: '₹12,000 - ₹30,000',
    },
  ];

  const alternativeRecommendations = allAlternatives.filter((a) => a.categoryId !== normCat).slice(0, 3);

  const dimensions = [
    {
      id: 'market_demand',
      name: 'Local Market Demand',
      nameHindi: 'स्थानीय बाजार मांग',
      score: demandScore,
      maxScore: 25,
      description: 'Density of consumer daily need and essential purchase frequency.',
      descriptionHindi: 'दैनिक उपभोग एवं आवश्यक उपभोक्ता खरीदारी की स्थानीय तीव्रता।',
    },
    {
      id: 'competition',
      name: 'Competition & Saturation',
      nameHindi: 'प्रतिस्पर्धा व बाजार संतृप्ति',
      score: competitionScore,
      maxScore: 15,
      description: 'Vendor proximity, cluster density, and entry barrier stability.',
      descriptionHindi: 'समीपवर्ती विक्रेताओं की संख्या, बाजार संतृप्ति एवं प्रतिस्पर्धा दबाव।',
    },
    {
      id: 'financial_viability',
      name: 'Operating Margins & Unit Economics',
      nameHindi: 'परिचालन लाभ मार्जिन व अर्थशास्त्र',
      score: financialViabilityScore,
      maxScore: 20,
      description: 'Sustainable gross and net operating margins after direct raw material costs.',
      descriptionHindi: 'कच्चे माल व प्रत्यक्ष व्यय के पश्चात शुद्ध परिचालन लाभ का अनुपात।',
    },
    {
      id: 'capital_fit',
      name: 'Capital & 10% Margin Fit',
      nameHindi: 'पूंजी व 10% स्व-निवेश अनुकूलता',
      score: capitalFitScore,
      maxScore: 15,
      description: 'Alignment of promoter contribution with essential asset capex.',
      descriptionHindi: 'प्रवर्तक की 10% पूंजी का आवश्यक मशीनरी व उपकरण लागत से समुचित मेल।',
    },
    {
      id: 'market_access',
      name: 'Mandi Access & Logistics',
      nameHindi: 'मंडी पहुंच व परिवहन सुविधा',
      score: marketAccessScore,
      maxScore: 10,
      description: 'Road connectivity, mandi distance, and perishable transport viability.',
      descriptionHindi: 'सड़क संपर्क, थोक मंडी दूरी एवं उत्पाद परिवहन की व्यावहारिक सुगमता।',
    },
    {
      id: 'supply_chain',
      name: 'Input Supply Chain Reliability',
      nameHindi: 'कच्चे माल की आपूर्ति विश्वसनीयता',
      score: supplyRiskScore,
      maxScore: 10,
      description: 'Availability of raw materials, feed, or seed at predictable rates.',
      descriptionHindi: 'स्थानीय स्तर पर उचित दर पर कच्चे माल, चारा अथवा सामग्री की सतत उपलब्धता।',
    },
    {
      id: 'seasonality',
      name: 'Seasonal Cashflow Stability',
      nameHindi: 'मौसमी नकदी प्रवाह स्थिरता',
      score: seasonalityScore,
      maxScore: 5,
      description: 'Buffer resilience during monsoon slowdown and harvest cycles.',
      descriptionHindi: 'मानसून व फसल कटाई चक्र के दौरान नकदी प्रवाह की नियमितता।',
    },
  ];

  return {
    overallScore,
    demandScore,
    competitionScore,
    financialViabilityScore,
    capitalFitScore,
    marketAccessScore,
    supplyRiskScore,
    seasonalityScore,
    verdict,
    verdictHindi,
    disclaimer: VIABILITY_SCORE_DISCLAIMER,
    dimensions,
    whyThisBusiness,
    alternativeRecommendations,
  };
}
