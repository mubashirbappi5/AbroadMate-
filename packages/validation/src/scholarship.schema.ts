import { z } from "zod";

export const ScholarshipProviderTypeEnum = z.enum([
  "GOVERNMENT",
  "UNIVERSITY",
  "FOUNDATION_TRUST",
  "EXTERNAL_ORGANIZATION",
]);

export const ScholarshipFundingTypeEnum = z.enum([
  "FULL_FUNDED",
  "TUITION_ONLY",
  "PARTIAL_WAIVER",
  "STIPEND_ONLY",
  "FIXED_GRANT",
]);

export const FundingChoiceTypeEnum = z.enum([
  "SCHOLARSHIP_FUNDED",
  "SELF_FUNDED",
]);

// -------------------------------------------------------------
// Filter & Query Schemas
// -------------------------------------------------------------
export const scholarshipFilterSchema = z.object({
  search: z.string().optional(),
  countryCode: z.string().optional(),
  degreeLevel: z.enum(["BACHELOR", "MASTER", "PHD", "DIPLOMA"]).optional(),
  fundingType: ScholarshipFundingTypeEnum.optional(),
  providerType: ScholarshipProviderTypeEnum.optional(),
  hasTravelSupport: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  hasStipend: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 20)),
});
export type ScholarshipFilterInput = z.infer<typeof scholarshipFilterSchema>;

// -------------------------------------------------------------
// Eligibility Evaluation Schemas
// -------------------------------------------------------------
export const evaluateScholarshipEligibilitySchema = z.object({
  scholarshipId: z.string().uuid("সঠিক স্কলারশিপ আইডি দিন"),
  studentProfileId: z.string().uuid().optional(),
  academicRecord: z
    .object({
      degreeLevel: z.enum(["SSC", "HSC", "DIPLOMA", "BACHELOR", "MASTER", "PHD"]),
      gpa: z.number().min(0).max(5.0),
      scale: z.number().min(1.0).max(5.0).default(4.0),
      percentage: z.number().min(0).max(100).optional(),
      discipline: z.string().optional(),
      passingYear: z.number().int().optional(),
    })
    .optional(),
  languageTest: z
    .object({
      testType: z.enum(["IELTS", "PTE", "TOEFL_IBT", "DUOLINGO", "NONE"]),
      overallScore: z.number().min(0).max(120),
      listening: z.number().optional(),
      reading: z.number().optional(),
      writing: z.number().optional(),
      speaking: z.number().optional(),
      isPlannedOnly: z.boolean().default(false),
    })
    .optional(),
  workExperienceMonths: z.number().int().min(0).default(0),
  nationality: z.string().default("BD"),
  age: z.number().int().min(15).max(70).optional(),
});
export type EvaluateScholarshipEligibilityInput = z.infer<
  typeof evaluateScholarshipEligibilitySchema
>;

// -------------------------------------------------------------
// Interactive Funding Decision Schema
// -------------------------------------------------------------
export const submitFundingDecisionSchema = z
  .object({
    choiceType: FundingChoiceTypeEnum,
    scholarshipId: z.string().uuid().optional(),
    targetProgramId: z.string().uuid().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.choiceType === "SCHOLARSHIP_FUNDED" && !data.scholarshipId) {
        return false;
      }
      return true;
    },
    {
      message: "স্কলারশিপ রুটের জন্য নির্দিষ্ট স্কলারশিপ নির্বাচন করুন।",
      path: ["scholarshipId"],
    }
  );
export type SubmitFundingDecisionInput = z.infer<typeof submitFundingDecisionSchema>;

// -------------------------------------------------------------
// Admin Scholarship Upsert Schema
// -------------------------------------------------------------
export const adminScholarshipUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  countryCode: z.string().min(2).max(3),
  universityId: z.string().uuid().optional().nullable(),
  titleEn: z.string().min(3, "ইংরেজি নাম বাধ্যতামূলক"),
  titleBn: z.string().min(3, "বাংলা নাম বাধ্যতামূলক"),
  providerName: z.string().min(2, "প্রোভাইডারের নাম দিন"),
  providerType: ScholarshipProviderTypeEnum.default("GOVERNMENT"),
  fundingType: ScholarshipFundingTypeEnum.default("FULL_FUNDED"),
  tuitionCoveragePercent: z.number().min(0).max(100).default(100.0),
  tuitionCoverageMaxAmount: z.number().optional().nullable(),
  tuitionCoverageCurrency: z.string().optional().nullable(),
  livingStipendMonthly: z.number().optional().nullable(),
  livingStipendAnnual: z.number().optional().nullable(),
  livingStipendCurrency: z.string().optional().nullable(),
  travelSupport: z.boolean().default(false),
  travelSupportDetailsBn: z.string().optional().nullable(),
  accommodationSupport: z.boolean().default(false),
  accommodationDetailsBn: z.string().optional().nullable(),
  healthInsuranceCovered: z.boolean().default(false),
  visaFeeCovered: z.boolean().default(false),
  otherBenefitsBn: z.string().optional().nullable(),
  coverageDescriptionBn: z.string().min(5, "কভারেজ বিবরণ দিন"),
  eligibilityCriteriaBn: z.string().min(5, "যোগ্যতা মানদণ্ড দিন"),
  applicationDeadline: z.string().or(z.date()).optional().nullable(),
  deadlineType: z.string().default("ANNUAL_RECURRING"),
  deadlineMonth: z.number().int().min(1).max(12).optional().nullable(),
  deadlineDay: z.number().int().min(1).max(31).optional().nullable(),
  deadlineNotice: z.string().optional().nullable(),
  requiredDocumentsJson: z.string().optional().nullable(),
  officialPortalUrl: z.string().url("সঠিক অফিশিয়াল পোর্টাল ইউআরএল দিন"),
  notesBn: z.string().optional().nullable(),
  
  // Eligibility Rule payload
  rule: z.object({
    eligibleDegreeLevels: z.array(z.enum(["BACHELOR", "MASTER", "PHD", "DIPLOMA"])).min(1),
    eligibleDisciplines: z.array(z.string()).default([]),
    targetNationalities: z.array(z.string()).default(["BD"]),
    minCgpaRequired: z.number().min(0).max(5.0).optional().nullable(),
    gpaScale: z.number().default(4.0),
    minPercentage: z.number().optional().nullable(),
    minUkDegreeClassification: z.string().optional().nullable(),
    minIeltsRequired: z.number().min(0).max(9.0).optional().nullable(),
    minIeltsEachBand: z.number().min(0).max(9.0).optional().nullable(),
    minPteRequired: z.number().int().optional().nullable(),
    minToeflRequired: z.number().int().optional().nullable(),
    duolingoAccepted: z.boolean().default(false),
    workExperienceMonths: z.number().int().min(0).default(0),
    workExperienceRequired: z.boolean().default(false),
    minAge: z.number().int().optional().nullable(),
    maxAge: z.number().int().optional().nullable(),
    ruleDescriptionBn: z.string().optional().nullable(),
  }),
});
export type AdminScholarshipUpsert = z.infer<typeof adminScholarshipUpsertSchema>;
