import { z } from "zod";

export const BangladeshiPhoneRegex = /^(\+?880|0)1[3-9]\d{8}$/;

export const EnglishScoreSchema = z.object({
  testType: z.enum(["IELTS", "TOEFL", "PTE", "DUOLINGO", "MOI", "NOT_TAKEN"]),
  overallBand: z.number().min(0).max(160).optional(),
  listening: z.number().min(0).max(120).optional(),
  reading: z.number().min(0).max(120).optional(),
  writing: z.number().min(0).max(120).optional(),
  speaking: z.number().min(0).max(120).optional(),
  testDate: z.string().optional(),
});

export const StudentAcademicProfileSchema = z.object({
  fullName: z.string().min(2, "পূর্ণ নাম আবশ্যক"),
  email: z.string().email("সঠিক ইমেইল এড্রেস প্রদান করুন"),
  phoneNumber: z.string().regex(BangladeshiPhoneRegex, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)").optional().or(z.literal("")),
  currentLevel: z.enum([
    "hsc_passed",
    "a_level",
    "diploma",
    "bachelor_running",
    "bachelor_passed",
    "master_passed",
  ]),
  
  // Secondary / Higher Secondary
  sscGpa: z.number().min(0).max(5.0, "এসএসসি জিপিএ সর্বোচ্চ ৫.০০ হতে পারে").optional(),
  sscPassingYear: z.number().int().min(2000).max(2030).optional(),
  sscBoard: z.string().optional(),
  
  hscGpa: z.number().min(0).max(5.0, "এইচএসসি জিপিএ সর্বোচ্চ ৫.০০ হতে পারে").optional(),
  hscPassingYear: z.number().int().min(2000).max(2030).optional(),
  hscBoard: z.string().optional(),
  hscGroup: z.enum(["science", "business", "humanities", "engineering_tech", "general"]).optional(),

  // Undergraduate / Bachelor
  bachelorCgpa: z.number().min(0).max(4.0, "সিজিপিএ সর্বোচ্চ ৪.০০ হতে পারে").optional(),
  bachelorPassingYear: z.number().int().min(2010).max(2030).optional(),
  bachelorUniversity: z.string().optional(),
  bachelorMajor: z.string().optional(),
  hasBacklogs: z.boolean().default(false),
  backlogsCount: z.number().int().min(0).default(0),

  // Language & Standardized Testing
  englishTest: EnglishScoreSchema,
  
  // Preferences
  budgetBdtAnnual: z.number().min(0).optional(),
  targetCountries: z.array(z.string()).min(1, "অন্তত একটি পছন্দের দেশ নির্বাচন করুন"),
  targetIntakeSeason: z.enum(["fall", "spring", "summer"]),
  targetIntakeYear: z.number().int().min(2025).max(2030),
  preferredFieldOfStudy: z.string().min(2, "পছন্দের পড়াশোনার বিষয় উল্লেখ করুন"),
});

export type StudentAcademicProfileInput = z.infer<typeof StudentAcademicProfileSchema>;
