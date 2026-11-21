import { z } from "zod";

// -------------------------------------------------------------
// Legacy Quick Eligibility (for backward compatibility)
// -------------------------------------------------------------
export const QuickEligibilityCheckSchema = z.object({
  targetCountry: z.string().min(2, "দেশ নির্বাচন করুন"),
  degreeLevel: z.enum(["bachelor", "master", "phd"]),
  currentGpa: z.number().min(1.0).max(5.0, "সঠিক জিপিএ / সিজিপিএ দিন"),
  ieltsBand: z.number().min(0.0).max(9.0, "সঠিক আইইএলটিএস ব্যান্ড দিন"),
  fieldOfStudy: z.string().optional(),
});

export type QuickEligibilityCheckInput = z.infer<typeof QuickEligibilityCheckSchema>;

// -------------------------------------------------------------
// Result Status Enums
// -------------------------------------------------------------
export const EligibilityStatusEnum = z.enum([
  "ELIGIBLE",
  "CONDITIONALLY_ELIGIBLE",
  "NOT_ELIGIBLE",
  "UNABLE_TO_DETERMINE",
]);
export type EligibilityStatus = z.infer<typeof EligibilityStatusEnum>;

export const RequirementItemStatusEnum = z.enum([
  "MET",
  "PARTIALLY_MET",
  "NOT_MET",
  "UNABLE_TO_DETERMINE",
  "INFORMATION_MISSING",
]);
export type RequirementItemStatus = z.infer<typeof RequirementItemStatusEnum>;

// -------------------------------------------------------------
// Detailed Student Evaluation Input Schemas
// -------------------------------------------------------------
export const DegreeLevelInputEnum = z.enum([
  "SSC",
  "HSC",
  "DIPLOMA",
  "BACHELOR",
  "MASTER",
  "PHD",
]);

export const EnglishTestTypeInputEnum = z.enum([
  "IELTS",
  "PTE",
  "TOEFL_IBT",
  "DUOLINGO",
  "NONE",
]);

export const StudentAcademicRecordInputSchema = z.object({
  degreeLevel: DegreeLevelInputEnum,
  institution: z.string().optional(),
  discipline: z.string().min(1, "বিষয় বা বিভাগ উল্লেখ করুন"),
  gpa: z.number().min(0.0).max(5.0, "জিপিএ ০.০ থেকে ৫.০ এর মধ্যে হতে হবে"),
  scale: z.number().min(1.0).max(5.0).default(4.0),
  percentage: z.number().min(0).max(100).optional(),
  passingYear: z.number().int().min(1990).max(2035),
  resultStatus: z.enum(["PASSED", "RUNNING", "ENROLLED"]).default("PASSED"),
});
export type StudentAcademicRecordInput = z.infer<typeof StudentAcademicRecordInputSchema>;

export const StudentLanguageTestInputSchema = z.object({
  testType: EnglishTestTypeInputEnum.default("IELTS"),
  overallScore: z.number().min(0).max(120), // Covers IELTS 0-9, PTE 10-90, TOEFL 0-120
  listening: z.number().min(0).max(120).optional(),
  reading: z.number().min(0).max(120).optional(),
  writing: z.number().min(0).max(120).optional(),
  speaking: z.number().min(0).max(120).optional(),
  testDate: z.string().or(z.date()).optional(),
  isPlannedOnly: z.boolean().default(false),
});
export type StudentLanguageTestInput = z.infer<typeof StudentLanguageTestInputSchema>;

export const EvaluateEligibilityInputSchema = z.object({
  programId: z.string().uuid("সঠিক প্রোগ্রাম আইডি প্রদান করুন"),
  intakeId: z.string().uuid().optional(),
  intakeSeason: z.enum(["FALL", "SPRING", "SUMMER", "WINTER"]).optional(),
  intakeYear: z.number().int().min(2024).max(2035).optional(),
  studentProfileId: z.string().uuid().optional(),
  
  // Optional manual overrides / simulations
  academicRecord: StudentAcademicRecordInputSchema.optional(),
  languageTest: StudentLanguageTestInputSchema.optional(),
  workExperienceMonths: z.number().int().min(0).default(0),
  workExperienceField: z.string().optional(),
  greScore: z
    .object({
      overall: z.number().int().min(260).max(340).optional(),
      quant: z.number().int().min(130).max(170).optional(),
      verbal: z.number().int().min(130).max(170).optional(),
    })
    .optional(),
  gmatScore: z.number().int().min(200).max(800).optional(),
  hasPortfolio: z.boolean().default(false),
});
export type EvaluateEligibilityInput = z.infer<typeof EvaluateEligibilityInputSchema>;

// -------------------------------------------------------------
// Evaluated Requirement Line Item & Output
// -------------------------------------------------------------
export const EvaluatedRequirementItemSchema = z.object({
  key: z.string(),
  nameEn: z.string(),
  nameBn: z.string(),
  requiredValue: z.string().nullable().transform((val) => val ?? "N/A"),
  studentValue: z.string().nullable().transform((val) => val ?? "N/A"),
  status: RequirementItemStatusEnum,
  explanationBn: z.string(),
  explanationEn: z.string(),
  missingInfoBn: z.string().optional(),
  officialSourceUrl: z.string().url().or(z.string()),
  requirementVersion: z.number().int().default(1),
});
export type EvaluatedRequirementItem = z.infer<typeof EvaluatedRequirementItemSchema>;

export const EligibilityEvaluationOutputSchema = z.object({
  verdict: EligibilityStatusEnum,
  verdictTitleBn: z.string(),
  verdictTitleEn: z.string(),
  summaryBn: z.string(),
  summaryEn: z.string(),
  programId: z.string(),
  programTitleEn: z.string(),
  programTitleBn: z.string(),
  universityId: z.string(),
  universityNameEn: z.string(),
  universityNameBn: z.string(),
  countryCode: z.string(),
  intakeSeason: z.string(),
  intakeYear: z.number().int(),
  applicationDeadline: z.string().optional(),
  deadlinePassed: z.boolean(),
  items: z.array(EvaluatedRequirementItemSchema),
  missingInformationListBn: z.array(z.string()),
  recommendationsBn: z.array(z.string()),
  conditionalAdmissionAvailable: z.boolean(),
  preSessionalEnglishAvailable: z.boolean(),
  officialAdmissionsUrl: z.string(),
  requirementVersion: z.number().int(),
  evaluatedAt: z.string(),
  visaDistinctionNoticeBn: z.string(),
  admissionGuaranteeDisclaimerBn: z.string(),
});
export type EligibilityEvaluationOutput = z.infer<typeof EligibilityEvaluationOutputSchema>;

// -------------------------------------------------------------
// Admin Requirement Management Schemas
// -------------------------------------------------------------
export const AdminAdmissionRequirementUpsertSchema = z.object({
  programId: z.string().uuid(),
  requiredDegreeLevel: z.enum(["BACHELOR", "MASTER", "PHD", "DIPLOMA"]).default("BACHELOR"),
  acceptedQualifications: z.array(z.string()).default([]),
  requiredDisciplines: z.array(z.string()).min(1, "কমপক্ষে একটি বিষয় বা বিভাগ যুক্ত করুন"),
  minGpaOrCgpa: z.number().min(1.0).max(5.0),
  gpaScale: z.number().min(1.0).max(5.0).default(4.0),
  minPercentage: z.number().min(0).max(100).optional(),
  minUkDegreeClassification: z.enum(["FIRST_CLASS", "UPPER_SECOND_2_1", "LOWER_SECOND_2_2", "THIRD_CLASS"]).optional(),
  maxGermanGrade: z.number().min(1.0).max(4.0).optional(),
  minIeltsOverall: z.number().min(0).max(9.0).default(6.5),
  minIeltsEachBand: z.number().min(0).max(9.0).default(6.0),
  minIeltsListening: z.number().min(0).max(9.0).optional(),
  minIeltsReading: z.number().min(0).max(9.0).optional(),
  minIeltsWriting: z.number().min(0).max(9.0).optional(),
  minIeltsSpeaking: z.number().min(0).max(9.0).optional(),
  minPteOverall: z.number().int().min(10).max(90).optional(),
  minPteEachBand: z.number().int().min(10).max(90).optional(),
  minToeflIbtOverall: z.number().int().min(0).max(120).optional(),
  minToeflEachBand: z.number().int().min(0).max(30).optional(),
  duolingoAccepted: z.boolean().default(false),
  minDuolingoScore: z.number().int().min(60).max(160).optional(),
  greRequired: z.boolean().default(false),
  minGreScore: z.number().int().optional(),
  minGreQuant: z.number().int().optional(),
  minGreVerbal: z.number().int().optional(),
  gmatRequired: z.boolean().default(false),
  minGmatScore: z.number().int().optional(),
  workExperienceMonths: z.number().int().min(0).default(0),
  workExperienceRequired: z.boolean().default(false),
  workExperienceField: z.string().optional(),
  portfolioRequired: z.boolean().default(false),
  prerequisiteCoursesJson: z.string().optional(),
  allowsConditionalAdmission: z.boolean().default(true),
  preSessionalEnglishAvailable: z.boolean().default(true),
  officialSourceUrl: z.string().url("সঠিক অফিশিয়াল ইউআরএল দিন"),
  sourceNotes: z.string().optional(),
  equivalencyNotesBn: z.string().optional(),
  notesBn: z.string().optional(),
});
export type AdminAdmissionRequirementUpsert = z.infer<typeof AdminAdmissionRequirementUpsertSchema>;
