import { prisma, NotificationType } from "@abroadmate/database";
import { IdempotencyService } from "../services/idempotencyService";
import { EmailService } from "../services/emailService";
import { TelegramService } from "../services/telegramService";

export interface DeadlineScanResult {
  processedCount: number;
  dispatchedInApp: number;
  dispatchedEmail: number;
  dispatchedTelegram: number;
  skippedDuplicates: number;
}

/**
 * Scans all uncompleted deadlines and evaluates 30, 14, 7, 3, and 1-day threshold alerts,
 * respecting each student's custom reminder preferences and enforcing strict idempotency.
 */
export async function processDeadlineRemindersJob(): Promise<DeadlineScanResult> {
  const now = new Date();
  const todayUtcStr = now.toISOString().split("T")[0]; // YYYY-MM-DD in UTC

  const deadlines = await prisma.deadline.findMany({
    where: { isCompleted: false },
    include: {
      user: {
        include: {
          settings: true,
        },
      },
    },
  });

  let dispatchedInApp = 0;
  let dispatchedEmail = 0;
  let dispatchedTelegram = 0;
  let skippedDuplicates = 0;

  for (const deadline of deadlines) {
    const dueDate = new Date(deadline.deadlineDate);
    const msDiff = dueDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(msDiff / (1000 * 60 * 60 * 24));

    // Only process future thresholds (> 0 days)
    if (daysRemaining <= 0) continue;

    // Resolve student's target threshold list (or default: 30, 14, 7, 3, 1)
    const activeThresholds =
      deadline.user?.settings?.customReminderDays &&
      deadline.user.settings.customReminderDays.length > 0
        ? deadline.user.settings.customReminderDays
        : [30, 14, 7, 3, 1];

    // Check if daysRemaining exactly hits one of the student's active thresholds
    if (!activeThresholds.includes(daysRemaining)) {
      continue;
    }

    const matchedThreshold = daysRemaining;

    // Resolve recipient users (specific user or active students if global)
    let targetUsers: Array<{
      id: string;
      email: string;
      fullName: string;
      settings: any;
    }> = [];

    if (deadline.user) {
      targetUsers = [
        {
          id: deadline.user.id,
          email: deadline.user.email,
          fullName: deadline.user.fullName,
          settings: deadline.user.settings,
        },
      ];
    } else {
      // Global deadline
      const activeStudents = await prisma.user.findMany({
        where: { isActive: true },
        include: { settings: true },
        take: 100,
      });
      targetUsers = activeStudents.map((u) => ({
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        settings: u.settings,
      }));
    }

    for (const student of targetUsers) {
      const settings = student.settings;
      const webEnabled = settings?.deadlineAlertsWeb ?? true;
      const emailEnabled = settings?.deadlineAlertsEmail ?? true;
      const telegramEnabled = (settings?.telegramAlerts ?? false) && !!settings?.telegramChatId;

      // Formulate Bengali and English alert messages
      const urgencyLabel =
        matchedThreshold <= 3 ? "জরুরি সতর্কবার্তা" : "গুরুত্বপূর্ণ রিমাইন্ডার";
      const titleBn = `${deadline.titleBn || deadline.titleEn}: আর মাত্র ${matchedThreshold} দিন বাকি!`;
      const dateFormatted = dueDate.toLocaleDateString("bn-BD", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const messageBn = `আপনার নির্ধারিত ডেডলাইন "${deadline.titleBn || deadline.titleEn}" অতি সন্নিকটে।\n\nচূড়ান্ত তারিখ: ${dateFormatted} (বাংলাদেশ সময়)।\nবাকি সময়: ${matchedThreshold} দিন।\n\nদেরি না করে প্রয়োজনীয় কাগজপত্র ও আবেদন প্রক্রিয়া সম্পন্ন করুন।`;

      // 1. Channel: In-App Notification (Idempotency checked)
      if (webEnabled) {
        const inAppKey = `IN_APP_DEADLINE_${deadline.id}_${student.id}_${matchedThreshold}_${todayUtcStr}`;
        const check = await IdempotencyService.checkAndRecord({
          idempotencyKey: inAppKey,
          userId: student.id,
          channel: "IN_APP",
          category: "DEADLINE_REMINDER",
          referenceId: deadline.id,
          thresholdDays: matchedThreshold,
        });

        if (check.shouldDispatch) {
          await prisma.notification.create({
            data: {
              userId: student.id,
              title: titleBn,
              message: messageBn,
              type: matchedThreshold <= 3 ? NotificationType.DEADLINE_ALERT : NotificationType.INFO,
              actionUrl: "/dashboard/deadlines",
            },
          });
          dispatchedInApp++;
        } else {
          skippedDuplicates++;
        }
      }

      // 2. Channel: Email Notification (Idempotency checked)
      if (emailEnabled && student.email) {
        const emailKey = `EMAIL_DEADLINE_${deadline.id}_${student.id}_${matchedThreshold}_${todayUtcStr}`;
        const check = await IdempotencyService.checkAndRecord({
          idempotencyKey: emailKey,
          userId: student.id,
          channel: "EMAIL",
          category: "DEADLINE_REMINDER",
          referenceId: deadline.id,
          thresholdDays: matchedThreshold,
          recipientEmail: student.email,
        });

        if (check.shouldDispatch) {
          await EmailService.sendEmail({
            to: student.email,
            subject: `[AbroadMate] ${urgencyLabel}: ${deadline.titleBn || deadline.titleEn} (${matchedThreshold} দিন বাকি)`,
            title: titleBn,
            messageBn,
            category: "DEADLINE_REMINDER",
            actionUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://abroadmate.ai"}/dashboard/deadlines`,
          });
          dispatchedEmail++;
        } else {
          skippedDuplicates++;
        }
      }

      // 3. Channel: Telegram Push (Idempotency checked)
      if (telegramEnabled && settings?.telegramChatId) {
        const tgKey = `TG_DEADLINE_${deadline.id}_${student.id}_${matchedThreshold}_${todayUtcStr}`;
        const check = await IdempotencyService.checkAndRecord({
          idempotencyKey: tgKey,
          userId: student.id,
          channel: "TELEGRAM",
          category: "DEADLINE_REMINDER",
          referenceId: deadline.id,
          thresholdDays: matchedThreshold,
        });

        if (check.shouldDispatch) {
          await TelegramService.sendMessage({
            chatId: settings.telegramChatId,
            title: titleBn,
            messageBn,
            actionUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://abroadmate.ai"}/dashboard/deadlines`,
          });
          dispatchedTelegram++;
        } else {
          skippedDuplicates++;
        }
      }
    }
  }

  console.log(
    `[DeadlineRemindersProcessor] Completed scan: ${deadlines.length} deadlines checked | Dispatched: ${dispatchedInApp} in-app, ${dispatchedEmail} emails, ${dispatchedTelegram} telegram | Skipped duplicates: ${skippedDuplicates}`
  );

  return {
    processedCount: deadlines.length,
    dispatchedInApp,
    dispatchedEmail,
    dispatchedTelegram,
    skippedDuplicates,
  };
}
