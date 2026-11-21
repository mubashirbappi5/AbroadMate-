import { z } from "zod";

// -------------------------------------------------------------
// Discovery Enums
// -------------------------------------------------------------
export const degreeLevelEnum = z.enum(["BACHELOR", "MASTER", "PHD", "DIPLOMA"]);
export const intakeSeasonEnum = z.enum(["FALL", "SPRING", "SUMMER"]);
export const subjectCategoryEnum = z.enum([
  "COMPUTER_SCIENCE_IT",
  "DATA_SCIENCE_AI",
  "ENGINEERING_TECHNOLOGY",
  "BUSINESS_MANAGEMENT",
  "HEALTH_MEDICAL_SCIENCES",
  "NATURAL_SCIENCES",
  "SOCIAL_SCIENCES_HUMANITIES",
  "LAW_LEGAL_STUDIES",
]);
export const favoriteCategoryEnum = z.enum(["AMBITIOUS", "TARGET", "SAFE"]);
export const favoriteItemTypeEnum = z.enum(["UNIVERSITY", "PROGRAM"]);
export const verificationStatusEnum = z.enum([
  "VERIFIED",
  "PENDING_REVIEW",
  "REJECTED",
  "DEPRECATED",
  "NEEDS_UPDATE",
  "UNVERIFIED",
]);

// -------------------------------------------------------------
// 1. Country Filter & Search Schema
// -------------------------------------------------------------
export const countryFilterSchema = z.object({
  search: z.string().optional(),
  currency: z.string().optional(),
  blockedAccount: z
    .string()
    .optional()
    .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
});

export type CountryFilterInput = z.infer<typeof countryFilterSchema>;

// -------------------------------------------------------------
// 2. University Filter, Search & Pagination Schema
// -------------------------------------------------------------
export const universityFilterSchema = z.object({
  search: z.string().optional(),
  countryCode: z.enum(["GB", "CA", "AU", "DE", "US"]).optional(),
  city: z.string().optional(),
  institutionType: z.string().optional(),
  isPublic: z
    .string()
    .optional()
    .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
  verificationStatus: verificationStatusEnum.optional(),
  minRank: z.coerce.number().int().min(1).optional(),
  maxRank: z.coerce.number().int().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  sortBy: z.enum(["worldRank", "nameEn", "city"]).default("worldRank"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type UniversityFilterInput = z.infer<typeof universityFilterSchema>;

// -------------------------------------------------------------
// 3. Program Filter, Search & Pagination Schema
// -------------------------------------------------------------
export const programFilterSchema = z.object({
  search: z.string().optional(),
  countryCode: z.enum(["GB", "CA", "AU", "DE", "US"]).optional(),
  universityId: z.string().uuid("সঠিক বিশ্ববিদ্যালয় আইডি নির্দেশ করুন").optional(),
  degreeLevel: degreeLevelEnum.optional(),
  subjectCategory: subjectCategoryEnum.optional(),
  studyMode: z.enum(["FULL_TIME", "PART_TIME", "HYBRID"]).optional(),
  minTuitionBdt: z.coerce.number().min(0).optional(),
  maxTuitionBdt: z.coerce.number().min(0).optional(),
  maxIelts: z.coerce.number().min(4.0).max(9.0).optional(),
  intakeSeason: intakeSeasonEnum.optional(),
  intakeYear: z.coerce.number().int().min(2025).max(2030).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  sortBy: z.enum(["tuition", "duration", "title", "deadline"]).default("tuition"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type ProgramFilterInput = z.infer<typeof programFilterSchema>;

// -------------------------------------------------------------
// 4. Saved Favorite (Shortlist) Schema
// -------------------------------------------------------------
export const savedFavoriteSchema = z.object({
  itemType: favoriteItemTypeEnum.default("UNIVERSITY"),
  targetId: z.string().uuid("সঠিক আইটেম আইডি প্রদান করুন"),
  category: favoriteCategoryEnum.default("TARGET"),
  notes: z.string().max(500, "নোট সর্বোচ্চ ৫০০ অক্ষরের মধ্যে হতে হবে").optional().or(z.literal("")),
});

export type SavedFavoriteInput = z.infer<typeof savedFavoriteSchema>;

export const updateFavoriteCategorySchema = z.object({
  category: favoriteCategoryEnum,
  notes: z.string().max(500).optional(),
});

export type UpdateFavoriteCategoryInput = z.infer<typeof updateFavoriteCategorySchema>;

// -------------------------------------------------------------
// 5. Admin University Upsert Schema
// -------------------------------------------------------------
export const adminUniversityUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  countryCode: z.enum(["GB", "CA", "AU", "DE", "US"], {
    required_error: "দেশের কোড নির্বাচন করুন (GB, CA, AU, DE, US)",
  }),
  nameEn: z.string().min(2, "বিশ্ববিদ্যালয়ের ইংরেজি নাম আবশ্যক").max(200),
  nameBn: z.string().min(2, "বিশ্ববিদ্যালয়ের বাংলা নাম আবশ্যক").max(200),
  city: z.string().min(2, "শহরের নাম লিখুন"),
  stateOrProvince: z.string().optional().or(z.literal("")),
  worldRank: z.coerce.number().int().min(1).max(5000).optional().nullable(),
  websiteUrl: z.string().url("সঠিক অফিসিয়াল ওয়েবসাইট ইউআরএল দিন"),
  admissionsUrl: z.string().url("সঠিক এডমিশন পেজের ইউআরএল দিন").optional().or(z.literal("")),
  applicationUrl: z.string().url("সঠিক অ্যাপ্লিকেশন পোর্টালের ইউআরএল দিন").optional().or(z.literal("")),
  institutionType: z.string().default("PUBLIC_RESEARCH"),
  accreditationDetailsBn: z
    .string()
    .min(5, "অফিসিয়াল অ্যাক্রিডিটেশন বা সরকারি স্বীকৃতির বিবরণ আবশ্যক"),
  recognizingAuthority: z
    .string()
    .min(2, "স্বীকৃতি প্রদানকারী সরকারি কর্তৃপক্ষের নাম দিন (যেমন: HESA, IRCC DLI, TEQSA)"),
  institutionRegistryCode: z.string().optional().or(z.literal("")),
  internationalStudentUrl: z.string().url().optional().or(z.literal("")),
  verificationStatus: verificationStatusEnum.default("VERIFIED"),
  isRecognized: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  officialSourceUrl: z.string().url("সরকারি প্রমাণ বা সোর্স ইউআরএল আবশ্যক"),
});

export type AdminUniversityUpsertInput = z.infer<typeof adminUniversityUpsertSchema>;

// -------------------------------------------------------------
// 6. Admin Program Upsert Schema
// -------------------------------------------------------------
export const adminProgramUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  universityId: z.string().uuid("সঠিক বিশ্ববিদ্যালয় নির্বাচন করুন"),
  titleEn: z.string().min(2, "প্রোগ্রামের ইংরেজি নাম আবশ্যক").max(200),
  titleBn: z.string().min(2, "প্রোগ্রামের বাংলা নাম আবশ্যক").max(200),
  degreeLevel: degreeLevelEnum.default("MASTER"),
  subjectCategory: subjectCategoryEnum.default("COMPUTER_SCIENCE_IT"),
  department: z.string().min(2, "ডিপার্টমেন্টের নাম দিন"),
  durationMonths: z.coerce.number().int().min(1).max(72).default(12),
  studyMode: z.enum(["FULL_TIME", "PART_TIME", "HYBRID"]).default("FULL_TIME"),
  annualTuitionAmount: z.coerce.number().min(0, "টিউশন ফি ঋণাত্মক হতে পারে না"),
  tuitionCurrencyCode: z.string().min(3).max(3),
  prerequisitesBn: z.string().optional().or(z.literal("")),
  officialProgramUrl: z.string().url("প্রোগ্রামের নিজস্ব অফিসিয়াল পেজের ইউআরএল দিন"),
  officialSourceUrl: z.string().url("তথ্য যাচাইকরণের সোর্স ইউআরএল দিন"),
  // Admission Requirement fields
  minGpaOrCgpa: z.coerce.number().min(0).max(5.0).default(3.0),
  gpaScale: z.coerce.number().min(4.0).max(5.0).default(4.0),
  minIeltsOverall: z.coerce.number().min(0).max(9.0).default(6.5),
  minIeltsEachBand: z.coerce.number().min(0).max(9.0).default(6.0),
  greRequired: z.boolean().default(false),
  workExperienceMonths: z.coerce.number().int().min(0).default(0),
  notesBn: z.string().optional().or(z.literal("")),
});

export type AdminProgramUpsertInput = z.infer<typeof adminProgramUpsertSchema>;
