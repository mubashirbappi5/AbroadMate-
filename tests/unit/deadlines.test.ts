import { describe, it, expect } from "vitest";
import {
  calculateDaysRemaining,
  classifyDeadlineUrgency,
  evaluateDeadlineNotification,
  batchEvaluateDeadlines,
  calculateIntakeMilestones,
  generateDeadlineIdempotencyKey,
  type DeadlineItem,
  DEFAULT_REMINDER_DAYS,
} from "../../packages/shared/src/utils/deadline-calculator";

describe("Deadline & Reminder Calculation Engine Unit Tests", () => {
  const referenceDate = new Date("2026-05-01T00:00:00.000Z");

  describe("Calendar Day Calculations & Normalization", () => {
    it("accurately calculates positive days remaining for future dates", () => {
      const futureDate = new Date("2026-05-31T00:00:00.000Z");
      const days = calculateDaysRemaining(futureDate, referenceDate);
      expect(days).toBe(30);
    });

    it("returns 0 days remaining when target date is today", () => {
      const todayDate = new Date("2026-05-01T15:45:00.000Z");
      const days = calculateDaysRemaining(todayDate, referenceDate);
      expect(days).toBe(0);
    });

    it("returns negative days for past due / overdue deadlines", () => {
      const pastDate = new Date("2026-04-24T00:00:00.000Z");
      const days = calculateDaysRemaining(pastDate, referenceDate);
      expect(days).toBe(-7);
    });

    it("handles leap year calculations correctly (e.g., Feb 28 to Mar 1 in leap year 2028)", () => {
      const refLeap = new Date("2028-02-28T00:00:00.000Z");
      const targetLeap = new Date("2028-03-01T00:00:00.000Z");
      expect(calculateDaysRemaining(targetLeap, refLeap)).toBe(2); // 2028-02-29 and 2028-03-01
    });

    it("normalizes arbitrary time strings and timezone offsets reliably", () => {
      const ref = "2026-09-01T23:59:59+06:00";
      const target = "2026-09-15T01:00:00-04:00";
      const days = calculateDaysRemaining(target, ref);
      expect(days).toBe(14);
    });
  });

  describe("Urgency Tier Classification", () => {
    it("classifies negative days as EXPIRED", () => {
      expect(classifyDeadlineUrgency(-1)).toBe("EXPIRED");
      expect(classifyDeadlineUrgency(-30)).toBe("EXPIRED");
    });

    it("classifies 0-3 days as CRITICAL", () => {
      expect(classifyDeadlineUrgency(0)).toBe("CRITICAL");
      expect(classifyDeadlineUrgency(1)).toBe("CRITICAL");
      expect(classifyDeadlineUrgency(3)).toBe("CRITICAL");
    });

    it("classifies 4-14 days as HIGH", () => {
      expect(classifyDeadlineUrgency(4)).toBe("HIGH");
      expect(classifyDeadlineUrgency(7)).toBe("HIGH");
      expect(classifyDeadlineUrgency(14)).toBe("HIGH");
    });

    it("classifies 15-30 days as MEDIUM", () => {
      expect(classifyDeadlineUrgency(15)).toBe("MEDIUM");
      expect(classifyDeadlineUrgency(30)).toBe("MEDIUM");
    });

    it("classifies >30 days as LOW", () => {
      expect(classifyDeadlineUrgency(31)).toBe("LOW");
      expect(classifyDeadlineUrgency(90)).toBe("LOW");
    });
  });

  describe("Notification Threshold Evaluation & Duplicate Protection", () => {
    it("triggers reminder on default 30-day threshold", () => {
      const item: DeadlineItem = {
        id: "dl-chevening-01",
        titleBn: "শেভেনিং স্কলারশিপ আবেদন",
        titleEn: "Chevening Scholarship Application",
        deadlineDate: "2026-05-31T00:00:00.000Z",
        category: "SCHOLARSHIP",
      };

      const result = evaluateDeadlineNotification(item, referenceDate);
      expect(result.daysRemaining).toBe(30);
      expect(result.shouldTriggerReminder).toBe(true);
      expect(result.matchedReminderDay).toBe(30);
      expect(result.urgency).toBe("MEDIUM");
      expect(result.idempotencyKey).toBe("deadline-alert-dl-chevening-01-30d-2026-05-01");
      expect(result.messageBn).toContain("৩০ দিন বাকি");
    });

    it("triggers reminder on urgent 1-day threshold with high urgency label", () => {
      const item: DeadlineItem = {
        id: "dl-tuition-dep",
        titleBn: "টিউশন ফি ডিপোজিট ডেডলাইন",
        titleEn: "Tuition Deposit Deadline",
        deadlineDate: "2026-05-02T00:00:00.000Z",
        category: "TUITION_DEPOSIT",
      };

      const result = evaluateDeadlineNotification(item, referenceDate);
      expect(result.daysRemaining).toBe(1);
      expect(result.shouldTriggerReminder).toBe(true);
      expect(result.matchedReminderDay).toBe(1);
      expect(result.urgency).toBe("CRITICAL");
      expect(result.messageBn).toContain("আগামীকাল");
      expect(result.messageEn).toContain("Tomorrow is the deadline");
    });

    it("does NOT trigger reminder on non-threshold days (e.g. 19 days remaining)", () => {
      const item: DeadlineItem = {
        id: "dl-ielts-exam",
        titleBn: "আইইএলটিএস টেস্ট রেজিস্ট্রেশন",
        titleEn: "IELTS Exam Registration",
        deadlineDate: "2026-05-20T00:00:00.000Z", // 19 days from May 1
        category: "LANGUAGE_TEST",
      };

      const result = evaluateDeadlineNotification(item, referenceDate);
      expect(result.daysRemaining).toBe(19);
      expect(result.shouldTriggerReminder).toBe(false);
      expect(result.matchedReminderDay).toBeNull();
      expect(result.idempotencyKey).toBeNull();
    });

    it("NEVER triggers a reminder for completed deadlines regardless of due date", () => {
      const item: DeadlineItem = {
        id: "dl-completed-task",
        titleBn: "পাসপোর্ট রিনিউয়াল",
        titleEn: "Passport Renewal",
        deadlineDate: "2026-05-02T00:00:00.000Z", // 1 day remaining
        category: "PASSPORT_EXPIRY",
        isCompleted: true,
      };

      const result = evaluateDeadlineNotification(item, referenceDate);
      expect(result.shouldTriggerReminder).toBe(false);
      expect(result.matchedReminderDay).toBeNull();
      expect(result.idempotencyKey).toBeNull();
      expect(result.messageBn).toContain("সম্পন্ন");
    });

    it("respects custom student reminder preferences (e.g. 45, 21, 5, 2 days)", () => {
      const customPreferences = [45, 21, 5, 2];
      const item: DeadlineItem = {
        id: "dl-custom-01",
        titleBn: "কানাডা ভিসা সাবমিশন",
        titleEn: "Canada Visa Submission",
        deadlineDate: "2026-05-22T00:00:00.000Z", // 21 days from May 1
        category: "VISA_SUBMISSION",
      };

      const result = evaluateDeadlineNotification(item, referenceDate, customPreferences);
      expect(result.daysRemaining).toBe(21);
      expect(result.shouldTriggerReminder).toBe(true);
      expect(result.matchedReminderDay).toBe(21);
      expect(result.idempotencyKey).toBe("deadline-alert-dl-custom-01-21d-2026-05-01");
    });
  });

  describe("Batch Deadline Processing", () => {
    it("processes heterogeneous deadlines and provides accurate alerts", () => {
      const deadlines: DeadlineItem[] = [
        {
          id: "dl-1",
          titleBn: "ইউকে বিশ্ববিদ্যালয় আবেদন",
          titleEn: "UK University Application",
          deadlineDate: "2026-05-08T00:00:00.000Z", // 7 days remaining -> MATCH (default threshold)
          category: "APPLICATION",
        },
        {
          id: "dl-2",
          titleBn: "জার্মানি ব্লকড অ্যাকাউন্ট",
          titleEn: "Germany Blocked Account",
          deadlineDate: "2026-05-15T00:00:00.000Z", // 14 days remaining -> MATCH (default threshold)
          category: "TUITION_DEPOSIT",
        },
        {
          id: "dl-3",
          titleBn: "মেডিকেল টেস্ট রিপোর্ট",
          titleEn: "Medical Test Report",
          deadlineDate: "2026-04-20T00:00:00.000Z", // -11 days past due -> OVERDUE
          category: "MEDICAL",
        },
      ];

      const evaluated = batchEvaluateDeadlines(deadlines, referenceDate);
      expect(evaluated).toHaveLength(3);

      const dl1 = evaluated.find((e) => e.deadlineId === "dl-1");
      expect(dl1?.shouldTriggerReminder).toBe(true);
      expect(dl1?.matchedReminderDay).toBe(7);

      const dl2 = evaluated.find((e) => e.deadlineId === "dl-2");
      expect(dl2?.shouldTriggerReminder).toBe(true);
      expect(dl2?.matchedReminderDay).toBe(14);

      const dl3 = evaluated.find((e) => e.deadlineId === "dl-3");
      expect(dl3?.isOverdue).toBe(true);
      expect(dl3?.shouldTriggerReminder).toBe(false);
      expect(dl3?.urgency).toBe("EXPIRED");
    });
  });

  describe("Intake Timeline & Milestone Backward Scheduling", () => {
    it("generates 8 standardized lifecycle milestones backward from Fall 2026 Intake (Sept 1, 2026)", () => {
      const intakeDate = "2026-09-01T00:00:00.000Z";
      const milestones = calculateIntakeMilestones(intakeDate);

      expect(milestones).toHaveLength(8);

      const keys = milestones.map((m) => m.key);
      expect(keys).toContain("PASSPORT_CHECK");
      expect(keys).toContain("LANGUAGE_EXAM");
      expect(keys).toContain("SCHOLARSHIP_DEADLINE");
      expect(keys).toContain("UNIVERSITY_APPLICATION");
      expect(keys).toContain("TUITION_DEPOSIT");
      expect(keys).toContain("VISA_SUBMISSION");
      expect(keys).toContain("BIOMETRICS_MEDICAL");
      expect(keys).toContain("ENROLLMENT_ARRIVAL");

      // Verify that milestones are chronologically spaced backward from intake
      const visaMilestone = milestones.find((m) => m.key === "VISA_SUBMISSION");
      expect(visaMilestone?.daysBeforeIntake).toBe(75);
      expect(visaMilestone?.mandatory).toBe(true);
      expect(visaMilestone?.suggestedDate).toBe("2026-06-18");

      const passportMilestone = milestones.find((m) => m.key === "PASSPORT_CHECK");
      expect(passportMilestone?.daysBeforeIntake).toBe(450);
      expect(passportMilestone?.suggestedDate).toBe("2025-06-08");
    });
  });
});
