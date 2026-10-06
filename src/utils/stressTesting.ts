import { StressScenarioResult, StressRiskLevel, BusinessEconomicsModel } from '../types';

/**
 * REPAYMENT SENSITIVITY & STRESS TESTING ENGINE
 * 
 * Simulates adverse economic conditions (demand shocks, raw material spikes, rural price deflation)
 * to evaluate whether the beneficiary can service their MoSJE/NBCFDC quarterly loan obligation.
 * 
 * Statutory Disclaimer: "Advisory simulation for planning purposes only, not an official bank appraisal decision."
 */

export const STRESS_DISCLAIMER = 'Advisory simulation for planning purposes only, not an official bank appraisal decision. / यह केवल योजना निर्माण हेतु संवेदनशीलता विश्लेषण है, बैंक का आधिकारिक ऋण निर्णय नहीं।';

export function runStressScenarios(
  economics: BusinessEconomicsModel,
  quarterlyDebtService: number
): StressScenarioResult[] {
  const monthlyDebtService = Math.round(quarterlyDebtService / 3);

  const scenarioConfigs = [
    {
      id: 'base_case',
      scenarioName: 'Base Case (Standard Rural Outlook)',
      scenarioNameHindi: 'सामान्य परिदृश्य (मानक ग्रामीण मांग)',
      description: 'Business operates under standard market conditions with expected seasonal demand and current input prices.',
      revenueChangePct: 0,
      costChangePct: 0,
      priceChangePct: 0,
    },
    {
      id: 'mild_demand_shock',
      scenarioName: 'Mild Demand Shock (-10% Volume)',
      scenarioNameHindi: 'हल्की मांग गिरावट (-10% बिक्री)',
      description: 'Local market experiences short-term slowdown or increased village competitor presence.',
      revenueChangePct: -10,
      costChangePct: 0,
      priceChangePct: 0,
    },
    {
      id: 'moderate_inflation_shock',
      scenarioName: 'Disruption (-20% Volume, +10% Costs)',
      scenarioNameHindi: 'मध्यम दबाव (-20% बिक्री, +10% इनपुट लागत)',
      description: 'Raw material procurement costs rise due to supply constraints while village consumer spending tightens.',
      revenueChangePct: -20,
      costChangePct: 10,
      priceChangePct: 0,
    },
    {
      id: 'severe_stress',
      scenarioName: 'Severe Drought / Crisis (-30% Volume, +20% Costs)',
      scenarioNameHindi: 'गंभीर तनाव (-30% बिक्री, +20% इनपुट लागत)',
      description: 'Extreme seasonal disruption (drought/unseasonal rain) causing sharp decline in purchasing power and input price surge.',
      revenueChangePct: -30,
      costChangePct: 20,
      priceChangePct: -10,
    },
  ];

  return scenarioConfigs.map((config) => {
    // Adjusted revenue
    const effectiveUnits = economics.expectedMonthlyUnitsSold * (1 + config.revenueChangePct / 100);
    const effectivePrice = economics.unitSellingPrice * (1 + config.priceChangePct / 100);
    const projectedRevenue = Math.round(effectiveUnits * effectivePrice);

    // Adjusted costs
    const effectiveVariableCostPerUnit = economics.variableCostPerUnit * (1 + config.costChangePct / 100);
    const projectedCOGS = Math.round(effectiveUnits * effectiveVariableCostPerUnit);
    const projectedGrossProfit = Math.max(0, projectedRevenue - projectedCOGS);

    // Operating expenses (fixed costs rise slightly in inflation)
    const projectedFixedCosts = Math.round(economics.monthlyFixedCosts * (1 + (config.costChangePct * 0.3) / 100));
    const projectedOperatingProfit = projectedGrossProfit - projectedFixedCosts;

    // Projected net cash flow after debt service
    const projectedCashFlow = projectedOperatingProfit - monthlyDebtService;

    // DSCR = Operating Profit / Debt Service
    let dscr = 0;
    if (monthlyDebtService > 0) {
      dscr = parseFloat((Math.max(0, projectedOperatingProfit) / monthlyDebtService).toFixed(2));
    } else {
      dscr = 5.0;
    }

    // Determine Risk Level & Recommendation
    let riskLevel: StressRiskLevel;
    let riskVerdictHindi: string;
    let actionableRecommendation: string;

    if (dscr >= 1.75) {
      riskLevel = 'COMFORTABLE';
      riskVerdictHindi = 'सुरक्षित (Comfortable): ऋण अदायगी में कोई जोखिम नहीं';
      actionableRecommendation = 'Strong repayment buffer. Recommend maintaining standard 2-month cash buffer in bank account.';
    } else if (dscr >= 1.30) {
      riskLevel = 'WATCH';
      riskVerdictHindi = 'निगरानी योग्य (Watch): किश्त सुरक्षित है परंतु बचत कम होगी';
      actionableRecommendation = 'Viable but tight. Keep personal drawings low and focus on prompt customer receivables.';
    } else if (dscr >= 1.00) {
      riskLevel = 'STRESSED';
      riskVerdictHindi = 'तनावग्रस्त (Stressed): लाभ लगभग किश्त के बराबर, आपात फंड आवश्यक';
      actionableRecommendation = 'Stressed repayment. Beneficiary should negotiate 30-day supplier credit and prioritize loan installment.';
    } else {
      riskLevel = 'UNSUSTAINABLE';
      riskVerdictHindi = 'अस्थिर (Unsustainable): घाटे का जोखिम, अतिरिक्त मार्जिन या पुनर्गठन आवश्यक';
      actionableRecommendation = 'High default risk under severe shock. Consider lower initial scale or pooling group SHG resources.';
    }

    return {
      id: config.id,
      scenarioId: config.id,
      scenarioName: config.scenarioName,
      scenarioNameHindi: config.scenarioNameHindi,
      description: config.description,
      revenueChangePct: config.revenueChangePct,
      costChangePct: config.costChangePct,
      priceChangePct: config.priceChangePct,
      projectedRevenue,
      projectedMonthlyRevenue: projectedRevenue,
      projectedOperatingProfit,
      projectedCashFlow,
      projectedMonthlyNetProfit: projectedCashFlow,
      quarterlyDebtService,
      monthlyDebtService,
      dscr,
      canServiceDebt: dscr >= 1.0 && projectedCashFlow >= 0,
      riskLevel,
      riskVerdictHindi,
      actionableRecommendation,
    };
  });
}
