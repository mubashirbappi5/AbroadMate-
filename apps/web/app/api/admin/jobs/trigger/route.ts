import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma, AppRole, NotificationType, VerificationStatus, AuditAction } from "@abroadmate/database";
import { calculateDeadlineAlerts } from "@abroadmate/roadmap-engine";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
    ]);

    const body = await request.json();
    const { action } = body;

    const now = new Date();
    const todayUtcStr = now.toISOString().split("T")[0];

    if (action === "scan-deadlines") {
      const deadlines = await prisma.deadline.findMany({
        where: { isCompleted: false },
        include: {
          user: { include: { settings: true } },
        },
      });

      let dispatchedInApp = 0;
      let skippedDuplicates = 0;

      for (const deadline of deadlines) {
        const dueDate = new Date(deadline.deadlineDate);
        const msDiff = dueDate.getTime() - now.getTime();
        const daysRemaining = Math.ceil(msDiff / (1000 * 60 * 60 * 24));

        if (daysRemaining <= 0) continue;

        const activeThresholds =
          deadline.user?.settings?.customReminderDays &&
          deadline.user.settings.customReminderDays.length > 0
            ? deadline.user.settings.customReminderDays
            : [30, 14, 7, 3, 1];

        if (!activeThresholds.includes(daysRemaining)) continue;

        const matchedThreshold = daysRemaining;
        const targetUserId = deadline.userId;

        if (targetUserId) {
          const idempotencyKey = `IN_APP_DEADLINE_${deadline.id}_${targetUserId}_${matchedThreshold}_${todayUtcStr}`;

          const existing = await prisma.notificationDispatchLog.findUnique({
            where: { idempotencyKey },
          });

          if (!existing) {
            await prisma.$transaction([
              prisma.notificationDispatchLog.create({
                data: {
                  idempotencyKey,
                  userId: targetUserId,
                  channel: "IN_APP",
                  category: "DEADLINE_REMINDER",
                  referenceId: deadline.id,
                  thresholdDays: matchedThreshold,
                },
              }),
              prisma.notification.create({
                data: {
                  userId: targetUserId,
                  title: `${deadline.titleBn || deadline.titleEn}: আর মাত্র ${matchedThreshold} দিন বাকি!`,
                  message: `আপনার ডেডলাইন "${deadline.titleBn || deadline.titleEn}" অতি সন্নিকটে। বাকি সময়: ${matchedThreshold} দিন।`,
                  type: matchedThreshold <= 3 ? NotificationType.DEADLINE_ALERT : NotificationType.INFO,
                  actionUrl: "/dashboard/deadlines",
                },
              }),
            ]);
            dispatchedInApp++;
          } else {
            skippedDuplicates++;
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: `ডেডলাইন স্ক্যান সম্পন্ন হয়েছে। নতুন অ্যালার্ট প্রেরিত: ${dispatchedInApp}, ডুপ্লিকেট স্কিপড: ${skippedDuplicates}`,
        data: { dispatchedInApp, skippedDuplicates, totalDeadlines: deadlines.length },
      });
    }

    if (action === "scan-sources") {
      const overdueSources = await prisma.informationSource.findMany({
        where: { nextReviewDate: { lte: now } },
      });

      for (const source of overdueSources) {
        if (source.status === VerificationStatus.VERIFIED) {
          await prisma.informationSource.update({
            where: { id: source.id },
            data: { status: VerificationStatus.NEEDS_UPDATE },
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: `সোর্স মনিটরিং সম্পন্ন। মোট ${overdueSources.length}টি মেয়াদোত্তীর্ণ সোর্স চিহ্নিত করা হয়েছে।`,
        data: { overdueCount: overdueSources.length },
      });
    }

    if (action === "audit-data") {
      const [unverifiedUnis, unverifiedScholarships, unverifiedSources] = await Promise.all([
        prisma.university.count({
          where: { verificationStatus: { not: VerificationStatus.VERIFIED } },
        }),
        prisma.scholarship.count({
          where: { verificationStatus: { not: VerificationStatus.VERIFIED } },
        }),
        prisma.informationSource.count({
          where: { status: { not: VerificationStatus.VERIFIED } },
        }),
      ]);

      const summary = {
        unverifiedUniversities: unverifiedUnis,
        unverifiedScholarships,
        unverifiedSources,
        triggeredBy: session.user.fullName,
        timestamp: now.toISOString(),
      };

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: AuditAction.VERIFY,
          resourceType: "DATA_VERIFICATION_AUDIT",
          resourceId: "MANUAL_TRIGGER",
          changesJson: JSON.stringify(summary),
        },
      });

      return NextResponse.json({
        success: true,
        message: "পিরিয়ডিক ডেটা অডিট সম্পন্ন হয়েছে এবং অডিট ট্রেইলে সংরক্ষিত হয়েছে।",
        data: summary,
      });
    }

    return NextResponse.json(
      { success: false, error: "অবৈধ অ্যাকশন প্যারামিটার।" },
      { status: 400 }
    );
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "জব ট্রিগারে সমস্যা হয়েছে।" },
      { status }
    );
  }
}
