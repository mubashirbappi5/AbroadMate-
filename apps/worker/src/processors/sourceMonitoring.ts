import { prisma, AppRole, NotificationType, VerificationStatus } from "@abroadmate/database";
import { IdempotencyService } from "../services/idempotencyService";
import { EmailService } from "../services/emailService";

export async function processSourceMonitoringJob() {
  const now = new Date();
  const todayUtcStr = now.toISOString().split("T")[0];

  const overdueSources = await prisma.informationSource.findMany({
    where: {
      nextReviewDate: { lte: now },
    },
    include: {
      country: true,
    },
  });

  if (overdueSources.length === 0) {
    return { overdueCount: 0, notificationsDispatched: 0 };
  }

  // Find verification managers & super admins
  const adminUsers = await prisma.user.findMany({
    where: {
      isActive: true,
      OR: [
        { primaryRole: AppRole.SUPER_ADMIN },
        { primaryRole: AppRole.VERIFICATION_MANAGER },
        { roles: { some: { role: AppRole.VERIFICATION_MANAGER } } },
      ],
    },
  });

  let notificationsDispatched = 0;

  for (const source of overdueSources) {
    // Optionally update status to NEEDS_UPDATE if currently VERIFIED
    if (source.status === VerificationStatus.VERIFIED) {
      await prisma.informationSource.update({
        where: { id: source.id },
        data: { status: VerificationStatus.NEEDS_UPDATE },
      });
    }

    const titleBn = `অফিসিয়াল সোর্স মেয়াদোত্তীর্ণ: ${source.title}`;
    const countryName = source.country?.nameBn || "আন্তর্জাতিক";
    const messageBn = `সোর্স "${source.title}" (${countryName})-এর নির্ধারিত রিভিউ সময়সীমা পার হয়েছে। নিয়ম পরিবর্তনের কোনো সার্কুলার এসেছে কিনা তা অফিসিয়াল পোর্টালের সাথে যাচাই করুন।`;

    for (const admin of adminUsers) {
      const idempotencyKey = `SOURCE_EXPIRY_${source.id}_${admin.id}_${todayUtcStr}`;

      const check = await IdempotencyService.checkAndRecord({
        idempotencyKey,
        userId: admin.id,
        channel: "IN_APP",
        category: "SOURCE_EXPIRY",
        referenceId: source.id,
      });

      if (check.shouldDispatch) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: titleBn,
            message: messageBn,
            type: NotificationType.WARNING,
            actionUrl: "/dashboard/admin/sources?expiredOnly=true",
          },
        });

        if (admin.email) {
          await EmailService.sendEmail({
            to: admin.email,
            subject: `[AbroadMate Admin Alert] ${titleBn}`,
            title: titleBn,
            messageBn,
            category: "POLICY_CHANGE",
            actionUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://abroadmate.ai"}/dashboard/admin/sources?expiredOnly=true`,
          });
        }

        notificationsDispatched++;
      }
    }
  }

  return {
    overdueCount: overdueSources.length,
    notificationsDispatched,
  };
}
