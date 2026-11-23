import { describe, it, expect } from "vitest";
import {
  notificationPreferencesSchema,
  enqueueJobSchema,
  emailDispatchSchema,
  reminderThresholds,
  queueNamesEnum,
} from "../worker.schema";

describe("Background Worker & Notification Validation Tests", () => {
  it("should validate default notification preferences with standard [30, 14, 7, 3, 1] days", () => {
    const defaultPrefs = {
      deadlineAlertsEmail: true,
      deadlineAlertsWeb: true,
      scholarshipAlerts: true,
      visaRuleUpdates: true,
      weeklyRoadmapChecklist: false,
      telegramAlerts: false,
      customReminderDays: [30, 14, 7, 3, 1],
    };

    const result = notificationPreferencesSchema.safeParse(defaultPrefs);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customReminderDays).toEqual([30, 14, 7, 3, 1]);
      expect(result.data.telegramAlerts).toBe(false);
    }
  });

  it("should validate custom reminder intervals including 45 and 10 days", () => {
    const customPrefs = {
      deadlineAlertsEmail: true,
      deadlineAlertsWeb: true,
      scholarshipAlerts: false,
      visaRuleUpdates: true,
      weeklyRoadmapChecklist: true,
      telegramAlerts: true,
      telegramChatId: "987654321",
      customReminderDays: [45, 30, 14, 10, 7, 1],
    };

    const result = notificationPreferencesSchema.safeParse(customPrefs);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customReminderDays).toContain(45);
      expect(result.data.customReminderDays).toContain(10);
      expect(result.data.telegramChatId).toBe("987654321");
    }
  });

  it("should reject empty reminder intervals array", () => {
    const invalidPrefs = {
      deadlineAlertsEmail: true,
      deadlineAlertsWeb: true,
      scholarshipAlerts: true,
      visaRuleUpdates: true,
      weeklyRoadmapChecklist: false,
      telegramAlerts: false,
      customReminderDays: [],
    };

    const result = notificationPreferencesSchema.safeParse(invalidPrefs);
    expect(result.success).toBe(false);
  });

  it("should validate all 8 queue names in enqueueJobSchema", () => {
    const all8Queues = [
      "deadline-reminders",
      "scheduled-notifications",
      "source-monitoring",
      "policy-change-detection",
      "ai-document-generation",
      "document-processing",
      "periodic-data-verification",
      "email-delivery",
    ] as const;

    all8Queues.forEach((qName) => {
      const res = enqueueJobSchema.safeParse({
        queueName: qName,
        jobName: `job-${qName}`,
        payload: { test: true },
      });
      expect(res.success).toBe(true);
    });
  });

  it("should reject non-existent queue name", () => {
    const result = enqueueJobSchema.safeParse({
      queueName: "invalid-queue-name" as any,
      jobName: "invalid-job",
    });
    expect(result.success).toBe(false);
  });

  it("should validate transactional email dispatch schema", () => {
    const validEmail = {
      to: "student@example.com",
      subject: "গুরুত্বপূর্ণ ডেডলাইন রিমাইন্ডার",
      title: "অক্সফোর্ড স্কলারশিপ ডেডলাইন",
      messageBn: "আপনার স্কলারশিপের আবেদনের জন্য আর মাত্র ৭ দিন বাকি আছে।",
      category: "DEADLINE_REMINDER" as const,
      actionUrl: "https://abroadmate.ai/dashboard/deadlines",
    };

    const result = emailDispatchSchema.safeParse(validEmail);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email format in email dispatch schema", () => {
    const invalidEmail = {
      to: "not-an-email",
      subject: "Test",
      title: "Test",
      messageBn: "Message",
    };

    const result = emailDispatchSchema.safeParse(invalidEmail);
    expect(result.success).toBe(false);
  });
});
