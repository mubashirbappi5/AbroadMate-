import { z } from "zod";

export const generateRoadmapSchema = z.object({
  targetCountryCode: z.string().min(2).max(5).default("GB"),
  targetIntakeSeason: z.enum(["fall", "spring", "summer"]).default("fall"),
  targetIntakeYear: z.number().int().min(2025).max(2035).default(2026),
  targetUniversityId: z.string().uuid().optional(),
  targetUniversityName: z.string().optional(),
  targetProgramId: z.string().uuid().optional(),
  targetProgramName: z.string().optional(),
  degreeLevel: z.enum(["BACHELOR", "MASTER", "DOCTORATE"]).default("MASTER"),
  fundingChoice: z.enum(["SCHOLARSHIP_FUNDED", "SELF_FUNDED"]).default("SELF_FUNDED"),
  scholarshipId: z.string().uuid().optional(),
  scholarshipName: z.string().optional(),
  englishProficiencyScore: z.number().min(0).max(9).optional(),
  hasValidPassport: z.boolean().default(false),
});

export type GenerateRoadmapInput = z.infer<typeof generateRoadmapSchema>;

export const updateRoadmapTaskSchema = z.object({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "WAITING", "COMPLETED", "BLOCKED", "SKIPPED"]),
  isCompleted: z.boolean().optional(),
  actionNotesBn: z.string().optional(),
});

export type UpdateRoadmapTaskInput = z.infer<typeof updateRoadmapTaskSchema>;

export const recalculateRoadmapSchema = z.object({
  newCountryCode: z.string().min(2).max(5),
  newIntakeSeason: z.enum(["fall", "spring", "summer"]),
  newIntakeYear: z.number().int().min(2025).max(2035),
  newUniversityId: z.string().uuid().optional(),
  newProgramId: z.string().uuid().optional(),
  newFundingChoice: z.enum(["SCHOLARSHIP_FUNDED", "SELF_FUNDED"]).default("SELF_FUNDED"),
  newScholarshipId: z.string().uuid().optional(),
  changeReasonBn: z.string().min(3).default("শিক্ষার্থীর উচ্চশিক্ষা পরিকল্পনা পরিবর্তন"),
});

export type RecalculateRoadmapInput = z.infer<typeof recalculateRoadmapSchema>;

export const createDeadlineSchema = z.object({
  titleBn: z.string().min(3, "শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে"),
  titleEn: z.string().min(3, "Title must be at least 3 characters"),
  deadlineType: z.enum([
    "APPLICATION_DEADLINE",
    "SCHOLARSHIP_DEADLINE",
    "IELTS_TEST_DATE",
    "TUITION_DEPOSIT_DEADLINE",
    "VISA_SUBMISSION_DEADLINE",
    "BIOMETRICS_APPOINTMENT",
    "MEDICAL_APPOINTMENT",
    "PASSPORT_EXPIRY",
    "ENROLLMENT_DEADLINE",
    "CUSTOM_REMINDER",
  ]).default("APPLICATION_DEADLINE"),
  category: z.string().default("UNIVERSITY"),
  countryCode: z.string().optional(),
  deadlineDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "সঠিক তারিখ (YYYY-MM-DD) প্রদান করুন",
  }),
  officialUrl: z.string().url().optional().or(z.literal("")),
  notesBn: z.string().optional(),
  isGlobal: z.boolean().default(false),
});

export type CreateDeadlineInput = z.infer<typeof createDeadlineSchema>;

export const createCustomReminderSchema = z.object({
  deadlineId: z.string().uuid().optional(),
  customTitle: z.string().min(3),
  reminderDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "সঠিক তারিখ প্রদান করুন",
  }),
  channel: z.enum(["EMAIL", "IN_APP", "SMS"]).default("EMAIL"),
});

export type CreateCustomReminderInput = z.infer<typeof createCustomReminderSchema>;
