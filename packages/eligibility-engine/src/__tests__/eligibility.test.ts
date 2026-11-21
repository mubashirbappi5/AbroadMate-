import { describe, it, expect } from "vitest";
import {
  calculateBavarianGrade,
  convertToUkHonours,
  isUkClassificationSufficient,
  evaluateAcademicRequirements,
  evaluateLanguageRequirements,
  evaluatePrerequisites,
  evaluateIntakeAndDeadline,
  evaluateProgramEligibility,
} from "../index";

describe("Deterministic Eligibility Engine", () => {
  describe("1. Bavarian Formula (Bayerische Formel) for Germany", () => {
    it("converts maximum grade 4.0 to German 1.00", () => {
      const res = calculateBavarianGrade(4.0, 4.0, 2.0);
      expect(res).not.toBeNull();
      expect(res!.germanGrade).toBe(1.0);
      expect(res!.isPassing).toBe(true);
    });

    it("converts minimum passing grade 2.0 to German 4.00", () => {
      const res = calculateBavarianGrade(2.0, 4.0, 2.0);
      expect(res).not.toBeNull();
      expect(res!.germanGrade).toBe(4.0);
      expect(res!.isPassing).toBe(true);
    });

    it("converts Bangladesh CGPA 3.25 to German 2.13", () => {
      // 1 + 3 * (4.0 - 3.25) / (4.0 - 2.0) = 1 + 3 * 0.75 / 2 = 1 + 1.125 = 2.125 -> 2.13
      const res = calculateBavarianGrade(3.25, 4.0, 2.0);
      expect(res).not.toBeNull();
      expect(res!.germanGrade).toBe(2.13);
      expect(res!.isPassing).toBe(true);
    });

    it("converts Bangladesh CGPA 3.00 to German 2.50", () => {
      // 1 + 3 * (4.0 - 3.0) / (4.0 - 2.0) = 1 + 3 * 1.0 / 2 = 1 + 1.5 = 2.50
      const res = calculateBavarianGrade(3.0, 4.0, 2.0);
      expect(res).not.toBeNull();
      expect(res!.germanGrade).toBe(2.5);
      expect(res!.isPassing).toBe(true);
    });

    it("handles failing grade below minimum passing grade (returns 5.00 Fail)", () => {
      const res = calculateBavarianGrade(1.8, 4.0, 2.0);
      expect(res).not.toBeNull();
      expect(res!.germanGrade).toBe(5.0);
      expect(res!.isPassing).toBe(false);
    });

    it("returns null for invalid scale parameters", () => {
      const res = calculateBavarianGrade(3.0, 2.0, 4.0);
      expect(res).toBeNull();
    });
  });

  describe("2. UK Honours Degree Classification Equivalency", () => {
    it("classifies CGPA >= 3.50 as FIRST_CLASS (1st)", () => {
      const res = convertToUkHonours(3.6, 4.0);
      expect(res.classification).toBe("FIRST_CLASS");
    });

    it("classifies CGPA 3.15 as UPPER_SECOND_2_1 (2:1)", () => {
      const res = convertToUkHonours(3.15, 4.0);
      expect(res.classification).toBe("UPPER_SECOND_2_1");
    });

    it("classifies CGPA 2.65 as LOWER_SECOND_2_2 (2:2)", () => {
      const res = convertToUkHonours(2.65, 4.0);
      expect(res.classification).toBe("LOWER_SECOND_2_2");
    });

    it("classifies CGPA 2.20 as THIRD_CLASS", () => {
      const res = convertToUkHonours(2.2, 4.0);
      expect(res.classification).toBe("THIRD_CLASS");
    });

    it("converts percentage 72% directly to FIRST_CLASS", () => {
      const res = convertToUkHonours(0, 4.0, 72);
      expect(res.classification).toBe("FIRST_CLASS");
    });

    it("checks hierarchy satisfaction correctly", () => {
      expect(isUkClassificationSufficient("FIRST_CLASS", "UPPER_SECOND_2_1")).toBe(true);
      expect(isUkClassificationSufficient("UPPER_SECOND_2_1", "UPPER_SECOND_2_1")).toBe(true);
      expect(isUkClassificationSufficient("LOWER_SECOND_2_2", "UPPER_SECOND_2_1")).toBe(false);
      expect(isUkClassificationSufficient("LOWER_SECOND_2_2", "LOWER_SECOND_2_2")).toBe(true);
    });
  });

  describe("3. Academic Requirements Evaluator", () => {
    const baseRequirement = {
      requiredDegreeLevel: "BACHELOR",
      requiredDisciplines: ["Computer Science", "Software Engineering"],
      minGpaOrCgpa: 3.0,
      gpaScale: 4.0,
      countryCode: "GB",
      minUkDegreeClassification: "UPPER_SECOND_2_1",
      officialSourceUrl: "https://www.manchester.ac.uk",
      requirementVersion: 1,
    };

    it("evaluates matching Bachelor degree and CGPA 3.40 as MET", () => {
      const student = {
        degreeLevel: "BACHELOR" as const,
        discipline: "Software Engineering",
        gpa: 3.4,
        scale: 4.0,
        passingYear: 2024,
        resultStatus: "PASSED" as const,
      };

      const res = evaluateAcademicRequirements(student, baseRequirement);
      expect(res.isHardFail).toBe(false);
      expect(res.items.find((i) => i.key === "academic_degree_level")?.status).toBe("MET");
      expect(res.items.find((i) => i.key === "academic_discipline")?.status).toBe("MET");
      expect(res.items.find((i) => i.key === "academic_uk_honours")?.status).toBe("MET");
    });

    it("fails when previous degree level is inadequate (HSC applying for Master)", () => {
      const student = {
        degreeLevel: "HSC" as const,
        discipline: "Science",
        gpa: 4.8,
        scale: 5.0,
        passingYear: 2024,
        resultStatus: "PASSED" as const,
      };

      const res = evaluateAcademicRequirements(student, baseRequirement);
      expect(res.isHardFail).toBe(true);
      expect(res.items.find((i) => i.key === "academic_degree_level")?.status).toBe("NOT_MET");
    });

    it("fails when discipline is completely incompatible", () => {
      const student = {
        degreeLevel: "BACHELOR" as const,
        discipline: "History & Philosophy",
        gpa: 3.8,
        scale: 4.0,
        passingYear: 2023,
        resultStatus: "PASSED" as const,
      };

      const res = evaluateAcademicRequirements(student, baseRequirement);
      expect(res.isHardFail).toBe(true);
      expect(res.items.find((i) => i.key === "academic_discipline")?.status).toBe("NOT_MET");
    });

    it("flags Studienkolleg requirement for German Bachelor with Bangladesh HSC", () => {
      const deRequirement = {
        ...baseRequirement,
        requiredDegreeLevel: "HSC",
        countryCode: "DE",
        maxGermanGrade: 2.5,
      };

      const student = {
        degreeLevel: "HSC" as const,
        discipline: "Science",
        gpa: 4.8,
        scale: 5.0,
        passingYear: 2024,
        resultStatus: "PASSED" as const,
      };

      const res = evaluateAcademicRequirements(student, deRequirement);
      const degreeItem = res.items.find((i) => i.key === "academic_degree_level");
      expect(degreeItem?.status).toBe("PARTIALLY_MET");
      expect(degreeItem?.explanationBn).toContain("স্টুডিয়ানকলেগ");
    });
  });

  describe("4. Language Requirements Evaluator", () => {
    const baseLanguageReq = {
      minIeltsOverall: 6.5,
      minIeltsEachBand: 6.0,
      minIeltsWriting: 6.0,
      allowsConditionalAdmission: true,
      preSessionalEnglishAvailable: true,
      officialSourceUrl: "https://www.manchester.ac.uk",
      requirementVersion: 1,
    };

    it("passes when all IELTS bands meet or exceed requirement", () => {
      const student = {
        testType: "IELTS" as const,
        overallScore: 7.0,
        listening: 7.5,
        reading: 7.0,
        writing: 6.5,
        speaking: 7.0,
        testDate: new Date().toISOString(),
        isPlannedOnly: false,
      };

      const res = evaluateLanguageRequirements(student, baseLanguageReq);
      expect(res.isHardFail).toBe(false);
      expect(res.canQualifyConditionally).toBe(false);
      expect(res.items.find((i) => i.key === "ielts_overall")?.status).toBe("MET");
      expect(res.items.find((i) => i.key === "ielts_writing")?.status).toBe("MET");
    });

    it("identifies sub-band deficit (e.g. 5.5 writing) and offers Pre-sessional English", () => {
      const student = {
        testType: "IELTS" as const,
        overallScore: 7.0,
        listening: 7.5,
        reading: 7.0,
        writing: 5.5, // 0.5 below cutoff 6.0
        speaking: 7.0,
        testDate: new Date().toISOString(),
        isPlannedOnly: false,
      };

      const res = evaluateLanguageRequirements(student, baseLanguageReq);
      expect(res.isHardFail).toBe(false);
      expect(res.canQualifyConditionally).toBe(true);
      expect(res.items.find((i) => i.key === "ielts_writing")?.status).toBe("PARTIALLY_MET");
    });

    it("flags expired language tests (> 2 years)", () => {
      const expiredDate = new Date();
      expiredDate.setFullYear(expiredDate.getFullYear() - 3);

      const student = {
        testType: "IELTS" as const,
        overallScore: 8.0,
        listening: 8.0,
        reading: 8.0,
        writing: 8.0,
        speaking: 8.0,
        testDate: expiredDate.toISOString(),
        isPlannedOnly: false,
      };

      const res = evaluateLanguageRequirements(student, baseLanguageReq);
      expect(res.isHardFail).toBe(true);
      expect(res.items.find((i) => i.key === "language_validity")?.status).toBe("NOT_MET");
    });

    it("handles student who has not taken any test yet (allows conditional offer)", () => {
      const student = {
        testType: "NONE" as const,
        overallScore: 0,
        isPlannedOnly: true,
      };

      const res = evaluateLanguageRequirements(student, baseLanguageReq);
      expect(res.canQualifyConditionally).toBe(true);
      expect(res.items.find((i) => i.key === "language_overall_score")?.status).toBe("PARTIALLY_MET");
    });
  });

  describe("5. Prerequisites and Deadlines Evaluator", () => {
    it("flags passed application deadlines", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const intake = {
        season: "FALL",
        year: 2025,
        applicationDeadline: yesterday,
        officialSourceUrl: "https://example.com",
      };

      const res = evaluateIntakeAndDeadline(intake);
      expect(res.deadlinePassed).toBe(true);
      expect(res.items[0]?.status).toBe("NOT_MET");
    });

    it("verifies work experience requirements", () => {
      const prereqReq = {
        workExperienceMonths: 12,
        workExperienceRequired: true,
        workExperienceField: "Software Engineering",
        greRequired: false,
        gmatRequired: false,
        portfolioRequired: false,
        officialSourceUrl: "https://example.com",
        requirementVersion: 1,
      };

      const resFail = evaluatePrerequisites({ workExperienceMonths: 6 }, prereqReq);
      expect(resFail.isHardFail).toBe(true);
      expect(resFail.items[0]?.status).toBe("NOT_MET");

      const resPass = evaluatePrerequisites({ workExperienceMonths: 18 }, prereqReq);
      expect(resPass.isHardFail).toBe(false);
      expect(resPass.items[0]?.status).toBe("MET");
    });
  });

  describe("6. Complete Deterministic Program Evaluation Engine", () => {
    const fullProgram = {
      id: "prog-1",
      titleEn: "MSc Advanced Computer Science",
      titleBn: "মাস্টার্স ইন অ্যাডভান্সড কম্পিউটার সায়েন্স",
      universityId: "uni-1",
      universityNameEn: "University of Manchester",
      universityNameBn: "ম্যানচেস্টার বিশ্ববিদ্যালয়",
      countryCode: "GB",
      officialAdmissionsUrl: "https://www.manchester.ac.uk/study/masters/courses/list/08343/msc-advanced-computer-science/",
    };

    const fullRequirement = {
      requiredDegreeLevel: "BACHELOR",
      requiredDisciplines: ["Computer Science", "Software Engineering"],
      minGpaOrCgpa: 3.25,
      gpaScale: 4.0,
      countryCode: "GB",
      minUkDegreeClassification: "UPPER_SECOND_2_1",
      minIeltsOverall: 7.0,
      minIeltsEachBand: 6.5,
      minIeltsWriting: 6.5,
      allowsConditionalAdmission: true,
      preSessionalEnglishAvailable: true,
      workExperienceMonths: 0,
      workExperienceRequired: false,
      greRequired: false,
      gmatRequired: false,
      portfolioRequired: false,
      officialSourceUrl: "https://www.manchester.ac.uk",
      requirementVersion: 1,
    };

    const openIntake = {
      season: "FALL",
      year: 2026,
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120), // 120 days in future
      officialSourceUrl: "https://www.manchester.ac.uk",
    };

    it("evaluates a fully qualifying student as ELIGIBLE", () => {
      const output = evaluateProgramEligibility({
        program: fullProgram,
        requirement: fullRequirement,
        intake: openIntake,
        student: {
          academicRecord: {
            degreeLevel: "BACHELOR",
            discipline: "Computer Science",
            gpa: 3.65,
            scale: 4.0,
            passingYear: 2024,
            resultStatus: "PASSED",
          },
          languageTest: {
            testType: "IELTS",
            overallScore: 7.5,
            listening: 8.0,
            reading: 7.5,
            writing: 7.0,
            speaking: 7.0,
            testDate: new Date().toISOString(),
            isPlannedOnly: false,
          },
        },
      });

      expect(output.verdict).toBe("ELIGIBLE");
      expect(output.visaDistinctionNoticeBn).toBeDefined();
      expect(output.admissionGuaranteeDisclaimerBn).toBeDefined();
    });

    it("evaluates a student with good academics but pending IELTS as CONDITIONALLY_ELIGIBLE", () => {
      const output = evaluateProgramEligibility({
        program: fullProgram,
        requirement: fullRequirement,
        intake: openIntake,
        student: {
          academicRecord: {
            degreeLevel: "BACHELOR",
            discipline: "Computer Science",
            gpa: 3.5,
            scale: 4.0,
            passingYear: 2024,
            resultStatus: "PASSED",
          },
          languageTest: {
            testType: "NONE",
            overallScore: 0,
            isPlannedOnly: true,
          },
        },
      });

      expect(output.verdict).toBe("CONDITIONALLY_ELIGIBLE");
      expect(output.missingInformationListBn.length).toBeGreaterThan(0);
    });

    it("evaluates a student with missing academic records as UNABLE_TO_DETERMINE", () => {
      const output = evaluateProgramEligibility({
        program: fullProgram,
        requirement: fullRequirement,
        intake: openIntake,
        student: {},
      });

      expect(output.verdict).toBe("UNABLE_TO_DETERMINE");
    });
  });
});
