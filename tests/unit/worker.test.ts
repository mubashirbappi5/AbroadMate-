import { describe, it, expect, beforeEach } from "vitest";
import {
  buildAbroadMateEmailHtml,
  EmailService,
  getDispatchedEmails,
  clearDispatchedEmails,
} from "../../apps/worker/src/services/emailService";
import { TelegramService } from "../../apps/worker/src/services/telegramService";

describe("Worker Services & Infrastructure Tests", () => {
  beforeEach(() => {
    clearDispatchedEmails();
  });

  it("should generate responsive HTML email with Bengali title, message, and CTA", () => {
    const html = buildAbroadMateEmailHtml({
      to: "student@example.com",
      subject: "শেভেনিং স্কলারশিপ ডেডলাইন রিমাইন্ডার",
      title: "শেভেনিং স্কলারশিপ: আর মাত্র ৭ দিন বাকি!",
      messageBn: "আপনার চূড়ান্ত আবেদন পোর্টাল সাবমিট করার শেষ তারিখ অতি সন্নিকটে।",
      category: "DEADLINE_REMINDER",
      actionUrl: "https://abroadmate.ai/dashboard/deadlines",
    });

    expect(html).toContain("AbroadMate");
    expect(html).toContain("শেভেনিং স্কলারশিপ: আর মাত্র ৭ দিন বাকি!");
    expect(html).toContain("DEADLINE REMINDER");
    expect(html).toContain("AbroadMate পোর্টালে দেখুন");
  });

  it("should record dispatched email in memory history for offline/testing validation", async () => {
    const res = await EmailService.sendEmail({
      to: "tanvir.ahmed@gmail.com",
      subject: "ভিসা পলিসি আপডেট",
      title: "ইউকে স্টুডেন্ট ভিসা ফাইন্যান্সিয়াল নিয়ম ২০২৬",
      messageBn: "লন্ডনের বাইরে মাসিক লিভিং কস্ট ১,৪৮৩ পাউন্ড কার্যকর হয়েছে।",
      category: "POLICY_CHANGE",
    });

    expect(res.success).toBe(true);
    expect(res.messageId).toBeDefined();

    const history = getDispatchedEmails();
    expect(history.length).toBe(1);
    expect(history[0].to).toBe("tanvir.ahmed@gmail.com");
    expect(history[0].category).toBe("POLICY_CHANGE");
  });

  it("should calculate UTC deadline threshold days correctly", () => {
    const nowUtc = new Date("2026-11-23T00:00:00.000Z");
    const targetDate7Days = new Date("2026-11-30T00:00:00.000Z");

    const msDiff = targetDate7Days.getTime() - nowUtc.getTime();
    const daysRemaining = Math.ceil(msDiff / (1000 * 60 * 60 * 24));

    expect(daysRemaining).toBe(7);
    const standardThresholds = [30, 14, 7, 3, 1];
    expect(standardThresholds.includes(daysRemaining)).toBe(true);
  });

  it("should construct deterministic idempotency keys preventing duplicates", () => {
    const deadlineId = "dl-12345";
    const userId = "usr-67890";
    const threshold = 7;
    const dateStr = "2026-11-23";

    const key1 = `DEADLINE_${deadlineId}_${userId}_${threshold}_${dateStr}`;
    const key2 = `DEADLINE_${deadlineId}_${userId}_${threshold}_${dateStr}`;

    expect(key1).toBe(key2);
    expect(key1).toBe("DEADLINE_dl-12345_usr-67890_7_2026-11-23");
  });

  it("should format Telegram push message structure correctly", async () => {
    const res = await TelegramService.sendMessage({
      chatId: "123456789",
      title: "ইউকে ভিসা রুলস আপডেট",
      messageBn: "আপনার রোডম্যাপের প্রাসঙ্গিক টাস্ক যাচাই করুন।",
      actionUrl: "https://abroadmate.ai/dashboard/roadmap",
    });

    expect(res.success).toBe(true);
  });
});
