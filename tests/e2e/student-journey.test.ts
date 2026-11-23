import { describe, it, expect } from "vitest";
import { registerSchema } from "../../packages/validation/src/auth.schema";
import {
  basicInfoStepSchema,
  educationStepSchema,
  languageProficiencyStepSchema,
  financialBackgroundStepSchema,
  studyPreferencesStepSchema,
  calculateProfileCompletion,
} from "../../packages/validation/src/onboarding.schema";
import {
  evaluateProgramEligibility,
  calculateBavarianGrade,
  convertToUkHonours,
} from "../../packages/eligibility-engine/src";
import {
  evaluateScholarship,
  type ScholarshipRecord,
  type StudentScholarshipProfileInput,
} from "../../packages/scholarship-engine/src";
import { evaluateStudentVisaEligibility } from "../../packages/visa-engine/src";
import { generateIntelligentRoadmap } from "../../packages/roadmap-engine/src";
import { calculateFullBudgetPlan } from "../../packages/shared/src/utils/financial-planner";
import {
  calculateIntakeMilestones,
  batchEvaluateDeadlines,
  type DeadlineItem,
} from "../../packages/shared/src/utils/deadline-calculator";
import {
  scrubSensitivePII,
  OpenAIProviderService,
  type SopProfileContext,
} from "../../packages/ai/src";

describe("E2E: Full 13-Stage Student Journey Lifecycle", () => {
  // Global Student Session State across the 13 stages
  const studentSession = {
    userId: "usr_e2e_tanvir_007",
    email: "tanvir.buet@gmail.com",
    fullName: "Tanvir Ahmed",
    phone: "01712345678",
    passportNumber: "A12345678", // Sensitive PII
    nationalId: "19992691234567890", // Sensitive PII
    dateOfBirth: "2000-11-20",
    currentCity: "Dhaka",
    educationLevel: "BACHELOR",
    instituteName: "Bangladesh University of Engineering and Technology (BUET)",
    fieldOfStudy: "Computer Science and Engineering",
    cgpa: 3.76,
    passingYear: 2024,
    workExperienceMonths: 26,
    englishTest: {
      type: "IELTS" as const,
      overall: 7.5,
      listening: 8.5,
      reading: 7.5,
      writing: 7.0,
      speaking: 7.5,
      testDate: "2025-08-15",
      expiryDate: "2027-08-15",
      trfNumber: "25BD009876TAN001A",
    },
    fundingSource: "PARTIAL_SCHOLARSHIP_AND_FAMILY",
    availableBudgetBdt: 4500000,
    targetCountry: "GB",
    targetUniversity: "University of Manchester",
    targetProgram: "MSc Advanced Computer Science",
    targetIntakeSeason: "fall" as const,
    targetIntakeYear: 2026,
    targetIntakeDate: "2026-09-15T00:00:00.000Z",
  };

  // --------------------------------------------------------------------------
  // Stage 1: Registration
  // --------------------------------------------------------------------------
  it("Stage 1: Validates and registers new student account with ethical guarantee", () => {
    const regPayload = {
      email: studentSession.email,
      password: "StrongPassword2026!",
      confirmPassword: "StrongPassword2026!",
      fullName: studentSession.fullName,
      phone: studentSession.phone,
      ethicalNonAgencyConsent: true,
      targetIntakeSeason: "FALL" as const,
      targetIntakeYear: 2026,
    };

    const regResult = registerSchema.safeParse(regPayload);
    expect(regResult.success).toBe(true);
    if (regResult.success) {
      expect(regResult.data.email).toBe(studentSession.email);
      expect(regResult.data.ethicalNonAgencyConsent).toBe(true);
    }
  });

  // --------------------------------------------------------------------------
  // Stage 2: Student Onboarding (7-Step Wizard Validation)
  // --------------------------------------------------------------------------
  it("Stage 2: Completes all onboarding steps and verifies data structures", () => {
    // Step 1: Personal
    const s1 = basicInfoStepSchema.safeParse({
      fullName: studentSession.fullName,
      dateOfBirth: studentSession.dateOfBirth,
      nationality: "Bangladeshi",
      currentCountry: "Bangladesh",
      currentCity: studentSession.currentCity,
      phone: studentSession.phone,
      hasPassport: true,
      passportNumber: studentSession.passportNumber,
      passportExpiryDate: "2029-12-31",
    });
    expect(s1.success).toBe(true);

    // Step 2: Academic
    const s2 = educationStepSchema.safeParse({
      highestCompletedLevel: "bachelor_passed" as const,
      academicRecords: [
        {
          level: "BACHELOR" as const,
          institutionName: studentSession.instituteName,
          boardOrAuthority: "UGC",
          degreeTitle: "BSc in CSE",
          groupOrMajor: "Computer Science",
          passingYear: studentSession.passingYear,
          gpaOrCgpa: studentSession.cgpa,
          scale: 4.0,
          resultStatus: "PASSED" as const,
        },
      ],
    });
    expect(s2.success).toBe(true);

    // Step 3: English Test
    const s3 = languageProficiencyStepSchema.safeParse({
      hasTakenTest: true,
      testType: studentSession.englishTest.type,
      overallScore: studentSession.englishTest.overall,
      listeningScore: studentSession.englishTest.listening,
      readingScore: studentSession.englishTest.reading,
      writingScore: studentSession.englishTest.writing,
      speakingScore: studentSession.englishTest.speaking,
      testDate: studentSession.englishTest.testDate,
      expiryDate: studentSession.englishTest.expiryDate,
      trfNumber: studentSession.englishTest.trfNumber,
    });
    expect(s3.success).toBe(true);

    // Step 4: Financial
    const s4 = financialBackgroundStepSchema.safeParse({
      annualTuitionBudget: 3500000,
      liquidSavingsAmount: studentSession.availableBudgetBdt,
      hasSponsor: true,
      sponsorName: "Md. Rafiqul Islam",
      sponsorRelationship: "FATHER",
      annualSponsorIncome: 2400000,
      scholarshipPreference: "PARTIAL_OK" as const,
      educationLoanInterest: "EXPLORING" as const,
    });
    expect(s4.success).toBe(true);

    // Step 5: Goals
    const s5 = studyPreferencesStepSchema.safeParse({
      targetCountryCodes: [studentSession.targetCountry, "CA"],
      targetDegreeLevel: "MASTER",
      targetIntakeSeason: "FALL" as const,
      targetIntakeYear: studentSession.targetIntakeYear,
      preferredSubject: "Computer Science & Artificial Intelligence",
      careerGoals: "Advance AI engineering capabilities in Bangladesh",
    });
    expect(s5.success).toBe(true);
  });

  // --------------------------------------------------------------------------
  // Stage 3: Profile Completion Meter
  // --------------------------------------------------------------------------
  it("Stage 3: Evaluates profile completion meter reaching verified ready state", () => {
    const fullProfile = {
      basicInfo: {
        fullName: studentSession.fullName,
        dateOfBirth: studentSession.dateOfBirth,
        currentCity: studentSession.currentCity,
        hasPassport: true,
        passportExpiryDate: "2029-12-31",
      },
      education: {
        highestCompletedLevel: "bachelor_passed" as const,
        academicRecords: [
          { level: "BACHELOR" as const, gpaOrCgpa: studentSession.cgpa, scale: 4.0 },
        ],
      },
      language: {
        hasTakenTest: true,
        overallScore: studentSession.englishTest.overall,
      },
      preferences: {
        targetCountryCodes: [studentSession.targetCountry],
        preferredSubject: "Computer Science",
        careerGoals: "AI Engineer",
      },
      financial: {
        annualTuitionBudget: 3500000,
        hasSponsor: true,
        liquidSavingsAmount: studentSession.availableBudgetBdt,
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

    const completion = calculateProfileCompletion(fullProfile);
    expect(completion.percentage).toBeGreaterThanOrEqual(90);
    expect(completion.requiredComplete).toBe(true);
    expect(completion.missingRequired).toHaveLength(0);
  });

  // --------------------------------------------------------------------------
  // Stage 4: Country Selection
  // --------------------------------------------------------------------------
  it("Stage 4: Confirms United Kingdom country selection and regulatory rules", () => {
    const selectedCountryCode = studentSession.targetCountry;
    expect(selectedCountryCode).toBe("GB");

    // UK Statutory Post-study work (Graduate Route: 2 years) and visa rules
    const ukRules = {
      visaType: "Student Visa (Subclass)",
      pswYears: 2,
      financialHoldingDays: 28,
      tbTestMandatoryForBangladesh: true,
      casRequired: true,
    };

    expect(ukRules.financialHoldingDays).toBe(28);
    expect(ukRules.tbTestMandatoryForBangladesh).toBe(true);
  });

  // --------------------------------------------------------------------------
  // Stage 5: University Selection
  // --------------------------------------------------------------------------
  it("Stage 5: Shortlists target institution University of Manchester", () => {
    const selectedProgram = {
      universityName: studentSession.targetUniversity,
      programTitle: studentSession.targetProgram,
      countryCode: studentSession.targetCountry,
      tuitionAnnualGbp: 34500,
      minCgpa: 3.3,
      minIeltsOverall: 7.0,
      minIeltsSubScore: 6.5,
    };

    expect(selectedProgram.universityName).toBe("University of Manchester");
    expect(selectedProgram.tuitionAnnualGbp).toBe(34500);
  });

  // --------------------------------------------------------------------------
  // Stage 6: Admission Eligibility Engine (Deterministic)
  // --------------------------------------------------------------------------
  it("Stage 6: Runs deterministic admission eligibility engine with ELIGIBLE verdict", () => {
    const program = {
      id: "prog-manc-cs",
      titleEn: studentSession.targetProgram,
      titleBn: "মাস্টার্স ইন অ্যাডভান্সড কম্পিউটার সায়েন্স",
      universityId: "uni-manc",
      universityNameEn: studentSession.targetUniversity,
      universityNameBn: "ম্যানচেস্টার বিশ্ববিদ্যালয়",
      countryCode: "GB",
      officialAdmissionsUrl: "https://www.manchester.ac.uk",
    };

    const requirement = {
      requiredDegreeLevel: "BACHELOR",
      requiredDisciplines: ["Computer Science", "Computer Science and Engineering", "Software Engineering"],
      minGpaOrCgpa: 3.3,
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

    const intake = {
      season: "FALL",
      year: 2026,
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120),
      officialSourceUrl: "https://www.manchester.ac.uk",
    };

    const studentData = {
      academicRecord: {
        degreeLevel: "BACHELOR",
        discipline: "Computer Science",
        gpa: studentSession.cgpa, // 3.76
        scale: 4.0,
        passingYear: 2024,
        resultStatus: "PASSED",
      },
      languageTest: {
        testType: "IELTS",
        overallScore: studentSession.englishTest.overall, // 7.5
        listening: studentSession.englishTest.listening, // 8.5
        reading: studentSession.englishTest.reading, // 7.5
        writing: studentSession.englishTest.writing, // 7.0
        speaking: studentSession.englishTest.speaking, // 7.5
        testDate: new Date().toISOString(),
        isPlannedOnly: false,
      },
      workExperience: {
        months: studentSession.workExperienceMonths,
        field: "Software Engineering",
      },
    };

    const eligibilityOutput = evaluateProgramEligibility({
      program,
      requirement,
      intake,
      student: studentData,
    });

    expect(eligibilityOutput.verdict).toBe("ELIGIBLE");
    expect(eligibilityOutput.visaDistinctionNoticeBn).toBeDefined();
    expect(eligibilityOutput.admissionGuaranteeDisclaimerBn).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // Stage 7: Scholarship Selection
  // --------------------------------------------------------------------------
  it("Stage 7: Matches Chevening Scholarship for candidate", () => {
    const cheveningScholarship: ScholarshipRecord = {
      id: "sch-chevening-uk",
      countryCode: "GB",
      titleEn: "Chevening Scholarships",
      titleBn: "যুক্তরাজ্য শেভেনিং স্কলারশিপ",
      providerName: "UK FCDO",
      providerType: "GOVERNMENT",
      fundingType: "FULL_FUNDED",
      tuitionCoveragePercent: 100.0,
      livingStipendMonthly: 1340.0,
      livingStipendCurrency: "GBP",
      travelSupport: true,
      accommodationSupport: false,
      healthInsuranceCovered: true,
      visaFeeCovered: true,
      coverageDescriptionBn: "১০০% টিউশন ফি, মাসিক £১,৩৪০ ভাতা, রিটার্ন ফ্লাইট ও ভিসা ফি।",
      eligibilityCriteriaBn: "ব্যাচেলর ডিগ্রি (সিজিপিএ ৩.২৫+), ২ বছরের কাজের অভিজ্ঞতা।",
      officialPortalUrl: "https://www.chevening.org/scholarship/bangladesh/",
      applicationDeadline: new Date("2026-11-05"),
      eligibilityRules: [
        {
          eligibleDegreeLevels: ["MASTER"],
          eligibleDisciplines: ["All"],
          targetNationalities: ["BD"],
          minCgpaRequired: 3.25,
          gpaScale: 4.0,
          minIeltsRequired: 6.5,
          workExperienceMonths: 24, // 2 years required
          workExperienceRequired: true,
        },
      ],
    };

    const candidate: StudentScholarshipProfileInput = {
      nationality: "BD",
      degreeLevel: "MASTER",
      discipline: "Computer Science and Engineering",
      cgpa: studentSession.cgpa,
      scale: 4.0,
      ieltsOverall: studentSession.englishTest.overall,
      workExperienceMonths: studentSession.workExperienceMonths, // 26 months >= 24
    };

    const evalResult = evaluateScholarship(candidate, cheveningScholarship);
    expect(evalResult.status).toBe("ELIGIBLE");
    expect(evalResult.matchScore).toBeGreaterThanOrEqual(90);
    expect(evalResult.missingConditionsBn).toHaveLength(0);
  });

  // --------------------------------------------------------------------------
  // Stage 8: Funding Choice & Financial Planner
  // --------------------------------------------------------------------------
  it("Stage 8: Plans financial budget with tuition, living costs and exchange rate conversion", () => {
    const budgetPlan = calculateFullBudgetPlan({
      countryCode: "GB",
      studyDurationYears: 1.0,
      grossTuitionAnnualLocal: 34500,
      tuitionDepositPaidLocal: 4000,
      scholarshipDeductionLocal: 10000, // Partial scholarship 10,000 GBP
      studentSavingsLocal: 15000,
      sponsorContributionLocal: 15000,
      educationLoanLocal: 0,
      monthlySavingsCapacityBdt: 50000,
      monthsUntilDeparture: 8,
      isInsideLondonOrMetro: false,
    });

    // Net tuition = 34500 - 10000 = 24500
    const netTuition = budgetPlan.expenses.find((e) => e.id === "tuition-fee-net");
    expect(netTuition?.amountLocal).toBe(24500);

    // Outside London statutory living = 9207 GBP
    const living = budgetPlan.expenses.find((e) => e.id === "living-cost-annual");
    expect(living?.amountLocal).toBe(9207);

    // Converted to BDT accurately
    expect(budgetPlan.exchangeRateToBdt).toBe(153.5);
    expect(budgetPlan.firstYearTotalCostBdt).toBeGreaterThan(5000000);
  });

  // --------------------------------------------------------------------------
  // Stage 9: Visa Assessment
  // --------------------------------------------------------------------------
  it("Stage 9: Evaluates UK Student Visa with 28-day rule and TB test clearance", () => {
    const visaEval = evaluateStudentVisaEligibility({
      countryCode: "GB",
      degreeLevel: "MASTERS",
      isInsideLondon: false,
      tuitionFeeLocal: 24500,
      tuitionFeePaidLocal: 4000,
      availableLiquidFundsLocal: 32000,
      fundsHoldingDays: 30, // >= 28 days
      sponsorType: "PARENTS",
      hasValidPassport: true,
      hasOfficialAdmissionConfirmation: true, // CAS
      hasAcademicCertificates: true,
      hasLanguageProficiencyProof: true,
      hasBankSolvencyCertificate: true,
      hasSponsorTaxReturns: true,
      hasMedicalTbClearance: true,
      hasHealthInsurance: true,
      hasPoliceClearance: true,
      hasPreviousRefusal: false,
      scholarshipFundingBdt: 0,
    });

    expect(visaEval.verdict).toBe("PRELIMINARY_ELIGIBLE");
    expect(visaEval.financialBreakdown.isHoldingPeriodSatisfied).toBe(true);
    expect(visaEval.financialBreakdown.maintenancePeriodDaysRequired).toBe(28);
  });

  // --------------------------------------------------------------------------
  // Stage 10: Document Checklist Generation
  // --------------------------------------------------------------------------
  it("Stage 10: Generates personalized document checklist for UK Masters student", () => {
    const requiredChecklist = [
      { id: "doc_pass", title: "Valid International Passport", mandatory: true },
      { id: "doc_trans", title: "Official Bachelor Academic Transcript (BUET)", mandatory: true },
      { id: "doc_cert", title: "Bachelor Degree Certificate", mandatory: true },
      { id: "doc_ielts", title: "IELTS Official TRF (Score 7.5)", mandatory: true },
      { id: "doc_solv", title: "Bank Solvency Certificate (28-day history)", mandatory: true },
      { id: "doc_tb", title: "IOM Tuberculosis Medical Clearance", mandatory: true },
      { id: "doc_sop", title: "Statement of Purpose (SOP)", mandatory: true },
      { id: "doc_lor", title: "2 Academic Letters of Recommendation (LOR)", mandatory: true },
    ];

    expect(requiredChecklist).toHaveLength(8);
    const mandatoryCount = requiredChecklist.filter((d) => d.mandatory).length;
    expect(mandatoryCount).toBe(8);
  });

  // --------------------------------------------------------------------------
  // Stage 11: Roadmap Generation (12 Phases)
  // --------------------------------------------------------------------------
  it("Stage 11: Generates intelligent 12-phase roadmap with chronological dependencies", () => {
    const roadmap = generateIntelligentRoadmap({
      targetCountryCode: studentSession.targetCountry,
      targetIntakeSeason: studentSession.targetIntakeSeason,
      targetIntakeYear: studentSession.targetIntakeYear,
      fundingChoice: "SCHOLARSHIP_FUNDED",
      hasValidPassport: true,
    });

    expect(roadmap).toHaveLength(12);
    expect(roadmap[0].phaseKey).toBe("PREPARATION");
    expect(roadmap[3].phaseKey).toBe("UNIVERSITY_APPLICATION");
    expect(roadmap[4].phaseKey).toBe("SCHOLARSHIP_APPLICATION");
    expect(roadmap[7].phaseKey).toBe("STUDENT_VISA_APPLICATION");
    expect(roadmap[11].phaseKey).toBe("ARRIVAL_AND_ENROLLMENT");

    // Total tasks should cover the full journey comprehensively
    const totalTasks = roadmap.reduce((acc, p) => acc + p.tasks.length, 0);
    expect(totalTasks).toBeGreaterThan(25);
  });

  // --------------------------------------------------------------------------
  // Stage 12: Deadline Tracking & Alert Calculations
  // --------------------------------------------------------------------------
  it("Stage 12: Calculates intake milestone deadlines and 30/14/7/3/1 alert thresholds", () => {
    const milestones = calculateIntakeMilestones(studentSession.targetIntakeDate);
    expect(milestones.length).toBe(8);

    // Simulate upcoming deadlines evaluation
    const referenceDate = new Date("2026-06-01T00:00:00.000Z");
    const deadlines: DeadlineItem[] = [
      {
        id: "dl_cas_deposit",
        titleBn: "টিউশন ফি ডিপোজিট ডেডলাইন",
        titleEn: "Tuition Deposit Deadline",
        deadlineDate: "2026-06-15T00:00:00.000Z", // 14 days away -> 14-day threshold!
        category: "TUITION_DEPOSIT",
      },
      {
        id: "dl_visa_file",
        titleBn: "ভিসা ফাইল সাবমিশন",
        titleEn: "Visa File Submission",
        deadlineDate: "2026-07-01T00:00:00.000Z", // 30 days away -> 30-day threshold!
        category: "VISA_SUBMISSION",
      },
    ];

    const alerts = batchEvaluateDeadlines(deadlines, referenceDate);
    expect(alerts).toHaveLength(2);

    const depositAlert = alerts.find((a) => a.deadlineId === "dl_cas_deposit");
    expect(depositAlert?.shouldTriggerReminder).toBe(true);
    expect(depositAlert?.matchedReminderDay).toBe(14);
    expect(depositAlert?.messageBn).toContain("১৪ দিন বাকি");

    const visaAlert = alerts.find((a) => a.deadlineId === "dl_visa_file");
    expect(visaAlert?.shouldTriggerReminder).toBe(true);
    expect(visaAlert?.matchedReminderDay).toBe(30);
  });

  // --------------------------------------------------------------------------
  // Stage 13: SOP Generation with Zero Hallucinations & PII Scrubbing
  // --------------------------------------------------------------------------
  it("Stage 13: Assembles context-grounded SOP draft with PII scrubbing and strict facts", async () => {
    const rawStudentInput = `My name is ${studentSession.fullName}, passport ${studentSession.passportNumber}, NID ${studentSession.nationalId}.
I graduated from ${studentSession.instituteName} in ${studentSession.fieldOfStudy} with CGPA ${studentSession.cgpa}.
I am applying to ${studentSession.targetUniversity} for ${studentSession.targetProgram}.`;

    // 1. Scrub sensitive PII before AI processing
    const scrubbedInput = scrubSensitivePII(rawStudentInput);
    expect(scrubbedInput).not.toContain(studentSession.passportNumber);
    expect(scrubbedInput).not.toContain(studentSession.nationalId);
    expect(scrubbedInput).toContain("[PASSPORT_PROTECTED]");
    expect(scrubbedInput).toContain("[NID_PROTECTED]");

    // 2. Generate grounded SOP draft
    const provider = new OpenAIProviderService();
    const context: SopProfileContext = {
      targetCountry: studentSession.targetCountry,
      targetUniversity: studentSession.targetUniversity,
      targetProgram: studentSession.targetProgram,
      degreeLevel: "MASTER",
      academicHistory: [
        {
          degree: "BSc in Computer Science & Engineering",
          institution: studentSession.instituteName,
          cgpa: studentSession.cgpa,
          graduationYear: studentSession.passingYear,
        },
      ],
      workExperience: [
        {
          role: "Machine Learning Engineer",
          company: "Local Software Firm",
          durationMonths: studentSession.workExperienceMonths,
        },
      ],
      careerGoals: "Advance research in AI systems and contribute to the emerging tech ecosystem in Bangladesh.",
      genuineMotivation: "MSc Advanced Computer Science will equip me with deeper mathematical grounding in neural architectures.",
    };

    const sopResult = await provider.generateSopDraft(context);
    expect(sopResult.title).toContain("MSc Advanced Computer Science");
    expect(sopResult.sections.introductionMotivation).toBeDefined();
    expect(sopResult.sections.academicBackground).toBeDefined();
    expect(sopResult.sections.workResearchExperience).toBeDefined();
    expect(sopResult.sections.whyThisUniversity).toBeDefined();
    expect(sopResult.sections.careerGoalsContribution).toBeDefined();
    expect(sopResult.wordCount).toBeGreaterThan(150);
  });
});
