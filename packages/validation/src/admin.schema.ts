import { z } from "zod";

export const adminRolesList = [
  "STUDENT",
  "SUPER_ADMIN",
  "DATA_MANAGER",
  "VERIFICATION_MANAGER",
  "SUPPORT_ADMIN",
  "CONTENT_MANAGER",
] as const;

export const assignRoleSchema = z.object({
  targetUserId: z.string().uuid("সঠিক ইউজার আইডি প্রদান করুন"),
  role: z.enum(adminRolesList),
  permissions: z.array(z.string()).default([]),
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;

export const policyApprovalSchema = z.object({
  versionId: z.string().uuid("সঠিক পলিসি ভার্সন আইডি আবশ্যক"),
  approvalStatus: z.enum(["APPROVED", "REJECTED"]),
  decisionComment: z.string().min(5, "সিদ্ধান্তের কারণ বা কমেন্ট লিখুন (কমপক্ষে ৫ অক্ষর)"),
});

export type PolicyApprovalInput = z.infer<typeof policyApprovalSchema>;

export const verifySourceSchema = z.object({
  sourceId: z.string().uuid("সঠিক তথ্যসূত্র আইডি দিন"),
  verificationMethod: z.enum([
    "OFFICIAL_PORTAL_CROSSCHECK",
    "EMBASSY_CIRCULAR",
    "MINISTRY_GAZETTE",
    "UNIVERSITY_DIRECT_COMMUNICATION",
  ]),
  verificationNotes: z.string().optional(),
});

export type VerifySourceInput = z.infer<typeof verifySourceSchema>;

// Source Upsert Schema
export const sourceUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "সোর্সের নাম কমপক্ষে ৩ অক্ষর হতে হবে"),
  authorityName: z.string().min(2, "কর্তৃপক্ষের নাম আবশ্যক (যেমন UKVI, IRCC)"),
  officialUrl: z.string().url("সঠিক অফিশিয়াল ইউআরএল দিন"),
  countryCode: z.string().length(2, "২ অক্ষরের কান্ট্রি কোড দিন (যেমন GB, CA)").optional().nullable(),
  sourceCategory: z.enum([
    "GOVERNMENT_IMMIGRATION",
    "EMBASSY_CIRCULAR",
    "UNIVERSITY_PORTAL",
    "MINISTRY_GAZETTE",
    "CENTRAL_BANK",
  ]).default("GOVERNMENT_IMMIGRATION"),
  nextReviewDays: z.number().int().min(1).max(365).default(90),
  status: z.enum(["VERIFIED", "PENDING_REVIEW", "REJECTED", "DEPRECATED", "NEEDS_UPDATE"]).default("VERIFIED"),
});

export type SourceUpsertInput = z.infer<typeof sourceUpsertSchema>;

// Policy Change Proposal Schema (Step 3 in 9-step workflow)
export const policyChangeProposalSchema = z.object({
  visaRequirementId: z.string().uuid("ভিসা রিকোয়ারমেন্ট আইডি দিন"),
  title: z.string().min(3, "পলিসি পরিবর্তনের শিরোনাম দিন"),
  sourceOrganization: z.string().min(2, "উৎস সংস্থার নাম দিন"),
  officialGazetteUrl: z.string().url("অফিশিয়াল গেজেট বা সার্কুলার লিঙ্ক দিন"),
  changeSummaryBn: z.string().min(10, "পরিবর্তনের বিস্তারিত বাংলা সারাংশ দিন"),
  effectiveDate: z.string().or(z.date()),
  category: z.enum([
    "FINANCIAL_MAINTENANCE",
    "TUITION_DEPOSIT",
    "WORK_RIGHTS",
    "DOCUMENT_REQUIREMENTS",
    "GENERAL_IMMIGRATION",
  ]).default("FINANCIAL_MAINTENANCE"),
  oldValue: z.string().min(1, "পূর্ববর্তী মান আবশ্যক"),
  newValue: z.string().min(1, "নতুন প্রস্তাবিত মান আবশ্যক"),
  evidenceComparisonJson: z.string().optional(),
});

export type PolicyChangeProposalInput = z.infer<typeof policyChangeProposalSchema>;

// Policy Change Review & Publish Schema (Step 6 & 7)
export const policyChangeReviewSchema = z.object({
  versionId: z.string().uuid("পলিসি সংস্করণ আইডি আবশ্যক"),
  decision: z.enum(["APPROVED", "REJECTED"]),
  decisionComment: z.string().min(5, "সিদ্ধান্তের কারণ বা মন্তব্য লিখুন (কমপক্ষে ৫ অক্ষর)"),
  notifyAffectedStudents: z.boolean().default(true),
});

export type PolicyChangeReviewInput = z.infer<typeof policyChangeReviewSchema>;

// Admin Country Upsert Schema
export const adminCountryUpsertSchema = z.object({
  code: z.string().length(2, "২ অক্ষরের কান্ট্রি কোড আবশ্যক (যেমন GB, CA, AU)"),
  iso2: z.string().length(2, "ISO2 কোড আবশ্যক"),
  nameEn: z.string().min(2, "দেশের ইংরেজি নাম দিন"),
  nameBn: z.string().min(2, "দেশের বাংলা নাম দিন"),
  flagEmoji: z.string().min(1, "পতাকা ইমোজি দিন"),
  currencyCode: z.string().length(3, "মুদ্রা কোড (যেমন GBP, CAD, AUD)"),
  currencySymbol: z.string().min(1, "মুদ্রা প্রতীক দিন (যেমন £, $, €)"),
  approxBdtRate: z.number().positive("সঠিক BDT রেট দিন"),
  officialLanguage: z.string().default("English"),
  postStudyWorkDurationBn: z.string().min(2, "পোস্ট-স্টাডি ওয়ার্ক অধিকারের মেয়াদ লিখুন"),
  avgMonthlyLivingCost: z.number().nonnegative("গড় মাসিক জীবনযাত্রার ব্যয় দিন"),
  blockedAccountRequired: z.boolean().default(false),
  officialImmigrationUrl: z.string().url("অফিশিয়াল ইমিগ্রেশন পোর্টাল লিঙ্ক দিন"),
  dhakaEmbassyName: z.string().min(3, "ঢাকাস্থ দূতাবাস/হাইকমিশনের নাম দিন"),
  dhakaEmbassyUrl: z.string().url("ঢাকাস্থ দূতাবাসের ওয়েবসাইট লিঙ্ক দিন"),
  educationSystemOverviewBn: z.string().optional().nullable(),
  tuitionCostRangesBn: z.string().optional().nullable(),
  livingCostInfoBn: z.string().optional().nullable(),
  workRightsInTermHours: z.number().int().min(0).max(40).default(20),
  workRightsVacationHours: z.number().int().min(0).max(60).default(40),
});

export type AdminCountryUpsertInput = z.infer<typeof adminCountryUpsertSchema>;

// Audit Log Query Schema
export const auditLogQuerySchema = z.object({
  resourceType: z.string().optional(),
  action: z.string().optional(),
  userId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type AuditLogQueryInput = z.infer<typeof auditLogQuerySchema>;
