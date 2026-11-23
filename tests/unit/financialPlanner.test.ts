import { describe, it, expect } from "vitest";
import {
  calculateFullBudgetPlan,
  VERIFIED_EXCHANGE_RATES,
} from "../../packages/shared/src/utils/financial-planner";

describe("Study Abroad Financial Planner Engine", () => {
  describe("Country-specific Cost Aggregations", () => {
    it("calculates UK budget with Outside London living costs and 1-year Masters duration", () => {
      const plan = calculateFullBudgetPlan({
        countryCode: "GB",
        studyDurationYears: 1.0,
        grossTuitionAnnualLocal: 16000,
        tuitionDepositPaidLocal: 3000,
        scholarshipDeductionLocal: 2000,
        studentSavingsLocal: 10000,
        sponsorContributionLocal: 5000,
        educationLoanLocal: 0,
        monthlySavingsCapacityBdt: 40000,
        monthsUntilDeparture: 6,
        isInsideLondonOrMetro: false,
      });

      expect(plan.countryCode).toBe("GB");
      expect(plan.currencyCode).toBe("GBP");
      expect(plan.exchangeRateToBdt).toBe(153.5);
      expect(plan.exchangeRateSource).toContain("বাংলাদেশ ব্যাংক");

      // Net tuition = 16000 - 2000 = 14000
      const tuitionExp = plan.expenses.find((e) => e.id === "tuition-fee-net");
      expect(tuitionExp?.amountLocal).toBe(14000);

      // Outside London Living = 9207
      const livingExp = plan.expenses.find((e) => e.id === "living-cost-annual");
      expect(livingExp?.amountLocal).toBe(9207);
      expect(livingExp?.isVerifiedStatutory).toBe(true);

      // Visa fee = 490, IHS = 776
      const visaExp = plan.expenses.find((e) => e.id === "visa-fee");
      expect(visaExp?.amountLocal).toBe(490);
      expect(visaExp?.isVerifiedStatutory).toBe(true);

      const ihsExp = plan.expenses.find((e) => e.id === "health-insurance");
      expect(ihsExp?.amountLocal).toBe(776);
      expect(ihsExp?.isVerifiedStatutory).toBe(true);

      // Pre-departure BDT sum
      expect(plan.preDepartureTotalBdt).toBeGreaterThan(40000);

      // Available funds = 10000 (savings) + 5000 (sponsor) + 3000 (deposit paid) = 18000
      expect(plan.totalAvailableFundsLocal).toBe(18000);
      expect(plan.fundingGapLocal).toBeGreaterThan(0);
      expect(plan.targetMonthlySavingsBdt).toBeGreaterThan(0);
    });

    it("calculates Germany budget with €11,904 blocked account and €0 tuition", () => {
      const plan = calculateFullBudgetPlan({
        countryCode: "DE",
        studyDurationYears: 2.0,
        grossTuitionAnnualLocal: 0,
        studentSavingsLocal: 8000,
        sponsorContributionLocal: 6000,
        monthlySavingsCapacityBdt: 25000,
        monthsUntilDeparture: 8,
      });

      expect(plan.currencyCode).toBe("EUR");
      expect(plan.exchangeRateToBdt).toBe(130.0);

      const livingExp = plan.expenses.find((e) => e.id === "living-cost-annual");
      expect(livingExp?.amountLocal).toBe(11904);
      expect(livingExp?.isVerifiedStatutory).toBe(true);

      const blockedSetup = plan.expenses.find((e) => e.id === "country-specific");
      expect(blockedSetup?.amountLocal).toBe(89);

      // 2 years degree projection should multiply annual living by 2
      expect(plan.totalDegreeCostLocal).toBeGreaterThan(plan.firstYearTotalCostLocal);
    });

    it("calculates Canada budget with CAD $20,635 living cost and biometrics fee", () => {
      const plan = calculateFullBudgetPlan({
        countryCode: "CA",
        studyDurationYears: 2.0,
        grossTuitionAnnualLocal: 18000,
        studentSavingsLocal: 20000,
        sponsorContributionLocal: 20000,
      });

      expect(plan.currencyCode).toBe("CAD");
      const livingExp = plan.expenses.find((e) => e.id === "living-cost-annual");
      expect(livingExp?.amountLocal).toBe(20635);

      const bioExp = plan.expenses.find((e) => e.id === "biometrics-fee");
      expect(bioExp?.amountLocal).toBe(85);
    });

    it("calculates Australia budget with AUD $29,710 living + $2,000 travel", () => {
      const plan = calculateFullBudgetPlan({
        countryCode: "AU",
        studyDurationYears: 2.0,
        grossTuitionAnnualLocal: 30000,
        studentSavingsLocal: 40000,
        sponsorContributionLocal: 30000,
      });

      expect(plan.currencyCode).toBe("AUD");
      const livingExp = plan.expenses.find((e) => e.id === "living-cost-annual");
      expect(livingExp?.amountLocal).toBe(29710 + 2000);

      const visaExp = plan.expenses.find((e) => e.id === "visa-fee");
      expect(visaExp?.amountLocal).toBe(1600);
    });

    it("calculates USA budget with Form I-20 expenses, SEVIS ($350) and MRV ($185)", () => {
      const plan = calculateFullBudgetPlan({
        countryCode: "US",
        studyDurationYears: 2.0,
        grossTuitionAnnualLocal: 25000,
        studentSavingsLocal: 30000,
      });

      expect(plan.currencyCode).toBe("USD");
      const sevisExp = plan.expenses.find((e) => e.id === "country-specific");
      expect(sevisExp?.amountLocal).toBe(350);

      const visaExp = plan.expenses.find((e) => e.id === "visa-fee");
      expect(visaExp?.amountLocal).toBe(185);
    });
  });

  describe("Savings Feasibility & Deficit Analysis", () => {
    it("returns SURPLUS when available funds exceed first year total costs", () => {
      const plan = calculateFullBudgetPlan({
        countryCode: "GB",
        grossTuitionAnnualLocal: 10000,
        scholarshipDeductionLocal: 10000, // Full tuition waiver!
        studentSavingsLocal: 20000, // More than enough for living & fees
      });

      expect(plan.fundingGapLocal).toBe(0);
      expect(plan.fundingGapBdt).toBe(0);
      expect(plan.savingsFeasibility).toBe("SURPLUS");
      expect(plan.feasibilityRecommendationBn).toContain("নিরাপদ");
    });

    it("returns FEASIBLE when target monthly savings is within monthly capacity", () => {
      const plan = calculateFullBudgetPlan({
        countryCode: "DE",
        grossTuitionAnnualLocal: 0,
        studentSavingsLocal: 12000,
        sponsorContributionLocal: 1000,
        monthlySavingsCapacityBdt: 40000,
        monthsUntilDeparture: 10,
      });

      // Deficit is small, should easily fit in 30k/mo
      expect(plan.savingsFeasibility).toBe("FEASIBLE");
      expect(plan.feasibilityRecommendationBn).toContain("ঘাটতি পূরণ সম্ভব");
    });

    it("returns HIGH_GAP when target monthly savings far exceeds capacity", () => {
      const plan = calculateFullBudgetPlan({
        countryCode: "US",
        grossTuitionAnnualLocal: 40000,
        studentSavingsLocal: 5000,
        monthlySavingsCapacityBdt: 10000, // Very low capacity
        monthsUntilDeparture: 4,
      });

      expect(plan.savingsFeasibility).toBe("HIGH_GAP");
      expect(plan.feasibilityRecommendationBn).toContain("ফান্ডের ঘাটতি বড়");
    });
  });
});
