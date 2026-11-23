import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  VerificationStatus,
  ReviewStatus,
  AuditAction,
  NotificationType,
} from "@abroadmate/database";
import { policyChangeReviewSchema } from "@abroadmate/validation";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.VERIFICATION_MANAGER,
    ]);

    const body = await request.json();
    const parseResult = policyChangeReviewSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "রিভিউ ইনপুট ফরম্যাট ভুল।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { versionId, decision, decisionComment, notifyAffectedStudents } =
      parseResult.data;
    const adminUserId = session.user.id;

    // Fetch version and related requirement
    const version = await prisma.visaRequirementVersion.findUnique({
      where: { id: versionId },
      include: {
        visaRequirement: {
          include: { country: true, visaType: true },
        },
        approvals: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!version) {
      return NextResponse.json(
        { success: false, error: "পলিসি সংস্করণ রেকর্ড পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const approvalRecord = version.approvals[0];
    const countryCode = version.visaRequirement.countryCode;
    const countryName = version.visaRequirement.country.nameBn;

    if (decision === "REJECTED") {
      const result = await prisma.$transaction(async (tx) => {
        // Mark version as rejected
        await tx.visaRequirementVersion.update({
          where: { id: versionId },
          data: {
            verificationStatus: VerificationStatus.REJECTED,
            isArchived: true,
          },
        });

        // Update approval
        const updatedApproval = approvalRecord
          ? await tx.policyChangeApproval.update({
              where: { id: approvalRecord.id },
              data: {
                approvalStatus: ReviewStatus.REJECTED,
                approvedByUserId: adminUserId,
                decisionComment,
                decidedAt: new Date(),
              },
            })
          : await tx.policyChangeApproval.create({
              data: {
                versionId,
                proposedByUserId: adminUserId,
                approvedByUserId: adminUserId,
                approvalStatus: ReviewStatus.REJECTED,
                decisionComment,
                decidedAt: new Date(),
              },
            });

        // Audit Log
        await tx.auditLog.create({
          data: {
            userId: adminUserId,
            action: AuditAction.REJECT,
            resourceType: "VISA_POLICY_UPDATE",
            resourceId: versionId,
            approvalStatus: "REJECTED",
            changesJson: JSON.stringify({
              decision: "REJECTED",
              comment: decisionComment,
            }),
          },
        });

        return updatedApproval;
      });

      return NextResponse.json({
        success: true,
        data: result,
        message: "পলিসি পরিবর্তনের প্রস্তাব বাতিল করা হয়েছে।",
      });
    }

    // Decision is APPROVED -> Steps 7, 8, 9
    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // Step 7: New Version Publishing
      // Archive previous active versions
      await tx.visaRequirementVersion.updateMany({
        where: {
          visaRequirementId: version.visaRequirementId,
          id: { not: versionId },
          isArchived: false,
        },
        data: {
          isArchived: true,
          effectiveToDate: now,
        },
      });

      // Activate new version
      const publishedVersion = await tx.visaRequirementVersion.update({
        where: { id: versionId },
        data: {
          verificationStatus: VerificationStatus.VERIFIED,
          publishedDate: now,
          lastCheckedDate: now,
          isArchived: false,
        },
      });

      // Step 8: Affected Student Identification
      // 1) Find students targeting this country via active study goals
      const affectedGoals = await tx.userGoal.findMany({
        where: {
          targetCountryCodes: { has: countryCode },
        },
        select: { userId: true },
      });

      // 2) Find students having roadmaps for this country
      const affectedRoadmaps = await tx.roadmap.findMany({
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

      const affectedRoadmapIds = affectedRoadmaps.map((r: { id: string }) => r.id);

      // Flag matching roadmap tasks with needsReview = true
      let updatedTasksCount = 0;
      if (affectedRoadmapIds.length > 0) {
        const phases = await tx.roadmapPhase.findMany({
          where: { roadmapId: { in: affectedRoadmapIds } },
          select: { id: true },
        });
        const phaseIds = phases.map((p: { id: string }) => p.id);
        if (phaseIds.length > 0) {
          const updateTaskRes = await tx.roadmapTask.updateMany({
            where: {
              phaseId: { in: phaseIds },
              isCompleted: false,
            },
            data: {
              needsReview: true,
            },
          });
          updatedTasksCount = updateTaskRes.count;
        }
      }

      // Step 9: Notifications
      let notificationsCreated = 0;
      if (notifyAffectedStudents && affectedUserIds.length > 0) {
        const notificationsData = affectedUserIds.map((userId) => ({
          userId,
          title: `অফিসিয়াল পলিসি আপডেট: ${countryName}`,
          message: `${countryName}-এর ইমিগ্রেশন ও ভিসা নিয়মে নতুন সরকারি পরিবর্তন অনুমোদিত হয়েছে (${version.changeSummaryBn})। আপনার রোডম্যাপের প্রাসঙ্গিক টাস্কগুলো যাচাই করুন।`,
          type: NotificationType.WARNING,
          actionUrl: "/dashboard/roadmap",
        }));

        await tx.notification.createMany({
          data: notificationsData,
        });

        notificationsCreated = affectedUserIds.length;
      }

      // Update PolicyChangeApproval
      const updatedApproval = approvalRecord
        ? await tx.policyChangeApproval.update({
            where: { id: approvalRecord.id },
            data: {
              approvalStatus: ReviewStatus.APPROVED,
              approvedByUserId: adminUserId,
              decisionComment,
              decidedAt: now,
              affectedStudentsCount: affectedUserIds.length,
              notifiedStudentsCount: notificationsCreated,
            },
          })
        : await tx.policyChangeApproval.create({
            data: {
              versionId,
              proposedByUserId: adminUserId,
              approvedByUserId: adminUserId,
              approvalStatus: ReviewStatus.APPROVED,
              decisionComment,
              decidedAt: now,
              affectedStudentsCount: affectedUserIds.length,
              notifiedStudentsCount: notificationsCreated,
            },
          });

      // Immutable Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: AuditAction.APPROVE,
          resourceType: "VISA_POLICY_UPDATE",
          resourceId: versionId,
          approvalStatus: "APPROVED",
          changesJson: JSON.stringify({
            versionNumber: publishedVersion.versionNumber,
            countryCode,
            affectedStudents: affectedUserIds.length,
            notifiedStudents: notificationsCreated,
            tasksFlaggedForReview: updatedTasksCount,
            comment: decisionComment,
          }),
        },
      });

      return {
        publishedVersion,
        approval: updatedApproval,
        affectedStudentsCount: affectedUserIds.length,
        notifiedStudentsCount: notificationsCreated,
        tasksFlaggedForReview: updatedTasksCount,
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `পলিসি পরিবর্তন সফলভাবে অনুমোদিত ও প্রকাশিত হয়েছে। মোট ${result.affectedStudentsCount} জন শিক্ষার্থী চিহ্নিত এবং ${result.notifiedStudentsCount} জনকে সতর্কবার্তা পাঠানো হয়েছে।`,
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "পলিসি অনুমোদন প্রক্রিয়ায় সমস্যা হয়েছে।" },
      { status }
    );
  }
}
