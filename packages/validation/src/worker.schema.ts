import { z } from "zod";

export const reminderThresholds = [30, 14, 7, 3, 1] as const;

export const notificationPreferencesSchema = z.object({
  deadlineAlertsEmail: z.boolean().default(true),
  deadlineAlertsWeb: z.boolean().default(true),
  scholarshipAlerts: z.boolean().default(true),
  visaRuleUpdates: z.boolean().default(true),
  weeklyRoadmapChecklist: z.boolean().default(false),
  telegramAlerts: z.boolean().default(false),
  telegramChatId: z.string().optional().nullable(),
  customReminderDays: z
    .array(z.number().int().min(1).max(180))
    .min(1, "কমপক্ষে একটি রিমাইন্ডার ব্যবধান নির্বাচন করুন")
    .default([30, 14, 7, 3, 1]),
});

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;

export const queueNamesEnum = z.enum([
  "deadline-reminders",
  "scheduled-notifications",
  "source-monitoring",
  "policy-change-detection",
  "ai-document-generation",
  "document-processing",
  "periodic-data-verification",
  "email-delivery",
]);

export type QueueName = z.infer<typeof queueNamesEnum>;

export const enqueueJobSchema = z.object({
  queueName: queueNamesEnum,
  jobName: z.string().min(2, "জব নাম প্রদান করুন"),
  payload: z.record(z.any()).default({}),
});

export type EnqueueJobInput = z.infer<typeof enqueueJobSchema>;

export const emailDispatchSchema = z.object({
  to: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
  subject: z.string().min(3, "ইমেইল বিষয় আবশ্যক"),
  title: z.string().min(2, "শিরোনাম আবশ্যক"),
  messageBn: z.string().min(5, "বার্তার বিবরণ দিন"),
  category: z.enum([
    "DEADLINE_REMINDER",
    "POLICY_CHANGE",
    "DOCUMENT_VERIFICATION",
    "SOP_READY",
    "SYSTEM",
  ]).default("SYSTEM"),
  actionUrl: z.string().optional().nullable(),
});

export type EmailDispatchInput = z.infer<typeof emailDispatchSchema>;
