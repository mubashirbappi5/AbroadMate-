import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  VerificationStatus,
  ReviewStatus,
} from "@abroadmate/database";

export async function GET(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
      AppRole.SUPPORT_ADMIN,
      AppRole.CONTENT_MANAGER,
    ]);

    const now = new Date();

    const [
      totalStudents,
      activeGoals,
      countriesCount,
      universitiesCount,
      programsCount,
      scholarshipsCount,
      visaRulesCount,
      unverifiedUnis,
      unverifiedScholarships,
      unverifiedSources,
      pendingPolicyApprovals,
      pendingDataReviews,
      expiredSourcesCount,
      detectedPolicyChangesCount,
      pendingPolicyList,
      expiredSourcesList,
    ] = await Promise.all([
      prisma.user.count({ where: { primaryRole: AppRole.STUDENT } }),
      prisma.userGoal.count(),
      prisma.country.count(),
      prisma.university.count(),
      prisma.program.count(),
      prisma.scholarship.count(),
      prisma.visaRequirement.count(),
      prisma.university.count({
        where: { verificationStatus: { not: VerificationStatus.VERIFIED } },
      }),
      prisma.scholarship.count({
        where: { verificationStatus: { not: VerificationStatus.VERIFIED } },
      }),
      prisma.informationSource.count({
        where: { status: { not: VerificationStatus.VERIFIED } },
      }),
      prisma.policyChangeApproval.count({
        where: { approvalStatus: ReviewStatus.PENDING },
      }),
      prisma.dataReview.count({
        where: { status: ReviewStatus.PENDING },
      }),
      prisma.informationSource.count({
        where: {
          nextReviewDate: { lte: now },
        },
      }),
      prisma.sourceChangeLog.count({
        where: { isResolved: false },
      }),
      prisma.policyChangeApproval.findMany({
        where: { approvalStatus: ReviewStatus.PENDING },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          version: {
            include: {
              visaRequirement: {
                include: { country: true, visaType: true },
              },
            },
          },
          proposedByUser: {
            select: { fullName: true, email: true },
          },
        },
      }),
      prisma.informationSource.findMany({
        where: {
          nextReviewDate: { lte: now },
        },
        take: 5,
        orderBy: { nextReviewDate: "asc" },
        include: { country: true },
      }),
    ]);

    const unverifiedRecords =
      unverifiedUnis + unverifiedScholarships + unverifiedSources;
    const pendingReviews = pendingPolicyApprovals + pendingDataReviews;

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalStudents,
          activeGoals,
          countries: countriesCount,
          universities: universitiesCount,
          programs: programsCount,
          scholarships: scholarshipsCount,
          visaRules: visaRulesCount,
          unverifiedRecords,
          pendingReviews,
          expiredSources: expiredSourcesCount,
          detectedPolicyChanges: detectedPolicyChangesCount,
        },
        alerts: {
          pendingPolicyList,
          expiredSourcesList,
        },
        userRole: session.user.primaryRole,
      },
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      {
        success: false,
        error: error.message || "ড্যাশবোর্ড মেট্রিক্স লোড করতে ব্যর্থ হয়েছে।",
      },
      { status }
    );
  }
}
