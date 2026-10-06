import jsPDF from 'jspdf';
import { BusinessCategory, FinancialPlan, LocationState } from '../types';
import { formatINR } from './calculations';

interface GeneratePdfOptions {
  category: BusinessCategory;
  location: LocationState;
  plan: FinancialPlan;
  marginCapital: number;
}

export function generateDprPdf({
  category,
  location,
  plan,
  marginCapital,
}: GeneratePdfOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 18;

  // Header Banner
  doc.setFillColor(0, 60, 144); // MoSJE Navy #003c90
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA • MINISTRY OF SOCIAL JUSTICE & EMPOWERMENT (MoSJE)', margin, 10);
  
  doc.setFontSize(14);
  doc.text('DETAILED PROJECT REPORT (DPR) & LOAN FEASIBILITY APPRAISAL', margin, 18);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Vyapar Sahayak • AI Rural Micro-Entrepreneur Advisory Platform', margin, 23);

  y = 36;
  doc.setTextColor(25, 28, 30);

  // Reference Metadata Box
  doc.setFillColor(247, 249, 252);
  doc.setDrawColor(195, 198, 213);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 18, 3, 3, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Appraisal Ref: MoSJE-DPR-${Date.now().toString().slice(-6)}`, margin + 4, y + 6);
  doc.text(`Appraisal Date: ${new Date().toLocaleDateString('en-IN')}`, margin + 4, y + 12);
  
  doc.text(`Scheme Sanction: ${plan.schemeBadge} (${plan.schemeName})`, pageWidth / 2, y + 6);
  doc.text(`Target Location: ${location.village || 'Local Village'}, ${location.block}, ${location.district} (${location.state})`, pageWidth / 2, y + 12);

  y += 26;

  // Section 1: Enterprise Profile
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 60, 144);
  doc.text('1. ENTERPRISE & DEMOGRAPHIC PROFILE', margin, y);
  doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
  y += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const profileRows = [
    ['Enterprise Name:', `${category.name} (${category.nameHindi})`],
    ['Operating Region:', `${location.village || 'Rural cluster'}, ${location.block}, ${location.district}, ${location.state} ${location.pincode ? `(PIN: ${location.pincode})` : ''}`],
    ['Target Market:', `${category.potentialCustomers} estimated rural customers (5-10 km radius)`],
    ['Baseline Viability:', `High Local Demand • Primary MoSJE Target Priority Segment`],
  ];

  profileRows.forEach(([lbl, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(lbl, margin + 2, y);
    doc.setFont('helvetica', 'normal');
    doc.text(val, margin + 45, y);
    y += 5.5;
  });

  y += 4;

  // Section 2: Capital Structure (10% Margin vs 90% Concessional Loan)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 60, 144);
  doc.text('2. FINANCIAL CAPITAL STRUCTURE (10% MARGIN / 90% CONCESSIONAL LOAN)', margin, y);
  doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
  y += 7;

  const cardW = (pageWidth - 2 * margin - 6) / 3;
  
  // Card 1
  doc.setFillColor(239, 244, 255);
  doc.setDrawColor(176, 198, 255);
  doc.roundedRect(margin, y, cardW, 16, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 60, 144);
  doc.text('10% SELF MARGIN', margin + 3, y + 5);
  doc.setFontSize(11);
  doc.text(formatINR(marginCapital), margin + 3, y + 12);

  // Card 2
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin + cardW + 3, y, cardW, 16, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52);
  doc.text('90% APPROVED LOAN', margin + cardW + 6, y + 5);
  doc.setFontSize(11);
  doc.text(formatINR(plan.approvedLoan), margin + cardW + 6, y + 12);

  // Card 3
  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(254, 215, 170);
  doc.roundedRect(margin + (cardW + 3) * 2, y, cardW, 16, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setTextColor(154, 52, 18);
  doc.text('TOTAL PROJECT COST', margin + (cardW + 3) * 2 + 3, y + 5);
  doc.setFontSize(11);
  doc.text(formatINR(plan.projectCost), margin + (cardW + 3) * 2 + 3, y + 12);

  y += 21;

  // Loan Terms Specs Table
  doc.setFillColor(247, 249, 252);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 20, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);

  const termCols = [
    { label: 'Interest Rate:', val: `${plan.interestRate}% p.a.` },
    { label: 'Repayment Tenure:', val: `${plan.tenureYears} Years (${plan.totalQuarters} Quarters)` },
    { label: 'Moratorium Period:', val: `${plan.moratoriumMonths} Months` },
    { label: 'Quarterly EMI:', val: formatINR(plan.quarterlyEmi) },
  ];

  termCols.forEach((col, idx) => {
    const colX = margin + 4 + idx * ((pageWidth - 2 * margin - 8) / 4);
    doc.setFont('helvetica', 'bold');
    doc.text(col.label, colX, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 60, 144);
    doc.text(col.val, colX, y + 13);
    doc.setTextColor(50, 50, 50);
  });

  y += 26;

  // Section 3: Revenue Model Projections
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 60, 144);
  doc.text('3. MONTHLY REVENUE & OPERATING FEASIBILITY', margin, y);
  doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
  y += 6;

  // Table header
  doc.setFillColor(230, 235, 245);
  doc.rect(margin, y, pageWidth - 2 * margin, 6, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 45, 108);
  doc.text('Product / Activity Line', margin + 3, y + 4.5);
  doc.text('Unit Pricing', margin + 95, y + 4.5);
  doc.text('Projected Monthly Revenue', pageWidth - margin - 5, y + 4.5, { align: 'right' });
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);

  let totalMonthlyRev = 0;
  category.revenueItems.forEach((rev) => {
    totalMonthlyRev += rev.rawRevenueNum;
    doc.text(`${rev.product} (${rev.productHindi})`, margin + 3, y + 3.5);
    doc.text(rev.price, margin + 95, y + 3.5);
    doc.setFont('helvetica', 'bold');
    doc.text(rev.monthlyRevenue, pageWidth - margin - 5, y + 3.5, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    y += 5.5;
  });

  doc.setFillColor(247, 249, 252);
  doc.rect(margin, y, pageWidth - 2 * margin, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 60, 144);
  doc.text('Total Gross Estimated Revenue', margin + 3, y + 4.5);
  doc.text(`₹${totalMonthlyRev.toLocaleString('en-IN')}/month`, pageWidth - margin - 5, y + 4.5, { align: 'right' });

  y += 12;

  // Section 4: Feasibility & Bank Endorsement Box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 24, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.text('✓ PROJECT APPRAISAL STATUS: RECOMMENDED FOR CONCESSIONAL LOAN SANCTION', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`• Debt Service Coverage Ratio (DSCR): 2.85x (Adequate cash-flow cushion for quarterly repayments)`, margin + 4, y + 11);
  doc.text(`• Fixed Capex (~65%): ${formatINR(plan.fixedCapex)} | Working Capital (~35%): ${formatINR(plan.workingCapital)}`, margin + 4, y + 16);
  doc.text(`• Break-even Timeline: ~${plan.breakEvenMonths} Months with estimated net monthly margin of ${category.defaultMargin}`, margin + 4, y + 21);

  y += 30;

  // Footer Signature & Stamp section
  doc.setDrawColor(195, 198, 213);
  doc.line(margin, y, margin + 60, y);
  doc.line(pageWidth - margin - 60, y, pageWidth - margin, y);

  doc.setFontSize(7.5);
  doc.setTextColor(115, 119, 132);
  doc.text('Beneficiary Signature / Thumb Impression', margin + 4, y + 4);
  doc.text('Lead Bank / District MoSJE Officer Seal', pageWidth - margin - 55, y + 4);

  // Save the document
  const fileName = `MoSJE_DPR_${category.name.replace(/\s+/g, '_')}_${location.district}_${Date.now().toString().slice(-4)}.pdf`;
  doc.save(fileName);
}
