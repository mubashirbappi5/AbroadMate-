import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma, AppRole, VerificationStatus, AuditAction } from "@abroadmate/database";
import { adminVisaVersionApprovalSchema } from "@abroadmate/validation";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([AppRole.SUPER_ADMIN, AppRole.VERIFICATION_MANAGER]);

    const body = await request.json();
    const parseResult = adminVisaVersionApprovalSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { versionId, decision, decisionComment } = parseResult.data;
    const adminUserId = session.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const version = await tx.visaRequirementVersion.findUnique({
        where: { id: versionId },
      });

      if (!version) {
        throw new Error("পলিসি সংস্করণ পাওয়া যায়নি।");
      }

      const updatedVersion = await tx.visaRequirementVersion.update({
        where: { id: versionId },
        data: {
          verificationStatus:
            decision === "APPROVED" ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED,
          lastCheckedDate: new Date(),
        },
      });

      await tx.policyChangeApproval.create({
        data: {
          versionId,
          proposedByUserId: adminUserId,
          approvedByUserId: decision === "APPROVED" ? adminUserId : null,
          approvalStatus: decision === "APPROVED" ? "APPROVED" : "REJECTED",
          decisionComment: decisionComment || null,
          decidedAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: AuditAction.APPROVE,
          resourceType: "VISA_REQUIREMENT_VERSION",
          resourceId: versionId,
          changesJson: JSON.stringify({
            decision,
            decisionComment,
            versionNumber: version.versionNumber,
          }),
        },
      });

      return updatedVersion;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `পলিসি সংস্করণ সফলভাবে ${decision === "APPROVED" ? "অনুমোদিত" : "বাতিল"} করা হয়েছে।`,
    });
  } catch (err: any) {
    console.error("Error in /api/admin/visa/approve-version:", err);
    return NextResponse.json(
      {
        success: false,
        error: "পলিসি সংস্করণ অনুমোদন করতে সমস্যা হয়েছে।",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
