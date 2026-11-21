import { z } from "zod";
import { bangladeshPhoneRegex } from "./auth.schema";

// -------------------------------------------------------------
// Step 1: Basic Personal & Contact Information
// -------------------------------------------------------------
export const basicInfoStepSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "পাসপোর্ট অনুযায়ী আপনার পূর্ণ নাম লিখুন (কমপক্ষে ২ অক্ষর)")
      .max(100, "নাম সর্বোচ্চ ১০০ অক্ষরের মধ্যে হতে হবে"),
    dateOfBirth: z
      .string()
      .min(1, "সঠিক জন্মতারিখ নির্বাচন করুন (YYYY-MM-DD)")
      .refine((val) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) return false;
        const ageInYears = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        return ageInYears >= 15 && ageInYears <= 65;
      }, "বয়স অবশ্যই ১৫ থেকে ৬৫ বছরের মধ্যে হতে হবে"),
    nationality: z.string().min(2, "জাতীয়তা উল্লেখ করুন").default("Bangladeshi"),
    currentCountry: z.string().min(2, "বর্তমান দেশ উল্লেখ করুন").default("Bangladesh"),
    currentCity: z
      .string()
      .min(2, "আপনার বর্তমান শহর উল্লেখ করুন (যেমন: ঢাকা, চট্টগ্রাম, সিলেট)"),
    hasPassport: z.boolean().default(false),
    passportNumber: z.string().optional().or(z.literal("")),
    passportExpiryDate: z.string().optional().or(z.literal("")),
    phone: z
      .string()
      .regex(bangladeshPhoneRegex, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)"),
    alternatePhone: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.hasPassport) {
        return !!data.passportExpiryDate && data.passportExpiryDate.length > 0;
      }
      return true;
    },
    {
      message: "পাসপোর্ট থাকলে পাসপোর্টের মেয়াদোত্তীর্ণের তারিখ প্রদান করা আবশ্যক",
      path: ["passportExpiryDate"],
    }
  );

export type BasicInfoStepInput = z.infer<typeof basicInfoStepSchema>;

// -------------------------------------------------------------
// Step 2: Education Background & Academic Records
// -------------------------------------------------------------
export const singleAcademicRecordSchema = z.object({
  id: z.string().optional(),
  level: z.enum([
    "SSC",
    "HSC",
    "O_LEVEL",
    "A_LEVEL",
    "DIPLOMA",
    "BACHELOR",
    "MASTER",
    "PHD",
  ]),
  institutionName: z
    .string()
    .min(2, "শিক্ষা প্রতিষ্ঠানের নাম লিখুন (কমপক্ষে ২ অক্ষর)"),
  boardOrAuthority: z.string().optional().or(z.literal("")),
  groupOrMajor: z
    .string()
    .min(2, "বিভাগ বা পড়ার বিষয় উল্লেখ করুন (যেমন: Science, CSE, BBA)"),
  gpaOrCgpa: z
    .number()
    .min(0, "জিপিএ/সিজিপিএ ০ এর কম হতে পারে না")
    .max(100, "জিপিএ সর্বোচ্চ স্কেলের মধ্যে হতে হবে"),
  scale: z.number().min(4).max(100).default(4.0),
  startYear: z.number().int().min(1990).max(2030).optional(),
  passingYear: z
    .number({ required_error: "পাশের বছর উল্লেখ করুন" })
    .int()
    .min(1990, "সঠিক পাশের বছর দিন")
    .max(2030, "পাশের বছর ২০৩০ এর বেশি হতে পারে না"),
  resultStatus: z.enum(["PASSED", "RUNNING", "ENROLLED"]).default("PASSED"),
  hasBacklogs: z.boolean().default(false),
  backlogsCount: z.number().int().min(0).default(0),
  transcriptDocId: z.string().optional().or(z.literal("")),
  certificateDocId: z.string().optional().or(z.literal("")),
});

export type SingleAcademicRecordInput = z.infer<typeof singleAcademicRecordSchema>;

export const educationStepSchema = z.object({
  highestCompletedLevel: z.enum([
    "hsc_passed",
    "a_level",
    "diploma",
    "bachelor_running",
    "bachelor_passed",
    "master_passed",
    "phd",
  ]),
  academicRecords: z
    .array(singleAcademicRecordSchema)
    .min(1, "কমপক্ষে একটি শিক্ষাগত রেকর্ড যোগ করা আবশ্যক"),
});

export type EducationStepInput = z.infer<typeof educationStepSchema>;

// -------------------------------------------------------------
// Step 3: Language Proficiency
// -------------------------------------------------------------
export const languageProficiencyStepSchema = z
  .object({
    hasTakenTest: z.boolean().default(false),
    testType: z.enum([
      "IELTS",
      "TOEFL",
      "PTE",
      "DUOLINGO",
      "MOI",
      "NOT_TAKEN",
    ]),
    overallScore: z.number().min(0).max(160).optional(),
    listeningScore: z.number().min(0).max(120).optional(),
    readingScore: z.number().min(0).max(120).optional(),
    writingScore: z.number().min(0).max(120).optional(),
    speakingScore: z.number().min(0).max(120).optional(),
    testDate: z.string().optional().or(z.literal("")),
    expiryDate: z.string().optional().or(z.literal("")),
    trfNumber: z.string().optional().or(z.literal("")),
    plannedTestDate: z.string().optional().or(z.literal("")),
    certificateDocId: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.hasTakenTest && data.testType !== "NOT_TAKEN" && data.testType !== "MOI") {
        return typeof data.overallScore === "number" && data.overallScore > 0;
      }
      return true;
    },
    {
      message: "পরীক্ষা সম্পন্ন করে থাকলে সার্বিক স্কোর (Overall Score) দেওয়া আবশ্যক",
      path: ["overallScore"],
    }
  )
  .refine(
    (data) => {
      if (data.hasTakenTest && data.testType === "IELTS" && typeof data.overallScore === "number") {
        return data.overallScore <= 9.0;
      }
      return true;
    },
    {
      message: "আইইএলটিএস স্কোর সর্বোচ্চ ৯.০ হতে পারে",
      path: ["overallScore"],
    }
  )
  .refine(
    (data) => {
      if (data.hasTakenTest && data.testType === "PTE" && typeof data.overallScore === "number") {
        return data.overallScore <= 90;
      }
      return true;
    },
    {
      message: "পিটিই স্কোর সর্বোচ্চ ৯০ হতে পারে",
      path: ["overallScore"],
    }
  )
  .refine(
    (data) => {
      if (data.hasTakenTest && data.testType === "TOEFL" && typeof data.overallScore === "number") {
        return data.overallScore <= 120;
      }
      return true;
    },
    {
      message: "টোফেল স্কোর সর্বোচ্চ ১২০ হতে পারে",
      path: ["overallScore"],
    }
  );

export type LanguageProficiencyStepInput = z.infer<
  typeof languageProficiencyStepSchema
>;

// -------------------------------------------------------------
// Step 4: Study Preferences & Career Vision
// -------------------------------------------------------------
export const studyPreferencesStepSchema = z.object({
  desiredDegreeLevel: z.enum(["BACHELOR", "MASTER", "PHD"]).default("MASTER"),
  preferredSubject: z
    .string()
    .min(2, "যে বিষয়ে পড়তে চান তা উল্লেখ করুন (যেমন: Data Science, MBA)"),
  targetCountryCodes: z
    .array(z.string())
    .min(1, "কমপক্ষে একটি পছন্দের দেশ নির্বাচন করুন (যেমন: UK, Canada, Germany)"),
  targetIntakeSeason: z.enum(["FALL", "SPRING", "SUMMER"]).default("FALL"),
  targetIntakeYear: z.number().int().min(2025).max(2030).default(2026),
  studyMode: z.enum(["FULL_TIME", "PART_TIME", "HYBRID"]).default("FULL_TIME"),
  preferredCityType: z
    .enum(["AFFORDABLE_STUDENT_TOWN", "METROPOLITAN", "RESEARCH_CAMPUS"])
    .default("AFFORDABLE_STUDENT_TOWN"),
  pswWorkImportance: z.enum(["HIGH", "MEDIUM", "LOW"]).default("HIGH"),
  academicGoals: z.string().optional().or(z.literal("")),
  careerGoals: z.string().optional().or(z.literal("")),
});

export type StudyPreferencesStepInput = z.infer<
  typeof studyPreferencesStepSchema
>;

// -------------------------------------------------------------
// Step 5: Financial Background & Sponsorship
// -------------------------------------------------------------
export const financialBackgroundStepSchema = z
  .object({
    annualTuitionBudget: z
      .number({ required_error: "বার্ষিক টিউশন ফি বাজেট উল্লেখ করুন" })
      .min(300000, "বার্ষিক টিউশন বাজেট কমপক্ষে ৩ লাখ টাকা হতে হবে"),
    budgetCurrencyCode: z.string().default("BDT"),
    liquidSavingsAmount: z.number().min(0).default(0),
    savingsCurrencyCode: z.string().default("BDT"),
    primaryBankName: z.string().optional().or(z.literal("")),
    fundingStrategyType: z
      .enum(["SELF", "PARTIAL_SCHOLARSHIP", "FULL_SCHOLARSHIP", "SELF_AND_FAMILY"])
      .default("SELF_AND_FAMILY"),
    hasSponsor: z.boolean().default(true),
    sponsorRelationship: z
      .enum([
        "SELF",
        "FATHER",
        "MOTHER",
        "SPOUSE",
        "SIBLING",
        "ORGANIZATION",
        "GOVERNMENT",
        "OTHER",
      ])
      .default("FATHER"),
    sponsorName: z.string().optional().or(z.literal("")),
    sponsorOccupation: z.string().optional().or(z.literal("")),
    annualSponsorIncome: z.number().min(0).optional(),
    scholarshipPreference: z
      .enum(["FULL_ONLY", "PARTIAL_OK", "NO_NEED"])
      .default("PARTIAL_OK"),
    educationLoanInterest: z
      .enum(["EXPLORING", "APPLIED", "NOT_INTERESTED"])
      .default("NOT_INTERESTED"),
  })
  .refine(
    (data) => {
      if (data.hasSponsor && data.sponsorRelationship !== "SELF") {
        return !!data.sponsorName && data.sponsorName.length >= 2;
      }
      return true;
    },
    {
      message: "স্পন্সরের নাম উল্লেখ করা আবশ্যক",
      path: ["sponsorName"],
    }
  );

export type FinancialBackgroundStepInput = z.infer<
  typeof financialBackgroundStepSchema
>;

// -------------------------------------------------------------
// Step 6: Immigration History
// -------------------------------------------------------------
export const immigrationHistoryStepSchema = z
  .object({
    hasTravelHistory: z.boolean().default(false),
    travelHistorySummary: z.string().optional().or(z.literal("")),
    countryCode: z.string().default("NONE"),
    visaTypeApplied: z.string().optional().or(z.literal("")),
    applicationYear: z.number().int().min(2000).max(2026).optional(),
    outcomeStatus: z
      .enum(["GRANTED", "REFUSED", "WITHDRAWN", "NONE"])
      .default("NONE"),
    hasPreviousRefusal: z.boolean().default(false),
    refusalReasonNotice: z.string().optional().or(z.literal("")),
    hasViolations: z.boolean().default(false),
    violationDetails: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.hasPreviousRefusal) {
        return !!data.refusalReasonNotice && data.refusalReasonNotice.length >= 5;
      }
      return true;
    },
    {
      message: "পূর্ববর্তী ভিসা প্রত্যাখ্যাত হয়ে থাকলে অফিসিয়াল কারণ সংক্ষেপে লিখুন (কমপক্ষে ৫ অক্ষর)",
      path: ["refusalReasonNotice"],
    }
  );

export type ImmigrationHistoryStepInput = z.infer<
  typeof immigrationHistoryStepSchema
>;

// -------------------------------------------------------------
// Step 7: Review & Explicit Confirmation
// -------------------------------------------------------------
export const reviewConfirmationSchema = z.object({
  explicitConfirmation: z
    .boolean()
    .refine((val) => val === true, "প্রোফাইল সংরক্ষণের পূর্বে তথ্যের সত্যতা স্বীকার করুন"),
});

export type ReviewConfirmationInput = z.infer<typeof reviewConfirmationSchema>;

// -------------------------------------------------------------
// Profile Completion Engine & Scoring Algorithm
// -------------------------------------------------------------
export interface ProfileCompletionResult {
  percentage: number;
  requiredComplete: boolean;
  missingRequired: string[];
  missingRecommended: string[];
  optionalOpportunities: string[];
  documentStatus: {
    totalUploaded: number;
    needsVerification: number;
    verified: number;
  };
}

export function calculateProfileCompletion(data: {
  basicInfo?: Partial<BasicInfoStepInput>;
  education?: {
    highestCompletedLevel?: EducationStepInput["highestCompletedLevel"];
    academicRecords?: Array<Partial<SingleAcademicRecordInput>>;
  };
  language?: Partial<LanguageProficiencyStepInput>;
  preferences?: Partial<StudyPreferencesStepInput>;
  financial?: Partial<FinancialBackgroundStepInput>;
  immigration?: Partial<ImmigrationHistoryStepInput>;
  hasDocuments?: {
    transcriptUploaded?: boolean;
    languageCertUploaded?: boolean;
    passportUploaded?: boolean;
  };
}): ProfileCompletionResult {
  let score = 0;
  const missingRequired: string[] = [];
  const missingRecommended: string[] = [];
  const optionalOpportunities: string[] = [];

  // 1. Required (40 points total)
  // Full Name + DOB + City (10 points)
  if (data.basicInfo?.fullName && data.basicInfo?.dateOfBirth && data.basicInfo?.currentCity) {
    score += 10;
  } else {
    missingRequired.push("নাম, জন্মতারিখ ও বর্তমান শহর");
  }

  // Highest education + At least 1 academic record with GPA (15 points)
  if (
    data.education?.highestCompletedLevel &&
    data.education?.academicRecords &&
    data.education.academicRecords.length > 0 &&
    (data.education.academicRecords[0]?.gpaOrCgpa ?? 0) > 0
  ) {
    score += 15;
  } else {
    missingRequired.push("শিক্ষাগত যোগ্যতা ও জিপিএ");
  }

  // Target Countries & Target Subject (10 points)
  if (
    data.preferences?.targetCountryCodes &&
    data.preferences.targetCountryCodes.length > 0 &&
    data.preferences?.preferredSubject
  ) {
    score += 10;
  } else {
    missingRequired.push("টার্গেট দেশ ও পড়ার বিষয়");
  }

  // Tuition Budget (5 points)
  if (data.financial?.annualTuitionBudget && data.financial.annualTuitionBudget > 0) {
    score += 5;
  } else {
    missingRequired.push("বার্ষিক পড়াশোনার বাজেট");
  }

  const requiredComplete = missingRequired.length === 0;

  // 2. Recommended (35 points total)
  // Passport expiry date check (10 points)
  if (data.basicInfo?.hasPassport && data.basicInfo?.passportExpiryDate) {
    score += 10;
  } else if (!data.basicInfo?.hasPassport) {
    missingRecommended.push("আন্তর্জাতিক পাসপোর্ট সংগ্রহ");
  }

  // Language test score or planned date (15 points)
  if (data.language?.hasTakenTest && (data.language?.overallScore ?? 0) > 0) {
    score += 15;
  } else if (data.language?.plannedTestDate) {
    score += 10; // Partial for planned test
  } else {
    missingRecommended.push("আইইএলটিএস বা ভাষা পরীক্ষার স্কোর / পরিকল্পনা");
  }

  // Sponsor details & liquid savings (10 points)
  if (
    data.financial?.hasSponsor &&
    (data.financial?.liquidSavingsAmount ?? 0) > 0
  ) {
    score += 10;
  } else {
    missingRecommended.push("স্পন্সর ও ব্যাংক সেভিংস তথ্য");
  }

  // 3. Optional & Depth (15 points total)
  // Career goals / SOP vision (5 points)
  if (data.preferences?.careerGoals || data.preferences?.academicGoals) {
    score += 5;
  } else {
    optionalOpportunities.push("ভবিষ্যৎ ক্যারিয়ার লক্ষ্য ও ভিশন");
  }

  // Immigration declaration (5 points)
  if (typeof data.immigration?.hasTravelHistory === "boolean") {
    score += 5;
  }

  // Multiple academic records / depth (5 points)
  if ((data.education?.academicRecords?.length ?? 0) >= 2) {
    score += 5;
  } else {
    optionalOpportunities.push("মাধ্যমিক ও উচ্চ মাধ্যমিক উভয় রেকর্ড সংযোজন");
  }

  // 4. Document uploads (10 points total)
  let totalUploaded = 0;
  if (data.hasDocuments?.transcriptUploaded) totalUploaded++;
  if (data.hasDocuments?.languageCertUploaded) totalUploaded++;
  if (data.hasDocuments?.passportUploaded) totalUploaded++;

  if (totalUploaded >= 2) {
    score += 10;
  } else if (totalUploaded === 1) {
    score += 5;
  }

  return {
    percentage: Math.min(100, Math.max(10, score)),
    requiredComplete,
    missingRequired,
    missingRecommended,
    optionalOpportunities,
    documentStatus: {
      totalUploaded,
      needsVerification: totalUploaded, // User-uploaded docs are strictly Needs Verification until confirmed
      verified: 0,
    },
  };
}
