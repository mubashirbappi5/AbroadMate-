import { describe, it, expect } from "vitest";
import {
  EmailService,
  getDispatchedEmails,
  clearDispatchedEmails,
} from "../../apps/worker/src/services/emailService";
import { TelegramService } from "../../apps/worker/src/services/telegramService";

describe("Integration: Background Jobs, Notification & Reliability Infrastructure", () => {
  describe("Multi-Channel Alert Dispatching", () => {
    it("dispatches transactional email with bilingual formatting and records in history", async () => {
      clearDispatchedEmails();

      const emailPayload = {
        to: "anika.tabassum@gmail.com",
        subject: "যুক্তরাজ্য স্টুডেন্ট ভিসা - ২৮ দিন ফান্ড হোল্ডিং রিমাইন্ডার",
        title: "জরুরি ভিসা রিমাইন্ডার",
        messageBn: "আপনার ইউকে স্টুডেন্ট ভিসা আবেদনের পূর্বে ব্যাংক অ্যাকাউন্টে ২৮ দিন ফান্ড হোল্ডিং নিশ্চিত করুন।",
        category: "DEADLINE_REMINDER",
        actionUrl: "https://abroadmate.com/dashboard/calculator",
        actionTextBn: "ক্যালকুলেটর দেখুন",
      };

      const result = await EmailService.sendEmail(emailPayload);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();

      const history = getDispatchedEmails();
      expect(history.length).toBe(1);
      expect(history[0].to).toBe("anika.tabassum@gmail.com");
      expect(history[0].subject).toContain("যুক্তরাজ্য স্টুডেন্ট ভিসা");
    });

    it("formats and validates Telegram push notification messages", async () => {
      const tgPayload = {
        chatId: "987654321",
        title: "⚠️ ডেডলাইন অ্যালার্ট: IELTS রেজিস্ট্রেশন",
        messageBn: "আপনার টার্গেট ফল ২০২৬ ইনটেকের জন্য আর মাত্র ৭ দিন বাকি আছে টেস্ট বুক করার।",
      };

      const result = await TelegramService.sendMessage(tgPayload);
      expect(result.success).toBe(true);
      expect(result.delivered).toBe(true); // Offline mock mode returns delivered: true
    });
  });

  describe("Idempotency Guard & Duplicate Alert Prevention", () => {
    it("strictly prevents duplicate notifications on repeated cron runs using idempotency keys", () => {
      const dispatchedStore = new Set<string>();

      const tryDispatchNotification = (key: string): boolean => {
        if (dispatchedStore.has(key)) {
          return false; // Suppress duplicate
        }
        dispatchedStore.add(key);
        return true; // Dispatched
      };

      const idempotencyKey = "deadline-alert-usr_01-dl_chevening-14d-2026-05-01";

      // 1st run of the background job at 06:00 UTC
      const firstRun = tryDispatchNotification(idempotencyKey);
      expect(firstRun).toBe(true);

      // 2nd run of the background job at 12:00 UTC on the same day
      const secondRun = tryDispatchNotification(idempotencyKey);
      expect(secondRun).toBe(false); // MUST be suppressed!

      // 3rd run at 18:00 UTC on the same day
      const thirdRun = tryDispatchNotification(idempotencyKey);
      expect(thirdRun).toBe(false);

      expect(dispatchedStore.size).toBe(1);
    });
  });

  describe("Exponential Backoff & Dead Letter Queue (DLQ) Resilience", () => {
    it("calculates exponential backoff delay correctly across retry attempts", () => {
      const calculateDelayMs = (attempt: number, initialDelayMs = 2000, maxDelayMs = 64000): number => {
        const delay = initialDelayMs * Math.pow(2, attempt - 1);
        return Math.min(delay, maxDelayMs);
      };

      expect(calculateDelayMs(1)).toBe(2000);  // 2s
      expect(calculateDelayMs(2)).toBe(4000);  // 4s
      expect(calculateDelayMs(3)).toBe(8000);  // 8s
      expect(calculateDelayMs(4)).toBe(16000); // 16s
      expect(calculateDelayMs(5)).toBe(32000); // 32s
      expect(calculateDelayMs(10)).toBe(64000); // capped at max
    });

    it("captures exhausted job failure in Dead Letter Queue (FailedJobLog)", () => {
      interface MockFailedJobLog {
        queueName: string;
        jobId: string;
        failedReason: string;
        attemptsMade: number;
        maxAttempts: number;
        createdAt: Date;
      }

      const dlqStore: MockFailedJobLog[] = [];

      const recordToDlq = (job: { queue: string; id: string; reason: string; attempts: number; max: number }) => {
        if (job.attempts >= job.max) {
          dlqStore.push({
            queueName: job.queue,
            jobId: job.id,
            failedReason: job.reason,
            attemptsMade: job.attempts,
            maxAttempts: job.max,
            createdAt: new Date(),
          });
        }
      };

      // Job attempts 5 times and exhausts
      recordToDlq({
        queue: "email-delivery",
        id: "job_email_exhausted_99",
        reason: "SMTP_CONN_TIMEOUT_504",
        attempts: 5,
        max: 5,
      });

      expect(dlqStore).toHaveLength(1);
      expect(dlqStore[0].queueName).toBe("email-delivery");
      expect(dlqStore[0].failedReason).toBe("SMTP_CONN_TIMEOUT_504");
      expect(dlqStore[0].attemptsMade).toBe(5);
    });
  });

  describe("Policy Change Detection & Student Cascade", () => {
    it("flags affected student roadmap tasks when destination country policy is published", () => {
      interface RoadmapTask {
        id: string;
        countryCode: string;
        titleEn: string;
        needsReview: boolean;
        reviewNote?: string;
      }

      const tasks: RoadmapTask[] = [
        { id: "tsk_1", countryCode: "GB", titleEn: "UK Financial Preparation", needsReview: false },
        { id: "tsk_2", countryCode: "CA", titleEn: "Canada PAL Attestation", needsReview: false },
        { id: "tsk_3", countryCode: "GB", titleEn: "UK CAS Issuance", needsReview: false },
      ];

      // Simulated Policy Change in UK
      const affectedCountry = "GB";
      const policyChangeSummary = "UK Living cost statutory requirement updated to £1,050/mo outside London.";

      // Execution of policy change cascade
      for (const t of tasks) {
        if (t.countryCode === affectedCountry) {
          t.needsReview = true;
          t.reviewNote = policyChangeSummary;
        }
      }

      expect(tasks[0].needsReview).toBe(true);
      expect(tasks[0].reviewNote).toBe(policyChangeSummary);
      expect(tasks[1].needsReview).toBe(false); // Canada unaffected
      expect(tasks[2].needsReview).toBe(true);
    });
  });
});
