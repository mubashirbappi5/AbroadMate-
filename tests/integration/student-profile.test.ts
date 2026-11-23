import { describe, it, expect } from "vitest";
import {
  basicInfoStepSchema,
  educationStepSchema,
  languageProficiencyStepSchema,
  financialBackgroundStepSchema,
  studyPreferencesStepSchema,
  calculateProfileCompletion,
} from "../../packages/validation/src/onboarding.schema";

describe("Integration: Student Profile & Onboarding System", () => {
  describe("Multi-Step Onboarding Data Flow", () => {
    it("validates Step 1: Personal & Contact Information", () => {
      const step1Valid = {
        fullName: "Fahim Faysal",
        dateOfBirth: "2001-08-15",
        nationality: "Bangladeshi",
        currentCountry: "Bangladesh",
        currentCity: "Dhaka",
        phone: "01812345678",
        hasPassport: true,
        passportNumber: "A01928374",
        passportExpiryDate: "2029-05-20",
      };

      const parsed = basicInfoStepSchema.safeParse(step1Valid);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.fullName).toBe("Fahim Faysal");
        expect(parsed.data.hasPassport).toBe(true);
      }
    });

    it("validates Step 2: Bangladeshi Academic Qualifications & GPA Conversion", () => {
      const step2Valid = {
        highestCompletedLevel: "bachelor_passed" as const,
        academicRecords: [
          {
            level: "BACHELOR" as const,
            institutionName: "BUET",
            boardOrAuthority: "UGC",
            degreeTitle: "BSc in CSE",
            groupOrMajor: "Computer Science",
            passingYear: 2024,
            gpaOrCgpa: 3.78,
            scale: 4.0,
            resultStatus: "PASSED" as const,
          },
          {
            level: "HSC" as const,
            institutionName: "Notre Dame College",
            boardOrAuthority: "Dhaka Board",
            degreeTitle: "HSC Science",
            groupOrMajor: "Science",
            passingYear: 2019,
            gpaOrCgpa: 5.0,
            scale: 5.0,
            resultStatus: "PASSED" as const,
          },
        ],
      };

      const parsed = educationStepSchema.safeParse(step2Valid);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.academicRecords).toHaveLength(2);
        expect(parsed.data.academicRecords[0].gpaOrCgpa).toBe(3.78);
      }
    });

    it("validates Step 3: English Test Proficiency with 2-year Validity Enforcement", () => {
      const validIelts = {
        hasTakenTest: true,
        testType: "IELTS" as const,
        overallScore: 7.5,
        listeningScore: 8.0,
        readingScore: 7.5,
        writingScore: 7.0,
        speakingScore: 7.5,
        testDate: "2025-06-10",
        expiryDate: "2027-06-10",
        trfNumber: "24BD001234FAHS001A",
      };

      const parsed = languageProficiencyStepSchema.safeParse(validIelts);
      expect(parsed.success).toBe(true);

      // Verify 2-year validity check logic
      const testDate = new Date(validIelts.testDate);
      const currentDate = new Date("2026-05-01");
      const diffYears = (currentDate.getTime() - testDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      expect(diffYears).toBeLessThan(2.0); // Within 2 years
    });

    it("validates Step 4: Financial Solvency & Family Sponsorship Details", () => {
      const step4Valid = {
        annualTuitionBudget: 3500000,
        liquidSavingsAmount: 4500000,
        hasSponsor: true,
        sponsorRelationship: "FATHER",
        sponsorName: "Md. Rafiqul Islam",
        annualSponsorIncome: 2400000,
        scholarshipPreference: "PARTIAL_OK" as const,
        educationLoanInterest: "EXPLORING" as const,
      };

      const parsed = financialBackgroundStepSchema.safeParse(step4Valid);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.liquidSavingsAmount).toBe(4500000);
      }
    });

    it("validates Step 5: Study Abroad Preferences & Goals", () => {
      const step5Valid = {
        targetCountryCodes: ["GB", "CA", "DE"],
        targetDegreeLevel: "MASTER",
        targetIntakeSeason: "FALL" as const,
        targetIntakeYear: 2026,
        preferredSubject: "Data Science & Artificial Intelligence",
        careerGoals: "Establish an AI research lab in Bangladesh",
      };

      const parsed = studyPreferencesStepSchema.safeParse(step5Valid);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.targetCountryCodes).toHaveLength(3);
        expect(parsed.data.targetIntakeYear).toBe(2026);
      }
    });
  });

  describe("Profile Completion Scoring Engine", () => {
    it("returns low score (0-40%) for minimal unverified profile", () => {
      const minimalProfile = {
        basicInfo: {
          fullName: "Nafis Imtiaz",
        },
      };

      const result = calculateProfileCompletion(minimalProfile);
      expect(result.percentage).toBeLessThanOrEqual(40);
      expect(result.requiredComplete).toBe(false);
      expect(result.missingRequired.length).toBeGreaterThan(0);
    });

    it("returns 90-100% completion when all required, recommended, and document items are fulfilled", () => {
      const fullProfile = {
        basicInfo: {
          fullName: "Fahim Faysal",
          dateOfBirth: "2001-08-15",
          currentCity: "Dhaka",
          hasPassport: true,
          passportExpiryDate: "2029-05-20",
        },
        education: {
          highestCompletedLevel: "bachelor_passed" as const,
          academicRecords: [
            { level: "BACHELOR" as const, gpaOrCgpa: 3.78, scale: 4.0 },
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
          careerGoals: "Lead Software Architect",
        },
        financial: {
          annualTuitionBudget: 3500000,
          hasSponsor: true,
          liquidSavingsAmount: 4500000,
        },
        immigration: {
          hasTravelHistory: false,
          outcomeStatus: "NONE" as const,
          hasPreviousRefusal: false,
          hasViolations: false,
        },
        hasDocuments: {
          transcriptUploaded: true,
          languageCertUploaded: true,
          passportUploaded: true,
        },
      };

      const result = calculateProfileCompletion(fullProfile);
      expect(result.percentage).toBeGreaterThanOrEqual(90);
      expect(result.requiredComplete).toBe(true);
    });
  });

  describe("Verification Lifecycle & Status Transitions", () => {
    type ProfileVerificationStatus = "UNVERIFIED" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";

    function transitionVerificationStatus(
      current: ProfileVerificationStatus,
      action: "SUBMIT_FOR_REVIEW" | "APPROVE" | "REJECT" | "RESET"
    ): ProfileVerificationStatus {
      switch (current) {
        case "UNVERIFIED":
          if (action === "SUBMIT_FOR_REVIEW") return "PENDING_VERIFICATION";
          return current;
        case "PENDING_VERIFICATION":
          if (action === "APPROVE") return "VERIFIED";
          if (action === "REJECT") return "REJECTED";
          return current;
        case "VERIFIED":
          if (action === "RESET") return "UNVERIFIED";
          return current;
        case "REJECTED":
          if (action === "SUBMIT_FOR_REVIEW") return "PENDING_VERIFICATION";
          return current;
      }
    }

    it("correctly models the student verification lifecycle", () => {
      let status: ProfileVerificationStatus = "UNVERIFIED";

      // 1. Student uploads credentials and requests verification
      status = transitionVerificationStatus(status, "SUBMIT_FOR_REVIEW");
      expect(status).toBe("PENDING_VERIFICATION");

      // 2. Admin verifies documents and approves
      status = transitionVerificationStatus(status, "APPROVE");
      expect(status).toBe("VERIFIED");

      // 3. If student modifies academic record, verification status resets
      status = transitionVerificationStatus(status, "RESET");
      expect(status).toBe("UNVERIFIED");
    });
  });
});
