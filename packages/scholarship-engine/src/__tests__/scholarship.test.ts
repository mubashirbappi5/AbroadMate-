import { describe, it, expect } from "vitest";
import {
  evaluateScholarship,
  evaluateScholarshipBatch,
  calculateFundingImpact,
  getRoadmapTaskTemplatesForFunding,
  mergeTasksWithPreservation,
  ScholarshipRecord,
  StudentScholarshipProfileInput,
} from "../index";

describe("Deterministic Scholarship Discovery & Eligibility Engine", () => {
  const cheveningScholarship: ScholarshipRecord = {
    id: "sch-chevening-1",
    countryCode: "GB",
    titleEn: "Chevening Scholarships",
    titleBn: "শেভেনিং স্কলারশিপ",
    providerName: "UK Foreign, Commonwealth & Development Office (FCDO)",
    providerType: "GOVERNMENT",
    fundingType: "FULL_FUNDED",
    tuitionCoveragePercent: 100.0,
    livingStipendMonthly: 1340.0,
    livingStipendCurrency: "GBP",
    travelSupport: true,
    travelSupportDetailsBn: "ঢাকা-লন্ডন রিটার্ন বিমান টিকিট",
    accommodationSupport: false,
    healthInsuranceCovered: true,
    visaFeeCovered: true,
    coverageDescriptionBn: "১০০% টিউশন ফি, মাসিক £১,৩৪০ ভাতা, রিটার্ন ফ্লাইট ও ভিসা ফি।",
    eligibilityCriteriaBn: "ব্যাচেলর ডিগ্রি (সিজিপিএ ৩.২৫+), ২ বছরের কাজের অভিজ্ঞতা, দেশে ফেরার অঙ্গীকার।",
    officialPortalUrl: "https://www.chevening.org/scholarship/bangladesh/",
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days in future
    eligibilityRules: [
      {
        eligibleDegreeLevels: ["MASTER"],
        eligibleDisciplines: ["All"],
        targetNationalities: ["BD"],
        minCgpaRequired: 3.25,
        gpaScale: 4.0,
        minIeltsRequired: 6.5,
        minIeltsEachBand: 6.0,
        workExperienceMonths: 24, // 2 years
        workExperienceRequired: true,
      },
    ],
  };

  const daadScholarship: ScholarshipRecord = {
    id: "sch-daad-1",
    countryCode: "DE",
    titleEn: "DAAD EPOS Scholarship",
    titleBn: "ডিএএডি ইপিওএস স্কলারশিপ",
    providerName: "German Academic Exchange Service (DAAD)",
    providerType: "GOVERNMENT",
    fundingType: "FULL_FUNDED",
    tuitionCoveragePercent: 100.0,
    livingStipendMonthly: 934.0,
    livingStipendCurrency: "EUR",
    travelSupport: true,
    accommodationSupport: false,
    healthInsuranceCovered: true,
    visaFeeCovered: false,
    coverageDescriptionBn: "সম্পূর্ণ টিউশন ফ্রি, মাসিক ৯৩৪ ইউরো লিভিং স্টাইপেন্ড ও স্বাস্থ্য সুরক্ষা।",
    eligibilityCriteriaBn: "স্নাতক ডিগ্রি (সিজিপিএ ৩.০০+), ২ বছরের কাজের অভিজ্ঞতা, আইইএলটিএস ৬.৫।",
    officialPortalUrl: "https://www.daad.de",
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    eligibilityRules: [
      {
        eligibleDegreeLevels: ["MASTER"],
        eligibleDisciplines: ["Engineering", "Development", "Public Policy", "Computer Science"],
        targetNationalities: ["BD"],
        minCgpaRequired: 3.0,
        gpaScale: 4.0,
        minIeltsRequired: 6.5,
        minIeltsEachBand: 6.0,
        workExperienceMonths: 24,
      },
    ],
  };

  describe("1. Deterministic Evaluation Logic", () => {
    it("evaluates a fully qualifying applicant as ELIGIBLE with high match score", () => {
      const student: StudentScholarshipProfileInput = {
        nationality: "BD",
        degreeLevel: "MASTER",
        discipline: "Public Policy",
        cgpa: 3.65,
        scale: 4.0,
        ieltsOverall: 7.5,
        ieltsWriting: 6.5,
        workExperienceMonths: 36, // 3 years
      };

      const result = evaluateScholarship(student, cheveningScholarship);

      expect(result.status).toBe("ELIGIBLE");
      expect(result.matchScore).toBeGreaterThanOrEqual(90);
      expect(result.missingConditionsBn.length).toBe(0);
      expect(result.coveredBenefitsBn.length).toBeGreaterThan(0);
      expect(result.uncoveredEstimatedBdt).toBe(93000);
    });

    it("evaluates an applicant with insufficient work experience as NOT_ELIGIBLE", () => {
      const student: StudentScholarshipProfileInput = {
        nationality: "BD",
        degreeLevel: "MASTER",
        discipline: "Computer Science",
        cgpa: 3.8,
        scale: 4.0,
        ieltsOverall: 8.0,
        workExperienceMonths: 10, // Fails 24-month requirement
      };

      const result = evaluateScholarship(student, cheveningScholarship);

      expect(result.status).toBe("NOT_ELIGIBLE");
      expect(result.breakdown.find((b) => b.key === "work_experience")?.status).toBe("NOT_MET");
      expect(result.missingConditionsBn.length).toBeGreaterThan(0);
    });

    it("evaluates an applicant with low CGPA as NOT_ELIGIBLE", () => {
      const student: StudentScholarshipProfileInput = {
        nationality: "BD",
        degreeLevel: "MASTER",
        discipline: "Engineering",
        cgpa: 2.8, // Fails 3.25 requirement
        scale: 4.0,
        ieltsOverall: 7.0,
        workExperienceMonths: 30,
      };

      const result = evaluateScholarship(student, cheveningScholarship);

      expect(result.status).toBe("NOT_ELIGIBLE");
      expect(result.breakdown.find((b) => b.key === "academic_cgpa")?.status).toBe("NOT_MET");
    });

    it("evaluates a student with good academics and experience but pending IELTS as CONDITIONALLY_ELIGIBLE", () => {
      const student: StudentScholarshipProfileInput = {
        nationality: "BD",
        degreeLevel: "MASTER",
        discipline: "Engineering",
        cgpa: 3.5,
        scale: 4.0,
        ieltsOverall: 0,
        isLanguagePlannedOnly: true,
        workExperienceMonths: 28,
      };

      const result = evaluateScholarship(student, daadScholarship);

      expect(result.status).toBe("CONDITIONALLY_ELIGIBLE");
      expect(result.breakdown.find((b) => b.key === "language_proficiency")?.status).toBe(
        "PARTIALLY_MET"
      );
    });

    it("flags incompatible nationality as NOT_ELIGIBLE", () => {
      const student: StudentScholarshipProfileInput = {
        nationality: "US", // Incompatible with BD targeted scholarship
        degreeLevel: "MASTER",
        cgpa: 3.9,
        scale: 4.0,
        workExperienceMonths: 30,
      };

      const result = evaluateScholarship(student, cheveningScholarship);

      expect(result.status).toBe("NOT_ELIGIBLE");
      expect(result.breakdown.find((b) => b.key === "nationality_eligibility")?.status).toBe(
        "NOT_MET"
      );
    });

    it("sorts batch evaluation by highest match score", () => {
      const student: StudentScholarshipProfileInput = {
        nationality: "BD",
        degreeLevel: "MASTER",
        discipline: "Computer Science",
        cgpa: 3.4,
        scale: 4.0,
        ieltsOverall: 7.0,
        workExperienceMonths: 28,
      };

      const batch = evaluateScholarshipBatch(student, [daadScholarship, cheveningScholarship]);

      expect(batch.length).toBe(2);
      expect(batch[0]?.matchScore).toBeGreaterThanOrEqual(batch[1]?.matchScore || 0);
    });
  });

  describe("2. Integrated Funding Decision Engine", () => {
    const mockProgram = {
      annualTuitionAmount: 26000,
      tuitionCurrencyCode: "GBP",
      countryCode: "GB",
    };

    it("calculates covered vs uncovered expenses for Scholarship-Funded route", () => {
      const impact = calculateFundingImpact("SCHOLARSHIP_FUNDED", cheveningScholarship, mockProgram);

      expect(impact.choiceType).toBe("SCHOLARSHIP_FUNDED");
      expect(impact.coveredTuitionBdt).toBeGreaterThan(0);
      expect(impact.totalCoveredBdt).toBeGreaterThan(5000000); // Over 50 Lakhs BDT
      expect(impact.uncoveredPersonalBufferBdt).toBe(93000);
      expect(impact.requiredBankSolvencyBdt).toBeLessThan(300000); // Waived solvency
      expect(impact.summaryBn).toContain("শেভেনিং স্কলারশিপ");
    });

    it("calculates full tuition and embassy solvency for Self-Funded route", () => {
      const impact = calculateFundingImpact("SELF_FUNDED", null, mockProgram);

      expect(impact.choiceType).toBe("SELF_FUNDED");
      expect(impact.coveredTuitionBdt).toBe(0);
      expect(impact.totalCoveredBdt).toBe(0);
      expect(impact.uncoveredPersonalBufferBdt).toBeGreaterThan(4000000); // 40+ Lakhs BDT
      expect(impact.requiredBankSolvencyBdt).toBeGreaterThan(4000000);
      expect(impact.summaryBn).toContain("স্ব-অর্থায়নে");
    });

    it("generates scholarship roadmap tasks when choosing scholarship route", () => {
      const tasks = getRoadmapTaskTemplatesForFunding("SCHOLARSHIP_FUNDED", "শেভেনিং স্কলারশিপ");

      expect(tasks.length).toBeGreaterThanOrEqual(3);
      expect(tasks.some((t) => t.titleBn.includes("এসওপি") || t.titleBn.includes("প্রবন্ধ"))).toBe(
        true
      );
      expect(tasks.some((t) => t.titleBn.includes("রেফারেন্স"))).toBe(true);
      expect(tasks.some((t) => t.titleBn.includes("পোর্টালে"))).toBe(true);
    });

    it("generates self-funded roadmap tasks when choosing self-funded route", () => {
      const tasks = getRoadmapTaskTemplatesForFunding("SELF_FUNDED");

      expect(tasks.length).toBeGreaterThanOrEqual(3);
      expect(tasks.some((t) => t.titleBn.includes("হলফনামা"))).toBe(true);
      expect(tasks.some((t) => t.titleBn.includes("ব্যাংক ব্যালেন্স"))).toBe(true);
      expect(tasks.some((t) => t.titleBn.includes("ট্যাক্স"))).toBe(true);
    });

    it("preserves completed tasks when switching funding paths", () => {
      // Simulate existing completed tasks
      const existingTasks = [
        {
          titleBn: "২টি অ্যাকাডেমিক ও প্রফেশনাল রেফারেন্স লেটার সংগ্রহ",
          isCompleted: true,
          completedAt: new Date(),
        },
      ];

      const newTemplates = getRoadmapTaskTemplatesForFunding("SCHOLARSHIP_FUNDED");
      const merged = mergeTasksWithPreservation(existingTasks, newTemplates);

      const refTask = merged.find((t) => t.titleBn.includes("রেফারেন্স"));
      expect(refTask?.isCompleted).toBe(true);
      expect(refTask?.completedAt).toBeDefined();

      const essayTask = merged.find((t) => t.titleBn.includes("প্রবন্ধ"));
      expect(essayTask?.isCompleted).toBe(false);
    });
  });
});
