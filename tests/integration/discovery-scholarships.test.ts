import { describe, it, expect } from "vitest";
import {
  evaluateScholarship,
  type ScholarshipRecord,
  type StudentScholarshipProfileInput,
} from "../../packages/scholarship-engine/src";
import { convertToBdt } from "../../packages/shared/src/utils/currency";

describe("Integration: University Discovery & Scholarship Matching Engine", () => {
  describe("University & Program Search with BDT Conversions", () => {
    interface ProgramSummary {
      id: string;
      universityName: string;
      countryCode: string;
      titleEn: string;
      degreeLevel: "MASTER" | "BACHELOR";
      tuitionFeeAnnualLocal: number;
      currencyCode: "GBP" | "CAD" | "EUR" | "AUD" | "USD";
      minIeltsOverall: number;
      minCgpa: number;
    }

    const catalog: ProgramSummary[] = [
      {
        id: "prg_manc_cs",
        universityName: "University of Manchester",
        countryCode: "GB",
        titleEn: "MSc Advanced Computer Science",
        degreeLevel: "MASTER",
        tuitionFeeAnnualLocal: 34500,
        currencyCode: "GBP",
        minIeltsOverall: 7.0,
        minCgpa: 3.5,
      },
      {
        id: "prg_ottawa_cs",
        universityName: "University of Ottawa",
        countryCode: "CA",
        titleEn: "Master of Computer Science (M.C.S.)",
        degreeLevel: "MASTER",
        tuitionFeeAnnualLocal: 28000,
        currencyCode: "CAD",
        minIeltsOverall: 6.5,
        minCgpa: 3.2,
      },
      {
        id: "prg_tum_informatics",
        universityName: "Technical University of Munich (TUM)",
        countryCode: "DE",
        titleEn: "M.Sc. Informatics",
        degreeLevel: "MASTER",
        tuitionFeeAnnualLocal: 6000,
        currencyCode: "EUR",
        minIeltsOverall: 6.5,
        minCgpa: 3.3,
      },
    ];

    it("accurately converts international tuition fees into BDT using official benchmark exchange rates", () => {
      // Manchester: 34,500 GBP * 153.5 BDT = 5,295,750 BDT
      const manchester = catalog.find((p) => p.id === "prg_manc_cs")!;
      const mancBdt = convertToBdt(manchester.tuitionFeeAnnualLocal, manchester.currencyCode);
      expect(mancBdt).toBeCloseTo(34500 * 153.5, -2);
      expect(mancBdt).toBeGreaterThan(5000000);

      // TUM: 6,000 EUR * 130.0 BDT = 780,000 BDT
      const tum = catalog.find((p) => p.id === "prg_tum_informatics")!;
      const tumBdt = convertToBdt(tum.tuitionFeeAnnualLocal, tum.currencyCode);
      expect(tumBdt).toBeCloseTo(6000 * 130.0, -2);
      expect(tumBdt).toBeLessThan(1000000);
    });

    it("filters and categorizes programs into Ambitious, Target, and Safe for a student", () => {
      const student = {
        cgpa: 3.45,
        ielts: 7.0,
      };

      const categorized = catalog.map((prg) => {
        let category: "AMBITIOUS" | "TARGET" | "SAFE";
        if (student.cgpa < prg.minCgpa) {
          category = "AMBITIOUS"; // Student CGPA below min requirement
        } else if (student.cgpa >= prg.minCgpa + 0.3 && student.ielts >= prg.minIeltsOverall + 0.5) {
          category = "SAFE"; // Student comfortably exceeds requirements
        } else {
          category = "TARGET"; // Solid match
        }
        return { id: prg.id, category };
      });

      // Manchester min 3.5 > student 3.45 -> AMBITIOUS
      expect(categorized.find((c) => c.id === "prg_manc_cs")?.category).toBe("AMBITIOUS");
      // Ottawa min 3.2 <= student 3.45 -> TARGET
      expect(categorized.find((c) => c.id === "prg_ottawa_cs")?.category).toBe("TARGET");
    });
  });

  describe("Scholarship Matching Pipeline", () => {
    const cheveningScholarship: ScholarshipRecord = {
      id: "sch_chevening_uk",
      titleEn: "Chevening Scholarships",
      titleBn: "যুক্তরাজ্য শেভেনিং স্কলারশিপ",
      countryCode: "GB",
      providerName: "UK FCDO",
      providerType: "GOVERNMENT",
      fundingType: "FULL_FUNDED",
      tuitionCoveragePercent: 100,
      livingStipendMonthly: 1340,
      livingStipendCurrency: "GBP",
      travelSupport: true,
      accommodationSupport: false,
      healthInsuranceCovered: true,
      visaFeeCovered: true,
      coverageDescriptionBn: "১০০% টিউশন ফি ও ভাতা",
      eligibilityCriteriaBn: "সিজিপিএ ৩.২৫+, ২ বছরের অভিজ্ঞতা",
      officialPortalUrl: "https://www.chevening.org/scholarship/bangladesh/",
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      eligibilityRules: [
        {
          eligibleDegreeLevels: ["MASTER"],
          eligibleDisciplines: ["All"],
          targetNationalities: ["BD"],
          minCgpaRequired: 3.25,
          gpaScale: 4.0,
          minIeltsRequired: 6.5,
          workExperienceMonths: 24,
          workExperienceRequired: true,
        },
      ],
    };

    const commonwealthScholarship: ScholarshipRecord = {
      id: "sch_commonwealth_uk",
      titleEn: "Commonwealth Master's Scholarships",
      titleBn: "কমনওয়েলথ মাস্টার্স স্কলারশিপ",
      countryCode: "GB",
      providerName: "Commonwealth Scholarship Commission",
      providerType: "GOVERNMENT",
      fundingType: "FULL_FUNDED",
      tuitionCoveragePercent: 100,
      livingStipendMonthly: 1300,
      livingStipendCurrency: "GBP",
      travelSupport: true,
      accommodationSupport: false,
      healthInsuranceCovered: true,
      visaFeeCovered: true,
      coverageDescriptionBn: "সম্পূর্ণ টিউশন ও ভাতা",
      eligibilityCriteriaBn: "সিজিপিএ ৩.৫০+",
      officialPortalUrl: "https://cscuk.fcdo.gov.uk/apply/",
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      eligibilityRules: [
        {
          eligibleDegreeLevels: ["MASTER"],
          eligibleDisciplines: ["All"],
          targetNationalities: ["BD"],
          minCgpaRequired: 3.5,
          gpaScale: 4.0,
          minIeltsRequired: 6.5,
          workExperienceMonths: 0,
          workExperienceRequired: false,
        },
      ],
    };

    it("matches Chevening as ELIGIBLE for a Bangladeshi student with 2+ years work experience and qualifying CGPA", () => {
      const candidate: StudentScholarshipProfileInput = {
        nationality: "BD",
        degreeLevel: "MASTER",
        discipline: "Computer Science",
        cgpa: 3.4,
        scale: 4.0,
        ieltsOverall: 7.0,
        workExperienceMonths: 28,
      };

      const result = evaluateScholarship(candidate, cheveningScholarship);
      expect(result.status).toBe("ELIGIBLE");
      expect(result.matchScore).toBeGreaterThanOrEqual(90);
      expect(result.missingConditionsBn).toHaveLength(0);
    });

    it("flags Commonwealth as NOT_ELIGIBLE if student CGPA is below 3.5 requirement", () => {
      const candidate: StudentScholarshipProfileInput = {
        nationality: "BD",
        degreeLevel: "MASTER",
        discipline: "Computer Science",
        cgpa: 3.3, // Below 3.5 requirement
        scale: 4.0,
        ieltsOverall: 7.0,
        workExperienceMonths: 12,
      };

      const result = evaluateScholarship(candidate, commonwealthScholarship);
      expect(result.status).toBe("NOT_ELIGIBLE");
      expect(result.breakdown.find((b) => b.key === "academic_cgpa")?.status).toBe("NOT_MET");
      expect(result.missingConditionsBn.length).toBeGreaterThan(0);
    });

    it("verifies official source URLs and portal links for matched scholarships", () => {
      expect(cheveningScholarship.officialPortalUrl).toMatch(/^https:\/\//);
      expect(commonwealthScholarship.officialPortalUrl).toMatch(/^https:\/\//);
      expect(cheveningScholarship.officialPortalUrl).toContain("chevening.org");
    });
  });
});
