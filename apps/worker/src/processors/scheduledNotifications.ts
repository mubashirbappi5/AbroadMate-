import { prisma, NotificationType } from "@abroadmate/database";
import { EmailService } from "../services/emailService";

export interface ScheduledNotificationJobData {
  userIds: string[];
  title: string;
  messageBn: string;
  type?: NotificationType;
  actionUrl?: string;
  sendEmail?: boolean;
}

export async function processScheduledNotificationsJob(data: ScheduledNotificationJobData) {
  const { userIds, title, messageBn, type = NotificationType.INFO, actionUrl, sendEmail } = data;

  let dispatchedCount = 0;

  for (const userId of userIds) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) continue;

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId,
        title,
        message: messageBn,
        type,
        actionUrl: actionUrl || null,
      },
    });
    dispatchedCount++;

    // Optionally send email
    if (sendEmail && user.email) {
      await EmailService.sendEmail({
        to: user.email,
        subject: `[AbroadMate] ${title}`,
        title,
        messageBn,
        category: "SYSTEM",
        actionUrl: actionUrl || null,
      });
    }
  }

  return { success: true, dispatchedCount };
}
