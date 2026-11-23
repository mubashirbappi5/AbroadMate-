import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  VerificationStatus,
  ReviewStatus,
  AuditAction,
} from "@abroadmate/database";
import { policyChangeProposalSchema } from "@abroadmate/validation";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
    ]);

    const body = await request.json();
    const parseResult = policyChangeProposalSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "পলিসি প্রস্তাবনা ভ্যালিডেশন ব্যর্থ হয়েছে।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const proposerUserId = session.user.id;

    // Verify visa requirement exists
    const visaReq = await prisma.visaRequirement.findUnique({
      where: { id: data.visaRequirementId },
      include: {
        country: true,
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
      },
    });

    if (!visaReq) {
      return NextResponse.json(
        { success: false, error: "ভিসা রিকোয়ারমেন্ট পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const latestVersion = visaReq.versions[0];
    const nextVersionNum = latestVersion ? latestVersion.versionNumber + 1 : 1;

    // Structure evidence comparison
    const evidenceDiff = {
      category: data.category,
      title: data.title,
      oldValue: data.oldValue,
      newValue: data.newValue,
      sourceOrganization: data.sourceOrganization,
      officialGazetteUrl: data.officialGazetteUrl,
      changeSummaryBn: data.changeSummaryBn,
      effectiveDate: data.effectiveDate,
      proposedBy: session.user.fullName || session.user.email,
      submittedAt: new Date().toISOString(),
    };

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create a draft/pending requirement version
      const newVersion = await tx.visaRequirementVersion.create({
        data: {
          visaRequirementId: visaReq.id,
          versionNumber: nextVersionNum,
          previousVersionId: latestVersion?.id || null,
          effectiveFromDate: new Date(data.effectiveDate),
          isArchived: false,
          changeSummaryBn: data.changeSummaryBn,
          officialGazetteUrl: data.officialGazetteUrl,
          sourceOrganization: data.sourceOrganization,
          verificationStatus: VerificationStatus.PENDING_REVIEW,
        },
      });

      // 2. Create PolicyChangeApproval record
      const approval = await tx.policyChangeApproval.create({
        data: {
          versionId: newVersion.id,
          proposedByUserId: proposerUserId,
          approvalStatus: ReviewStatus.PENDING,
          evidenceComparisonJson: JSON.stringify(evidenceDiff),
        },
      });

      // 3. Log Audit
      await tx.auditLog.create({
        data: {
          userId: proposerUserId,
          action: AuditAction.CREATE,
          resourceType: "POLICY_CHANGE_PROPOSAL",
          resourceId: approval.id,
          previousValue: data.oldValue,
          newValue: data.newValue,
          approvalStatus: "PENDING",
          changesJson: JSON.stringify(evidenceDiff),
        },
      });

      return { newVersion, approval };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "পলিসি পরিবর্তনের প্রস্তাবনা সফলভাবে তৈরি হয়েছে এবং ভেরিফিকেশন ম্যানেজারের পর্যালোচনার জন্য জমা দেওয়া হয়েছে।",
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "পলিসি প্রস্তাব তৈরিতে সমস্যা হয়েছে।" },
      { status }
    );
  }
}
