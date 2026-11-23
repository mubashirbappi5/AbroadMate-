import { prisma, NotificationType } from "@abroadmate/database";
import { IdempotencyService } from "../services/idempotencyService";
import { EmailService } from "../services/emailService";

export interface PolicyChangeJobData {
  versionId: string;
  countryCode: string;
  countryNameBn: string;
  changeSummaryBn: string;
}

export async function processPolicyChangeDetectionJob(data: PolicyChangeJobData) {
  const { versionId, countryCode, countryNameBn, changeSummaryBn } = data;

  // 1. Find affected students targeting this country
  const affectedGoals = await prisma.userGoal.findMany({
    where: {
      targetCountryCodes: { has: countryCode },
    },
    select: { userId: true },
  });

  const affectedRoadmaps = await prisma.roadmap.findMany({
    where: {
      targetCountryCode: countryCode,
    },
    select: { userId: true, id: true },
  });

  const affectedUserIds = Array.from(
    new Set([
      ...affectedGoals.map((g: { userId: string }) => g.userId),
      ...affectedRoadmaps.map((r: { userId: string }) => r.userId),
    ])
  );

  // 2. Flag matching roadmap tasks with needsReview = true
  const roadmapIds = affectedRoadmaps.map((r: { id: string }) => r.id);
  let updatedTasksCount = 0;

  if (roadmapIds.length > 0) {
    const phases = await prisma.roadmapPhase.findMany({
      where: { roadmapId: { in: roadmapIds } },
      select: { id: true },
    });
    const phaseIds = phases.map((p: { id: string }) => p.id);

    if (phaseIds.length > 0) {
      const res = await prisma.roadmapTask.updateMany({
        where: {
          phaseId: { in: phaseIds },
          isCompleted: false,
        },
        data: {
          needsReview: true,
        },
      });
      updatedTasksCount = res.count;
    }
  }

  // 3. Dispatch notifications with idempotency
  let notifiedStudentsCount = 0;
  const titleBn = `অফিসিয়াল পলিসি পরিবর্তন: ${countryNameBn}`;
  const messageBn = `${countryNameBn}-এর ইমিগ্রেশন ও ভিসা বিধিমালার নতুন অফিসিয়াল সার্কুলার অনুমোদিত হয়েছে।\n\nসারাংশ: ${changeSummaryBn}\n\nআপনার রোডম্যাপের প্রাসঙ্গিক টাস্কগুলো পর্যালোচনার জন্য চিহ্নিত করা হয়েছে।`;

  for (const userId of affectedUserIds) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) continue;

    const idempotencyKey = `POLICY_ALERT_${versionId}_${user.id}`;
    const check = await IdempotencyService.checkAndRecord({
      idempotencyKey,
      userId: user.id,
      channel: "IN_APP",
      category: "POLICY_CHANGE",
      referenceId: versionId,
    });

    if (check.shouldDispatch) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: titleBn,
          message: messageBn,
          type: NotificationType.WARNING,
          actionUrl: "/dashboard/roadmap",
        },
      });

      if (user.settings?.visaRuleUpdates && user.email) {
        await EmailService.sendEmail({
          to: user.email,
          subject: `[AbroadMate Policy Alert] ${titleBn}`,
          title: titleBn,
          messageBn,
          category: "POLICY_CHANGE",
          actionUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://abroadmate.ai"}/dashboard/roadmap`,
        });
      }

      notifiedStudentsCount++;
    }
  }

  return {
    affectedStudentsCount: affectedUserIds.length,
    updatedTasksCount,
    notifiedStudentsCount,
  };
}
