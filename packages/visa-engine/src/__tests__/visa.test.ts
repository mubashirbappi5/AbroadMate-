import { describe, it, expect } from "vitest";
import {
  calculateDetailedFinancialProof,
  evaluateStudentVisaEligibility,
  generateCountryWorkflow,
  COUNTRY_VISA_GUIDES,
} from "../index";

describe("Visa Engine Unit Tests", () => {
  describe("Financial Calculations by Country", () => {
    it("calculates UK financial proof for Outside London with 28-day rule", () => {
      const result = calculateDetailedFinancialProof({
        countryCode: "GB",
        tuitionFeeLocal: 15000,
        tuitionPaidLocal: 5000,
        isInsideLondon: false,
        availableLiquidFundsLocal: 20473,
        fundsHoldingDays: 28,
        sponsorType: "PARENTS",
      });

      expect(result.currencyCode).toBe("GBP");
      expect(result.tuitionRemainingLocal).toBe(10000);
      expect(result.livingFundsRequiredLocal).toBe(1023 * 9); // £9,207
      expect(result.visaApplicationFeeLocal).toBe(490);
      expect(result.healthInsuranceLocal).toBe(776);
      expect(result.maintenancePeriodDaysRequired).toBe(28);
      expect(result.isHoldingPeriodSatisfied).toBe(true);
      expect(result.isSponsorAccepted).toBe(true);
      expect(result.financialGapLocal).toBe(0);
    });

    it("calculates UK financial proof for Inside London", () => {
      const result = calculateDetailedFinancialProof({
        countryCode: "GB",
        tuitionFeeLocal: 18000,
        tuitionPaidLocal: 0,
        isInsideLondon: true,
      });

      expect(result.livingFundsRequiredLocal).toBe(1334 * 9); // £12,006
      expect(result.totalFundsRequiredLocal).toBe(18000 + 12006 + 490 + 776);
    });

    it("rejects unauthorized third-party sponsor for UKVI", () => {
      const result = calculateDetailedFinancialProof({
        countryCode: "GB",
        tuitionFeeLocal: 15000,
        sponsorType: "OTHER_RELATIVE",
      });

      expect(result.isSponsorAccepted).toBe(false);
      expect(result.sponsorEvaluationBn).toContain("UKVI");
    });

    it("calculates Germany blocked account requirements (€11,904)", () => {
      const result = calculateDetailedFinancialProof({
        countryCode: "DE",
        tuitionFeeLocal: 0,
        availableLiquidFundsLocal: 14000,
        sponsorType: "SELF",
      });

      expect(result.currencyCode).toBe("EUR");
      expect(result.livingFundsRequiredLocal).toBe(11904);
      expect(result.visaApplicationFeeLocal).toBe(75);
      expect(result.healthInsuranceLocal).toBe(1440);
      expect(result.financialGapLocal).toBe(0);
    });

    it("calculates Canada living benchmark (CAD $20,635)", () => {
      const result = calculateDetailedFinancialProof({
        countryCode: "CA",
        tuitionFeeLocal: 22000,
        tuitionPaidLocal: 10000,
        availableLiquidFundsLocal: 35000,
        fundsHoldingDays: 120,
        sponsorType: "PARENTS",
      });

      expect(result.currencyCode).toBe("CAD");
      expect(result.tuitionRemainingLocal).toBe(12000);
      expect(result.livingFundsRequiredLocal).toBe(20635);
      expect(result.maintenancePeriodDaysRequired).toBe(120);
      expect(result.isHoldingPeriodSatisfied).toBe(true);
    });

    it("calculates Australia benchmark (AUD $29,710 + $2,000 travel)", () => {
      const result = calculateDetailedFinancialProof({
        countryCode: "AU",
        tuitionFeeLocal: 30000,
        tuitionPaidLocal: 15000,
        availableLiquidFundsLocal: 50000,
        fundsHoldingDays: 90,
        sponsorType: "PARENTS",
      });

      expect(result.currencyCode).toBe("AUD");
      expect(result.livingFundsRequiredLocal).toBe(29710);
      expect(result.travelExpenseLocal).toBe(2000);
      expect(result.visaApplicationFeeLocal).toBe(1600);
      expect(result.healthInsuranceLocal).toBe(700);
      expect(result.maintenancePeriodDaysRequired).toBe(90);
      expect(result.isHoldingPeriodSatisfied).toBe(true);
    });
  });

  describe("Student Visa Assessment Verdicts", () => {
    it("returns PRELIMINARY_ELIGIBLE when all conditions are satisfied", () => {
      const assessment = evaluateStudentVisaEligibility({
        countryCode: "GB",
        degreeLevel: "MASTERS",
        isInsideLondon: false,
        tuitionFeeLocal: 14000,
        tuitionFeePaidLocal: 4000,
        availableLiquidFundsLocal: 21000,
        fundsHoldingDays: 30,
        sponsorType: "PARENTS",
        hasOfficialAdmissionConfirmation: true,
        hasLanguageProficiencyProof: true,
        hasValidPassport: true,
        hasAcademicCertificates: true,
        hasBankSolvencyCertificate: true,
        hasSponsorTaxReturns: true,
        hasMedicalTbClearance: true,
        hasPoliceClearance: true,
        hasHealthInsurance: true,
        hasPreviousRefusal: false,
        scholarshipFundingBdt: 0,
      });

      expect(assessment.verdict).toBe("PRELIMINARY_ELIGIBLE");
      expect(assessment.summaryBn).toContain("যুক্তরাজ্য");
      expect(assessment.financialBreakdown.financialGapLocal).toBe(0);
      expect(assessment.actionableRecommendationsBn.length).toBeGreaterThan(0);
    });

    it("returns FINANCIAL_GAP when funds or holding days are inadequate", () => {
      const assessment = evaluateStudentVisaEligibility({
        countryCode: "GB",
        degreeLevel: "MASTERS",
        isInsideLondon: false,
        tuitionFeeLocal: 16000,
        tuitionFeePaidLocal: 0,
        availableLiquidFundsLocal: 5000, // Deficit!
        fundsHoldingDays: 10, // Deficit!
        sponsorType: "PARENTS",
        hasOfficialAdmissionConfirmation: true,
        hasLanguageProficiencyProof: true,
        hasValidPassport: true,
        hasAcademicCertificates: true,
        hasBankSolvencyCertificate: true,
        hasSponsorTaxReturns: true,
        hasMedicalTbClearance: true,
        hasPoliceClearance: true,
        hasHealthInsurance: true,
        hasPreviousRefusal: false,
        scholarshipFundingBdt: 0,
      });

      expect(assessment.verdict).toBe("FINANCIAL_GAP");
      expect(assessment.financialBreakdown.financialGapLocal).toBeGreaterThan(0);
      expect(assessment.actionableRecommendationsBn[0]).toContain("ব্যাংক অ্যাকাউন্টে");
    });

    it("returns REQUIREMENTS_MISSING when CAS/admission or passport is absent", () => {
      const assessment = evaluateStudentVisaEligibility({
        countryCode: "US",
        degreeLevel: "MASTERS",
        isInsideLondon: false,
        tuitionFeeLocal: 20000,
        tuitionFeePaidLocal: 0,
        availableLiquidFundsLocal: 40000,
        fundsHoldingDays: 0,
        sponsorType: "PARENTS",
        hasOfficialAdmissionConfirmation: false, // Missing I-20!
        hasLanguageProficiencyProof: true,
        hasValidPassport: true,
        hasAcademicCertificates: true,
        hasBankSolvencyCertificate: true,
        hasSponsorTaxReturns: true,
        hasMedicalTbClearance: true,
        hasPoliceClearance: true,
        hasHealthInsurance: true,
        hasPreviousRefusal: false,
        scholarshipFundingBdt: 0,
      });

      expect(assessment.verdict).toBe("REQUIREMENTS_MISSING");
      expect(assessment.actionableRecommendationsBn[0]).toContain("ভর্তি নিশ্চয়তাপত্র");
    });

    it("includes mandatory refusal disclosure warning when hasPreviousRefusal is true", () => {
      const assessment = evaluateStudentVisaEligibility({
        countryCode: "GB",
        degreeLevel: "MASTERS",
        isInsideLondon: false,
        tuitionFeeLocal: 14000,
        tuitionFeePaidLocal: 4000,
        availableLiquidFundsLocal: 22000,
        fundsHoldingDays: 30,
        sponsorType: "PARENTS",
        hasOfficialAdmissionConfirmation: true,
        hasLanguageProficiencyProof: true,
        hasValidPassport: true,
        hasAcademicCertificates: true,
        hasBankSolvencyCertificate: true,
        hasSponsorTaxReturns: true,
        hasMedicalTbClearance: true,
        hasPoliceClearance: true,
        hasHealthInsurance: true,
        hasPreviousRefusal: true, // Prior refusal!
        refusalCountryCode: "SE",
        refusalExplanation: "Lack of financial ties",
        scholarshipFundingBdt: 0,
      });

      expect(assessment.refusalAdvisoryBn).toBeDefined();
      expect(assessment.refusalAdvisoryBn).toContain("Paragraph 9.7.1");
      expect(assessment.refusalAdvisoryBn).toContain("১০ বছরের আন্তর্জাতিক ভ্রমণ নিষেধাজ্ঞা");
    });
  });

  describe("Country Workflows & 15-Section Guides", () => {
    it("generates correct country-specific workflows without cross-contamination", () => {
      const ukSteps = generateCountryWorkflow("GB");
      const usSteps = generateCountryWorkflow("US");
      const deSteps = generateCountryWorkflow("DE");

      expect(ukSteps.some((s) => s.stageCode === "CAS")).toBe(true);
      expect(ukSteps.some((s) => s.stageCode === "I20")).toBe(false);

      expect(usSteps.some((s) => s.stageCode === "I20" || s.stageCode === "SEVIS")).toBe(true);
      expect(usSteps.some((s) => s.stageCode === "BLOCKED_ACCOUNT")).toBe(false);

      expect(deSteps.some((s) => s.stageCode === "BLOCKED_ACCOUNT")).toBe(true);
      expect(deSteps.some((s) => s.stageCode === "CAS")).toBe(false);
    });

    it("has all 15 sections populated for all 5 countries", () => {
      const countries: ("GB" | "CA" | "AU" | "DE" | "US")[] = ["GB", "CA", "AU", "DE", "US"];

      for (const code of countries) {
        const guide = COUNTRY_VISA_GUIDES[code];
        expect(guide).toBeDefined();
        if (!guide) continue;
        for (let i = 1; i <= 15; i++) {
          const section = guide.sections[i as keyof typeof guide.sections];
          expect(section).toBeDefined();
          expect(section.titleBn.length).toBeGreaterThan(0);
          expect(section.contentBn.length).toBeGreaterThan(10);
        }
      }
    });
  });
});
