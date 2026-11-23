import { describe, it, expect } from "vitest";
import {
  calculateFinancialBudgetSchema,
  saveBudgetPlanSchema,
} from "../calculator.schema";

describe("Financial Calculator Schemas", () => {
  it("validates valid budget calculation input", () => {
    const valid = {
      countryCode: "GB",
      degreeLevel: "MASTERS",
      studyDurationYears: 1,
      grossTuitionAnnualLocal: 16000,
      tuitionDepositPaidLocal: 3000,
      scholarshipDeductionLocal: 2000,
      studentSavingsLocal: 15000,
      sponsorContributionLocal: 10000,
      educationLoanLocal: 0,
      monthlySavingsCapacityBdt: 30000,
      monthsUntilDeparture: 6,
      isInsideLondonOrMetro: false,
    };

    const result = calculateFinancialBudgetSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.countryCode).toBe("GB");
      expect(result.data.grossTuitionAnnualLocal).toBe(16000);
    }
  });

  it("validates saveBudgetPlanSchema with valid figures", () => {
    const validPlan = {
      title: "ইউকে ফল ২০২৫ মাস্টার্স বাজেট",
      countryCode: "GB",
      degreeLevel: "MASTERS",
      studyDurationYears: 1,
      currencyCode: "GBP",
      exchangeRateToBdt: 153.5,
      exchangeRateSource: "বাংলাদেশ ব্যাংক",
      grossTuitionAnnualLocal: 16000,
      livingCostAnnualLocal: 9207,
      visaApplicationFeeLocal: 490,
      healthInsuranceLocal: 776,
      studentSavingsLocal: 10000,
      monthsUntilDeparture: 6,
    };

    const result = saveBudgetPlanSchema.safeParse(validPlan);
    expect(result.success).toBe(true);
  });

  it("rejects invalid country code", () => {
    const invalid = {
      countryCode: "XYZ",
      grossTuitionAnnualLocal: 10000,
    };

    const result = calculateFinancialBudgetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
