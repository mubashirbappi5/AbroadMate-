import { describe, it, expect } from "vitest";
import {
  basicInfoStepSchema,
  educationStepSchema,
  languageProficiencyStepSchema,
  studyPreferencesStepSchema,
  financialBackgroundStepSchema,
  immigrationHistoryStepSchema,
  reviewConfirmationSchema,
  calculateProfileCompletion,
} from "../onboarding.schema";

describe("Onboarding & Profile Validation Engine", () => {
  describe("Step 1: Basic Information Validation", () => {
    it("validates valid Bangladeshi student basic info", () => {
      const valid = {
        fullName: "সাকিব আহমেদ",
        dateOfBirth: "2002-05-14",
        nationality: "Bangladeshi",
        currentCountry: "Bangladesh",
        currentCity: "ঢাকা",
        hasPassport: true,
        passportNumber: "A01234567",
        passportExpiryDate: "2028-08-20",
        phone: "01712345678",
      };

      const result = basicInfoStepSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when Bangladeshi phone number is invalid", () => {
      const invalid = {
        fullName: "সাকিব আহমেদ",
        dateOfBirth: "2002-05-14",
        nationality: "Bangladeshi",
        currentCountry: "Bangladesh",
        currentCity: "ঢাকা",
        hasPassport: false,
        phone: "12345678", // Invalid format
      };

      const result = basicInfoStepSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.phone).toBeDefined();
      }
    });

    it("enforces age between 15 and 65 years", () => {
      const tooYoung = {
        fullName: "শিশু শিক্ষার্থী",
        dateOfBirth: "2020-01-01", // Age ~6
        nationality: "Bangladeshi",
        currentCountry: "Bangladesh",
        currentCity: "ঢাকা",
        hasPassport: false,
        phone: "01812345678",
      };

      const result = basicInfoStepSchema.safeParse(tooYoung);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.dateOfBirth).toBeDefined();
      }
    });

    it("requires passportExpiryDate if hasPassport is true", () => {
      const missingExpiry = {
        fullName: "সাকিব আহমেদ",
        dateOfBirth: "2001-04-10",
        nationality: "Bangladeshi",
        currentCountry: "Bangladesh",
        currentCity: "চট্টগ্রাম",
        hasPassport: true,
        passportNumber: "B98765432",
        passportExpiryDate: "", // empty
        phone: "01912345678",
      };

      const result = basicInfoStepSchema.safeParse(missingExpiry);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.passportExpiryDate).toBeDefined();
      }
    });
  });

  describe("Step 2: Education Background Validation", () => {
    it("validates valid academic records with multiple degrees", () => {
      const valid = {
        highestCompletedLevel: "bachelor_passed" as const,
        academicRecords: [
          {
            level: "BACHELOR" as const,
            institutionName: "ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি",
            boardOrAuthority: "UGC / DIU",
            groupOrMajor: "কম্পিউটার সায়েন্স",
            gpaOrCgpa: 3.65,
            scale: 4.0,
            startYear: 2020,
            passingYear: 2024,
            resultStatus: "PASSED" as const,
            hasBacklogs: false,
            backlogsCount: 0,
          },
          {
            level: "HSC" as const,
            institutionName: "ঢাকা রেসিডেনসিয়াল মডেল কলেজ",
            boardOrAuthority: "ঢাকা বোর্ড",
            groupOrMajor: "বিজ্ঞান",
            gpaOrCgpa: 5.0,
            scale: 5.0,
            startYear: 2017,
            passingYear: 2019,
            resultStatus: "PASSED" as const,
            hasBacklogs: false,
            backlogsCount: 0,
          },
        ],
      };

      const result = educationStepSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when no academic records are provided", () => {
      const empty = {
        highestCompletedLevel: "hsc_passed" as const,
        academicRecords: [],
      };

      const result = educationStepSchema.safeParse(empty);
      expect(result.success).toBe(false);
    });

    it("fails when passing year is outside valid range", () => {
      const invalidYear = {
        highestCompletedLevel: "hsc_passed" as const,
        academicRecords: [
          {
            level: "HSC" as const,
            institutionName: "কলেজ",
            groupOrMajor: "বিজ্ঞান",
            gpaOrCgpa: 4.5,
            scale: 5.0,
            passingYear: 1980, // min is 1990
            resultStatus: "PASSED" as const,
          },
        ],
      };

      const result = educationStepSchema.safeParse(invalidYear);
      expect(result.success).toBe(false);
    });
  });

  describe("Step 3: Language Proficiency Validation", () => {
    it("validates IELTS test with valid band scores", () => {
      const valid = {
        hasTakenTest: true,
        testType: "IELTS" as const,
        overallScore: 7.5,
        listeningScore: 8.0,
        readingScore: 7.5,
        writingScore: 6.5,
        speakingScore: 7.5,
        testDate: "2024-10-15",
        expiryDate: "2026-10-15",
        trfNumber: "24BD001234S",
      };

      const result = languageProficiencyStepSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when IELTS score exceeds 9.0", () => {
      const invalid = {
        hasTakenTest: true,
        testType: "IELTS" as const,
        overallScore: 9.5, // IELTS maximum is 9.0
      };

      const result = languageProficiencyStepSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.overallScore).toBeDefined();
      }
    });

    it("allows NOT_TAKEN with optional planned test date", () => {
      const notTaken = {
        hasTakenTest: false,
        testType: "NOT_TAKEN" as const,
        plannedTestDate: "2025-06-15",
      };

      const result = languageProficiencyStepSchema.safeParse(notTaken);
      expect(result.success).toBe(true);
    });
  });

  describe("Step 4: Study Preferences Validation", () => {
    it("validates valid study abroad preferences", () => {
      const valid = {
        desiredDegreeLevel: "MASTER" as const,
        preferredSubject: "Data Science & AI",
        targetCountryCodes: ["GB", "CA"],
        targetIntakeSeason: "FALL" as const,
        targetIntakeYear: 2026,
        studyMode: "FULL_TIME" as const,
        preferredCityType: "AFFORDABLE_STUDENT_TOWN" as const,
        pswWorkImportance: "HIGH" as const,
        academicGoals: "অ্যাডভান্সড মেশিন লার্নিং নিয়ে পড়াশোনা করা।",
        careerGoals: "শীর্ষ টেক কোম্পানিতে এআই ইঞ্জিনিয়ার হওয়া।",
      };

      const result = studyPreferencesStepSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when target countries array is empty", () => {
      const emptyCountries = {
        desiredDegreeLevel: "MASTER" as const,
        preferredSubject: "Data Science",
        targetCountryCodes: [],
        targetIntakeSeason: "FALL" as const,
        targetIntakeYear: 2026,
        studyMode: "FULL_TIME" as const,
      };

      const result = studyPreferencesStepSchema.safeParse(emptyCountries);
      expect(result.success).toBe(false);
    });
  });

  describe("Step 5: Financial Background Validation", () => {
    it("validates financial plan with sponsor details in BDT", () => {
      const valid = {
        annualTuitionBudget: 2800000,
        budgetCurrencyCode: "BDT",
        liquidSavingsAmount: 3200000,
        savingsCurrencyCode: "BDT",
        primaryBankName: "ইস্টার্ন ব্যাংক পিএলসি",
        fundingStrategyType: "SELF_AND_FAMILY" as const,
        hasSponsor: true,
        sponsorRelationship: "FATHER" as const,
        sponsorName: "মো: রফিকুল ইসলাম",
        sponsorOccupation: "ব্যবসায়ী",
        annualSponsorIncome: 1800000,
        scholarshipPreference: "PARTIAL_OK" as const,
        educationLoanInterest: "EXPLORING" as const,
      };

      const result = financialBackgroundStepSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("fails when hasSponsor is true but sponsorName is missing", () => {
      const missingSponsor = {
        annualTuitionBudget: 2500000,
        liquidSavingsAmount: 2000000,
        hasSponsor: true,
        sponsorName: "", // missing
      };

      const result = financialBackgroundStepSchema.safeParse(missingSponsor);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.sponsorName).toBeDefined();
      }
    });
  });

  describe("Step 6: Immigration History Validation", () => {
    it("validates clean immigration record without refusals", () => {
      const clean = {
        hasTravelHistory: false,
        outcomeStatus: "NONE" as const,
        hasPreviousRefusal: false,
        hasViolations: false,
      };

      const result = immigrationHistoryStepSchema.safeParse(clean);
      expect(result.success).toBe(true);
    });

    it("requires refusalReasonNotice if hasPreviousRefusal is true", () => {
      const missingReason = {
        hasTravelHistory: true,
        travelHistorySummary: "ভারত",
        outcomeStatus: "REFUSED" as const,
        hasPreviousRefusal: true,
        refusalReasonNotice: "", // missing
        hasViolations: false,
      };

      const result = immigrationHistoryStepSchema.safeParse(missingReason);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.refusalReasonNotice).toBeDefined();
      }
    });
  });

  describe("Step 7: Final Review & Confirmation Validation", () => {
    it("passes when student explicitly confirms truthfulness", () => {
      const result = reviewConfirmationSchema.safeParse({
        explicitConfirmation: true,
      });
      expect(result.success).toBe(true);
    });

    it("fails when explicitConfirmation is false", () => {
      const result = reviewConfirmationSchema.safeParse({
        explicitConfirmation: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Profile Completion Calculation Engine", () => {
    it("scores minimal draft properly", () => {
      const result = calculateProfileCompletion({});
      expect(result.percentage).toBe(10); // minimum baseline
      expect(result.requiredComplete).toBe(false);
      expect(result.missingRequired.length).toBeGreaterThan(0);
    });

    it("scores fully completed profile with documents up to 100%", () => {
      const fullProfile = {
        basicInfo: {
          fullName: "সাকিব আহমেদ",
          dateOfBirth: "2002-05-14",
          currentCity: "ঢাকা",
          hasPassport: true,
          passportExpiryDate: "2028-08-20",
        },
        education: {
          highestCompletedLevel: "bachelor_passed" as const,
          academicRecords: [
            { level: "BACHELOR" as const, gpaOrCgpa: 3.65, scale: 4.0 },
            { level: "HSC" as const, gpaOrCgpa: 5.0, scale: 5.0 },
          ],
        },
        language: {
          hasTakenTest: true,
          overallScore: 7.5,
        },
        preferences: {
          targetCountryCodes: ["GB", "CA"],
          preferredSubject: "Computer Science",
          careerGoals: "AI Engineer",
        },
        financial: {
          annualTuitionBudget: 2800000,
          hasSponsor: true,
          liquidSavingsAmount: 3200000,
        },
        immigration: {
          hasTravelHistory: true,
        },
        hasDocuments: {
          transcriptUploaded: true,
          languageCertUploaded: true,
          passportUploaded: true,
        },
      };

      const result = calculateProfileCompletion(fullProfile);
      expect(result.percentage).toBe(100);
      expect(result.requiredComplete).toBe(true);
      expect(result.missingRequired).toHaveLength(0);
      expect(result.missingRecommended).toHaveLength(0);
      // Ensure uploaded documents default to needsVerification, NEVER auto-verified
      expect(result.documentStatus.needsVerification).toBe(3);
      expect(result.documentStatus.verified).toBe(0);
    });

    it("never marks unverified user documents as officially verified", () => {
      const result = calculateProfileCompletion({
        hasDocuments: {
          transcriptUploaded: true,
          passportUploaded: true,
        },
      });

      expect(result.documentStatus.totalUploaded).toBe(2);
      expect(result.documentStatus.needsVerification).toBe(2);
      expect(result.documentStatus.verified).toBe(0);
    });
  });
});
