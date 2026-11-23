import { z } from "zod";

export const countryCodeEnum = z.enum(["GB", "CA", "AU", "DE", "US"]);
export type CountryCodeType = z.infer<typeof countryCodeEnum>;

export const sponsorTypeEnum = z.enum([
  "SELF",
  "PARENTS",
  "GOVERNMENT_SCHOLARSHIP",
  "UNIVERSITY_SCHOLARSHIP",
  "BANK_LOAN",
  "OTHER_RELATIVE",
  "THIRD_PARTY",
]);
export type SponsorType = z.infer<typeof sponsorTypeEnum>;

export const requirementStatusEnum = z.enum([
  "MANDATORY",
  "CONDITIONAL",
  "NOT_APPLICABLE",
  "UNKNOWN",
]);

export const visaAssessmentVerdictEnum = z.enum([
  "PRELIMINARY_ELIGIBLE",
  "REQUIREMENTS_MISSING",
  "FINANCIAL_GAP",
  "DOCUMENTS_MISSING",
  "CONDITIONAL_REQUIREMENTS",
  "UNABLE_TO_DETERMINE",
]);
export type VisaAssessmentVerdict = z.infer<typeof visaAssessmentVerdictEnum>;

export const evaluateVisaAssessmentSchema = z.object({
  countryCode: countryCodeEnum,
  degreeLevel: z.enum(["BACHELORS", "MASTERS", "PHD", "LANGUAGE", "OTHER"]).default("MASTERS"),
  isInsideLondon: z.boolean().default(false),
  tuitionFeeLocal: z.number().min(0, "টিউশন ফি ঋণাত্মক হতে পারে না"),
  tuitionFeePaidLocal: z.number().min(0).default(0),
  availableLiquidFundsLocal: z.number().min(0, "ফান্ডের পরিমাণ ঋণাত্মক হতে পারে না").default(0),
  fundsHoldingDays: z.number().min(0, "হোল্ডিং দিন ঋণাত্মক হতে পারে না").default(0),
  sponsorType: sponsorTypeEnum.default("PARENTS"),
  hasOfficialAdmissionConfirmation: z.boolean().default(false),
  hasLanguageProficiencyProof: z.boolean().default(false),
  hasValidPassport: z.boolean().default(false),
  hasAcademicCertificates: z.boolean().default(false),
  hasBankSolvencyCertificate: z.boolean().default(false),
  hasSponsorTaxReturns: z.boolean().default(false),
  hasMedicalTbClearance: z.boolean().default(false),
  hasPoliceClearance: z.boolean().default(false),
  hasHealthInsurance: z.boolean().default(false),
  hasPreviousRefusal: z.boolean().default(false),
  refusalCountryCode: z.string().optional(),
  refusalExplanation: z.string().optional(),
  scholarshipFundingBdt: z.number().min(0).default(0),
});
export type EvaluateVisaAssessmentInput = z.infer<typeof evaluateVisaAssessmentSchema>;

export const calculateVisaFinancialsSchema = z.object({
  countryCode: countryCodeEnum,
  tuitionFeeLocal: z.number().min(0, "টিউশন ফি অন্তত ০ বা তার বেশি হতে হবে"),
  tuitionPaidLocal: z.number().min(0).default(0),
  isInsideLondon: z.boolean().default(false),
  scholarshipDeductionLocal: z.number().min(0).default(0),
  dependentSpouseCount: z.number().min(0).default(0),
  dependentChildCount: z.number().min(0).default(0),
});
export type CalculateVisaFinancialsInput = z.infer<typeof calculateVisaFinancialsSchema>;

export const adminVisaRequirementUpsertSchema = z.object({
  countryCode: countryCodeEnum,
  visaCode: z.string().min(2),
  nameEn: z.string().min(3),
  nameBn: z.string().min(3),
  officialFeeAmount: z.number().min(0),
  feeCurrencyCode: z.string().min(3).max(4),
  processingDaysAvg: z.number().int().min(1),
  changeSummaryBn: z.string().min(5),
  officialGazetteUrl: z.string().url("অবশ্যই সঠিক অফিশিয়াল URL প্রদান করতে হবে"),
  sourceOrganization: z.string().min(2),
  requiredLivingFunds: z.number().min(0),
  maintenancePeriodDays: z.number().int().min(0),
  bankStatementPeriodMonths: z.number().int().min(1).default(1),
  travelExpenseLocal: z.number().min(0).default(0),
  blockedAccountRequired: z.boolean().default(false),
  acceptableInstrumentsBn: z.string().min(3),
  unacceptableFundsBn: z.string().optional(),
  sponsorConditionsBn: z.string().min(3),
  effectiveFromDate: z.string().datetime().optional(),
});
export type AdminVisaRequirementUpsertInput = z.infer<typeof adminVisaRequirementUpsertSchema>;

export const adminVisaVersionApprovalSchema = z.object({
  versionId: z.string().uuid(),
  decision: z.enum(["APPROVED", "REJECTED"]),
  decisionComment: z.string().optional(),
});
export type AdminVisaVersionApprovalInput = z.infer<typeof adminVisaVersionApprovalSchema>;
