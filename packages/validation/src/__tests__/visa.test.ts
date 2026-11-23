import { describe, it, expect } from "vitest";
import {
  evaluateVisaAssessmentSchema,
  calculateVisaFinancialsSchema,
  adminVisaRequirementUpsertSchema,
} from "../visa.schema";

describe("Visa Validation Schemas", () => {
  describe("evaluateVisaAssessmentSchema", () => {
    it("validates valid input for UK Student Route", () => {
      const valid = {
        countryCode: "GB",
        degreeLevel: "MASTERS",
        isInsideLondon: false,
        tuitionFeeLocal: 16000,
        tuitionFeePaidLocal: 5000,
        availableLiquidFundsLocal: 20207,
        fundsHoldingDays: 28,
        sponsorType: "PARENTS",
        hasOfficialAdmissionConfirmation: true,
        hasLanguageProficiencyProof: true,
        hasValidPassport: true,
        hasAcademicCertificates: true,
        hasBankSolvencyCertificate: true,
        hasSponsorTaxReturns: true,
        hasMedicalTbClearance: true,
        hasPoliceClearance: false,
        hasHealthInsurance: true,
      };

      const result = evaluateVisaAssessmentSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countryCode).toBe("GB");
        expect(result.data.fundsHoldingDays).toBe(28);
      }
    });

    it("rejects negative fees or invalid country code", () => {
      const invalid = {
        countryCode: "FR", // Not in our 5 countries
        tuitionFeeLocal: -500,
      };

      const result = evaluateVisaAssessmentSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("calculateVisaFinancialsSchema", () => {
    it("validates financial calculator input", () => {
      const valid = {
        countryCode: "DE",
        tuitionFeeLocal: 0,
        tuitionPaidLocal: 0,
      };
      const result = calculateVisaFinancialsSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countryCode).toBe("DE");
      }
    });
  });

  describe("adminVisaRequirementUpsertSchema", () => {
    it("requires valid URL and non-negative figures", () => {
      const validAdmin = {
        countryCode: "DE",
        visaCode: "NATIONAL_D",
        nameEn: "National Visa Category D",
        nameBn: "জাতীয় ভিসা (ক্যাটাগরি ডি)",
        officialFeeAmount: 75,
        feeCurrencyCode: "EUR",
        processingDaysAvg: 60,
        changeSummaryBn: "ব্লকড একাউন্ট ফান্ড আপডেট",
        officialGazetteUrl: "https://dhaka.diplo.de/bd-en/service/visa-einreise",
        sourceOrganization: "German Embassy Dhaka",
        requiredLivingFunds: 11904,
        maintenancePeriodDays: 0,
        acceptableInstrumentsBn: "Expatrio, Coracle বা Fintiba ব্লকড একাউন্ট",
        sponsorConditionsBn: "জার্মানিতে Verpflichtungserklärung থাকলে প্রযোজ্য",
      };

      const result = adminVisaRequirementUpsertSchema.safeParse(validAdmin);
      expect(result.success).toBe(true);
    });

    it("rejects invalid URL in admin schema", () => {
      const invalid = {
        countryCode: "US",
        visaCode: "F1",
        nameEn: "F-1",
        nameBn: "এফ-১",
        officialFeeAmount: 185,
        feeCurrencyCode: "USD",
        processingDaysAvg: 30,
        changeSummaryBn: "আপডেট",
        officialGazetteUrl: "not-a-valid-url",
        sourceOrganization: "US Embassy",
        requiredLivingFunds: 15000,
        maintenancePeriodDays: 0,
        acceptableInstrumentsBn: "ব্যাংক ব্যালেন্স",
        sponsorConditionsBn: "পিতা-মাতা",
      };

      const result = adminVisaRequirementUpsertSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
