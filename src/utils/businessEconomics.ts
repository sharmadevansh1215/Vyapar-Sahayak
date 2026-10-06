import { BusinessEconomicsModel } from '../types';

/**
 * AUTHORITATIVE BUSINESS ECONOMICS ENGINE
 * Grounded in empirical Indian rural market economics, MSME cluster benchmarks,
 * and realistic unit economics (COGS, Contribution Margin, Break-even, Cash Runway, DSCR).
 */

export interface BusinessBaselineConfig {
  categoryId: string;
  categoryName: string;
  categoryNameHindi: string;
  capexRatio: number; // e.g. 0.65
  unitName: string;
  defaultUnitSellingPrice: number;
  variableCostRatio: number; // Variable cost as % of selling price
  baseMonthlyUnitsSold: number;
  rawMaterialsPctOfOpex: number;
  labourPctOfOpex: number;
  rentPctOfOpex: number;
  utilitiesPctOfOpex: number;
  transportPctOfOpex: number;
  packagingPctOfOpex: number;
  maintenancePctOfOpex: number;
  marketingPctOfOpex: number;
  seasonality: {
    normal: number;
    festive: number;
    harvest: number;
    monsoon: number;
  };
}

export const BUSINESS_BASELINES: Record<string, BusinessBaselineConfig> = {
  dairy: {
    categoryId: 'dairy',
    categoryName: 'Dairy & Livestock Farming',
    categoryNameHindi: 'डेयरी व पशुपालन उद्यम',
    capexRatio: 0.65, // Cattle, milking machines, chilling can
    unitName: 'Litre Milk / Value Products',
    defaultUnitSellingPrice: 58, // ₹58 per litre average realization
    variableCostRatio: 0.62, // Fodder, cattle feed, minerals
    baseMonthlyUnitsSold: 2800, // ~90-100 litres/day
    rawMaterialsPctOfOpex: 0.52, // Fodder & concentrates
    labourPctOfOpex: 0.18,
    rentPctOfOpex: 0.08,
    utilitiesPctOfOpex: 0.09, // Water, electricity
    transportPctOfOpex: 0.05,
    packagingPctOfOpex: 0.03,
    maintenancePctOfOpex: 0.03,
    marketingPctOfOpex: 0.02,
    seasonality: { normal: 1.0, festive: 1.25, harvest: 1.1, monsoon: 0.9 },
  },
  retail: {
    categoryId: 'retail',
    categoryName: 'Village Kirana & Provisions',
    categoryNameHindi: 'ग्रामीण किराना व खुदरा दुकान',
    capexRatio: 0.45, // Racks, deep freezer, counter, weighing scale
    unitName: 'Average Grocery Basket',
    defaultUnitSellingPrice: 420,
    variableCostRatio: 0.78, // Wholesale procurement cost
    baseMonthlyUnitsSold: 380,
    rawMaterialsPctOfOpex: 0.68, // FMCG wholesale stock replenishment
    labourPctOfOpex: 0.12,
    rentPctOfOpex: 0.08,
    utilitiesPctOfOpex: 0.04,
    transportPctOfOpex: 0.03,
    packagingPctOfOpex: 0.02,
    maintenancePctOfOpex: 0.02,
    marketingPctOfOpex: 0.01,
    seasonality: { normal: 1.0, festive: 1.45, harvest: 1.3, monsoon: 0.85 },
  },
  textiles: {
    categoryId: 'textiles',
    categoryName: 'Handloom & Textile Trading',
    categoryNameHindi: 'हथकरघा एवं वस्त्र व्यापार',
    capexRatio: 0.55, // Loom, fabric display, storage
    unitName: 'Handcrafted Garment / Saree',
    defaultUnitSellingPrice: 950,
    variableCostRatio: 0.58, // Yarn, dye, embroidery work
    baseMonthlyUnitsSold: 140,
    rawMaterialsPctOfOpex: 0.48,
    labourPctOfOpex: 0.22,
    rentPctOfOpex: 0.09,
    utilitiesPctOfOpex: 0.04,
    transportPctOfOpex: 0.06,
    packagingPctOfOpex: 0.04,
    maintenancePctOfOpex: 0.04,
    marketingPctOfOpex: 0.03,
    seasonality: { normal: 1.0, festive: 1.6, harvest: 1.2, monsoon: 0.75 },
  },
  tailoring: {
    categoryId: 'tailoring',
    categoryName: 'Tailoring & Boutique Unit',
    categoryNameHindi: 'सिलाई व लेडीज बुटीक इकाई',
    capexRatio: 0.40, // Electric sewing machines, interlock, cutting table
    unitName: 'Stitched Apparel Unit',
    defaultUnitSellingPrice: 380,
    variableCostRatio: 0.28, // Thread, buttons, zip, canvas
    baseMonthlyUnitsSold: 260,
    rawMaterialsPctOfOpex: 0.20,
    labourPctOfOpex: 0.45, // High labor service component
    rentPctOfOpex: 0.14,
    utilitiesPctOfOpex: 0.08,
    transportPctOfOpex: 0.03,
    packagingPctOfOpex: 0.03,
    maintenancePctOfOpex: 0.04,
    marketingPctOfOpex: 0.03,
    seasonality: { normal: 1.0, festive: 1.7, harvest: 1.15, monsoon: 0.8 },
  },
  food_processing: {
    categoryId: 'food_processing',
    categoryName: 'Agro-Processing & Flour/Oil Mill',
    categoryNameHindi: 'खाद्य प्रसंस्करण व तेल-आटा चक्की',
    capexRatio: 0.70, // Oil expeller, chakki, pulverizer, 3-phase motor
    unitName: 'Processed Unit (Kg / Tin)',
    defaultUnitSellingPrice: 185,
    variableCostRatio: 0.65, // Raw mustard seeds, wheat grain
    baseMonthlyUnitsSold: 950,
    rawMaterialsPctOfOpex: 0.55,
    labourPctOfOpex: 0.16,
    rentPctOfOpex: 0.07,
    utilitiesPctOfOpex: 0.12, // High electricity consumption
    transportPctOfOpex: 0.04,
    packagingPctOfOpex: 0.03,
    maintenancePctOfOpex: 0.02,
    marketingPctOfOpex: 0.01,
    seasonality: { normal: 1.0, festive: 1.2, harvest: 1.4, monsoon: 0.9 },
  },
  agri_machinery: {
    categoryId: 'agri_machinery',
    categoryName: 'Custom Hiring & Farm Equipment',
    categoryNameHindi: 'कृषि उपकरण व कस्टम हायरिंग',
    capexRatio: 0.78, // Rotavator, thresher, solar pump set, kisan drone
    unitName: 'Machine Operating Hour / Acre',
    defaultUnitSellingPrice: 850,
    variableCostRatio: 0.38, // Diesel, operator wages, grease
    baseMonthlyUnitsSold: 120,
    rawMaterialsPctOfOpex: 0.15, // Lubricants, spares
    labourPctOfOpex: 0.28, // Machine operator salary
    rentPctOfOpex: 0.06,
    utilitiesPctOfOpex: 0.22, // Fuel / diesel
    transportPctOfOpex: 0.08,
    packagingPctOfOpex: 0.01,
    maintenancePctOfOpex: 0.16, // High machine maintenance
    marketingPctOfOpex: 0.04,
    seasonality: { normal: 0.8, festive: 0.9, harvest: 1.7, monsoon: 0.6 },
  },
  handicrafts: {
    categoryId: 'handicrafts',
    categoryName: 'Artisan Handicrafts & Pottery',
    categoryNameHindi: 'हस्तशिल्प व ग्रामीण कारीगरी',
    capexRatio: 0.35, // Kiln, clay mixer, carving tools
    unitName: 'Craft / Decor Unit',
    defaultUnitSellingPrice: 450,
    variableCostRatio: 0.35, // Clay, brass, colors, glaze
    baseMonthlyUnitsSold: 210,
    rawMaterialsPctOfOpex: 0.30,
    labourPctOfOpex: 0.38,
    rentPctOfOpex: 0.09,
    utilitiesPctOfOpex: 0.08,
    transportPctOfOpex: 0.06,
    packagingPctOfOpex: 0.04,
    maintenancePctOfOpex: 0.03,
    marketingPctOfOpex: 0.02,
    seasonality: { normal: 0.9, festive: 1.8, harvest: 1.1, monsoon: 0.6 },
  },
  services: {
    categoryId: 'services',
    categoryName: 'Rural Repair & CSC Service Center',
    categoryNameHindi: 'मरम्मत व ग्राहक सेवा केंद्र',
    capexRatio: 0.40, // Testing kit, laptop, biometric scanner, inverter
    unitName: 'Service Order / Transaction',
    defaultUnitSellingPrice: 220,
    variableCostRatio: 0.22, // Spare components, paper, consumables
    baseMonthlyUnitsSold: 420,
    rawMaterialsPctOfOpex: 0.18,
    labourPctOfOpex: 0.42,
    rentPctOfOpex: 0.14,
    utilitiesPctOfOpex: 0.12,
    transportPctOfOpex: 0.04,
    packagingPctOfOpex: 0.02,
    maintenancePctOfOpex: 0.04,
    marketingPctOfOpex: 0.04,
    seasonality: { normal: 1.0, festive: 1.25, harvest: 1.3, monsoon: 0.9 },
  },
};

/**
 * Calculate full business economics grounded in project cost scale and industry ratios
 */
export function calculateBusinessEconomics(
  categoryId: string,
  projectCost: number,
  monthlyDebtService: number = 0
): BusinessEconomicsModel {
  const normId = categoryId.toLowerCase();
  const baseline = BUSINESS_BASELINES[normId] || BUSINESS_BASELINES.dairy;

  // Scale factor based on project cost
  const scaleRatio = Math.max(0.4, projectCost / 140000);

  // Capex Allocation
  const capexRatio = baseline.capexRatio;
  const totalFixedCapex = Math.round(projectCost * capexRatio);
  const equipmentCapex = Math.round(totalFixedCapex * 0.75);
  const civilOrShelterCapex = Math.round(totalFixedCapex * 0.15);
  const initialStockCapex = Math.round(totalFixedCapex * 0.10);

  // Total Working Capital Buffer from Project Cost
  const workingCapitalRequirement = Math.round(projectCost * (1 - capexRatio));

  // Unit Economics
  const unitSellingPrice = baseline.defaultUnitSellingPrice;
  const variableCostPerUnit = Math.round(unitSellingPrice * baseline.variableCostRatio);
  const contributionMarginPerUnit = unitSellingPrice - variableCostPerUnit;

  // Monthly Units Sold scaled with capacity
  const expectedMonthlyUnitsSold = Math.round(baseline.baseMonthlyUnitsSold * Math.sqrt(scaleRatio));

  // Monthly Revenue = Units * Price
  const monthlyRevenue = Math.round(expectedMonthlyUnitsSold * unitSellingPrice);

  // Operational Expenditure
  // Monthly OPEX scales with revenue and variable economics
  const rawMaterialsMonthly = Math.round(expectedMonthlyUnitsSold * variableCostPerUnit * 0.75);
  const packagingMonthly = Math.round(expectedMonthlyUnitsSold * variableCostPerUnit * 0.12);
  const transportationMonthly = Math.round(expectedMonthlyUnitsSold * variableCostPerUnit * 0.13);
  const monthlyCOGS = rawMaterialsMonthly + packagingMonthly + transportationMonthly;

  // Monthly Fixed Operating Costs
  const labourMonthly = Math.round(monthlyRevenue * baseline.labourPctOfOpex * 0.85);
  const rentMonthly = Math.round(monthlyRevenue * baseline.rentPctOfOpex * 0.85);
  const utilitiesMonthly = Math.round(monthlyRevenue * baseline.utilitiesPctOfOpex * 0.9);
  const maintenanceMonthly = Math.round(totalFixedCapex * 0.015);
  const marketingMonthly = Math.round(monthlyRevenue * 0.02);

  const monthlyFixedCosts = labourMonthly + rentMonthly + utilitiesMonthly + maintenanceMonthly + marketingMonthly;
  const totalMonthlyOpex = monthlyCOGS + monthlyFixedCosts;

  // Profitability Metrics
  const monthlyGrossProfit = Math.max(0, monthlyRevenue - monthlyCOGS);
  const grossMarginPct = monthlyRevenue > 0 ? Math.round((monthlyGrossProfit / monthlyRevenue) * 100) : 0;
  const monthlyOperatingProfit = Math.max(0, monthlyGrossProfit - monthlyFixedCosts);
  const operatingMarginPct = monthlyRevenue > 0 ? Math.round((monthlyOperatingProfit / monthlyRevenue) * 100) : 0;

  // Net Cash Flow after Debt Service
  const monthlyNetCashFlow = Math.max(0, monthlyOperatingProfit - monthlyDebtService);

  // Break-even Calculations
  const breakEvenUnits = contributionMarginPerUnit > 0
    ? Math.ceil((monthlyFixedCosts + monthlyDebtService) / contributionMarginPerUnit)
    : 0;
  const breakEvenRevenue = Math.round(breakEvenUnits * unitSellingPrice);

  // Estimated Months to Break-Even based on rural adoption curve
  const capacityUtilizationMonth1 = 0.50;
  const monthlyGrowthRate = 0.15;
  let runningMonth = 1;
  let currentMonthSales = expectedMonthlyUnitsSold * capacityUtilizationMonth1;
  while (runningMonth <= 12 && currentMonthSales < breakEvenUnits) {
    currentMonthSales += expectedMonthlyUnitsSold * monthlyGrowthRate;
    runningMonth++;
  }
  const estimatedMonthsToBreakEven = Math.min(Math.max(runningMonth, 3), 9);

  // Cash Burn & Runway
  const monthlyBurnRate = monthlyFixedCosts + monthlyDebtService;
  const cashRunwayMonths = monthlyBurnRate > 0
    ? parseFloat((workingCapitalRequirement / monthlyBurnRate).toFixed(1))
    : 4.0;

  let runwayAssessment: 'Strong' | 'Adequate' | 'Low' | 'Critical';
  if (cashRunwayMonths >= 4.0) runwayAssessment = 'Strong';
  else if (cashRunwayMonths >= 2.5) runwayAssessment = 'Adequate';
  else if (cashRunwayMonths >= 1.5) runwayAssessment = 'Low';
  else runwayAssessment = 'Critical';

  // Debt Service Coverage Ratio (DSCR)
  const dscr = monthlyDebtService > 0
    ? parseFloat((monthlyOperatingProfit / monthlyDebtService).toFixed(2))
    : 3.5;

  const itemizedCosts = [
    { name: 'Equipment & Machinery (Capex)', nameHindi: 'उपकरण व मशीनरी (पूंजीगत खर्च)', amount: equipmentCapex, category: 'CAPEX' as const },
    { name: 'Civil Works / Shed / Counter', nameHindi: 'शेड / दुकान निर्माण व काउंटर', amount: civilOrShelterCapex, category: 'CAPEX' as const },
    { name: 'Initial Raw Stock / Consumables', nameHindi: 'प्रारंभिक कच्चा माल / स्टॉक', amount: initialStockCapex, category: 'CAPEX' as const },
    { name: 'Raw Material Replenishment (Monthly)', nameHindi: 'कच्चा माल मासिक खरीद', amount: rawMaterialsMonthly, category: 'OPEX_VARIABLE' as const },
    { name: 'Labour & Assistant Wages', nameHindi: 'कर्मचारी वेतन व मानदेय', amount: labourMonthly, category: 'OPEX_FIXED' as const },
    { name: 'Shop / Facility Rent', nameHindi: 'दुकान / शेड किराया', amount: rentMonthly, category: 'OPEX_FIXED' as const },
    { name: 'Electricity & Water Utilities', nameHindi: 'बिजली व जल आपूर्ति खर्च', amount: utilitiesMonthly, category: 'OPEX_FIXED' as const },
    { name: 'Packaging & Distribution', nameHindi: 'पैकेजिंग व ढुलाई व्यय', amount: packagingMonthly + transportationMonthly, category: 'OPEX_VARIABLE' as const },
    { name: 'Equipment Maintenance Reserve', nameHindi: 'मशीन मरम्मत व रखरखाव फंड', amount: maintenanceMonthly, category: 'OPEX_FIXED' as const },
  ];

  return {
    categoryId: baseline.categoryId,
    categoryName: baseline.categoryName,
    categoryNameHindi: baseline.categoryNameHindi,
    equipmentCapex,
    civilOrShelterCapex,
    initialStockCapex,
    totalFixedCapex,
    rawMaterialsMonthly,
    labourMonthly,
    rentMonthly,
    utilitiesMonthly,
    transportationMonthly,
    packagingMonthly,
    maintenanceMonthly,
    marketingMonthly,
    totalMonthlyOpex,
    unitSellingPrice,
    variableCostPerUnit,
    contributionMarginPerUnit,
    expectedMonthlyUnitsSold,
    monthlyRevenue,
    monthlyCOGS,
    monthlyGrossProfit,
    grossMarginPct,
    monthlyOperatingProfit,
    operatingMarginPct,
    monthlyDebtService,
    monthlyNetCashFlow,
    monthlyFixedCosts,
    breakEvenUnits,
    breakEvenMonthlyUnits: breakEvenUnits,
    breakEvenRevenue,
    unitPrice: unitSellingPrice,
    estimatedMonthsToBreakEven,
    workingCapitalRequirement,
    monthlyBurnRate,
    cashRunwayMonths,
    runwayAssessment,
    debtServiceCoverageRatio: dscr,
    seasonality: baseline.seasonality,
    itemizedCosts,
  };
}

/**
 * Universal builder function compatible with (categoryId, marginCapital, location, monthlyDebtService)
 */
export function buildBusinessEconomicsModel(
  categoryId: string,
  marginCapitalOrProjectCost: number,
  locationOrMonthlyDebt?: any,
  monthlyDebtService?: number
): BusinessEconomicsModel {
  // If marginCapital is passed (typically between 5,000 and 500,000 for MoSJE margin)
  // Convert 10% margin to 100% project cost unless already scaled
  let projectCost = marginCapitalOrProjectCost;
  if (marginCapitalOrProjectCost > 0 && marginCapitalOrProjectCost <= 500000) {
    projectCost = Math.round(marginCapitalOrProjectCost / 0.1);
  }
  const debtService = typeof locationOrMonthlyDebt === 'number'
    ? locationOrMonthlyDebt
    : (typeof monthlyDebtService === 'number' ? monthlyDebtService : 0);
  return calculateBusinessEconomics(categoryId, projectCost, debtService);
}

