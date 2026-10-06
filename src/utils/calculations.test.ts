import { describe, it, expect } from 'vitest';
import { calculateFinancialPlan, formatINR, formatNumberWithCommas } from './calculations';

describe('calculateFinancialPlan', () => {
  it('should clamp margin capital minimum at ₹5,000 and calculate plan', () => {
    const lowPlan = calculateFinancialPlan(2000);
    expect(lowPlan.marginCapital).toBe(5000);
    expect(lowPlan.projectCost).toBe(50000);
    expect(lowPlan.approvedLoan).toBe(45000);
  });

  it('enforces statutory project cost cap of ₹50,00,000 and loan cap of ₹45,00,000 for high margin', () => {
    const highPlan = calculateFinancialPlan(600000); // Theoretical 60 Lakhs
    expect(highPlan.isProjectCostCapped).toBe(true);
    expect(highPlan.originalTheoreticalProjectCost).toBe(6000000);
    expect(highPlan.projectCost).toBe(5000000);
    expect(highPlan.approvedLoan).toBe(4500000);
    expect(highPlan.cappingReason).toBeDefined();
  });

  it('routes to Micro Finance Scheme when project cost <= ₹1,40,000 and enforces ₹1,25,000 loan cap (NOT ₹1,26,000)', () => {
    const plan = calculateFinancialPlan(14000); // Theoretical 1,40,000
    expect(plan.projectCost).toBe(140000);
    // Statutory rule: 1,40,000 * 0.90 = 1,26,000, but capped at 1,25,000!
    expect(plan.approvedLoan).toBe(125000);
    expect(plan.schemeType).toBe('micro_finance');
    expect(plan.interestRate).toBe(6.5);
    expect(plan.tenureYears).toBe(3);
    expect(plan.totalQuarters).toBe(12);
    expect(plan.moratoriumMonths).toBe(3);
    expect(plan.moratoriumQuarters).toBe(1);
    expect(plan.repaymentQuarters).toBe(11);
    expect(plan.schemeBadge).toContain('Micro Finance');
  });

  it('routes to Term Loan Scheme when project cost > ₹1,40,000 (margin > ₹14,000)', () => {
    const plan = calculateFinancialPlan(50000);
    expect(plan.projectCost).toBe(500000);
    expect(plan.approvedLoan).toBe(450000);
    expect(plan.schemeType).toBe('term_loan');
    expect(plan.interestRate).toBe(8.0);
    expect(plan.tenureYears).toBe(7);
    expect(plan.totalQuarters).toBe(28);
    expect(plan.moratoriumMonths).toBe(6);
    expect(plan.moratoriumQuarters).toBe(2);
    expect(plan.repaymentQuarters).toBe(26);
    expect(plan.schemeBadge).toContain('Term Loan');
  });

  it('generates a full repayment schedule with accurate moratorium quarters and zeroes balance at end', () => {
    const plan = calculateFinancialPlan(14000);
    expect(plan.repaymentSchedule.length).toBe(12);

    // Quarter 1 must be Moratorium
    expect(plan.repaymentSchedule[0].isMoratorium).toBe(true);
    expect(Number(plan.repaymentSchedule[0].principal)).toBe(0);

    // Quarter 2 onwards must be Repayment
    expect(plan.repaymentSchedule[1].isMoratorium).toBe(false);

    // Final Quarter balance must zero out (exact reconciliation)
    const lastQuarter = plan.repaymentSchedule[plan.repaymentSchedule.length - 1];
    expect(lastQuarter.balance).toBe('0');
  });

  it('correctly splits fixed Capex (~65%) and Working Capital (~35%)', () => {
    const plan = calculateFinancialPlan(50000);
    expect(plan.fixedCapex).toBe(Math.round(500000 * 0.65));
    expect(plan.workingCapital).toBe(Math.round(500000 * 0.35));
    expect(plan.fixedCapex + plan.workingCapital).toBe(plan.projectCost);
  });

  it('properly labels interest saving vs benchmark with disclaimer', () => {
    const plan = calculateFinancialPlan(14000);
    expect(plan.benchmarkInterestSaving).toBeGreaterThan(0);
    expect(plan.benchmarkDisclaimer).toContain('illustrative comparison');
    expect(plan.quarterlyInstallmentLabel).toContain('Quarterly Installment');
  });

  it('formats INR numbers correctly', () => {
    expect(formatINR(50000)).toMatch(/50,000/);
    expect(formatNumberWithCommas(125000)).toBe('1,25,000');
  });
});
